/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module.js";
import { Member, MembersResponse, UserMember } from "../../../../src/services/access-control/models/members.js";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock.js";

const tests = () =>
  describe("add", () => {
    const iTwinId = crypto.randomUUID();
    const roleId1 = crypto.randomUUID();
    const roleId2 = crypto.randomUUID();
    const roleId3 = crypto.randomUUID();

    it("should add multiple internal user members to iTwin using `--email` and `--role-ids` flags", async () => {
      const userMembers: UserMember[] = [
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
        await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${userMembers[0].email} --email ${userMembers[1].email} --email ${userMembers[2].email}
            --role-ids ${userMembers[0].roleIds.join(",")} --role-ids ${userMembers[1].roleIds.join(",")} --role-ids ${userMembers[2].roleIds.join(",")}`);

      expect(createResult).to.not.be.undefined;
      expect(createResult).to.be.deep.equal(response);
    });

    it("should add multiple external user members to iTwin using `--email` and `--role-ids` (single list) flags", async () => {
      const roleIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];
      const userMembers: UserMember[] = [
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
        await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${userMembers[0].email} --email ${userMembers[1].email} --email ${userMembers[2].email}
            --role-ids ${roleIds.join(",")}`);

      expect(createResult).to.not.be.undefined;
      expect(createResult).to.be.deep.equal(response);
    });

    it("should return an error when provided role is not found", async () => {
      const userMembers: UserMember[] = [
        {
          email: "email@example.com",
          roleIds: [crypto.randomUUID()],
        },
      ];
      const response = AccessControlApiMock.members.addiTwinUserMembers.roleNotFound(iTwinId, userMembers);

      const { error: createError } = await runCommand<Member>(
        `access-control member user add -i ${iTwinId} --email ${userMembers[0].email} --role-ids ${userMembers[0].roleIds.join(",")}`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when provided iTwin is not found", async () => {
      const userMembers: UserMember[] = [
        {
          email: "email@example.com",
          roleIds: [crypto.randomUUID()],
        },
      ];
      const response = AccessControlApiMock.members.addiTwinUserMembers.iTwinNotFound(iTwinId, userMembers);

      const { error: createError } = await runCommand<Member>(
        `access-control member user add -i ${iTwinId} --email ${userMembers[0].email} --role-ids ${userMembers[0].roleIds.join(",")}`,
      );

      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when invalid email is provided as --email", async () => {
      const { error: updateError } = await runCommand<Member>(
        `access-control member user add -i ${crypto.randomUUID()} --email not-a-valid-email --role-ids ${crypto.randomUUID()}`,
      );
      expect(updateError?.message).to.contain("'not-a-valid-email' is not a valid email.");
    });

    it("should return an error when all of the following flags are provided: `--members`, `--email`, `--role-ids`", async () => {
      const usersInfo = [
        {
          email: "test1@example.com",
          roleIds: [roleId1, roleId2],
        },
        {
          email: "test2@example.com",
          roleIds: [roleId1, roleId3],
        },
        {
          email: "test3@example.com",
          roleIds: [roleId2, roleId3],
        },
      ];

      const { error: createError } =
        await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --members ${JSON.stringify(usersInfo)} --email ${usersInfo[0].email} --email ${usersInfo[1].email} --email ${usersInfo[2].email}
            --role-ids ${usersInfo[0].roleIds.join(",")} --role-ids ${usersInfo[1].roleIds.join(",")} --role-ids ${usersInfo[2].roleIds.join(",")}`);
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.match(
        new RegExp(`--email=${usersInfo[0].email},${usersInfo[1].email},${usersInfo[2].email} cannot also be provided when using --members`),
      );
    });

    it("should return an error when none of the following flags are provided: `--members`, `--member`, `--role-ids`", async () => {
      const { error: createError } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId}`);
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.match(/Exactly one of the following must be provided: --email, --members/);
    });

    it("should return an error when only `--email` flag is provided", async () => {
      const usersInfo = [
        {
          email: "test1@example.com",
        },
        {
          email: "test2@example.com",
        },
        {
          email: "test3@example.com",
        },
      ];

      const { error: createError } = await runCommand<MembersResponse>(
        `access-control member user add --itwin-id ${iTwinId} --email ${usersInfo[0].email} --email ${usersInfo[1].email} --email ${usersInfo[2].email}`,
      );
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.match(/All of the following must be provided when using --email: --role-ids/);
    });

    it("should return an error when only `--role-ids` flag is provided", async () => {
      const usersInfo = [
        {
          roleIds: [roleId1, roleId2],
        },
        {
          roleIds: [roleId1, roleId3],
        },
        {
          roleIds: [roleId2, roleId3],
        },
      ];

      const { error: createError } = await runCommand<MembersResponse>(
        `access-control member user add --itwin-id ${iTwinId} --role-ids ${usersInfo[0].roleIds.join(",")} --role-ids ${usersInfo[1].roleIds.join(",")} --role-ids ${usersInfo[2].roleIds.join(",")}`,
      );
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.match(/All of the following must be provided when using --role-ids: --email/);
    });

    it("should return an error when there are invalid UUIDs provided to `--role-ids` flag", async () => {
      const usersInfo = [
        {
          email: "test1@example.com",
          roleIds: [roleId1, roleId2],
        },
      ];

      const { error: createError } = await runCommand<MembersResponse>(`access-control member user add --itwin-id ${iTwinId} --email ${usersInfo[0].email}
            --role-ids ${usersInfo[0].roleIds.join(",")},some-invalid-uuid`);
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.match(new RegExp(`There are invalid UUIDs in '${usersInfo[0].roleIds.join(",")},some-invalid-uuid'`));
    });

    it("should return an error when invalid JSON is provided to `--members` flag", async () => {
      const { error: createError } = await runCommand<MembersResponse>(
        `access-control member user add --itwin-id ${iTwinId} --members not-valid-serialized-json`,
      );
      expect(createError).to.not.be.undefined;
      expect(createError!.message).to.match(/'not-valid-serialized-json' is not valid serialized JSON./);
    });

    it("should return an error when JSON of invalid schema is provided to `--members` flag", async () => {
      const usersInfo = [
        {
          email: "not-an-email",
          roleIds: [roleId1, roleId2],
        },
        {
          email: true,
          roleIds: [roleId1, 123],
        },
        {
          email: "test3@example.com",
          roleIds: ["not-a-uuid", roleId3],
        },
      ];

      const { error: createError } = await runCommand<MembersResponse>(
        `access-control member user add --itwin-id ${iTwinId} --members ${JSON.stringify(usersInfo)}`,
      );
      expect(createError).to.not.be.undefined;
      expect(createError!.message).to.match(/\[0].email is not a valid email/);
      expect(createError!.message).to.match(/\[1].email: expected type 'string', received 'boolean'/);
      expect(createError!.message).to.match(/\[1].roleIds\[1]: expected type 'string', received 'number'/);
      expect(createError!.message).to.match(/\[2].roleIds\[0] is not a valid uuid/);
    });

    it("should fail to add iTwin user members, when there are too many role assignments", async () => {
      const members: { email: string; roleIds: string[] }[] = [];
      for (let i = 0; i < 11; i++) {
        members.push({
          email: `email1${i}@example.com`,
          roleIds: [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()],
        });
      }

      const serializedMembersInfo = JSON.stringify(members);

      const { error: createError } = await runCommand<MembersResponse>(
        `access-control member user add --itwin-id ${iTwinId} --members ${serializedMembersInfo}`,
      );
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal("A maximum of 50 role assignments can be performed.");
    });

    it("should return an error when invalid uuid is provided as --itwin-id", async () => {
      const { error: addError } = await runCommand<Member>(
        `access-control member user add -i an-invalid-uuid --email email@example.com --role-ids ${crypto.randomUUID()},${crypto.randomUUID()}`,
      );
      expect(addError).to.not.be.undefined;
      expect(addError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
