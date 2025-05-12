/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { storageConnection } from '../../../src/services/synchronizationClient/models/storage-connection';
import { createFile, createIModel, createITwin, getRootFolderId } from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('create', () => {
  let testITwinId: string;
  let testIModelId: string;
  let rootFolderId: string;
  let testFileId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test--${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(`cli-imodel-integration-test--${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFile = await createFile(rootFolderId, 'test.zip', 'integration-tests/test.zip');
    testFileId = testFile.id as string;
  });

  after(async () => {
    const { result: fileDeleteResult} = await runCommand(`storage file delete --file-id ${testFileId}`);
    const { result: imodelDeleteResult } = await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(fileDeleteResult).to.have.property('result', 'deleted');
    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should create a connection', async () => {
    const { result: createdConnection } = await runCommand<storageConnection>(`imodel connection create -m ${testIModelId} -f ${testFileId} --connector-type MSTN -n TestConnection`);

    expect(createdConnection).to.not.be.undefined;
    expect(createdConnection!.id).to.not.be.undefined;
    expect(createdConnection!.iModelId).to.be.equal(testIModelId);
    expect(createdConnection!.displayName).to.be.equal('TestConnection');
    expect(createdConnection!.authenticationType).to.be.equal('User');

    const { result } = await runCommand(`imodel connection delete --connection-id ${createdConnection!.id}`);
    expect(result).to.have.property('result', 'deleted');
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);