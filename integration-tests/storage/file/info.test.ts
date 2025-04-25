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
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('info', () => {
  const testFileName = 'test.zip';
  const testFilePath = 'integration-tests/test.zip';
  let testFileId: string;
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel('IntegrationTestIModel', testITwinId);
    testIModelId = testIModel.id;
    const rootFolderId = await getRootFolderId(testITwinId);
    const testFile = await createFile(rootFolderId, testFileName, testFilePath);
    testFileId = testFile.id as string;
  });

  after(async () => {
    await deleteFile(testFileId);
    await deleteIModel(testIModelId);
    await deleteITwin(testITwinId);
  });

  it('should get the info of the file', async () => {
    const { stdout } = await runCommand(`storage file info --file-id ${testFileId}`);
    const fileInfo = JSON.parse(stdout);

    expect(fileInfo).to.have.property('id', testFileId);
    expect(fileInfo).to.have.property('displayName', testFileName);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);