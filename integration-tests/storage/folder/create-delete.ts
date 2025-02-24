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
  getRootFolderId, 
} from '../../utils/helpers';

const tests = () => describe('create + delete', () => {
  const name = 'IntegrationTestITwin';
  const classType = 'Thing';
  const subClass = 'Asset';
  let testITwinId: string;
  let testFolderId: string;

  before(async () => {
    const testITwin = await createITwin(name, classType, subClass);
    testITwinId = testITwin.id;
  });

  after(async () => {
    await deleteITwin(testITwinId);
  });

  it('should create a new folder', async () => {
    const rootFolderId = await getRootFolderId(testITwinId);
    const displayName = 'IntegrationTestFolder';
    const description = 'Test description'

    const createdFolder = await createFolder(rootFolderId, displayName, description);

    expect(createdFolder).to.have.property('type', 'folder');
    expect(createdFolder).to.have.property('id');
    expect(createdFolder).to.have.property('displayName', displayName);
    expect(createdFolder).to.have.property('description', description);
    expect(createdFolder).to.have.property('parentFolderId', rootFolderId);

    testFolderId = createdFolder.id;
  });

  it('should delete the folder', async () => {
    await deleteFolder(testFolderId);

    const result = await runCommand(`storage folder info --folder-id ${testFolderId}`);
    expect(result.error).to.be.not.undefined;
    expect(result.error!.message).to.include('FolderNotFound');
  });
});

export default tests;