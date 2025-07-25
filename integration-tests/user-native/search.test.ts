/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { User } from "../../src/services/users/models/user";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("user search (Native Client Tests)", () => {
    it("should search for users with a valid query", async () => {
      const { result: meResult } = await runCommand<User>("user me");
      expect(meResult?.id).to.not.be.undefined;
      expect(meResult?.email).to.not.be.undefined;

      const testUserId = meResult!.id;
      const testUserEmail = meResult!.email;

      const { result: users } = await runCommand<User[]>(`user search --search ${testUserEmail}`);

      expect(users).to.be.an("array").that.is.not.empty;
      const userInfo = users![0];

      expect(userInfo).to.have.property("id", testUserId);
      expect(userInfo).to.have.property("email", testUserEmail);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
