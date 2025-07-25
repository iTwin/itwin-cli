/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import fs from "node:fs";

import { runCommand } from "@oclif/test";

import { AuthorizationInformation } from "../../src/services/authorization/authorization-type";
import { ITP_API_URL, ITP_ISSUER_URL, ITP_SERVICE_CLIENT_ID, ITP_SERVICE_CLIENT_SECRET } from "../utils/environment";
import { getTokenPathByOS, serviceLoginToCli } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("Authentication Integration Tests (Service Client)", () => {
    it("auth info get full auth info from token when logged in", async () => {
      await serviceLoginToCli();

      const apiUrl = ITP_API_URL;
      const issuerUrl = ITP_ISSUER_URL;
      const clientId = ITP_SERVICE_CLIENT_ID;

      process.env.ITP_API_URL = "changed-api-url";
      process.env.ITP_ISSUER_URL = "changed-issuer-url";
      process.env.ITP_SERVICE_CLIENT_ID = "a-different-client-id";

      const { result: infoResult } = await runCommand<AuthorizationInformation>("auth info");
      expect(infoResult).to.be.not.undefined;
      expect(infoResult!.apiUrl).to.be.equal(apiUrl);
      expect(infoResult!.authorizationType).to.be.equal("Service");
      expect(infoResult!.clientId).to.be.equal(clientId);
      expect(infoResult?.expirationDate).not.to.be.undefined;
      expect(infoResult!.issuerUrl).to.be.equal(issuerUrl);

      process.env.ITP_API_URL = apiUrl;
      process.env.ITP_ISSUER_URL = issuerUrl;
      process.env.ITP_SERVICE_CLIENT_ID = clientId;
    });

    it("should return an error if service auth token is expired and no service credentials are available.", async () => {
      const serviceClientId = ITP_SERVICE_CLIENT_ID;
      const serviceClientSecret = ITP_SERVICE_CLIENT_SECRET;

      const authTokenObject = {
        clientId: ITP_SERVICE_CLIENT_ID,
        authToken: "some-expired-token",
        authenticationType: "Service",
        expirationDate: new Date(Date.now() - 1000),
      };
      fs.writeFileSync(getTokenPathByOS(), JSON.stringify(authTokenObject), "utf8");

      delete process.env.ITP_SERVICE_CLIENT_ID;
      delete process.env.ITP_SERVICE_CLIENT_SECRET;
      const { error } = await runCommand<AuthorizationInformation>("user me");
      expect(error).to.not.be.undefined;
      expect(error?.message).to.be.equal(
        "Service auth token has expired and no client credentials are available. Please run 'itp auth login' command with client credentials to re-authenticate. Alternatively, you may save your client credentials to ITP_SERVICE_CLIENT_ID and ITP_SERVICE_CLIENT_SECRET environment variables and re-run this command.",
      );

      process.env.ITP_SERVICE_CLIENT_ID = serviceClientId;
      process.env.ITP_SERVICE_CLIENT_SECRET = serviceClientSecret;
    });

    after(async () => {
      await serviceLoginToCli();
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
