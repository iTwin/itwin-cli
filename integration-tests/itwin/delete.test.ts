/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";

import { ResultResponse } from "../../src/services/general-models/result-response";
import { createITwin } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("delete", () => {
    let testITwin: ITwin;

    before(async () => {
      testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
    });

    it("should delete the iTwin", async () => {
      const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwin.id}`);
      expect(deleteResult).to.have.property("result", "deleted");

      const { error: errorResult } = await runCommand(`itwin info --itwin-id ${testITwin.id}`);
      expect(errorResult).to.be.not.undefined;
      expect(errorResult!.message).to.include("iTwinNotFound");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
