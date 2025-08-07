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
  describe("info", () => {
    const iTwinId = crypto.randomUUID();
    const memberId = crypto.randomUUID();

    it("should get user member", async () => {
      const response = AccessControlApiMock.members.getiTwinUserMember.success(iTwinId, memberId);

      const { result: infoResult } = await runCommand<UserMember>(`access-control member user info --itwin-id ${iTwinId} --member-id ${memberId}`);
      expect(infoResult).to.not.be.undefined;
      expect(infoResult).to.be.deep.equal(response.member);
    });

    it("should return an error when provided iTwin is not found", async () => {
      const response = AccessControlApiMock.members.getiTwinUserMember.iTwinNotFound(iTwinId, memberId);

      const { error: infoError } = await runCommand<UserMember>(`access-control member user info --itwin-id ${iTwinId} --member-id ${memberId}`);
      expect(infoError).to.not.be.undefined;
      expect(infoError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when provided user member is not found", async () => {
      const response = AccessControlApiMock.members.getiTwinUserMember.teamMemberNotFound(iTwinId, memberId);

      const { error: infoError } = await runCommand<UserMember>(`access-control member user info --itwin-id ${iTwinId} --member-id ${memberId}`);
      expect(infoError).to.not.be.undefined;
      expect(infoError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
