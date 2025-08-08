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

    it("should create a role", async () => {
      const roleName = "Test Role";
      const roleDescription = "Test Role Description";

      const response = AccessControlApiMock.roles.createiTwinRole.success(iTwinId, roleName, roleDescription);

      const { result: groupCreate } = await runCommand<Group>(
        `access-control role create --itwin-id ${iTwinId} --name "${roleName}" --description "${roleDescription}"`,
      );
      expect(groupCreate).to.not.be.undefined;
      expect(groupCreate).to.be.deep.equal(response.role);
    });

    it("should return an error when iTwin is not found", async () => {
      const roleName = "Test Role";
      const roleDescription = "Test Role Description";

      const response = AccessControlApiMock.roles.createiTwinRole.iTwinNotFound(iTwinId, roleName, roleDescription);

      const { error: createError } = await runCommand<Group>(
        `access-control role create --itwin-id ${iTwinId} --name "${roleName}" --description "${roleDescription}"`,
      );
      expect(createError).to.not.be.undefined;
      expect(createError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
