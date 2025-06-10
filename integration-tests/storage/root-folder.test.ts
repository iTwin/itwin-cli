/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from '@itwin/itwins-client';
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { FileTyped } from '../../src/services/storage-client/models/file-typed.js';
import { FolderTyped } from "../../src/services/storage-client/models/folder-typed.js";
import { ItemsWithFolderLink } from "../../src/services/storage-client/models/items-with-folder-link.js";
import { createFile, createFolder, createITwin, getRootFolderId } from '../utils/helpers.js';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module.js';

const tests = () => describe('root-folder', () => {
  let testITwin: ITwin;
  let rootFolderId: string;
  let testFolder: FolderTyped;
  let testFile: FileTyped;

  before(async () => {
    testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    rootFolderId = await getRootFolderId(testITwin.id!);
    testFolder = await createFolder(rootFolderId, 'IntegrationTestFolder', 'Test description');
    testFile = await createFile(rootFolderId, 'test.zip', 'integration-tests/test.zip');
  });

  after(async () => {
    const { result: itwinDeleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwin.id}`);
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should get the root folder with all items', async () => {
    const { result: rootFolder } = await runCommand<ItemsWithFolderLink>(`storage root-folder --itwin-id ${testITwin.id}`);

    expect(rootFolder).to.not.be.undefined;
    expect(rootFolder?.items).to.not.be.undefined;
    expect(rootFolder!.items).to.be.an('array').with.lengthOf(2);
    expect(rootFolder!.items![0].displayName).to.be.equal(testFolder.displayName);
    expect(rootFolder!.items![1].displayName).to.be.equal(testFile.displayName);
    expect(rootFolder).to.have.property('_links');
    expect(rootFolder!._links).to.have.property('folder');
    expect(rootFolder!._links!.folder).to.have.property('href');
    expect(rootFolder?._links?.folder?.href).to.be.a('string');

    // check helper function
    const fetchedRootFolderId = await getRootFolderId(testITwin.id!);
    expect(rootFolder!._links!.folder!.href).to.contain(fetchedRootFolderId);
  });

  it('should get the root folder with 2nd item only', async () => {
    const { result: rootFolder } = await runCommand<ItemsWithFolderLink>(`storage root-folder --itwin-id ${testITwin.id} --top 1 --skip 1`);

    expect(rootFolder).to.not.be.undefined;
    expect(rootFolder?.items).to.be.an('array').with.lengthOf(1);
    expect(rootFolder!.items![0].displayName).to.be.equal(testFile.displayName);
    expect(rootFolder).to.have.property('_links');
    expect(rootFolder!._links).to.have.property('folder');
    expect(rootFolder!._links!.folder).to.have.property('href');
    expect(rootFolder!._links!.folder!.href).to.be.a('string');

    // check helper function
    const fetchedRootFolderId = await getRootFolderId(testITwin.id!);
    expect(rootFolder!._links!.folder!.href).to.contain(fetchedRootFolderId);
  });

});

export default tests;

runSuiteIfMainModule(import.meta, tests);