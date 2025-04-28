/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../utils/run-suite-if-main-module";
import fileCreateUploadCompleteDeleteTests from "./file/create-upload-complete-delete.test";
import fileInfoTests from "./file/info.test";
import fileListTests from "./file/list.test";
import fileUpdateTests from "./file/update.test";
import fileUpdateContentTests from "./file/update-content.test";
import folderCreateDeleteTests from "./folder/create-delete.test";
import folderInfoTests from "./folder/info.test";
import folderListTests from "./folder/list.test";
import folderUpdateTests from "./folder/update.test";
import rootFolderTests from "./root-folder.test";

const tests = () => describe('Storage Integration Tests', () => {
  rootFolderTests();

  describe('folder', () => {
    folderCreateDeleteTests();
    folderUpdateTests();
    folderInfoTests();
    folderListTests();
  });

  describe('file', () => {
    fileCreateUploadCompleteDeleteTests();
    fileInfoTests();
    fileListTests();
    fileUpdateTests();
    fileUpdateContentTests();
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);