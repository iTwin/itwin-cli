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
    const testFolder = await createFolder(rootFolderId, "IntegrationTestFolder", "Test description")
    testFolderId = testFolder.id as string;
    const testFile = await createFile(rootFolderId, testFileName, testFilePath);
    testFileId = testFile.id as string;
  });

  after(async () => {
    await deleteFolder(testFolderId);
    await deleteFile(testFileId);
    await deleteITwin(testITwinId);
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