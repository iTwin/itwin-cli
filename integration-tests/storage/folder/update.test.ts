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
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('update', () => {
  let rootFolderId: string;
  let testFolderId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFolder = await createFolder(rootFolderId, 'IntegrationTestFolder', 'Test description');
    testFolderId = testFolder.id as string;
  });

  after(async () => {
    await deleteFolder(testFolderId);
    await deleteITwin(testITwinId);
  });

  it('should update the folder', async () => {
    const updatedDisplayName = 'UpdatedIntegrationTestFolder';
    const updatedDescription = 'Updated test description';

    const { stdout } = await runCommand(`storage folder update --folder-id ${testFolderId} --name ${updatedDisplayName} --description "${updatedDescription}"`);
    const updatedFolder = JSON.parse(stdout);

    expect(updatedFolder).to.have.property('id', testFolderId);
    expect(updatedFolder).to.have.property('displayName', updatedDisplayName);
    expect(updatedFolder).to.have.property('description', updatedDescription);
    expect(updatedFolder).to.have.property('parentFolderId', rootFolderId);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);