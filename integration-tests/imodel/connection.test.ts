/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createFile, createIModel, createITwin, getRootFolderId } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('connection', () => {
  let testITwinId: string;
  let testIModelId: string;
  let rootFolderId: string;
  let testFileId: string;
  let connectionId: string;

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

  it('should add a connection', async () => {
    const { stdout } = await runCommand(`imodel connection create -m ${testIModelId} -f ${testFileId} --connector-type MSTN -n TestConnection`);
    const createdConnection = JSON.parse(stdout);

    expect(createdConnection).to.not.be.undefined;
    expect(createdConnection).to.have.property('id');
    expect(createdConnection).to.have.property('iTwinId', testITwinId);
    expect(createdConnection).to.have.property('iModelId', testIModelId);
    expect(createdConnection).to.have.property('displayName', 'TestConnection');

    connectionId = createdConnection.id;
  });

  it('should get a connection', async () => {
    const { stdout } = await runCommand(`imodel connection info -c ${connectionId}`);
    const connection = JSON.parse(stdout);

    expect(connection).to.not.be.undefined;
    expect(connection).to.not.be.undefined;
    expect(connection).to.have.property('id');
    expect(connection).to.have.property('iTwinId', testITwinId);
    expect(connection).to.have.property('iModelId', testIModelId);
    expect(connection).to.have.property('displayName', 'TestConnection');
  });

  it('should delete a connection', async () => {
    const { stdout } = await runCommand(`imodel connection delete --connection-id ${connectionId}`);
    const result = JSON.parse(stdout);

    expect(result.result).to.equal('deleted')
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);