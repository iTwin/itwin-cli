/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { StorageConnection } from "../../../src/services/synchronizationClient/models/storage-connection";
import { createFile, createIModel, createITwin, getRootFolderId } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () =>
  describe("info", () => {
    let testITwinId: string;
    let testIModelId: string;
    let rootFolderId: string;
    let testFileId: string;
    let connectionId: string;

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test--${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
      const testIModel = await createIModel(`cli-imodel-integration-test--${new Date().toISOString()}`, testITwinId);
      testIModelId = testIModel.id;
      rootFolderId = await getRootFolderId(testITwinId);
      const testFile = await createFile(rootFolderId, "test.zip", "integration-tests/test.zip");
      testFileId = testFile.id as string;
      const { result: createdConnection } = await runCommand<StorageConnection>(
        `imodel connection create -m ${testIModelId} -f ${testFileId} --connector-type MSTN -n TestConnection`
      );
      expect(createdConnection).to.not.be.undefined;
      connectionId = createdConnection!.id!;
    });

    after(async () => {
      const { result: imodelDeleteResult } = await runCommand<{ result: string }>(`imodel delete --imodel-id ${testIModelId}`);
      const { result: itwinDeleteResult } = await runCommand<{ result: string }>(`itwin delete --itwin-id ${testITwinId}`);

      expect(imodelDeleteResult).to.have.property("result", "deleted");
      expect(itwinDeleteResult).to.have.property("result", "deleted");
    });

    it("should get a connection", async () => {
      const { result: connection } = await runCommand<StorageConnection>(`imodel connection info -c ${connectionId}`);

      expect(connection).to.not.be.undefined;
      expect(connection).to.have.property("id");
      expect(connection).to.have.property("iTwinId", testITwinId);
      expect(connection).to.have.property("iModelId", testIModelId);
      expect(connection).to.have.property("displayName", "TestConnection");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
