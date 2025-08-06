/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module.js";
import { UserMember } from "../../../../src/services/access-control/models/user-member.js";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock.js";

const tests = () =>
  describe("update", () => {
    const iTwinId = crypto.randomUUID();
    const memberId = crypto.randomUUID();
    const roleIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];

    it("should update an iTwin user member", async () => {
      const response = AccessControlApiMock.members.updateiTwinUserMember.success(iTwinId, memberId, roleIds);

      const { result: updateResult } = await runCommand<UserMember>(
        `access-control member user update -i ${iTwinId} --member-id ${memberId} --role-id ${roleIds[0]} --role-id ${roleIds[1]} --role-id ${roleIds[2]}`,
      );
      expect(updateResult).to.not.be.undefined;
      expect(updateResult).to.be.deep.equal(response.member);
    });

    it("should return an error if provided iTwin is not found", async () => {
      const response = AccessControlApiMock.members.updateiTwinUserMember.iTwinNotFound(iTwinId, memberId, roleIds);

      const { error: updateError } = await runCommand<UserMember>(
        `access-control member user update -i ${iTwinId} --member-id ${memberId} --role-id ${roleIds[0]} --role-id ${roleIds[1]} --role-id ${roleIds[2]}`,
      );
      expect(updateError).to.not.be.undefined;
      expect(updateError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error if provided member is not found", async () => {
      const response = AccessControlApiMock.members.updateiTwinUserMember.teamMemberFound(iTwinId, memberId, roleIds);

      const { error: updateError } = await runCommand<UserMember>(
        `access-control member user update -i ${iTwinId} --member-id ${memberId} --role-id ${roleIds[0]} --role-id ${roleIds[1]} --role-id ${roleIds[2]}`,
      );
      expect(updateError).to.not.be.undefined;
      expect(updateError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error if provided role is not found", async () => {
      const response = AccessControlApiMock.members.updateiTwinUserMember.roleNotFound(iTwinId, memberId, roleIds);

      const { error: updateError } = await runCommand<UserMember>(
        `access-control member user update -i ${iTwinId} --member-id ${memberId} --role-id ${roleIds[0]} --role-id ${roleIds[1]} --role-id ${roleIds[2]}`,
      );
      expect(updateError).to.not.be.undefined;
      expect(updateError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when invalid uuid is provided as --role-id", async () => {
      const { error: updateError } = await runCommand<UserMember>(
        `access-control member user update -i ${crypto.randomUUID()} --member-id ${crypto.randomUUID()} --role-id an-invalid-uuid`,
      );
      expect(updateError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });

    it("should fail to update iTwin group, when there are too many roles assigned", async () => {
      let command = `access-control member user update --itwin-id ${iTwinId} --member-id ${memberId}`;
      for (let i = 0; i < 51; i++) command += ` --role-id ${crypto.randomUUID()}`;

      const result = await runCommand<UserMember>(command);
      expect(result.error).to.not.be.undefined;
      expect(result.error?.message).to.be.equal("A maximum of 50 roles can be assigned.");
    });

    it("should return an error when invalid uuid is provided as --itwin-id", async () => {
      const { error: updateError } = await runCommand<UserMember>(
        `access-control member user update -i an-invalid-uuid --member-id ${crypto.randomUUID()} --role-id ${crypto.randomUUID()}`,
      );
      expect(updateError).to.not.be.undefined;
      expect(updateError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });

    it("should return an error when invalid uuid is provided as --member-id", async () => {
      const { error: updateError } = await runCommand<UserMember>(
        `access-control member user update -i ${crypto.randomUUID()} --member-id an-invalid-uuid --role-id ${crypto.randomUUID()}`,
      );
      expect(updateError).to.not.be.undefined;
      expect(updateError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
