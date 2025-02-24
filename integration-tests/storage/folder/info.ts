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

const tests = () => describe('info', () => {
  let rootFolderId: string;
  let testFolderId: string;
  let testITwinId: string;

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

  it('should get the info of the folder', async () => {
    const { stdout } = await runCommand(`storage folder info --folder-id ${testFolderId}`);
    const folderInfo = JSON.parse(stdout);

    expect(folderInfo).to.have.property('id', testFolderId);
    expect(folderInfo).to.have.property('displayName', 'IntegrationTestFolder');
    expect(folderInfo).to.have.property('description', 'Test description');
    expect(folderInfo).to.have.property('parentFolderId', rootFolderId);
  });
});

export default tests;