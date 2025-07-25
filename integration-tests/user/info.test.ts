/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { User } from "../../src/services/users/models/user";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("info", () => {
    it("should retrieve information about a specific user", async () => {
      const { result: meResult } = await runCommand<User>("user me");
      expect(meResult?.id).to.not.be.undefined;
      const testUserId = meResult!.id;

      const { result: users } = await runCommand<User[]>(`user info --user-id ${testUserId}`);
      expect(users).to.be.an("array").that.is.not.empty;

      const userInfo = users![0];
      expect(userInfo).to.have.property("id", testUserId);
      expect(userInfo).to.have.property("email");
      expect(userInfo).to.have.property("givenName");
      expect(userInfo).to.have.property("organizationName");
    });

    it("should return an error for invalid user IDs", async () => {
      const { error } = await runCommand<User[]>("user info --user-id an-invalid-uuid");
      expect(error).to.be.not.undefined;
      expect(error!.message).to.include("'an-invalid-uuid' is not a valid UUID.");
    });

    it("should return an empty array for not found user IDs", async () => {
      const { result } = await runCommand<User[]>(`user info --user-id ${crypto.randomUUID()}`);
      expect(result).to.be.an("array").that.is.empty;
    });

    it("should return an error for too many user IDs", async () => {
      let command = "user info";
      for (let i = 0; i < 1001; i++) {
        command += ` --user-id ${crypto.randomUUID()}`;
      }

      const { error } = await runCommand(command);
      expect(error).to.be.not.undefined;
      expect(error?.message).to.be.equal("A maximum of 1000 user IDs can be provided.");
    });

    it("should return an error when invalid uuid is provided as --user-id", async () => {
      const { error } = await runCommand<User>(`user info --user-id an-invalid-uuid`);
      expect(error?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
