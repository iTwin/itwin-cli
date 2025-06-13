/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { runCommand } from "@oclif/test";
import { expect } from "chai";

import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () => {
  it("should fail with incorrect credentials", async () => {
    const { error: loginError } = await runCommand("auth login --client-id invalid-id --client-secret wrong-secret");
    expect(loginError).to.be.not.undefined;
    expect(loginError!.message).to.include("User login was not successful");
  });

  it("should log out successfully", async () => {
    const { stdout } = await runCommand("auth logout");

    expect(stdout).to.include("User successfully logged out");
  });
};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Authentication Integration Tests", () => tests()));
