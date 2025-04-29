/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { 
  createFolder, 
  createITwin, 
  getRootFolderId 
} from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('info', () => {
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
    const { result: folderDeleteResult } = await runCommand(`storage folder delete --folder-id ${testFolderId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(folderDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
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

runSuiteIfMainModule(import.meta, tests);