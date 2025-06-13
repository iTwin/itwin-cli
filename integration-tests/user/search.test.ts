/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { User } from "../../src/services/user-client/models/user";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("search", () => {
    it("should return an empty list when no users match the search", async () => {
      const searchQuery = "non-existent-user";
      const { result: users } = await runCommand<User>(`user search --search ${searchQuery}`);

      expect(users).to.be.an("array").that.is.empty;
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
