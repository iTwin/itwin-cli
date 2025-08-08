/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import nock from "nock";

import { runCommand } from "@oclif/test";

import { AuthorizationInformation } from "../../src/services/authorization/authorization-type";
import { ResultResponse } from "../../src/services/general-models/result-response";
import { UserContext } from "../../src/services/general-models/user-context.js";
import { ITP_API_URL, ITP_ISSUER_URL } from "../utils/environment";
import { createIModel, createITwin } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () =>
  describe("Authentication Integration Tests", () => {
    const testIModelName = `cli-imodel-integration-test-${new Date().toISOString()}`;
    let testIModelId: string;
    let testITwinId: string;

    before(async () => {
      const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");
      testITwinId = testITwin.id as string;
      const testIModel = await createIModel(testIModelName, testITwinId);
      testIModelId = testIModel.id;
    });

    after(async () => {
      await runCommand("auth logout");

      nock.enableNetConnect();
      nock.recorder.rec();

      await runCommand("auth login");
      nock.restore();

      const { result: imodelDeleteResult } = await runCommand<ResultResponse>(`imodel delete --imodel-id ${testIModelId}`);
      const { result: itwinDeleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${testITwinId}`);

      expect(imodelDeleteResult).to.have.property("result", "deleted");
      expect(itwinDeleteResult).to.have.property("result", "deleted");
    });

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

    it("should clear context when user logs out", async () => {
      await runCommand("auth login");

      const { result: contextBefore } = await runCommand<UserContext>(`context set -i ${testITwinId} -m ${testIModelId}`);
      expect(contextBefore).to.not.be.undefined;
      expect(contextBefore?.iTwinId).to.be.equal(testITwinId);
      expect(contextBefore?.iModelId).to.be.equal(testIModelId);

      await runCommand("auth logout");

      const { result: contextAfter } = await runCommand<UserContext>(`context set -i ${testITwinId} -m ${testIModelId}`);
      expect(contextAfter).to.be.undefined;
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
