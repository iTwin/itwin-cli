/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { AuthorizationInformation } from "../../src/services/authorization/authorization-type";
import { ITP_API_URL, ITP_ISSUER_URL } from "../utils/environment";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("Authentication Integration Tests", () => {
    it("auth info should get urls from environment when not logged in", async () => {
      const apiUrl = ITP_API_URL;
      const issuerUrl = ITP_ISSUER_URL;
      process.env.ITP_API_URL = "changed-api-url";
      process.env.ITP_ISSUER_URL = "changed-issuer-url";

      await runCommand<void>("auth logout");

      const { result: infoResult } = await runCommand<AuthorizationInformation>("auth info");

      process.env.ITP_API_URL = apiUrl;
      process.env.ITP_ISSUER_URL = issuerUrl;

      expect(infoResult).to.be.not.undefined;
      expect(infoResult!.apiUrl).to.be.equal("changed-api-url");
      expect(infoResult!.authorizationType).to.be.undefined;
      expect(infoResult!.clientId).to.be.undefined;
      expect(infoResult?.expirationDate).to.be.undefined;
      expect(infoResult!.issuerUrl).to.be.equal("changed-issuer-url");
    });

    it("should ask user to login when there is no token available", async () => {
      await runCommand<void>("auth logout");

      const { error } = await runCommand<AuthorizationInformation>("user me");
      expect(error).to.not.be.undefined;
      expect(error?.message).to.be.equal("User is not logged in. Please run 'itp auth login' command to authenticate.");
    });

    it("should fail with incorrect credentials", async () => {
      const { error: loginError } = await runCommand("auth login --client-id invalid-id --client-secret wrong-secret");
      expect(loginError).to.be.not.undefined;
      expect(loginError!.message).to.include("User login was not successful");
    });

    it("should log out successfully", async () => {
      const { stdout } = await runCommand("auth logout");

      expect(stdout).to.include("User successfully logged out");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
