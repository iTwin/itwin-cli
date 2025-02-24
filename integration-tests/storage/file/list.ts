/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { 
  createFile,
  createIModel,
  createITwin, 
  deleteFile, 
  deleteIModel, 
  deleteITwin, 
  getRootFolderId 
} from '../../utils/helpers';

const tests = () => describe('list', () => {
  const testFileName = 'test.zip';
  const testFilePath = 'integration-tests/test.zip';
  let rootFolderId: string;
  let testFileId: string;
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id;
    const testIModel = await createIModel('IntegrationTestIModel', testITwinId);
    testIModelId = testIModel.id;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFile = await createFile(rootFolderId, testFileName, testFilePath);
    testFileId = testFile.id;
  });

  after(async () => {
    await deleteFile(testFileId);
    await deleteIModel(testIModelId);
    await deleteITwin(testITwinId);
  });

  it('should list the files in the specified folder', async () => {
    const { stdout } = await runCommand(`storage file list --folder-id ${rootFolderId}`);
    const fileList = JSON.parse(stdout);

    expect(fileList).to.be.an('array').that.is.not.empty;
    expect(fileList.some((file: { id: string; }) => file.id === testFileId)).to.be.true;
  });
});

export default tests;