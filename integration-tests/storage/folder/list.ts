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

const tests = () => describe('list', () => {
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

  it('should get the list of folders in the specified folder', async () => {
    const { stdout } = await runCommand(`storage folder list --folder-id ${rootFolderId}`);
    const folderList = JSON.parse(stdout);

    expect(folderList).to.be.an('array').that.is.not.empty;
    expect(folderList.some((folder: { id: string; }) => folder.id === testFolderId)).to.be.true;
  });
});

export default tests;