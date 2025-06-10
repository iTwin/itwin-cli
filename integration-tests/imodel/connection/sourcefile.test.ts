/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { SourceFile } from '../../../src/services/synchronizationClient/models/source-file';
import { StorageConnection } from '../../../src/services/synchronizationClient/models/storage-connection';
import { createFile, createIModel, createITwin, getRootFolderId } from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('sourcefile', () => {
  let testITwinId: string;
  let testIModelId: string;
  let rootFolderId: string;
  let testFileId: string;
  let anotherTestFileId: string;
  let yetAnotherTestFileId: string;
  let connectionId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test--${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(`cli-imodel-integration-test--${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFile = await createFile(rootFolderId, 'test.zip', 'integration-tests/test.zip');
    testFileId = testFile.id as string;
    const anotherTestFile = await createFile(rootFolderId, 'HouseModel.dgn', 'examples/datasets/HouseModel.dgn');
    anotherTestFileId = anotherTestFile.id!;
    const yetAnotherTestFile = await createFile(rootFolderId, 'HouseModel.dgn', 'examples/datasets/ExtonCampus.dgn');
    yetAnotherTestFileId = yetAnotherTestFile.id!;
    const { result: createdConnection} = await runCommand<StorageConnection>(`imodel connection create -m ${testIModelId} -f ${testFileId} --connector-type MSTN -n TestConnection`);
    expect(createdConnection).to.not.be.undefined;
    connectionId = createdConnection!.id!;
  });

  after(async () => {
    const { result: imodelDeleteResult } = await runCommand<{result: string}>(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwinId}`);

    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should add/get/delete a sourcefile', async () => {
    const { result: addResult } = await runCommand<SourceFile>(`imodel connection sourcefile add -c ${connectionId} --connector-type MSTN --storage-file-id ${anotherTestFileId}`);
    expect(addResult).to.not.be.undefined;
    expect(addResult!.connectorType).to.be.equal("MSTN");
    expect(addResult!.storageFileId).to.be.equal(anotherTestFileId);

    const { result: infoResult } = await runCommand<SourceFile>(`imodel connection sourcefile info -c ${connectionId} --source-file-id ${addResult?.id}`);
    expect(infoResult).to.not.be.undefined;
    expect(infoResult!.connectorType).to.be.equal("MSTN");
    expect(infoResult!.storageFileId).to.be.equal(anotherTestFileId);

    const { result: deleteResult } = await runCommand<{result: string}>(`imodel connection sourcefile delete -c ${connectionId} --source-file-id ${addResult?.id}`);
    expect(deleteResult).to.have.property('result', 'deleted');
  });

  it('should update connector-type and storage-file-id of a sourcefile', async () => {
    const { result: addResult } = await runCommand<SourceFile>(`imodel connection sourcefile add -c ${connectionId} --connector-type IFC --storage-file-id ${anotherTestFileId}`);
    expect(addResult).to.not.be.undefined;
    expect(addResult!.connectorType).to.be.equal("IFC");
    expect(addResult!.storageFileId).to.be.equal(anotherTestFileId);

    const { result: infoResult1 } = await runCommand<SourceFile>(`imodel connection sourcefile info -c ${connectionId} --source-file-id ${addResult?.id}`);
    expect(infoResult1).to.not.be.undefined;
    expect(infoResult1!.connectorType).to.be.equal("IFC");
    expect(infoResult1!.storageFileId).to.be.equal(anotherTestFileId);

    const { result: updateResult } = await runCommand<SourceFile>(`imodel connection sourcefile update -c ${connectionId} --source-file-id ${addResult?.id} --connector-type MSTN --storage-file-id ${yetAnotherTestFileId}`);
    expect(updateResult).to.not.be.undefined;
    expect(updateResult!.connectorType).to.be.equal("MSTN");
    expect(updateResult!.storageFileId).to.be.equal(yetAnotherTestFileId);

    const { result: infoResult2 } = await runCommand<SourceFile>(`imodel connection sourcefile info -c ${connectionId} --source-file-id ${addResult?.id}`);
    expect(infoResult2).to.not.be.undefined;
    expect(infoResult2!.connectorType).to.be.equal("MSTN");
    expect(infoResult2!.storageFileId).to.be.equal(yetAnotherTestFileId);

    const { result: deleteResult } = await runCommand<{result: string}>(`imodel connection sourcefile delete -c ${connectionId} --source-file-id ${addResult?.id}`);
    expect(deleteResult).to.have.property('result', 'deleted');
  });

  it('should list sourcefiles', async () => {
    const { result: addResult1 } = await runCommand<SourceFile>(`imodel connection sourcefile add -c ${connectionId} --connector-type IFC --storage-file-id ${anotherTestFileId}`);
    expect(addResult1).to.not.be.undefined;
    expect(addResult1!.connectorType).to.be.equal("IFC");
    expect(addResult1!.storageFileId).to.be.equal(anotherTestFileId);

    const { result: addResult2 } = await runCommand<SourceFile>(`imodel connection sourcefile add -c ${connectionId} --connector-type MSTN --storage-file-id ${yetAnotherTestFileId}`);
    expect(addResult2).to.not.be.undefined;
    expect(addResult2!.connectorType).to.be.equal("MSTN");
    expect(addResult2!.storageFileId).to.be.equal(yetAnotherTestFileId);

    const { result: listResult } = await runCommand<SourceFile[]>(`imodel connection sourcefile list -c ${connectionId}`);
    expect(listResult).to.not.be.undefined;
    expect(listResult).to.have.lengthOf(3);
    expect(listResult?.some(result => result.storageFileId === testFileId && result!.connectorType === "MSTN" ));
    expect(listResult?.some(result => result.id === addResult1!.id && result.storageFileId === addResult1!.storageFileId && result!.connectorType === "IFC")).to.be.true;
    expect(listResult?.some(result => result.id === addResult2!.id && result.storageFileId === addResult2!.storageFileId && result!.connectorType === "MSTN")).to.be.true;

    const { result: deleteResult1 } = await runCommand<{result: string}>(`imodel connection sourcefile delete -c ${connectionId} --source-file-id ${addResult1?.id}`);
    expect(deleteResult1).to.have.property('result', 'deleted');

    const { result: deleteResult2 } = await runCommand<{result: string}>(`imodel connection sourcefile delete -c ${connectionId} --source-file-id ${addResult2?.id}`);
    expect(deleteResult2).to.have.property('result', 'deleted');
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);