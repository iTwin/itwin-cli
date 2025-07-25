/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../../src/services/general-models/result-response";
import { FileTyped } from "../../../src/services/storage/models/file-typed";
import { FileUpload } from "../../../src/services/storage/models/file-upload";
import { createFile, createFolder, createITwin, getRootFolderId } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () =>
  describe("update-content", () => {
    let testITwinId: string;
    let rootFolderId: string;
    let testFolderId: string;
    let testFileId: string;
    let uploadUrl: string;
    const displayName = "IntegrationTestFile";
    const description = "Test description";
    const filePath = "integration-tests/test.csv";

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
      rootFolderId = await getRootFolderId(testITwinId);

      const testFolder = await createFolder(rootFolderId, "IntegrationTestFolder", "Test description");
      testFolderId = testFolder.id as string;

      const createdFile = await createFile(testFolderId, displayName, filePath, description);
      testFileId = createdFile.id as string;
    });

    after(async () => {
      const { result: itwinDeleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);
      expect(itwinDeleteResult).to.have.property("result", "deleted");
    });

    it("should get URLs to update file content", async () => {
      const { result: updateResponse } = await runCommand<FileUpload>(`storage file update-content --file-id ${testFileId}`);

      expect(updateResponse).to.have.property("_links");
      expect(updateResponse!._links).to.have.property("completeUrl");
      expect(updateResponse!._links).to.have.property("uploadUrl");

      uploadUrl = updateResponse!._links!.uploadUrl!.href!;
    });

    it("should upload a new file version", async () => {
      const { result: uploadResult } = await runCommand<ResultResponse>(`storage file upload --upload-url "${uploadUrl}" --file-path ${filePath}`);
      expect(uploadResult?.result).to.be.equal("uploaded");
    });

    it("should complete the file content update", async () => {
      const { result: completedFile } = await runCommand<FileTyped>(`storage file update-complete -f ${testFileId}`);

      expect(completedFile).to.have.property("id", testFileId);
      expect(completedFile).to.have.property("displayName", displayName);
      expect(completedFile).to.have.property("description", description);
    });

    it("should throw an error when trying to update a non-existent file", async () => {
      const { error } = await runCommand<FileUpload>("storage file update-content -f non-existent-file-id");
      expect(error).to.be.not.undefined;
      expect(error!.message).to.include("FileNotFound");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
