/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../integration-tests/utils/run-suite-if-main-module.js";
import { Group, GroupMember } from "../../../src/services/access-control/models/group.js";
import { AccessControlApiMock } from "../../utils/api-mocks/access-control-api/access-control-api-mock.js";

const tests = () =>
  describe("update", () => {
    const iTwinId = crypto.randomUUID();
    const groupId = crypto.randomUUID();
    const groupName = "Test Group";
    const groupDescription = "Test Group Description";
    const members: GroupMember[] = [
      {
        email: "email1@example.com",
        givenName: "Some Name",
        organization: "Some organization",
        surname: "Some Surname",
        userId: crypto.randomUUID(),
      },
    ];
    const imsGroups = ["Group 1"];

    it("should update a group", async () => {
      const response = AccessControlApiMock.groups.updateiTwinGroup.success(iTwinId, groupId, groupName, groupDescription, members, imsGroups);

      const { result: groupCreate } = await runCommand<Group>(
        `access-control group update --itwin-id ${iTwinId} --group-id ${groupId} --name "${groupName}" --description "${groupDescription}" --member ${members[0].email} --ims-group "${imsGroups[0]}"`,
      );
      expect(groupCreate).to.not.be.undefined;
      expect(groupCreate).to.be.deep.equal(response.group);
    });

    it("should return an error, when provided iTwin is not found", async () => {
      const response = AccessControlApiMock.groups.updateiTwinGroup.iTwinNotFound(iTwinId, groupId, groupName, groupDescription, members, imsGroups);

      const { error: createError } = await runCommand<Group>(
        `access-control group update --itwin-id ${iTwinId} --group-id ${groupId} --name "${groupName}" --description "${groupDescription}" --member ${members[0].email} --ims-group "${imsGroups[0]}"`,
      );
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
