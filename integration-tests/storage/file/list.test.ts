/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { 
  createFile,
  createFolder,
  createITwin, 
  getRootFolderId 
} from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('list', () => {
  const testFileName = 'test.zip';
  const testFilePath = 'integration-tests/test.zip';
  let rootFolderId: string;
  let testITwinId: string;
  let testFolderId: string;
  let testFileId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFolder = await createFolder(rootFolderId, "IntegrationTestFolder", "Test description")
    testFolderId = testFolder.id as string;
    const testFile = await createFile(rootFolderId, testFileName, testFilePath);
    testFileId = testFile.id as string;
  });

  after(async () => {
    const { result: fileDeleteResult } = await runCommand(`storage file delete --file-id ${testFileId}`);
    const { result: folderDeleteResult } = await runCommand(`storage folder delete --folder-id ${testFolderId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(fileDeleteResult).to.have.property('result', 'deleted');
    expect(folderDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should list the files in the specified folder', async () => {
    const { stdout } = await runCommand(`storage file list --folder-id ${rootFolderId}`);
    const itemList = JSON.parse(stdout);

    expect(itemList).to.be.an('array').that.is.not.empty;
    expect(itemList.some((file: { id: string; type: string; }) => file.id === testFileId && file.type === "file")).to.be.true;
    expect(itemList.some((folder: { id: string; type: string; }) => folder.id === testFolderId && folder.type === "folder")).to.be.false;
  });

  it('should list the files and folders in the specified folder', async () => {
    const { stdout } = await runCommand(`storage file list -f ${rootFolderId} --include-folders`);
    const itemList = JSON.parse(stdout);

    expect(itemList).to.be.an('array').that.is.not.empty;
    expect(itemList.some((file: { id: string; type: string; }) => file.id === testFileId && file.type === "file")).to.be.true;
    expect(itemList.some((folder: { id: string; type: string; }) => folder.id === testFolderId && folder.type === "folder")).to.be.true;
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);