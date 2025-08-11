/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../src/services/general-models/result-response";
import { UserContext } from "../../src/services/general-models/user-context";
import { createITwin } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("delete", () => {
    const testITwinName = `cli-itwin-integration-test-${new Date().toISOString()}`;
    let testITwin: ITwin;

    before(async () => {
      testITwin = await createITwin(testITwinName, "Thing", "Asset");
    });

    it("should delete the iTwin", async () => {
      const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwin.id}`);
      expect(deleteResult).to.have.property("result", "deleted");

      const { error: errorResult } = await runCommand(`itwin info --itwin-id ${testITwin.id}`);
      expect(errorResult).to.be.not.undefined;
      expect(errorResult!.message).to.include("iTwinNotFound");
    });

    it("should clear context, when saved iTwin is deleted", async () => {
      const iTwinName = `${testITwinName}-context-test1`;

      const { result: createdITwin } = await runCommand<ITwin>(`itwin create --name "${iTwinName}" --class Thing --sub-class Asset --save`);

      await runCommand<UserContext>(`context set -i ${createdITwin!.id}`);
      const { result: contextBefore } = await runCommand<UserContext>(`context info`);

      const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete -i ${createdITwin?.id}`);
      const { result: contextAfter } = await runCommand<UserContext>(`context info`);

      expect(createdITwin).to.not.be.undefined;

      expect(contextBefore).to.not.be.undefined;
      expect(contextBefore?.iTwinId).to.be.equal(createdITwin?.id);
      expect(contextBefore?.iModelId).to.be.undefined;

      expect(deleteResult).to.not.be.undefined;
      expect(deleteResult).to.have.property("result", "deleted");
      expect(contextAfter).to.be.undefined;
    });

    it("should not clear context, when a different iTwin is deleted", async () => {
      const iTwinName1 = `${testITwinName}-context-test1`;
      const iTwinName2 = `${testITwinName}-context-test2`;

      const { result: createdITwin1 } = await runCommand<ITwin>(`itwin create --name "${iTwinName1}" --class Thing --sub-class Asset --save`);
      const { result: createdITwin2 } = await runCommand<ITwin>(`itwin create --name "${iTwinName2}" --class Thing --sub-class Asset --save`);

      await runCommand<UserContext>(`context set -i ${createdITwin1!.id}`);
      const { result: contextBefore } = await runCommand<UserContext>(`context info`);

      const { result: deleteResult2 } = await runCommand<ResultResponse>(`itwin delete -i ${createdITwin2?.id}`);
      const { result: contextAfter } = await runCommand<UserContext>(`context info`);
      const { result: deleteResult1 } = await runCommand<ResultResponse>(`itwin delete -i ${createdITwin1?.id}`);

      expect(createdITwin1).to.not.be.undefined;
      expect(createdITwin2).to.not.be.undefined;

      expect(contextBefore).to.not.be.undefined;
      expect(contextBefore?.iTwinId).to.be.equal(createdITwin1?.id);
      expect(contextBefore?.iModelId).to.be.undefined;

      expect(deleteResult2).to.not.be.undefined;
      expect(deleteResult2).to.have.property("result", "deleted");
      expect(contextAfter).to.not.be.undefined;
      expect(contextAfter?.iTwinId).to.be.equal(createdITwin1?.id);
      expect(contextAfter?.iModelId).to.be.undefined;
      expect(deleteResult1).to.not.be.undefined;
      expect(deleteResult1).to.have.property("result", "deleted");
    });

    it("should return an error when invalid uuid is provided as --itwin-id", async () => {
      const { error } = await runCommand<ITwin>(`itwin delete --itwin-id an-invalid-uuid`);
      expect(error?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
