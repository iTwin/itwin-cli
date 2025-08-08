/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module";
import { AddedUserMembersResponse, UserMemberRoles } from "../../../../src/services/access-control/models/user-member";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock";

const tests = () =>
  describe("add", () => {
    const iTwinId = crypto.randomUUID();

    it("should add multiple internal user members to iTwin using `--email` and `--role-ids` flags", async () => {
      const userMembers: UserMemberRoles[] = [
        {
          email: "email1@example.com",
          roleIds: [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()],
        },
        {
          email: "email2@example.com",
          roleIds: [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()],
        },
        {
          email: "email3@example.com",
          roleIds: [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()],
        },
      ];
      const response = AccessControlApiMock.members.addiTwinUserMembers.successInternal(iTwinId, userMembers);

      const { result: createResult } =
        await runCommand<AddedUserMembersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${userMembers[0].email} --email ${userMembers[1].email} --email ${userMembers[2].email}
            --role-ids ${userMembers[0].roleIds.join(",")} --role-ids ${userMembers[1].roleIds.join(",")} --role-ids ${userMembers[2].roleIds.join(",")}`);

      expect(createResult).to.not.be.undefined;
      expect(createResult).to.be.deep.equal(response);
    });

    it("should add multiple external user members to iTwin using `--email` and `--role-ids` (single list) flags", async () => {
      const roleIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];
      const userMembers: UserMemberRoles[] = [
        {
          email: "email1@example.com",
          roleIds,
        },
        {
          email: "email2@example.com",
          roleIds,
        },
        {
          email: "email3@example.com",
          roleIds,
        },
      ];
      const response = AccessControlApiMock.members.addiTwinUserMembers.successExternal(iTwinId, userMembers);

      const { result: createResult } =
        await runCommand<AddedUserMembersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${userMembers[0].email} --email ${userMembers[1].email} --email ${userMembers[2].email}
            --role-ids ${roleIds.join(",")}`);

      expect(createResult).to.not.be.undefined;
      expect(createResult).to.be.deep.equal(response);
    });

    it("should return an error when provided role is not found", async () => {
      const userMembers: UserMemberRoles[] = [
        {
          email: "email@example.com",
          roleIds: [crypto.randomUUID()],
        },
      ];
      const response = AccessControlApiMock.members.addiTwinUserMembers.roleNotFound(iTwinId, userMembers);

      const { error: createError } = await runCommand<AddedUserMembersResponse>(
        `access-control member user add -i ${iTwinId} --email ${userMembers[0].email} --role-ids ${userMembers[0].roleIds.join(",")}`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when provided iTwin is not found", async () => {
      const userMembers: UserMemberRoles[] = [
        {
          email: "email@example.com",
          roleIds: [crypto.randomUUID()],
        },
      ];
      const response = AccessControlApiMock.members.addiTwinUserMembers.iTwinNotFound(iTwinId, userMembers);

      const { error: createError } = await runCommand<AddedUserMembersResponse>(
        `access-control member user add -i ${iTwinId} --email ${userMembers[0].email} --role-ids ${userMembers[0].roleIds.join(",")}`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
