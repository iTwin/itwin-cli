/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../integration-tests/utils/run-suite-if-main-module.js";
import { ResultResponse } from "../../src/services/general-models/result-response.js";
import { UserContext } from "../../src/services/general-models/user-context.js";
import { IModelsApiMock } from "../utils/api-mocks/imodels-api/imodels-api-mock.js";

const tests = () =>
  describe("delete", () => {
    const testIModelId1 = crypto.randomUUID();
    const testIModelId2 = crypto.randomUUID();
    const testITwinId = crypto.randomUUID();

    it("Should remove imodel from context when it is deleted", async () => {
      IModelsApiMock.getIModel.success(testITwinId, testIModelId1);
      IModelsApiMock.deleteIModel.success(testIModelId1);

      await runCommand<UserContext>(`context set -m ${testIModelId1}`);

      const { result: contextBefore } = await runCommand<UserContext>(`context info`);
      expect(contextBefore).to.not.be.undefined;
      expect(contextBefore?.iTwinId).to.be.equal(testITwinId);
      expect(contextBefore?.iModelId).to.be.equal(testIModelId1);

      const { result: deleteResult } = await runCommand<ResultResponse>(`imodel delete -m ${testIModelId1}`);
      expect(deleteResult).to.not.be.undefined;
      expect(deleteResult).to.have.property("result", "deleted");

      const { result: contextAfter } = await runCommand<UserContext>(`context info`);
      expect(contextAfter).to.not.be.undefined;
      expect(contextAfter?.iTwinId).to.be.equal(testITwinId);
      expect(contextAfter?.iModelId).to.be.undefined;
    });

    it("Should not remove imodel from context when a different iModel is deleted", async () => {
      IModelsApiMock.getIModel.success(testITwinId, testIModelId1);
      IModelsApiMock.deleteIModel.success(testIModelId2);

      await runCommand<UserContext>(`context set -m ${testIModelId1}`);

      const { result: contextBefore } = await runCommand<UserContext>(`context info`);
      expect(contextBefore).to.not.be.undefined;
      expect(contextBefore?.iTwinId).to.be.equal(testITwinId);
      expect(contextBefore?.iModelId).to.be.equal(testIModelId1);

      const { result: deleteResult } = await runCommand<ResultResponse>(`imodel delete -m ${testIModelId2}`);
      expect(deleteResult).to.not.be.undefined;
      expect(deleteResult).to.have.property("result", "deleted");

      const { result: contextAfter } = await runCommand<UserContext>(`context info`);
      expect(contextAfter).to.not.be.undefined;
      expect(contextAfter?.iTwinId).to.be.equal(testITwinId);
      expect(contextAfter?.iModelId).to.be.equal(testIModelId1);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
