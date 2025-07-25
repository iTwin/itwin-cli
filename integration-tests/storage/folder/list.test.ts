/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../../src/services/general-models/result-response";
import { FileTyped } from "../../../src/services/storage/models/file-typed";
import { FolderTyped } from "../../../src/services/storage/models/folder-typed";
import { createFile, createFolder, createITwin, getRootFolderId } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () =>
  describe("list", () => {
    const testFileName = "test.zip";
    const testFilePath = "integration-tests/test.zip";
    let rootFolderId: string;
    let testITwinId: string;
    let testFolderId: string;
    let testFileId: string;

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
      rootFolderId = await getRootFolderId(testITwinId);
      const testFolder = await createFolder(rootFolderId, "IntegrationTestFolder", "Test description");
      testFolderId = testFolder.id as string;
      const testFile = await createFile(rootFolderId, testFileName, testFilePath);
      testFileId = testFile.id as string;
    });

    after(async () => {
      const { result: itwinDeleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);
      expect(itwinDeleteResult).to.have.property("result", "deleted");
    });

    it("should get the list of folders in the specified folder", async () => {
      const { result: itemList } = await runCommand<FolderTyped[]>(`storage folder list --folder-id ${rootFolderId}`);

      expect(itemList).to.be.an("array").that.is.not.empty;
      expect(itemList!.some((folder) => folder.id === testFolderId && folder.type === "folder")).to.be.true;
      expect(itemList!.some((item) => item.id === testFileId)).to.be.false;
    });

    it("should get the list of folders and files in the specified folder", async () => {
      const { result: itemList } = await runCommand<FileTyped[]>(`storage folder list -f ${rootFolderId} --include-files`);
      expect(itemList).to.be.an("array").that.is.not.empty;
      expect(itemList!.some((folder) => folder.id === testFolderId && folder.type === "folder")).to.be.true;
      expect(itemList!.some((file) => file.id === testFileId && file.type === "file")).to.be.true;
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
