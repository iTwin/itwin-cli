/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { PopulateResponse} from '../../src/commands/imodel/populate';
import { ExecutionResult } from '../../src/services/synchronizationClient/models/execution-result';
import { ExecutionState } from '../../src/services/synchronizationClient/models/execution-state';
import { StorageRun } from '../../src/services/synchronizationClient/models/storage-run';
import { createIModel, createITwin } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('populate', () => {
  const failingTestFilePath1 = 'integration-tests/test.zip'
  const failingTestFilePath2 = 'integration-tests/test.land.xml'
  const testFilePath1 = 'examples/datasets/ExtonCampus.dgn';
  const testFilePath2 = 'examples/datasets/HouseModel.dgn';

  let testIModelId: string;
  let testITwinId: string;

  beforeEach(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id!;
    const testIModel = await createIModel(`cli-imodel-integration-test-${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id!;
  });

  afterEach(async () => {
    const { result: iModelDeleteResult } = await runCommand<{result: string}>(`imodel delete --imodel-id ${testIModelId}`);
    const { result: iTwinDeleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwinId}`);

    expect(iModelDeleteResult).to.have.property('result', 'deleted');
    expect(iTwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should populate the iModel with the uploaded file', async () => {
    const { result: populateResult } = await runCommand<PopulateResponse>(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath1} --file ${testFilePath2} --connector-type MSTN`);
    expect(populateResult).to.not.be.undefined;
    expect(populateResult).to.have.property('iTwinId', testITwinId);
    expect(populateResult).to.have.property('iModelId', testIModelId);
    expect(populateResult!.summary).to.not.be.undefined;
    expect(populateResult!.summary).to.have.lengthOf(1);
    expect(populateResult!.summary[0].connectionId).to.not.be.undefined;
    expect(populateResult!.summary[0].runId).to.not.be.undefined;

    const {connectionId, runId} = populateResult!.summary[0];
    const { result: infoResult } = await runCommand<StorageRun>(`imodel connection run info -c ${connectionId} --connection-run-id ${runId}`);
    expect(infoResult?.state).to.be.equal(ExecutionState.COMPLETED);
    expect(infoResult?.result).to.be.equal(ExecutionResult.SUCCESS);
    expect(infoResult?.jobs).to.have.lengthOf(1);
    expect(infoResult?.jobs![0].result).to.be.equal('Success');
    expect(infoResult?.jobs![0].tasks).to.have.lengthOf(2);
    expect(infoResult?.jobs![0].tasks!.every((task) => task.result === 'Success'));
  }).timeout(30 * 60 * 1000);

  it('should populate the iModel with the uploaded file (no-wait flag with polling)', async () => {
    const { result: populateResult } = await runCommand<PopulateResponse>(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath1} --connector-type MSTN --no-wait`);
    expect(populateResult).to.not.be.undefined;
    expect(populateResult).to.have.property('iTwinId', testITwinId);
    expect(populateResult).to.have.property('iModelId', testIModelId);
    expect(populateResult!.summary).to.not.be.undefined;
    expect(populateResult!.summary).to.have.lengthOf(1);
    expect(populateResult!.summary[0].connectionId).to.not.be.undefined;
    expect(populateResult!.summary[0].runId).to.not.be.undefined;

    const {connectionId, runId} = populateResult!.summary[0];
    let { result: infoResult } = await runCommand<StorageRun>(`imodel connection run info -c ${connectionId} --connection-run-id ${runId}`);
    while(infoResult?.state !== "Completed") {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => {setTimeout(r, 10_000)});

      // eslint-disable-next-line no-await-in-loop
      const { result } = await runCommand<StorageRun>(`imodel connection run info -c ${connectionId} --connection-run-id ${runId}`);
      infoResult = result;
    }

    expect(infoResult?.state).to.be.equal(ExecutionState.COMPLETED);
    expect(infoResult?.result).to.be.equal(ExecutionResult.SUCCESS);
    expect(infoResult?.jobs).to.have.lengthOf(1);
    expect(infoResult?.jobs![0].result).to.be.equal('Success');
    expect(infoResult?.jobs![0].tasks).to.have.lengthOf(1);
    expect(infoResult?.jobs![0].tasks!.every((task) => task.result === 'Success'));
  }).timeout(30 * 60 * 1000);

  it('should return an error message if synchronization run completes with a non-success state', async () => {
    const { error: populateError } = await runCommand<PopulateResponse>(`imodel populate --imodel-id ${testIModelId} --file ${failingTestFilePath1} --connector-type IFC`);
    expect(populateError).to.not.be.undefined;
    expect(populateError?.message).to.match(/Synchronization run .*? resulted in an error. Run 'itp imodel connection run info --connection-id .*? --connection-run-id .*?' for more info./);
    
    const command = populateError?.message.match(/imodel connection run info --connection-id .*? --connection-run-id .*?'/)![0]?.slice(0,-1);
    const { result: infoResult } = await runCommand<StorageRun>(command!);
    expect(infoResult?.state).to.be.equal(ExecutionState.COMPLETED);
    expect(infoResult?.result).to.be.equal(ExecutionResult.ERROR);
    expect(infoResult).to.not.be.undefined;
    expect(infoResult?.jobs).to.have.lengthOf(1);
    expect(infoResult?.jobs![0].result).to.be.equal('Error');
    expect(infoResult?.jobs![0].tasks).to.have.lengthOf(1);
    expect(infoResult?.jobs![0].tasks!.every((task) => task.result === 'Error'));
  }).timeout(30 * 60 * 1000);

  it('should pick correct connector-types according to file extensions, when no connector-types are provided', async () => {
    const { error: populateError } = await runCommand<PopulateResponse>(`imodel populate --imodel-id ${testIModelId} --file ${failingTestFilePath1} --file ${failingTestFilePath2}`);
    expect(populateError).to.not.be.undefined;
    expect(populateError?.message).to.match(/Synchronization run .*? resulted in an error. Run 'itp imodel connection run info --connection-id .*? --connection-run-id .*?' for more info./);
    
    const command = populateError?.message.match(/imodel connection run info --connection-id .*? --connection-run-id .*?'/)![0]?.slice(0,-1);
    const { result: infoResult } = await runCommand<StorageRun>(command!);
    expect(infoResult).to.not.be.undefined;
    expect(infoResult?.state).to.be.equal(ExecutionState.COMPLETED);
    expect(infoResult?.result).to.be.equal(ExecutionResult.ERROR);
    expect(infoResult).to.not.be.undefined;
    expect(infoResult?.jobs).to.have.lengthOf(2);
    for(const job of infoResult!.jobs!) {
      expect(job.result).to.be.equal('Error');
      expect(job.tasks).to.have.lengthOf(1);
      expect(job.tasks!.every((task) => task.result === 'Error'));
    }

    expect(infoResult?.jobs![0].connectorType).to.be.equal("SPPID");
    expect(infoResult?.jobs![1].connectorType).to.be.equal("MSTN");
  }).timeout(30 * 60 * 1000);

  it('should return an error message if amount of connector-types does not match the amount of files and is not equal to 1', async () => {
    const { error: populateError } = await runCommand<PopulateResponse>(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath1} --file ${testFilePath2} --file ${failingTestFilePath1} --connector-type MSTN --connector-type IFC`);
    expect(populateError).to.not.be.undefined;
    expect(populateError?.message).to.be.equal('When multiple connector-type options are provided, their amount must match file option amount. Alternatively, you can provide a single connector-type option, which will then be applied to all file options. You can also provide no connector-type options, in which case the command will attempt automatic detection.');
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);