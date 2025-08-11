/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../integration-tests/utils/run-suite-if-main-module.js";
import { AuthorizationType } from "../../src/services/authorization/authorization-type.js";
import { UserContext } from "../../src/services/general-models/user-context.js";
import { IModelsApiMock } from "../utils/api-mocks/imodels-api/imodels-api-mock.js";
import { writeMockToken } from "../utils/helpers.js";

const tests = () =>
  describe("auth", () => {
    const testIModelId = crypto.randomUUID();
    const testITwinId = crypto.randomUUID();

    after(async () => {
      writeMockToken("mock-client", AuthorizationType.Service);
    });

    it("should clear context when user logs out", async () => {
      IModelsApiMock.getIModel.success(testITwinId, testIModelId);

      await runCommand<UserContext>(`context set -i ${testITwinId} -m ${testIModelId}`);

      const { result: contextBefore } = await runCommand<UserContext>(`context info`);
      expect(contextBefore).to.not.be.undefined;
      expect(contextBefore?.iTwinId).to.be.equal(testITwinId);
      expect(contextBefore?.iModelId).to.be.equal(testIModelId);

      await runCommand("auth logout");

      const { result: contextAfter } = await runCommand<UserContext>(`context info`);
      expect(contextAfter).to.be.undefined;
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
