/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { authInfo } from '../../../src/services/synchronizationClient/models/connection-auth';
import { storageConnection } from '../../../src/services/synchronizationClient/models/storage-connection';
import { createFile, createIModel, createITwin, getRootFolderId } from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('auth', () => {
  let testITwinId: string;
  let testIModelId: string;
  let rootFolderId: string;
  let testFileId: string;
  let connectionId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(`cli-imodel-integration-test-${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFile = await createFile(rootFolderId, 'test.zip', 'integration-tests/test.zip');
    testFileId = testFile.id as string;
    const { result: createdConnection} = await runCommand<storageConnection>(`imodel connection create -m ${testIModelId} -f ${testFileId} --connector-type MSTN -n TestConnection`);
    expect(createdConnection).to.not.be.undefined;
    connectionId = createdConnection!.id!;
  });

  after(async () => {
    const { result: connectionDeleteResult } = await runCommand(`imodel connection delete --connection-id ${connectionId}`);
    const { result: fileDeleteResult} = await runCommand(`storage file delete --file-id ${testFileId}`);
    const { result: imodelDeleteResult } = await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(connectionDeleteResult).to.have.property('result', 'deleted');
    expect(fileDeleteResult).to.have.property('result', 'deleted');
    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should get a connection', async () => {
    const { result } = await runCommand<authInfo>(`imodel connection auth`);
    expect(result?.isUserAuthorized).to.be.equal(true);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);