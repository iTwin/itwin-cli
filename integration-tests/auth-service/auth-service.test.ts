/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import { AuthorizationInformation } from "../../src/services/authorization-client/authorization-type";
import { ITP_API_URL, ITP_ISSUER_URL, ITP_SERVICE_CLIENT_ID } from "../utils/environment";
import { serviceLoginToCli } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () => {
  it("should log in successfully using service authentication", async () => {
    await serviceLoginToCli();
  });

  it("should return auth info", async () => {
    const { result: infoResult } = await runCommand<AuthorizationInformation>("auth info");
    expect(infoResult).to.be.not.undefined;
    expect(infoResult!.apiUrl).to.be.equal(ITP_API_URL);
    expect(infoResult!.authorizationType).to.be.not.undefined;
    expect(infoResult!.clientId).to.be.equal(ITP_SERVICE_CLIENT_ID);
    expect(infoResult!.issuerUrl).to.be.equal(ITP_ISSUER_URL);
  });
};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Authentication Integration Tests (Service Client)", () => tests()));
