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
  deleteFile, 
  deleteFolder, 
  deleteITwin, 
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
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFolder = await createFolder(rootFolderId, 'IntegrationTestFolder', 'Test description');
    testFolderId = testFolder.id as string;
    const testFile = await createFile(rootFolderId, testFileName, testFilePath);
    testFileId = testFile.id as string;
  });

  after(async () => {
    await deleteFolder(testFolderId);
    await deleteFile(testFileId);
    await deleteITwin(testITwinId);
  });

  it('should get the list of folders in the specified folder', async () => {
    const { stdout } = await runCommand(`storage folder list --folder-id ${rootFolderId}`);
    const itemList = JSON.parse(stdout);

    expect(itemList).to.be.an('array').that.is.not.empty;
    expect(itemList.some((folder: { id: string; type: string; }) => folder.id === testFolderId && folder.type === "folder")).to.be.true;
    expect(itemList.some((item: { id: string; type: string; }) => item.id === testFileId && item.type === "file")).to.be.false;
  });

  it('should get the list of folders and files in the specified folder', async () => {
    const { stdout } = await runCommand(`storage folder list -f ${rootFolderId} --include-files`);
    const itemList = JSON.parse(stdout);

    expect(itemList).to.be.an('array').that.is.not.empty;
    expect(itemList.some((folder: { id: string; type: string; }) => folder.id === testFolderId && folder.type === "folder")).to.be.true;
    expect(itemList.some((file: { id: string; type: string; }) => file.id === testFileId && file.type === "file")).to.be.true;
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);