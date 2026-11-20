/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import nock from "nock";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../integration-tests/utils/run-suite-if-main-module.js";
import { environments } from "../../src/extensions/configuration.js";
import { AuthorizationInformation, AuthorizationType } from "../../src/services/authorization/authorization-type.js";
import { UserContext } from "../../src/services/general-models/user-context.js";
import { User } from "../../src/services/users/models/user.js";
import { IModelsApiMock } from "../utils/api-mocks/imodels-api/imodels-api-mock.js";
import { ImsMock } from "../utils/api-mocks/ims/ims-mock.js";
import { writeMockToken } from "../utils/helpers.js";

const tests = () =>
  describe("auth", () => {
    const testIModelId = crypto.randomUUID();
    const testITwinId = crypto.randomUUID();
    const otherApiUrl = "https://mock-other-api.bentley.com";

    after(async () => {
      writeMockToken("mock-client", AuthorizationType.Service);
    });

    it("should clear context when user logs out", async () => {
      IModelsApiMock.getIModel.success(testITwinId, testIModelId);

      await runCommand<UserContext>(`context set -i ${testITwinId} -m ${testIModelId}`);

      const { result: contextBefore } = await runCommand<UserContext>(`context info`);
      expect(contextBefore).to.not.be.undefined;
      expect(contextBefore?.iTwinId).to.be.equal(testITwinId);
      expect(contextBefore?.iModelId).to.be.equal(testIModelId);

      await runCommand("auth logout");

      const { result: contextAfter } = await runCommand<UserContext>(`context info`);
      expect(contextAfter).to.be.undefined;
    });

    it("should log in to the environment selected with --env, ignoring ITP_ISSUER_URL and ITP_API_URL", async () => {
      ImsMock.serviceLogin.success(environments.qa.issuerUrl);

      const { error } = await runCommand("auth login --env qa --client-id service-client --client-secret secret");
      expect(error).to.be.undefined;

      const { result: info } = await runCommand<AuthorizationInformation>("auth info");
      expect(info?.authorizationType).to.be.equal(AuthorizationType.Service);
      expect(info?.issuerUrl).to.be.equal(environments.qa.issuerUrl);
      expect(info?.apiUrl).to.be.equal(environments.qa.apiUrl);
    });

    it("should call the API of the environment saved at login rather than ITP_API_URL", async () => {
      writeMockToken("mock-client", AuthorizationType.Service, { apiUrl: otherApiUrl });
      nock(otherApiUrl)
        .get("/users/me")
        .reply(200, { user: { id: "user-id" } });

      const { result, error } = await runCommand<User>("user me");
      expect(error).to.be.undefined;
      expect(result?.id).to.be.equal("user-id");
    });

    it("should renew an expired service token from the issuer saved at login rather than ITP_ISSUER_URL", async () => {
      const otherIssuerUrl = "https://mock-other-ims.bentley.com";
      writeMockToken("service-client", AuthorizationType.Service, {
        apiUrl: otherApiUrl,
        expirationDate: new Date(Date.now() - 1000),
        issuerUrl: otherIssuerUrl,
      });
      ImsMock.serviceLogin.success(otherIssuerUrl);
      nock(otherApiUrl)
        .get("/users/me")
        .reply(200, { user: { id: "user-id" } });

      process.env.ITP_SERVICE_CLIENT_ID = "service-client";
      process.env.ITP_SERVICE_CLIENT_SECRET = "secret";
      try {
        const { result, error } = await runCommand<User>("user me");
        expect(error).to.be.undefined;
        expect(result?.id).to.be.equal("user-id");
      } finally {
        delete process.env.ITP_SERVICE_CLIENT_ID;
        delete process.env.ITP_SERVICE_CLIENT_SECRET;
      }

      const { result: info } = await runCommand<AuthorizationInformation>("auth info");
      expect(info?.issuerUrl).to.be.equal(otherIssuerUrl);
      expect(info?.apiUrl).to.be.equal(otherApiUrl);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
