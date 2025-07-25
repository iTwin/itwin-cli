/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { AuthorizationType } from "../../../src/services/authorization-client/authorization-type";
import { ResultResponse } from "../../../src/services/general-models/result-response";
import { StorageConnection } from "../../../src/services/synchronizationClient/models/storage-connection";
import { StorageRun } from "../../../src/services/synchronizationClient/models/storage-run";
import { StorageRunsResponse } from "../../../src/services/synchronizationClient/models/storage-run-response";
import { createFile, createIModel, createITwin, getCurrentAuthType, getRootFolderId } from "../../utils/helpers";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () =>
  describe("run", () => {
    let testITwinId: string;
    let testIModelId: string;
    let rootFolderId: string;
    let testFileId: string;
    let connectionId: string;

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
      const testIModel = await createIModel(`cli-imodel-integration-test-${new Date().toISOString()}`, testITwinId);
      testIModelId = testIModel.id;
      rootFolderId = await getRootFolderId(testITwinId);
      const testFile = await createFile(rootFolderId, "ExtonCampus.dgn", "examples/datasets/ExtonCampus.dgn");
      testFileId = testFile.id as string;

      const authenticationType = getCurrentAuthType() === AuthorizationType.Interactive ? "User" : "Service";
      const { result: createdConnection } = await runCommand<StorageConnection>(
        `imodel connection create -m ${testIModelId} -f ${testFileId} --connector-type MSTN -n TestConnection --authentication-type ${authenticationType}`,
      );
      expect(createdConnection).to.not.be.undefined;
      connectionId = createdConnection!.id!;
    });

    after(async () => {
      const { result: imodelDeleteResult } = await runCommand<ResultResponse>(`imodel delete --imodel-id ${testIModelId}`);
      const { result: itwinDeleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);

      expect(imodelDeleteResult).to.have.property("result", "deleted");
      expect(itwinDeleteResult).to.have.property("result", "deleted");
    });

    it("should create a connection run and wait for it to complete", async () => {
      const { result: createResult } = await runCommand(`imodel connection run create -c ${connectionId}`);
      expect(createResult).to.not.be.undefined;

      const { result: listResult } = await runCommand<StorageRunsResponse>(`imodel connection run list -c ${connectionId}`);
      expect(listResult).to.not.be.undefined;
      expect(listResult?.runs).to.not.be.undefined;
      expect(listResult?.runs).to.have.lengthOf(1);

      let { result: infoResult } = await runCommand<StorageRun>(`imodel connection run info -c ${connectionId} --connection-run-id ${listResult?.runs[0].id}`);

      while (infoResult?.state !== "Completed") {
        await new Promise((r) => {
          setTimeout(r, 10_000);
        });

        const { result } = await runCommand<StorageRun>(`imodel connection run info -c ${connectionId} --connection-run-id ${listResult?.runs[0].id}`);
        infoResult = result;
      }

      expect(infoResult?.id).to.be.equal(listResult?.runs[0].id);
      expect(infoResult?.state).to.be.equal("Completed");
      expect(infoResult?.result).to.be.equal("Success");
    }).timeout(30 * 60 * 1000);
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
