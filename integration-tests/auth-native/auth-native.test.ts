/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import fs from "node:fs";

import { runCommand } from "@oclif/test";

import { AuthorizationInformation } from "../../src/services/authorization-client/authorization-type";
import { ITP_API_URL, ITP_ISSUER_URL } from "../utils/environment";
import { getTokenPathByOS, nativeLoginToCli } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("Authentication Integration Tests (Native Client)", () => {
    before(async () => {
      await nativeLoginToCli();
    });

    it("should return auth info", async () => {
      const { result: infoResult } = await runCommand<AuthorizationInformation>("auth info");
      expect(infoResult).to.be.not.undefined;
      expect(infoResult!.apiUrl).to.be.equal(ITP_API_URL);
      expect(infoResult!.authorizationType).to.be.equal("Interactive");
      expect(infoResult!.clientId).to.be.undefined;
      expect(infoResult!.issuerUrl).to.be.equal(ITP_ISSUER_URL);
    });

    it("should return an error if interactive auth token is expired.", async () => {
      const authTokenObject = {
        authToken: "some-expired-token",
        authenticationType: "Interactive",
        expirationDate: new Date(Date.now() - 1000),
        manuallyWritten: true,
      };
      fs.writeFileSync(getTokenPathByOS(), JSON.stringify(authTokenObject), "utf8");

      delete process.env.ITP_SERVICE_CLIENT_ID;
      delete process.env.ITP_SERVICE_CLIENT_SECRET;
      const { error } = await runCommand<AuthorizationInformation>("user me");
      expect(error).to.not.be.undefined;
      expect(error?.message).to.be.equal("Interactive auth token has expired. Please run 'itp auth login' command to re-authenticate.");
    });

    after(async () => {
      await nativeLoginToCli();
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
