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
  getRootFolderId 
} from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('update', () => {
  let rootFolderId: string;
  let testFolderId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    rootFolderId = await getRootFolderId(testITwinId);
    const testFolder = await createFolder(rootFolderId, 'IntegrationTestFolder', 'Test description');
    testFolderId = testFolder.id as string;
  });

  after(async () => {
    const { result: itwinDeleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwinId}`);
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should update the folder', async () => {
    const updatedDisplayName = 'UpdatedIntegrationTestFolder';
    const updatedDescription = 'Updated test description';

    const { result: updatedFolder } = await runCommand<FolderTyped>(`storage folder update --folder-id ${testFolderId} --name ${updatedDisplayName} --description "${updatedDescription}"`);

    expect(updatedFolder).to.have.property('id', testFolderId);
    expect(updatedFolder).to.have.property('displayName', updatedDisplayName);
    expect(updatedFolder).to.have.property('description', updatedDescription);
    expect(updatedFolder).to.have.property('parentFolderId', rootFolderId);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);