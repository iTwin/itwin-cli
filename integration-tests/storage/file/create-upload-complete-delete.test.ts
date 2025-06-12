/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { FileTyped } from "../../../src/services/storage-client/models/file-typed";
import { FileUpload } from "../../../src/services/storage-client/models/file-upload";
import { createFolder, createITwin, getRootFolderId } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () =>
  describe("create + upload + complete + delete", () => {
    let testFileId: string;
    let rootFolderId: string;
    let testFolderId: string;
    let testITwinId: string;
    let uploadUrl: string;
    const displayName = "IntegrationTestFile";
    const description = "Test description";

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
      rootFolderId = await getRootFolderId(testITwinId);
      const testFolder = await createFolder(rootFolderId, "IntegrationTestFolder", "Test description");
      testFolderId = testFolder.id as string;
    });

    after(async () => {
      const { result: itwinDeleteResult } = await runCommand<{ result: string }>(`itwin delete --itwin-id ${testITwinId}`);
      expect(itwinDeleteResult).to.have.property("result", "deleted");
    });

    it("should create a new file meta data", async () => {
      const { result: createdFile } = await runCommand<FileUpload>(
        `storage file create --folder-id ${testFolderId} --name ${displayName} --description "${description}"`
      );

      expect(createdFile).to.have.property("_links");
      expect(createdFile!._links).to.have.property("completeUrl");
      expect(createdFile!._links).to.have.property("uploadUrl");

      uploadUrl = createdFile!._links!.uploadUrl!.href!;

      // extract file id from completeUrl that looks like this: "https://api.bentley.com/storage/files/TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI/complete"
      const completeUrl = createdFile!._links!.completeUrl!.href;
      testFileId = completeUrl!.split("/").at(-2)!;
    });

    it("should upload a file", async () => {
      const filePath = "integration-tests/test.csv";
      const { result: uploadResult } = await runCommand<{ result: string }>(
        `storage file upload --upload-url "${uploadUrl}" --file-path ${filePath}`
      );

      expect(uploadResult?.result).to.be.equal("uploaded");
    });

    it("should complete the upload", async () => {
      const { result: completedFile } = await runCommand<FileTyped>(`storage file update-complete --file-id ${testFileId}`);

      expect(completedFile).to.have.property("id", testFileId);
      expect(completedFile).to.have.property("displayName", displayName);
      expect(completedFile).to.have.property("description", description);
      expect(completedFile).to.have.property("_links");
      expect(completedFile!._links).to.have.property("parentFolder");
      expect(completedFile!._links!.parentFolder).to.have.property("href");
      expect(completedFile!._links!.parentFolder!.href).to.include(testFolderId);
    });

    it("should delete the file", async () => {
      await runCommand(`storage file delete --file-id ${testFileId}`);

      const { error: infoError } = await runCommand<FileTyped>(`storage file info --file-id ${testFileId}`);
      expect(infoError).to.be.not.undefined;
      expect(infoError!.message).to.include("FileNotFound");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
