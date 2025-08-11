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
  describe("update", () => {
    const iTwinId = crypto.randomUUID();
    const roleId = crypto.randomUUID();
    const roleName = "Test Role";
    const roleDescription = "Test Role Description";
    const permissions = ["read", "write", "execute"];

    it("should update a role", async () => {
      const response = AccessControlApiMock.roles.updateiTwinRole.success(iTwinId, roleId, roleName, roleDescription, permissions);

      const { result: groupCreate } = await runCommand<Group>(
        `access-control role update --itwin-id ${iTwinId} --role-id ${roleId} --name "${roleName}" --description "${roleDescription}" --permission ${permissions[0]} --permission ${permissions[1]} --permission ${permissions[2]}`,
      );
      expect(groupCreate).to.not.be.undefined;
      expect(groupCreate).to.be.deep.equal(response.role);
    });

    it("should return an error when iTwin is not found", async () => {
      const response = AccessControlApiMock.roles.updateiTwinRole.iTwinNotFound(iTwinId, roleId, roleName, roleDescription, permissions);

      const { error: infoError } = await runCommand<Group>(
        `access-control role update --itwin-id ${iTwinId} --role-id ${roleId} --name "${roleName}" --description "${roleDescription}" --permission ${permissions[0]} --permission ${permissions[1]} --permission ${permissions[2]}`,
      );
      expect(infoError).to.not.be.undefined;
      expect(infoError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when role is not found", async () => {
      const response = AccessControlApiMock.roles.updateiTwinRole.roleNotFound(iTwinId, roleId, roleName, roleDescription, permissions);

      const { error: infoError } = await runCommand<Group>(
        `access-control role update --itwin-id ${iTwinId} --role-id ${roleId} --name "${roleName}" --description "${roleDescription}" --permission ${permissions[0]} --permission ${permissions[1]} --permission ${permissions[2]}`,
      );
      expect(infoError).to.not.be.undefined;
      expect(infoError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when permission is not found", async () => {
      const response = AccessControlApiMock.roles.updateiTwinRole.permissionNotFound(iTwinId, roleId, roleName, roleDescription, permissions);

      const { error: infoError } = await runCommand<Group>(
        `access-control role update --itwin-id ${iTwinId} --role-id ${roleId} --name "${roleName}" --description "${roleDescription}" --permission ${permissions[0]} --permission ${permissions[1]} --permission ${permissions[2]}`,
      );
      expect(infoError).to.not.be.undefined;
      expect(infoError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
