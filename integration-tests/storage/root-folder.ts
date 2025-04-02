/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { itemsWithFolderLink } from "../../src/services/storage-client/models/items-with-folder-link.js";
import { createFile, createFolder, createITwin, deleteFile, deleteFolder, deleteITwin, getRootFolderId } from '../utils/helpers';

const tests = () => describe('root-folder', () => {
  const name = 'IntegrationTestITwin';
  const classType = 'Thing';
  const subClass = 'Asset';
    const testFileName = 'test.zip';
  const testFilePath = 'integration-tests/test.zip';
  let testITwinId: string;
  let rootFolderId: string;
  let testFolderId: string;
  let testFileId: string;

  before(async () => {
    const testITwin = await createITwin(name, classType, subClass);
    testITwinId = testITwin.id;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFolder = await createFolder(rootFolderId, 'IntegrationTestFolder', 'Test description');
    testFolderId = testFolder.id;
    const testFile = await createFile(rootFolderId, testFileName, testFilePath);
    testFileId = testFile.id;
  });

  after(async () => {
    await deleteFolder(testFolderId);
    await deleteFile(testFileId);
    await deleteITwin(testITwinId);
  });

  it('should get the root folder with all items', async () => {
    const { stdout } = await runCommand(`storage root-folder --itwin-id ${testITwinId}`);
    const rootFolder: itemsWithFolderLink = JSON.parse(stdout);

    expect(rootFolder).to.have.property('items');
    expect(rootFolder.items).to.be.an('array');
    expect(rootFolder.items!.length).to.be.equal(2);
    expect(rootFolder.items![0].displayName).to.be.equal("IntegrationTestFolder");
    expect(rootFolder.items![1].displayName).to.be.equal("test.zip");
    expect(rootFolder).to.have.property('_links');
    expect(rootFolder._links).to.have.property('folder');
    expect(rootFolder._links!.folder).to.have.property('href');
    expect(rootFolder._links!.folder!.href).to.be.a('string');

    // check helper function
    const rootFolderId = await getRootFolderId(testITwinId);
    expect(rootFolder._links!.folder!.href).to.contain(rootFolderId);
  });

  it('should get the root folder with 2nd item only', async () => {
    const { stdout } = await runCommand<itemsWithFolderLink>(`storage root-folder --itwin-id ${testITwinId} --top 1 --skip 1`);
    const rootFolder = JSON.parse(stdout);

    expect(rootFolder).to.have.property('items');
    expect(rootFolder.items).to.be.an('array');
    expect(rootFolder.items!.length).to.be.equal(1);
    expect(rootFolder.items![0].displayName).to.be.equal("test.zip");
    expect(rootFolder).to.have.property('_links');
    expect(rootFolder._links).to.have.property('folder');
    expect(rootFolder._links.folder).to.have.property('href');
    expect(rootFolder._links.folder.href).to.be.a('string');

    // check helper function
    const rootFolderId = await getRootFolderId(testITwinId);
    expect(rootFolder._links.folder.href).to.contain(rootFolderId);
  });

});

export default tests;