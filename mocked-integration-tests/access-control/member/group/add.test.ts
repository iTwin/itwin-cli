/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module";
import { AddedGroupMembersResponse, GroupMemberRoles } from "../../../../src/services/access-control/models/group-member";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock";

const tests = () =>
  describe("add", () => {
    const iTwinId = crypto.randomUUID();

    it("should add multiple external user members to iTwin using `--email` and `--role-ids` (single list) flags", async () => {
      const roleIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];
      const groupMembers: GroupMemberRoles[] = [
        {
          groupId: crypto.randomUUID(),
          roleIds,
        },
        {
          groupId: crypto.randomUUID(),
          roleIds,
        },
        {
          groupId: crypto.randomUUID(),
          roleIds,
        },
      ];
      const response = AccessControlApiMock.members.addiTwinGroupMembers.success(iTwinId, groupMembers);

      const { result: createResult } =
        await runCommand<AddedGroupMembersResponse>(`access-control member group add --itwin-id ${iTwinId} --group-id ${groupMembers[0].groupId} --group-id ${groupMembers[1].groupId} --group-id ${groupMembers[2].groupId}
            --role-ids ${roleIds.join(",")}`);

      expect(createResult).to.not.be.undefined;
      expect(createResult).to.be.deep.equal(response.members);
    });

    it("should return an error when provided role is not found", async () => {
      const userMembers: GroupMemberRoles[] = [
        {
          groupId: crypto.randomUUID(),
          roleIds: [crypto.randomUUID()],
        },
      ];
      const response = AccessControlApiMock.members.addiTwinGroupMembers.roleNotFound(iTwinId, userMembers);

      const { error: createError } = await runCommand<AddedGroupMembersResponse>(
        `access-control member group add -i ${iTwinId} --group-id ${userMembers[0].groupId} --role-ids ${userMembers[0].roleIds.join(",")}`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when provided iTwin is not found", async () => {
      const userMembers: GroupMemberRoles[] = [
        {
          groupId: crypto.randomUUID(),
          roleIds: [crypto.randomUUID()],
        },
      ];
      const response = AccessControlApiMock.members.addiTwinGroupMembers.iTwinNotFound(iTwinId, userMembers);

      const { error: createError } = await runCommand<AddedGroupMembersResponse>(
        `access-control member group add -i ${iTwinId} --group-id ${userMembers[0].groupId} --role-ids ${userMembers[0].roleIds.join(",")}`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when provided group is not found", async () => {
      const userMembers: GroupMemberRoles[] = [
        {
          groupId: crypto.randomUUID(),
          roleIds: [crypto.randomUUID()],
        },
      ];
      const response = AccessControlApiMock.members.addiTwinGroupMembers.teamMemberNotFound(iTwinId, userMembers);

      const { error: createError } = await runCommand<AddedGroupMembersResponse>(
        `access-control member group add -i ${iTwinId} --group-id ${userMembers[0].groupId} --role-ids ${userMembers[0].roleIds.join(",")}`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
