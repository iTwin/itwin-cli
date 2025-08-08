/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module";
import { UserMember } from "../../../../src/services/access-control/models/user-member";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock";

const tests = () =>
  describe("update", () => {
    const iTwinId = crypto.randomUUID();
    const memberId = crypto.randomUUID();
    const roleIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];

    it("should update an iTwin group member", async () => {
      const response = AccessControlApiMock.members.updateiTwinGroupMember.success(iTwinId, memberId, roleIds);

      const { result: updateResult } = await runCommand<UserMember>(
        `access-control member group update -i ${iTwinId} --group-id ${memberId} --role-id ${roleIds[0]} --role-id ${roleIds[1]} --role-id ${roleIds[2]}`,
      );
      expect(updateResult).to.not.be.undefined;
      expect(updateResult).to.be.deep.equal(response.member);
    });

    it("should return an error if provided iTwin is not found", async () => {
      const response = AccessControlApiMock.members.updateiTwinGroupMember.iTwinNotFound(iTwinId, memberId, roleIds);

      const { error: updateError } = await runCommand<UserMember>(
        `access-control member group update -i ${iTwinId} --group-id ${memberId} --role-id ${roleIds[0]} --role-id ${roleIds[1]} --role-id ${roleIds[2]}`,
      );
      expect(updateError).to.not.be.undefined;
      expect(updateError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error if provided member is not found", async () => {
      const response = AccessControlApiMock.members.updateiTwinGroupMember.teamMemberFound(iTwinId, memberId, roleIds);

      const { error: updateError } = await runCommand<UserMember>(
        `access-control member group update -i ${iTwinId} --group-id ${memberId} --role-id ${roleIds[0]} --role-id ${roleIds[1]} --role-id ${roleIds[2]}`,
      );
      expect(updateError).to.not.be.undefined;
      expect(updateError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error if provided role is not found", async () => {
      const response = AccessControlApiMock.members.updateiTwinGroupMember.roleNotFound(iTwinId, memberId, roleIds);

      const { error: updateError } = await runCommand<UserMember>(
        `access-control member group update -i ${iTwinId} --group-id ${memberId} --role-id ${roleIds[0]} --role-id ${roleIds[1]} --role-id ${roleIds[2]}`,
      );
      expect(updateError).to.not.be.undefined;
      expect(updateError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
