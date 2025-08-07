/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module";
import { OwnerMemberResponse } from "../../../../src/services/access-control/models/owner-member";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock";

const tests = () =>
  describe("add", () => {
    const iTwinId = crypto.randomUUID();

    it("should add an internal owner member to an iTwin", async () => {
      const emailToAdd = "some-email@example.com";
      const response = AccessControlApiMock.members.addiTwinOwnerMember.successInternal(iTwinId, emailToAdd);

      const { result: invitedUser } = await runCommand<OwnerMemberResponse>(`access-control member owner add --itwin-id ${iTwinId} --email ${emailToAdd}`);
      expect(invitedUser).to.be.deep.equal(response);
    });

    it("should invite an external owner member to an iTwin", async () => {
      const emailToAdd = "some-email@example.com";
      const response = AccessControlApiMock.members.addiTwinOwnerMember.successExternal(iTwinId, emailToAdd);

      const { result: invitedUser } = await runCommand<OwnerMemberResponse>(`access-control member owner add --itwin-id ${iTwinId} --email ${emailToAdd}`);
      expect(invitedUser).to.be.deep.equal(response);
    });

    it("should return an error when the owner member already exists", async () => {
      const emailToAdd = "some-email@example.com";
      const response = AccessControlApiMock.members.addiTwinOwnerMember.ownerAlreadyExists(iTwinId, emailToAdd);

      const { error } = await runCommand<OwnerMemberResponse>(`access-control member owner add --itwin-id ${iTwinId} --email ${emailToAdd}`);
      expect(error).to.not.be.undefined;
      expect(error?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
