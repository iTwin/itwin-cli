/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { User } from "../../src/services/user-client/models/user";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("me", () => {
    it("should retrieve the currently authenticated user", async () => {
      const { result: userInfo } = await runCommand<User>("user me");

      expect(userInfo).to.have.property("id");
      expect(userInfo).to.have.property("displayName");
      expect(userInfo).to.have.property("email");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
