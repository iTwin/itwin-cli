/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";

import { Group } from "../../src/services/access-control/models/group";
import { ResultResponse } from "../../src/services/general-models/result-response.js";
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
    const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${iTwinId}`);
    expect(deleteResult).to.have.property("result", "deleted");
  });

  it("Should create and update group info", async () => {
    const groupName = "Test Group";
    const groupDescription = "Test Group Description";

    const { result: groupCreate } = await runCommand<Group>(
      `access-control group create --itwin-id ${iTwinId} --name "${groupName}" --description "${groupDescription}"`,
    );

    expect(groupCreate).to.not.be.undefined;
    expect(groupCreate!.id).to.not.be.undefined;
    expect(groupCreate!.name).to.be.equal(groupName);
    expect(groupCreate!.description).to.be.equal(groupDescription);

    const { result: groupInfo } = await runCommand<Group>(`access-control group info --itwin-id ${iTwinId} --group-id ${groupCreate!.id}`);

    expect(groupInfo).to.not.be.undefined;

    expect(groupInfo?.id).to.be.equal(groupCreate!.id);
    expect(groupInfo?.name).to.be.equal(groupName);
    expect(groupInfo?.description).to.be.equal(groupDescription);

    const updatedGroupName = "Updated Group Name";
    const updatedGroupDescription = "Updated Group Description";

    const { result: groupUpdate } = await runCommand<Group>(
      `access-control group update --itwin-id ${iTwinId} --group-id ${groupCreate!.id} --name "${updatedGroupName}" --description "${updatedGroupDescription}"`,
    );
    expect(groupUpdate).to.not.be.undefined;
    expect(groupUpdate!.id).to.not.be.undefined;
    expect(groupUpdate!.name).to.be.equal(updatedGroupName);
    expect(groupUpdate!.description).to.be.equal(updatedGroupDescription);
    expect(groupUpdate!.members).to.not.be.undefined;
  });

  it("Should list groups", async () => {
    const { result: newGroup } = await runCommand<Group>(`access-control group create --itwin-id ${iTwinId} --name Test2 --description Description2`);
    expect(newGroup).to.not.be.undefined;
    expect(newGroup!.id).to.not.be.undefined;
    expect(newGroup!.name).to.be.equal("Test2");
    expect(newGroup!.description).to.be.equal("Description2");

    const { result: listedGroups } = await runCommand<Group[]>(`access-control group list --itwin-id ${iTwinId}`);
    expect(listedGroups).to.not.be.undefined;
    expect(listedGroups!.length).to.be.greaterThanOrEqual(1);

    expect(
      listedGroups!.some((entry) => entry.id === newGroup!.id),
      "Newly created group not found in the list",
    ).to.be.true;
  });

  it("Should delete group", async () => {
    const { result: createResult } = await runCommand<Group>(`access-control group create --itwin-id ${iTwinId} --name Test3 --description Description3`);
    expect(createResult).to.not.be.undefined;
    expect(createResult!.id).to.not.be.undefined;

    const { result: deleteResult } = await runCommand<ResultResponse>(`access-control group delete --itwin-id ${iTwinId} --group-id ${createResult!.id}`);
    expect(deleteResult).to.have.property("result", "deleted");

    const { error: infoError } = await runCommand<Group>(`access-control group info --itwin-id ${iTwinId} -g ${createResult!.id}`);
    expect(infoError?.message).to.contain("GroupNotFound");
  });

  it("Should fail to update group and return an error if too many members are provided", async () => {
    const { result: newGroup } = await runCommand<Group>(`access-control group create --itwin-id ${iTwinId} --name Test3 --description Description3`);
    expect(newGroup).to.not.be.undefined;
    expect(newGroup!.id).to.not.be.undefined;

    let updateCommand = `access-control group update --itwin-id ${iTwinId} --group-id ${newGroup!.id}`;
    for (let i = 0; i < 51; i++) {
      updateCommand += ` --member user${i}@example.com`;
    }

    const { error: updateError } = await runCommand(updateCommand);
    const { result: deleteResult } = await runCommand<ResultResponse>(`access-control group delete --itwin-id ${iTwinId} --group-id ${newGroup!.id}`);
    expect(deleteResult).to.have.property("result", "deleted");

    expect(updateError).to.not.be.undefined;
    expect(updateError?.message).to.be.equal("A maximum of 50 members can be provided.");
  });

  it("Should fail to update group and return an error if too many ims-groups are provided", async () => {
    const { result: newGroup } = await runCommand<Group>(`access-control group create --itwin-id ${iTwinId} --name Test3 --description Description3`);
    expect(newGroup).to.not.be.undefined;
    expect(newGroup!.id).to.not.be.undefined;

    let updateCommand = `access-control group update --itwin-id ${iTwinId} --group-id ${newGroup!.id}`;
    for (let i = 0; i < 51; i++) {
      updateCommand += ` --ims-group IMS_Group_${i}`;
    }

    const { error: updateError } = await runCommand(updateCommand);
    const { result: deleteResult } = await runCommand<ResultResponse>(`access-control group delete --itwin-id ${iTwinId} --group-id ${newGroup!.id}`);
    expect(deleteResult).to.have.property("result", "deleted");

    expect(updateError).to.not.be.undefined;
    expect(updateError?.message).to.be.equal("A maximum of 50 ims groups can be provided.");
  });

  it("Should return an error when invalid uuid is provided as --itwin-id", async () => {
    const { error: infoError } = await runCommand<Group>(`access-control group info -i an-invalid-uuid -g ${crypto.randomUUID()}`);
    expect(infoError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

    const { error: updateError } = await runCommand<Group>(`access-control group update -i an-invalid-uuid -g ${crypto.randomUUID()}`);
    expect(updateError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

    const { error: deleteError } = await runCommand<ResultResponse>(`access-control group delete --itwin-id an-invalid-uuid --group-id ${crypto.randomUUID()}`);
    expect(deleteError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
  });

  it("Should return an error when invalid uuid is provided as --group-id", async () => {
    const { error: infoError } = await runCommand<Group>(`access-control group info -i ${crypto.randomUUID()} -g another-invalid-uuid`);
    expect(infoError?.message).to.contain("'another-invalid-uuid' is not a valid UUID.");

    const { error: updateError } = await runCommand<Group>(`access-control group update -i ${crypto.randomUUID()} -g another-invalid-uuid`);
    expect(updateError?.message).to.contain("'another-invalid-uuid' is not a valid UUID.");

    const { error: deleteError } = await runCommand<ResultResponse>(
      `access-control group delete --itwin-id ${crypto.randomUUID()} --group-id another-invalid-uuid`,
    );
    expect(deleteError?.message).to.contain("'another-invalid-uuid' is not a valid UUID.");
  });

  it("Should return an error when invalid email is provided as --member", async () => {
    const { error: updateError } = await runCommand<Group>(
      `access-control group update -i ${crypto.randomUUID()} -g ${crypto.randomUUID()} --member not-a-valid-email`,
    );
    expect(updateError?.message).to.contain("'not-a-valid-email' is not a valid email.");
  });
};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Access Control Group Tests", () => tests()));
