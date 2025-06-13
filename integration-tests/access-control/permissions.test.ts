/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () => {
  let iTwinId: string;

  before(async () => {
    const iTwinName = `cli-itwin-integration-test-${new Date().toISOString()}`;
    const { result: iTwin } = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
    expect(iTwin?.id).to.not.be.undefined;
    iTwinId = iTwin!.id!;
  });

  after(async () => {
    const { result: deleteResult } = await runCommand<{ result: string }>(`itwin delete --itwin-id ${iTwinId}`);
    expect(deleteResult).to.have.property("result", "deleted");
  });

  it("Should retrieve my permissions", async () => {
    const { result: myPermissions } = await runCommand<string[]>(`access-control permissions me --itwin-id ${iTwinId}`);
    expect(myPermissions).to.not.be.undefined;
    expect(myPermissions!.length).to.be.greaterThan(0);
  });

  it("Should list all permissions", async () => {
    const { result: allPermissions } = await runCommand<string[]>(`access-control permissions all`);
    expect(allPermissions).to.not.be.undefined;
    expect(allPermissions!.length).to.be.greaterThan(0);
  });
};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Access Control Permissions Tests", () => tests()));
