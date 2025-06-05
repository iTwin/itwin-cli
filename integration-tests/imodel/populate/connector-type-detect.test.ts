/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { PopulateResponse} from '../../../src/commands/imodel/populate';
import { ExecutionResult } from '../../../src/services/synchronizationClient/models/execution-result';
import { ExecutionState } from '../../../src/services/synchronizationClient/models/execution-state';
import { StorageRun } from '../../../src/services/synchronizationClient/models/storage-run';
import { createIModel, createITwin } from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('populate (connector type detection)', () => {
  const failingTestFilePath1 = 'integration-tests/test.zip'
  const failingTestFilePath2 = 'integration-tests/test.land.xml'

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
});

export default tests;

runSuiteIfMainModule(import.meta, tests);