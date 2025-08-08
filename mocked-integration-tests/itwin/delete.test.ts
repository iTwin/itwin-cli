/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../integration-tests/utils/run-suite-if-main-module.js";
import { ResultResponse } from "../../src/services/general-models/result-response.js";
import { UserContext } from "../../src/services/general-models/user-context.js";
import { ITwinsApiMock } from "../utils/api-mocks/itwins-api/itwins-api-mock.js";

const tests = () =>
  describe("delete", () => {
    const testITwinId1 = crypto.randomUUID();
    const testITwinId2 = crypto.randomUUID();

    it("should clear context, when saved iTwin is deleted", async () => {
      ITwinsApiMock.getITwin.success(testITwinId1);
      ITwinsApiMock.deleteITwin.success(testITwinId1);

      await runCommand<UserContext>(`context set -i ${testITwinId1}`);
      const { result: contextBefore } = await runCommand<UserContext>(`context info`);
      expect(contextBefore).to.not.be.undefined;
      expect(contextBefore?.iTwinId).to.be.equal(testITwinId1);
      expect(contextBefore?.iModelId).to.be.undefined;

      const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete -i ${testITwinId1}`);
      expect(deleteResult).to.not.be.undefined;
      expect(deleteResult).to.have.property("result", "deleted");

      const { result: contextAfter } = await runCommand<UserContext>(`context info`);
      expect(contextAfter).to.be.undefined;
    });

    it("should not clear context, when a different iTwin is deleted", async () => {
      ITwinsApiMock.getITwin.success(testITwinId1);
      ITwinsApiMock.deleteITwin.success(testITwinId2);

      await runCommand<UserContext>(`context set -i ${testITwinId1}`);

      const { result: contextBefore } = await runCommand<UserContext>(`context info`);
      expect(contextBefore).to.not.be.undefined;
      expect(contextBefore?.iTwinId).to.be.equal(testITwinId1);
      expect(contextBefore?.iModelId).to.be.undefined;

      const { result: deleteResult2 } = await runCommand<ResultResponse>(`itwin delete -i ${testITwinId2}`);
      expect(deleteResult2).to.not.be.undefined;
      expect(deleteResult2).to.have.property("result", "deleted");

      const { result: contextAfter } = await runCommand<UserContext>(`context info`);
      expect(contextAfter).to.not.be.undefined;
      expect(contextAfter?.iTwinId).to.be.equal(testITwinId1);
      expect(contextAfter?.iModelId).to.be.undefined;
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
