/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../../src/services/general-models/result-response";
import { SourceFile } from "../../../src/services/synchronizationClient/models/source-file";
import { StorageConnection } from "../../../src/services/synchronizationClient/models/storage-connection";
import { createFile, createIModel, createITwin, getRootFolderId } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () =>
  describe("create", () => {
    let testITwinId: string;
    let testIModelId: string;
    let rootFolderId: string;
    let testFileId1: string;
    let testFileId2: string;
    let testFileId3: string;

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test--${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
      const testIModel = await createIModel(`cli-imodel-integration-test--${new Date().toISOString()}`, testITwinId);
      testIModelId = testIModel.id;
      rootFolderId = await getRootFolderId(testITwinId);
      const testFile1 = await createFile(rootFolderId, "ExtonCampus.dgn", "examples/datasets/ExtonCampus.dgn");
      testFileId1 = testFile1.id as string;
      const testFile2 = await createFile(rootFolderId, "HouseModel.dgn", "examples/datasets/HouseModel.dgn");
      testFileId2 = testFile2.id as string;
      const testFile3 = await createFile(rootFolderId, "test.zip", "integration-tests/test.zip");
      testFileId3 = testFile3.id as string;
    });

    after(async () => {
      const { result: imodelDeleteResult } = await runCommand<ResultResponse>(`imodel delete --imodel-id ${testIModelId}`);
      const { result: itwinDeleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);

      expect(imodelDeleteResult).to.have.property("result", "deleted");
      expect(itwinDeleteResult).to.have.property("result", "deleted");
    });

    it("should create a connection with multiple files and equal amount of connector types", async () => {
      const { result: createdConnection } = await runCommand<StorageConnection>(
        `imodel connection create -m ${testIModelId} -f ${testFileId1} -f ${testFileId3} --connector-type MSTN --connector-type SPPID -n TestConnection`,
      );

      expect(createdConnection).to.not.be.undefined;
      expect(createdConnection!.id).to.not.be.undefined;
      expect(createdConnection).to.have.property("iModelId", testIModelId);
      expect(createdConnection!.displayName).to.be.equal("TestConnection");

      const { result: listResult } = await runCommand<SourceFile[]>(`imodel connection sourcefile list -c ${createdConnection!.id}`);
      expect(listResult).to.have.lengthOf(2);
      expect(listResult!.some((sourceFile) => sourceFile.storageFileId === testFileId1 && sourceFile.connectorType === "MSTN")).to.be.true;
      expect(listResult!.some((sourceFile) => sourceFile.storageFileId === testFileId3 && sourceFile.connectorType === "SPPID")).to.be.true;

      const { result } = await runCommand<ResultResponse>(`imodel connection delete --connection-id ${createdConnection!.id}`);
      expect(result).to.have.property("result", "deleted");
    });

    it("should create a connection with multiple files and a single connector type", async () => {
      const { result: createdConnection } = await runCommand<StorageConnection>(
        `imodel connection create -m ${testIModelId} -f ${testFileId1} -f ${testFileId2} --connector-type MSTN -n TestConnection`,
      );

      expect(createdConnection).to.not.be.undefined;
      expect(createdConnection!.id).to.not.be.undefined;
      expect(createdConnection).to.have.property("iModelId", testIModelId);
      expect(createdConnection!.displayName).to.be.equal("TestConnection");

      const { result: listResult } = await runCommand<SourceFile[]>(`imodel connection sourcefile list -c ${createdConnection!.id}`);
      expect(listResult).to.have.lengthOf(2);
      expect(listResult!.some((sourceFile) => sourceFile.storageFileId === testFileId1 && sourceFile.connectorType === "MSTN")).to.be.true;
      expect(listResult!.some((sourceFile) => sourceFile.storageFileId === testFileId2 && sourceFile.connectorType === "MSTN")).to.be.true;

      const { result: deleteResult } = await runCommand<ResultResponse>(`imodel connection delete --connection-id ${createdConnection!.id}`);
      expect(deleteResult).to.have.property("result", "deleted");
    });

    it(`should throw an error if file and connector-type amounts don't match and connector-type amount is > 1.`, async () => {
      const { error: createError } = await runCommand<StorageConnection>(
        `imodel connection create -m ${testIModelId} -f ${testFileId1} -f ${testFileId2} -f ${testFileId3} --connector-type MSTN --connector-type SPPID -n TestConnection`,
      );
      expect(createError).to.not.be.undefined;
      expect(createError!.message).to.be.equal(
        "When multiple connector-type options are provided, their amount must match file-id option amount. Alternatively, you can provide a single connector-type option, which will then be applied to all file-id options.",
      );
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
