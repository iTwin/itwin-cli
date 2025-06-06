/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { StorageConnection } from '../../../src/services/synchronizationClient/models/storage-connection';
import { StorageConnectionListResponse } from '../../../src/services/synchronizationClient/models/storage-connection-response';
import { createFile, createIModel, createITwin, getRootFolderId } from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('list', () => {
  let testITwinId: string;
  let testIModelId: string;
  let rootFolderId: string;
  let testFileId1: string;
  let testFileId2: string;
  let connectionId1: string;
  let connectionId2: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test--${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(`cli-imodel-integration-test--${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFile1 = await createFile(rootFolderId, 'test.zip', 'integration-tests/test.zip');
    testFileId1 = testFile1.id as string;
    const testFile2 = await createFile(rootFolderId, 'test.csv', 'integration-tests/test.csv');
    testFileId2 = testFile2.id as string;
    const { result: createdConnection1} = await runCommand<StorageConnection>(`imodel connection create -m ${testIModelId} -f ${testFileId1} --connector-type MSTN -n TestConnection`);
    connectionId1 = createdConnection1!.id!;
    const { result: createdConnection2} = await runCommand<StorageConnection>(`imodel connection create -m ${testIModelId} -f ${testFileId2} --connector-type MSTN -n TestConnection`);
    connectionId2 = createdConnection2!.id!;
  });

  after(async () => {
    const { result: imodelDeleteResult } = await runCommand<{result: string}>(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwinId}`);

    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should get all connections', async () => {
    const { result: listResult } = await runCommand<StorageConnectionListResponse>(`imodel connection list -m ${testIModelId}`);
    expect(listResult).to.not.be.undefined;
    expect(listResult!.connections).to.have.lengthOf(2);
    expect(listResult?.connections.some(connection => connection.id === connectionId1)).to.be.true;
    expect(listResult?.connections.some(connection => connection.id === connectionId2)).to.be.true;
  });

  it('should get 1st connection', async () => {
    const { result: allConnections } = await runCommand<StorageConnectionListResponse>(`imodel connection list -m ${testIModelId}`);
    expect(allConnections).to.not.be.undefined;
    expect(allConnections!.connections).to.have.lengthOf(2);

    const { result: filteredConnections } = await runCommand<StorageConnectionListResponse>(`imodel connection list -m ${testIModelId} --top 1`);
    expect(filteredConnections).to.not.be.undefined;
    expect(filteredConnections!.connections).to.have.lengthOf(1);
    expect(filteredConnections!.connections[0].id).to.be.equal(allConnections!.connections[0].id);
  });

  it('should not get 1st connection', async () => {
    const { result: allConnections } = await runCommand<StorageConnectionListResponse>(`imodel connection list -m ${testIModelId}`);
    expect(allConnections).to.not.be.undefined;
    expect(allConnections!.connections).to.have.lengthOf(2);

    const { result: filteredConnections } = await runCommand<StorageConnectionListResponse>(`imodel connection list -m ${testIModelId} --skip 1`);
    expect(filteredConnections).to.not.be.undefined;
    expect(filteredConnections!.connections).to.have.lengthOf(1);
    expect(filteredConnections!.connections[0].id).to.be.equal(allConnections!.connections[1].id);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);