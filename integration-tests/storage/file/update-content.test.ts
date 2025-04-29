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

const tests = () => describe('update-content', () => {
  let testITwinId: string;
  let rootFolderId: string;
  let testFolderId: string;
  let testFileId: string;
  let uploadUrl: string;
  const displayName = 'IntegrationTestFile';
  const description = 'Test description';
  const filePath = 'integration-tests/test.csv';

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    rootFolderId = await getRootFolderId(testITwinId);
    
    const testFolder = await createFolder(rootFolderId, 'IntegrationTestFolder', 'Test description');
    testFolderId = testFolder.id as string;
    
    const createdFile = await createFile(testFolderId, displayName, filePath, description);
    testFileId = createdFile.id as string;
  });

  after(async () => {
    const { result: fileDeleteResult } = await runCommand(`storage file delete --file-id ${testFileId}`);
    const { result: folderDeleteResult } = await runCommand(`storage folder delete --folder-id ${testFolderId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(fileDeleteResult).to.have.property('result', 'deleted');
    expect(folderDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should get URLs to update file content', async () => {
    const { stdout } = await runCommand(`storage file update-content --file-id ${testFileId}`);
    const updateResponse = JSON.parse(stdout);

    expect(updateResponse).to.have.property('_links');
    expect(updateResponse._links).to.have.property('completeUrl');
    expect(updateResponse._links).to.have.property('uploadUrl');

    uploadUrl = updateResponse._links.uploadUrl.href;
  });

  it('should upload a new file version', async () => {
    const { stdout } = await runCommand(`storage file upload --upload-url "${uploadUrl}" --file-path ${filePath}`);
    const uploadResult = JSON.parse(stdout);

    expect(uploadResult).to.have.property('result', 'uploaded');
  });

  it('should complete the file content update', async () => {
    const { stdout } = await runCommand(`storage file update-complete -f ${testFileId}`);
    const completedFile = JSON.parse(stdout);

    expect(completedFile).to.have.property('id', testFileId);
    expect(completedFile).to.have.property('displayName', displayName);
    expect(completedFile).to.have.property('description', description);
  });

  it('should throw an error when trying to update a non-existent file', async () => {
    const result = await runCommand('storage file update-content -f non-existent-file-id');
    expect(result.error).to.be.not.undefined;
    expect(result.error!.message).to.include('FileNotFound');
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);