/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { populateResponse} from '../../src/commands/imodel/populate';
import { executionResult } from '../../src/services/synchronizationClient/models/execution-result';
import { executionState } from '../../src/services/synchronizationClient/models/execution-state';
import { storageConnection } from '../../src/services/synchronizationClient/models/storage-connection';
import { storageRun } from '../../src/services/synchronizationClient/models/storage-run';
import { createIModel, createITwin } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('populate', () => {
  const failingTestFilePath = 'integration-tests/test.zip'
  const testFilePath = 'examples/datasets/ExtonCampus.dgn';

  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id!;
    const testIModel = await createIModel(`cli-imodel-integration-test-${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id!;
  });

  after(async () => {
    const { result: iModelDeleteResult } = await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    const { result: iTwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(iModelDeleteResult).to.have.property('result', 'deleted');
    expect(iTwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should populate the iModel with the uploaded file', async () => {
    const { result: populateResult } = await runCommand<populateResponse>(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath} --connector-type MSTN`);
    expect(populateResult).to.not.be.undefined;
    expect(populateResult!.iTwinId).to.be.equal(testITwinId);
    expect(populateResult!.iModelId).to.be.equal(testIModelId);
    expect(populateResult!.summary).to.not.be.undefined;
    expect(populateResult!.summary.length).to.be.equal(1);
    expect(populateResult!.summary[0].connectionId).to.not.be.undefined;
    expect(populateResult!.summary[0].runId).to.not.be.undefined;

    const {connectionId, runId} = populateResult!.summary[0];
    const { result: infoResult } = await runCommand<storageRun>(`imodel connection run info -c ${connectionId} --connection-run-id ${runId}`);
    expect(infoResult?.state).to.be.equal(executionState.COMPLETED);
    expect(infoResult?.result).to.be.equal(executionResult.SUCCESS);
  }).timeout(30 * 60 * 1000);

  it('should populate the iModel with the uploaded file (no-wait flag with polling)', async () => {
    const { result: populateResult } = await runCommand<populateResponse>(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath} --connector-type SPPID --no-wait`);
    expect(populateResult).to.not.be.undefined;
    expect(populateResult!.iTwinId).to.be.equal(testITwinId);
    expect(populateResult!.iModelId).to.be.equal(testIModelId);
    expect(populateResult!.summary).to.not.be.undefined;
    expect(populateResult!.summary.length).to.be.equal(1);
    expect(populateResult!.summary[0].connectionId).to.not.be.undefined;
    expect(populateResult!.summary[0].runId).to.not.be.undefined;

    const {connectionId, runId} = populateResult!.summary[0];
    let { result: infoResult } = await runCommand<storageRun>(`imodel connection run info -c ${connectionId} --connection-run-id ${runId}`);
    while(infoResult?.state !== "Completed") {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => {setTimeout(r, 10_000)});

      // eslint-disable-next-line no-await-in-loop
      const { result } = await runCommand<storageRun>(`imodel connection run info -c ${connectionId} --connection-run-id ${runId}`);
      infoResult = result;
    }

    expect(infoResult?.state).to.be.equal(executionState.COMPLETED);
    expect(infoResult?.result).to.be.equal(executionResult.SUCCESS);
  }).timeout(30 * 60 * 1000);

  it('should return an error message if synchronization run completes with a non-success state', async () => {
    const { error: populateError } = await runCommand<populateResponse>(`imodel populate --imodel-id ${testIModelId} --file ${failingTestFilePath} --connector-type IFC`);
    expect(populateError).to.not.be.undefined;
    expect(populateError?.message).to.match(/Synchronization run .*? resulted in an error. Run 'itp imodel connection run info --connection-id .*? --connection-run-id .*?' for more info./);
    
    const command = populateError?.message.match(/imodel connection run info --connection-id .*? --connection-run-id .*?'/)![0]?.slice(0,-1);
    const { result: infoResult } = await runCommand<storageConnection>(command!);
    expect(infoResult).to.not.be.undefined;
    expect(infoResult?.error).to.not.be.null;
  }).timeout(30 * 60 * 1000);
});

export default tests;

runSuiteIfMainModule(import.meta, tests);