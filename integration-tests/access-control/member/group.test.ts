/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";

import { Group } from "../../../src/services/access-control/models/group";
import { GroupMemberInfo } from "../../../src/services/access-control/models/group-member";
import { Role } from "../../../src/services/access-control/models/role";
import { ResultResponse } from "../../../src/services/general-models/result-response.js";
import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";

const tests = () => {
  let iTwinId: string;
  let groupId1: string;
  let groupId2: string;
  let groupId3: string;
  let roleId1: string;
  let roleId2: string;
  let roleId3: string;

  before(async () => {
    const iTwinName = `cli-itwin-integration-test-${new Date().toISOString()}`;
    const { result: iTwin } = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name ${iTwinName}`);
    expect(iTwin?.id).to.not.be.undefined;
    iTwinId = iTwin!.id!;

    const { result: group1 } = await runCommand<Group>(
      `access-control group create --itwin-id ${iTwinId} --name "Test Group #1" --description "Test Group Description"`,
    );
    expect(group1?.id).to.not.be.undefined;
    groupId1 = group1!.id!;

    const { result: group2 } = await runCommand<Group>(
      `access-control group create --itwin-id ${iTwinId} --name "Test Group #2" --description "Test Group Description"`,
    );
    expect(group2?.id).to.not.be.undefined;
    groupId2 = group2!.id!;

    const { result: group3 } = await runCommand<Group>(
      `access-control group create --itwin-id ${iTwinId} --name "Test Group #3" --description "Test Group Description"`,
    );
    expect(group3?.id).to.not.be.undefined;
    groupId3 = group3!.id!;

    const { result: role1 } = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role #1" -d "Test Role Description"`);
    expect(role1?.id).to.not.be.undefined;
    roleId1 = role1!.id!;

    const { result: role2 } = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role #2" -d "Test Role Description"`);
    expect(role2?.id).to.not.be.undefined;
    roleId2 = role2!.id!;

    const { result: role3 } = await runCommand<Role>(`access-control role create -i ${iTwinId} -n "Test Role #3" -d "Test Role Description"`);
    expect(role3?.id).to.not.be.undefined;
    roleId3 = role3!.id!;
  });

  after(async () => {
    const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${iTwinId}`);
    expect(deleteResult).to.have.property("result", "deleted");
  });

  it("Should create, update and list info and delete member group", async () => {
    const serializedGroupsInfo = JSON.stringify([
      {
        groupId: groupId1,
        roleIds: [roleId1],
      },
    ]);

    const { result: createResult } = await runCommand<GroupMemberInfo[]>(
      `access-control member group add --itwin-id ${iTwinId} --groups ${serializedGroupsInfo}`,
    );
    expect(createResult).to.not.be.undefined;
    expect(createResult).to.have.lengthOf(1);
    expect(createResult![0].id).to.not.be.undefined;
    expect(createResult![0].id).to.be.equal(groupId1);
    expect(createResult![0].roles).to.not.be.undefined;
    expect(createResult![0].roles).to.have.lengthOf(1);
    expect(createResult![0].roles![0].id).to.be.equal(roleId1);

    const { result: infoResult } = await runCommand<GroupMemberInfo>(`access-control member group info --itwin-id ${iTwinId} --group-id ${groupId1}`);
    expect(infoResult).to.not.be.undefined;
    expect(infoResult!.id).to.not.be.undefined;
    expect(infoResult!.id).to.be.equal(groupId1);

    const { result: additionalRole } = await runCommand<Role>(
      `access-control role create -i ${iTwinId} -n "One More Test Role" -d "One More Test Role Description"`,
    );
    expect(additionalRole).to.not.be.undefined;
    expect(additionalRole!.id).to.not.be.undefined;

    const { result: updateResult } = await runCommand<GroupMemberInfo>(
      `access-control member group update --itwin-id ${iTwinId} --group-id ${groupId1} --role-id ${roleId1} --role-id ${additionalRole!.id}`,
    );
    expect(updateResult).to.not.be.undefined;
    expect(updateResult!.id).to.not.be.undefined;
    expect(updateResult!.id).to.be.equal(groupId1);
    expect(updateResult!.roles).to.not.be.undefined;
    expect(updateResult!.roles).to.have.lengthOf(2);
    const assignedRoleIds = updateResult!.roles!.map((role) => role.id);
    expect(assignedRoleIds).to.include(roleId1);
    expect(assignedRoleIds).to.include(additionalRole!.id);

    const { result: resultList } = await runCommand<GroupMemberInfo[]>(`access-control member group list --itwin-id ${iTwinId}`);
    expect(resultList).to.not.be.undefined;
    expect(resultList).to.have.lengthOf(1);
    expect(resultList![0].id).to.not.be.undefined;
    expect(resultList![0].id).to.be.equal(groupId1);
    expect(resultList![0].roles).to.not.be.undefined;
    expect(resultList![0].roles).to.have.lengthOf(2);
    expect(resultList![0].roles![0].id).to.be.equal(roleId1);
    expect(resultList![0].roles![1].id).to.be.equal(additionalRole!.id);

    const { result: deleteResult } = await runCommand<ResultResponse>(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId1}`);
    expect(deleteResult).to.have.property("result", "deleted");
  });

  it("Should create multiple member groups using `--groups` flag and delete them", async () => {
    const groupsInfo = [
      {
        groupId: groupId1,
        roleIds: [roleId1, roleId2],
      },
      {
        groupId: groupId2,
        roleIds: [roleId1, roleId3],
      },
      {
        groupId: groupId3,
        roleIds: [roleId2, roleId3],
      },
    ];

    const { result: createResult } = await runCommand<GroupMemberInfo[]>(
      `access-control member group add --itwin-id ${iTwinId} --groups ${JSON.stringify(groupsInfo)}`,
    );
    expect(createResult).to.not.be.undefined;
    expect(createResult).to.have.lengthOf(3);
    for (const [i, groupInfo] of groupsInfo.entries()) {
      expect(createResult![i].id).to.be.equal(groupInfo.groupId);
      expect(createResult![i].roles.map((role) => role.id)).to.be.deep.equal(groupInfo.roleIds);
    }

    const { result: deleteResult1 } = await runCommand<ResultResponse>(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId1}`);
    expect(deleteResult1).to.have.property("result", "deleted");

    const { result: deleteResult2 } = await runCommand<ResultResponse>(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId2}`);
    expect(deleteResult2).to.have.property("result", "deleted");

    const { result: deleteResult3 } = await runCommand<ResultResponse>(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId3}`);
    expect(deleteResult3).to.have.property("result", "deleted");
  });

  it("Should create multiple member groups using `--group-id` and `--role-ids` flags and delete them", async () => {
    const groupIds = [groupId1, groupId2, groupId3];
    const roleIds = [roleId1, roleId2, roleId3];

    const { result: resultCreate } = await runCommand<GroupMemberInfo[]>(
      `access-control member group add --itwin-id ${iTwinId} --group-id ${groupIds[0]} --group-id ${groupIds[1]} --group-id ${groupIds[2]} --role-ids ${roleIds.join(",")}`,
    );
    expect(resultCreate).to.not.be.undefined;
    expect(resultCreate).to.have.lengthOf(3);
    for (const memberInfo of resultCreate!) {
      expect(groupIds.includes(memberInfo.id)).to.be.true;
      expect(memberInfo.roles.map((role) => role.id)).to.be.deep.equal(roleIds);
    }

    const { result: deleteResult1 } = await runCommand<ResultResponse>(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupIds[0]}`);
    expect(deleteResult1).to.have.property("result", "deleted");

    const { result: deleteResult2 } = await runCommand<ResultResponse>(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupIds[1]}`);
    expect(deleteResult2).to.have.property("result", "deleted");

    const { result: deleteResult3 } = await runCommand<ResultResponse>(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupIds[2]}`);
    expect(deleteResult3).to.have.property("result", "deleted");
  });

  it("Should return an error when all of the following flags are provided: `--groups`, `--group-id`, `--role-ids`", async () => {
    const groupsInfo = [
      {
        groupId: groupId1,
        roleIds: [roleId1, roleId2],
      },
      {
        groupId: groupId2,
        roleIds: [roleId1, roleId3],
      },
      {
        groupId: groupId3,
        roleIds: [roleId2, roleId3],
      },
    ];

    const roleIds = [roleId1, roleId2, roleId3];

    const { error: createError } = await runCommand<GroupMemberInfo[]>(
      `access-control member group add --itwin-id ${iTwinId} --groups ${JSON.stringify(groupsInfo)} --group-id ${groupsInfo[0].groupId} --group-id ${groupsInfo[1].groupId} --group-id ${groupsInfo[2].groupId} --role-ids ${roleIds.join(",")}`,
    );
    expect(createError).to.not.be.undefined;
    expect(createError!.message).to.match(
      new RegExp(`--group-id=${groupsInfo[0].groupId},${groupsInfo[1].groupId},${groupsInfo[2].groupId} cannot also be provided when using --groups`),
    );
  });

  it("Should return an error when none of the following flags are provided: `--groups`, `--group-id`, `--role-ids`", async () => {
    const { error: createError } = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId}`);
    expect(createError).to.not.be.undefined;
    expect(createError!.message).to.match(/Exactly one of the following must be provided: --group-id, --groups/);
  });

  it("should return an error when only `--group-id` flag is provided", async () => {
    const groupsInfo = [
      {
        groupId: groupId1,
      },
      {
        groupId: groupId2,
      },
      {
        groupId: groupId3,
      },
    ];

    const { error: createError } = await runCommand<GroupMemberInfo[]>(
      `access-control member group add --itwin-id ${iTwinId} --group-id ${groupsInfo[0].groupId} --group-id ${groupsInfo[1].groupId} --group-id ${groupsInfo[2].groupId}`,
    );
    expect(createError).to.not.be.undefined;
    expect(createError!.message).to.match(/All of the following must be provided when using --group-id: --role-ids/);
  });

  it("should return an error when only `--role-ids` flag is provided", async () => {
    const roleIds = [roleId1, roleId2, roleId3];

    const { error: createError } = await runCommand<GroupMemberInfo[]>(`access-control member group add --itwin-id ${iTwinId} --role-ids ${roleIds.join(",")}`);
    expect(createError).to.not.be.undefined;
    expect(createError?.message).to.match(/All of the following must be provided when using --role-ids: --group-id/);
  });

  it("should return an error when there are invalid UUIDs provided to `--role-ids` flag", async () => {
    const groupsInfo = [
      {
        groupId: groupId1,
        roleIds: [roleId1, roleId2],
      },
    ];

    const { error: createError } = await runCommand<
      GroupMemberInfo[]
    >(`access-control member group add --itwin-id ${iTwinId} --group-id ${groupsInfo[0].groupId}
            --role-ids ${groupsInfo[0].roleIds.join(",")},some-invalid-uuid`);
    expect(createError).to.not.be.undefined;
    expect(createError!.message).to.match(new RegExp(`There are invalid UUIDs in '${groupsInfo[0].roleIds.join(",")},some-invalid-uuid'`));
  });

  it("should return an error when invalid JSON is provided to `--groups` flag", async () => {
    const { error: createError } = await runCommand<GroupMemberInfo[]>(
      `access-control member group add --itwin-id ${iTwinId} --groups not-a-serialized-json-string`,
    );
    expect(createError).to.not.be.undefined;
    expect(createError?.message).to.match(/'not-a-serialized-json-string' is not valid serialized JSON./);
  });

  it("should return an error when JSON provided to `--groups` flag is of invalid schema", async () => {
    const groupsInfo = [
      {
        roleIds: ["not-a-uuid", roleId2],
      },
      {
        groupId: "not-a-uuid",
        roleIds: [123, {}],
      },
      {
        groupId: true,
        roleIds: [roleId2, roleId3],
      },
    ];

    const { error: createError } = await runCommand<GroupMemberInfo[]>(
      `access-control member group add --itwin-id ${iTwinId} --groups ${JSON.stringify(groupsInfo)}`,
    );

    expect(createError).to.not.be.undefined;
    expect(createError!.message).to.match(/missing required property '\[0].groupId' of type 'string'/);
    expect(createError!.message).to.match(/\[0].roleIds\[0] is not a valid uuid/);
    expect(createError!.message).to.match(/\[1].groupId is not a valid uuid/);
    expect(createError!.message).to.match(/\[1].roleIds\[0]: expected type 'string', received 'number'/);
    expect(createError!.message).to.match(/\[1].roleIds\[1]: expected type 'string', received 'object'/);
    expect(createError!.message).to.match(/\[2].groupId: expected type 'string', received 'boolean'/);
  });

  it("Should return an error when there are too many role assignments", async () => {
    const groups: { groupId: string; roleIds: string[] }[] = [];
    for (let i = 0; i < 11; i++) {
      groups.push({
        groupId: crypto.randomUUID(),
        roleIds: [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()],
      });
    }

    const serializedGroupsInfo = JSON.stringify(groups);

    const { error: createError } = await runCommand<GroupMemberInfo[]>(
      `access-control member group add --itwin-id ${iTwinId} --groups ${serializedGroupsInfo}`,
    );
    expect(createError).to.not.be.undefined;
    expect(createError!.message).to.be.equal("A maximum of 50 role assignments can be performed.");
  });

  it("Should return an error when there are too many roles assigned", async () => {
    let command = `access-control member group update --itwin-id ${iTwinId} --group-id ${groupId1}`;

    for (let i = 0; i < 51; i++) command += ` --role-id ${crypto.randomUUID()}`;

    const { error: createError } = await runCommand<GroupMemberInfo[]>(command);
    expect(createError).to.not.be.undefined;
    expect(createError?.message).to.be.equal("A maximum of 50 roles can be assigned.");
  });

  it("Should return an error when invalid uuid is provided as --itwin-id", async () => {
    const { error: addError } = await runCommand<Group>(`access-control member group add -i an-invalid-uuid -g ${crypto.randomUUID()}`);
    expect(addError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

    const { error: infoError } = await runCommand<Group>(`access-control member group info -i an-invalid-uuid -g ${crypto.randomUUID()}`);
    expect(infoError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

    const { error: listError } = await runCommand<Group>(`access-control member group list -i an-invalid-uuid -g ${crypto.randomUUID()}`);
    expect(listError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

    const { error: updateError } = await runCommand<Group>(`access-control member group update -i an-invalid-uuid -g ${crypto.randomUUID()}`);
    expect(updateError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");

    const { error: deleteError } = await runCommand<ResultResponse>(
      `access-control member group delete --itwin-id an-invalid-uuid --group-id ${crypto.randomUUID()}`,
    );
    expect(deleteError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
  });

  it("Should return an error when invalid uuid is provided as --group-id", async () => {
    const { error: addError } = await runCommand<Group>(`access-control member group add -i ${crypto.randomUUID()} -g another-invalid-uuid`);
    expect(addError?.message).to.contain("'another-invalid-uuid' is not a valid UUID.");

    const { error: infoError } = await runCommand<Group>(`access-control member group info -i ${crypto.randomUUID()} -g another-invalid-uuid`);
    expect(infoError?.message).to.contain("'another-invalid-uuid' is not a valid UUID.");

    const { error: updateError } = await runCommand<Group>(`access-control member group update -i ${crypto.randomUUID()} -g another-invalid-uuid`);
    expect(updateError?.message).to.contain("'another-invalid-uuid' is not a valid UUID.");

    const { error: deleteError } = await runCommand<ResultResponse>(
      `access-control member group delete --itwin-id ${crypto.randomUUID()} --group-id another-invalid-uuid`,
    );
    expect(deleteError?.message).to.contain("'another-invalid-uuid' is not a valid UUID.");
  });

  it("Should return an error when invalid uuid is provided as --role-id", async () => {
    const { error: updateError } = await runCommand<Group>(
      `access-control member group update -i ${crypto.randomUUID()} -g ${crypto.randomUUID()} --role-id ${crypto.randomUUID()} --role-id an-invalid-uuid`,
    );
    expect(updateError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
  });
};

export default tests;

runSuiteIfMainModule(import.meta, () => describe("Access Control Member Group Tests", () => tests()));
