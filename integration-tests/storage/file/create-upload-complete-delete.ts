/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { 
  createFolder, 
  createITwin, 
  deleteFolder, 
  deleteITwin, 
  getRootFolderId 
} from '../../utils/helpers';

const tests = () => describe('create + upload + complete + delete', () => {
  let testFileId: string;
  let rootFolderId: string;
  let testFolderId: string;
  let testITwinId: string;
  let uploadUrl: string;
  const displayName = 'IntegrationTestFile';
  const description = 'Test description';

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFolder = await createFolder(rootFolderId, 'IntegrationTestFolder', 'Test description');
    testFolderId = testFolder.id;
  });

  after(async () => {
    await deleteFolder(testFolderId);
    await deleteITwin(testITwinId);
  });

  it('should create a new file meta data', async () => {
    const { stdout } = await runCommand(`storage file create --folder-id ${testFolderId} --name ${displayName} --description "${description}"`);
    const createdFile = JSON.parse(stdout);

    expect(createdFile).to.have.property('_links');
    expect(createdFile._links).to.have.property('completeUrl');
    expect(createdFile._links).to.have.property('uploadUrl');

    uploadUrl = createdFile._links.uploadUrl.href;

    // extract file id from completeUrl that looks like this: "https://api.bentley.com/storage/files/TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI/complete"
    const completeUrl = createdFile._links.completeUrl.href;
    testFileId = completeUrl.split('/').at(-2);
  });

  it('should upload a file', async () => {
    const filePath = 'integration-tests/test.csv';
    const { stdout } = await runCommand(`storage file upload --upload-url "${uploadUrl}" --file-path ${filePath}`);
    const uploadedFile = JSON.parse(stdout);

    expect(uploadedFile).to.have.property('result', 'uploaded');
  });

  it('should complete the upload', async () => {
    const { stdout } = await runCommand(`storage file update-complete --file-id ${testFileId}`);
    const completedFile = JSON.parse(stdout);

    expect(completedFile).to.have.property('id', testFileId);
    expect(completedFile).to.have.property('displayName', displayName);
    expect(completedFile).to.have.property('description', description);

    expect(completedFile).to.have.property('_links');
    expect(completedFile._links).to.have.property('parentFolder');
    expect(completedFile._links.parentFolder).to.have.property('href');
    expect(completedFile._links.parentFolder.href).to.include(testFolderId);
  });

  it('should delete the file', async () => {
    await runCommand(`storage file delete --file-id ${testFileId}`);

    const result = await runCommand(`storage file info --file-id ${testFileId}`);
    expect(result.error).to.be.not.undefined;
    expect(result.error!.message).to.include('FileNotFound');
  });

});

export default tests;