/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module.js";
import { GroupMember } from "../../../../src/services/access-control/models/group-members.js";
import { OwnerResponse } from "../../../../src/services/access-control/models/owner.js";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock.js";

const tests = () =>
  describe("add", () => {
    const iTwinId = crypto.randomUUID();

    it("should add an internal owner member to an iTwin", async () => {
      const emailToAdd = "some-email@example.com";
      const response = AccessControlApiMock.members.addiTwinOwnerMember.successInternal(iTwinId, emailToAdd);

      const { result: invitedUser } = await runCommand<OwnerResponse>(`access-control member owner add --itwin-id ${iTwinId} --email ${emailToAdd}`);
      expect(invitedUser).to.be.deep.equal(response);
    });

    it("should invite an external owner member to an iTwin", async () => {
      const emailToAdd = "some-email@example.com";
      const response = AccessControlApiMock.members.addiTwinOwnerMember.successExternal(iTwinId, emailToAdd);

      const { result: invitedUser } = await runCommand<OwnerResponse>(`access-control member owner add --itwin-id ${iTwinId} --email ${emailToAdd}`);
      expect(invitedUser).to.be.deep.equal(response);
    });

    it("should return an error when the owner member already exists", async () => {
      const emailToAdd = "some-email@example.com";
      const response = AccessControlApiMock.members.addiTwinOwnerMember.ownerAlreadyExists(iTwinId, emailToAdd);

      const { error } = await runCommand<OwnerResponse>(`access-control member owner add --itwin-id ${iTwinId} --email ${emailToAdd}`);
      expect(error).to.not.be.undefined;
      expect(error?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when invalid email is provided as --email", async () => {
      const { error: updateError } = await runCommand<OwnerResponse>(`access-control member owner add -i ${crypto.randomUUID()} --email not-a-valid-email`);
      expect(updateError?.message).to.contain("'not-a-valid-email' is not a valid email.");
    });

    it("should return an error when invalid uuid is provided as --itwin-id", async () => {
      const { error: addError } = await runCommand<GroupMember>(`access-control member owner add -i an-invalid-uuid --email email@example.com`);
      expect(addError).to.not.be.undefined;
      expect(addError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
