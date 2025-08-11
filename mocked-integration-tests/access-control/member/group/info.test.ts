/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module";
import { GroupMemberInfo } from "../../../../src/services/access-control/models/group-member";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock";

const tests = () =>
  describe("info", () => {
    const iTwinId = crypto.randomUUID();
    const groupId = crypto.randomUUID();

    it("should get group member", async () => {
      const response = AccessControlApiMock.members.getiTwinGroupMember.success(iTwinId, groupId);

      const { result: infoResult } = await runCommand<GroupMemberInfo>(`access-control member group info --itwin-id ${iTwinId} --group-id ${groupId}`);
      expect(infoResult).to.not.be.undefined;
      expect(infoResult).to.be.deep.equal(response.member);
    });

    it("should return an error when provided iTwin is not found", async () => {
      const response = AccessControlApiMock.members.getiTwinGroupMember.iTwinNotFound(iTwinId, groupId);

      const { error: infoError } = await runCommand<GroupMemberInfo>(`access-control member group info --itwin-id ${iTwinId} --group-id ${groupId}`);
      expect(infoError).to.not.be.undefined;
      expect(infoError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when provided user member is not found", async () => {
      const response = AccessControlApiMock.members.getiTwinGroupMember.teamMemberNotFound(iTwinId, groupId);

      const { error: infoError } = await runCommand<GroupMemberInfo>(`access-control member group info --itwin-id ${iTwinId} --group-id ${groupId}`);
      expect(infoError).to.not.be.undefined;
      expect(infoError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
