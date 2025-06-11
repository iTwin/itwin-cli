/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { FolderTyped } from '../../../src/services/storage-client/models/folder-typed';
import { 
  createFolder, 
  createITwin, 
  deleteFolder, 
  getRootFolderId, 
} from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('create + delete', () => {
  const classType = 'Thing';
  const subClass = 'Asset';
  let testITwinId: string;
  let testFolderId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, classType, subClass);
    testITwinId = testITwin.id as string;
  });

  after(async () => {
    const { result: itwinDeleteResult } = await runCommand<{ result: string }>(`itwin delete --itwin-id ${testITwinId}`);
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should create a new folder', async () => {
    const rootFolderId = await getRootFolderId(testITwinId);
    const displayName = 'IntegrationTestFolder';
    const description = 'Test description';

    const createdFolder = await createFolder(rootFolderId, displayName, description);

    expect(createdFolder).to.have.property('type', 'folder');
    expect(createdFolder).to.have.property('id');
    expect(createdFolder).to.have.property('displayName', displayName);
    expect(createdFolder).to.have.property('description', description);
    expect(createdFolder).to.have.property('parentFolderId', rootFolderId);

    testFolderId = createdFolder.id as string;
  });

  it('should delete the folder', async () => {
    await deleteFolder(testFolderId);

    const { error } = await runCommand<FolderTyped>(`storage folder info -f ${testFolderId}`);
    expect(error).to.be.not.undefined;
    expect(error!.message).to.include('FolderNotFound');
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);