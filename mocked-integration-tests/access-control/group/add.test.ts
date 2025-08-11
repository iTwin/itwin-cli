/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../integration-tests/utils/run-suite-if-main-module.js";
import { Group } from "../../../src/services/access-control/models/group.js";
import { AccessControlApiMock } from "../../utils/api-mocks/access-control-api/access-control-api-mock.js";

const tests = () =>
  describe("add", () => {
    const iTwinId = crypto.randomUUID();

    it("should create a group", async () => {
      const groupName = "Test Group";
      const groupDescription = "Test Group Description";

      const response = AccessControlApiMock.groups.createiTwinGroup.success(iTwinId, groupName, groupDescription);

      const { result: groupCreate } = await runCommand<Group>(
        `access-control group create --itwin-id ${iTwinId} --name "${groupName}" --description "${groupDescription}"`,
      );
      expect(groupCreate).to.not.be.undefined;
      expect(groupCreate).to.be.deep.equal(response.group);
    });

    it("should return an error, when provided iTwin is not found", async () => {
      const groupName = "Test Group";
      const groupDescription = "Test Group Description";

      const response = AccessControlApiMock.groups.createiTwinGroup.iTwinNotFound(iTwinId, groupName, groupDescription);

      const { error: createError } = await runCommand<Group>(
        `access-control group create --itwin-id ${iTwinId} --name "${groupName}" --description "${groupDescription}"`,
      );
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
