/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createITwin, deleteITwin, getRootFolderId } from '../utils/helpers';

const tests = () => describe('root-folder', () => {
  const name = 'IntegrationTestITwin';
  const classType = 'Thing';
  const subClass = 'Asset';
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin(name, classType, subClass);
    testITwinId = testITwin.id;
  });

  after(async () => {
    await deleteITwin(testITwinId);
  });

  it('should get the root folder', async () => {
    const { stdout } = await runCommand(`storage root-folder --itwin-id ${testITwinId}`);
    const rootFolder = JSON.parse(stdout);

    expect(rootFolder).to.have.property('items');
    expect(rootFolder.items).to.be.an('array');
    expect(rootFolder).to.have.property('_links');
    expect(rootFolder._links).to.have.property('folder');
    expect(rootFolder._links.folder).to.have.property('href');
    expect(rootFolder._links.folder.href).to.be.a('string');

    // check helper function
    const rootFolderId = await getRootFolderId(testITwinId);
    expect(rootFolder._links.folder.href).to.contain(rootFolderId);
  });

});

export default tests;