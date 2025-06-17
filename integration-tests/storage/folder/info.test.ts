/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../../src/services/general-models/result-response";
import { FolderTyped } from "../../../src/services/storage-client/models/folder-typed";
import { createFolder, createITwin, getRootFolderId } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () =>
  describe("info", () => {
    let rootFolderId: string;
    let testFolderId: string;
    let testITwinId: string;

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
      rootFolderId = await getRootFolderId(testITwinId);
      const testFolder = await createFolder(rootFolderId, "IntegrationTestFolder", "Test description");
      testFolderId = testFolder.id as string;
    });

    after(async () => {
      const { result: itwinDeleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);
      expect(itwinDeleteResult).to.have.property("result", "deleted");
    });

    it("should get the info of the folder", async () => {
      const { result: folderInfo } = await runCommand<FolderTyped>(`storage folder info --folder-id ${testFolderId}`);

      expect(folderInfo).to.have.property("id", testFolderId);
      expect(folderInfo).to.have.property("displayName", "IntegrationTestFolder");
      expect(folderInfo).to.have.property("description", "Test description");
      expect(folderInfo).to.have.property("parentFolderId", rootFolderId);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
