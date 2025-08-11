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
  describe("list", () => {
    const iTwinId = crypto.randomUUID();
    const groupIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];

    it("should list groups", async () => {
      const response = AccessControlApiMock.groups.getiTwinGroups.success(iTwinId, groupIds);

      const { result: groupCreate } = await runCommand<Group>(`access-control group list --itwin-id ${iTwinId}`);
      expect(groupCreate).to.not.be.undefined;
      expect(groupCreate).to.be.deep.equal(response.groups);
    });

    it("should return an error, when provided iTwin is not found", async () => {
      const response = AccessControlApiMock.groups.getiTwinGroups.iTwinNotFound(iTwinId);

      const { error: createError } = await runCommand<Group>(`access-control group list --itwin-id ${iTwinId}`);
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
