/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { folderTyped } from '../../../src/services/storage-client/models/folder-typed';
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
    expect(itwinDeleteResult?.result).to.be.equal('deleted');
  });

  it('should update the folder', async () => {
    const updatedDisplayName = 'UpdatedIntegrationTestFolder';
    const updatedDescription = 'Updated test description';

    const { result: updatedFolder } = await runCommand<folderTyped>(`storage folder update --folder-id ${testFolderId} --name ${updatedDisplayName} --description "${updatedDescription}"`);

    expect(updatedFolder?.id).to.be.equal(testFolderId);
    expect(updatedFolder?.displayName).to.be.equal(updatedDisplayName);
    expect(updatedFolder?.description).to.be.equal(updatedDescription);
    expect(updatedFolder?.parentFolderId).to.be.equal(rootFolderId);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);