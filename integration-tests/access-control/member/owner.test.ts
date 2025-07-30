/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";

import { GroupMember } from "../../../src/services/access-control/models/group-members";
import { OwnerResponse } from "../../../src/services/access-control/models/owner";
import { ResultResponse } from "../../../src/services/general-models/result-response.js";
import { User } from "../../../src/services/users/models/user";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () => {
  let iTwinId: string;
  const iTwinName: string = `cli-itwin-integration-test-${new Date().toISOString()}`;

  before(async () => {
    const { result: iTwin } = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
    expect(iTwin?.id).to.not.be.undefined;
    iTwinId = iTwin!.id!;
  });

  after(async () => {
    const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${iTwinId}`);
    expect(deleteResult).to.have.property("result", "deleted");
  });

  it("Should list owners of an iTwin", async () => {
    const { result: owners } = await runCommand<GroupMember[]>(`access-control member owner list --itwin-id ${iTwinId}`);
    expect(owners).to.not.be.undefined;
    expect(owners!.length).to.be.greaterThanOrEqual(1);

    const { result: userInfo } = await runCommand<User>(`user me`);
    expect(userInfo).to.not.be.undefined;
    expect(userInfo!.id).to.not.be.undefined;
    expect(owners!.some((owner) => owner.id === userInfo!.id)).to.be.true;
  });

  it("Should return an error when invalid uuid is provided as --itwin-id", async () => {
    const { error: addError } = await runCommand<GroupMember>(`access-control member owner add -i an-invalid-uuid --email email@example.com`);
    expect(addError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

    const { error: listError } = await runCommand<GroupMember>(`access-control member owner list -i an-invalid-uuid`);
    expect(listError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

    const { error: deleteError } = await runCommand<ResultResponse>(
      `access-control member owner delete --itwin-id an-invalid-uuid --member-id ${crypto.randomUUID()}`,
    );
    expect(deleteError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
  });

  it("Should return an error when invalid uuid is provided as --member-id", async () => {
    const { error: deleteError } = await runCommand<ResultResponse>(
      `access-control member owner delete --itwin-id ${crypto.randomUUID()} --member-id an-invalid-uuid`,
    );
    expect(deleteError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
  });

  it("Should return an error when invalid email is provided as --email", async () => {
    const { error: updateError } = await runCommand<OwnerResponse>(`access-control member owner add -i ${crypto.randomUUID()} --email not-a-valid-email`);
    expect(updateError?.message).to.contain("'not-a-valid-email' is not a valid email.");
  });
};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Access Control Member Owner Tests", () => tests()));
