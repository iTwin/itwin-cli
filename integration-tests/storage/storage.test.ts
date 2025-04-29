/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import isMainModule from "../utils/is-main-module";
import fileCreateUploadCompleteDeleteTests from "./file/create-upload-complete-delete";
import fileInfoTests from "./file/info";
import fileListTests from "./file/list";
import fileUpdateTests from "./file/update";
import fileUpdateContentTests from "./file/update-content";
import folderCreateDeleteTests from "./folder/create-delete";
import folderInfoTests from "./folder/info";
import folderListTests from "./folder/list";
import folderUpdateTests from "./folder/update";
import rootFolderTests from "./root-folder";

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

if (isMainModule(import.meta)) {
    tests();
}