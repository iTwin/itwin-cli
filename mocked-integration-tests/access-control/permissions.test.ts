/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../integration-tests/utils/run-suite-if-main-module.js";
import { AccessControlApiMock } from "../utils/api-mocks/access-control-api/access-control-api-mock.js";

const tests = () =>
  describe("Access Control Permissions Tests", () => {
    const iTwinId = crypto.randomUUID();
    const permissions = ["read", "write", "execute"];

    it("should retrieve my permissions", async () => {
      const response = AccessControlApiMock.permissions.getMyiTwinPermissions.success(iTwinId, permissions);

      const { result: myPermissions } = await runCommand<string[]>(`access-control permissions me --itwin-id ${iTwinId}`);
      expect(myPermissions).to.not.be.undefined;
      expect(myPermissions).to.be.deep.equal(response.permissions);
    });

    it("should fail to retrieve my permissions and return an error whem itwin is not found", async () => {
      const response = AccessControlApiMock.permissions.getMyiTwinPermissions.iTwinNotFound(iTwinId);

      const { error } = await runCommand<string[]>(`access-control permissions me --itwin-id ${iTwinId}`);
      expect(error).to.not.be.undefined;
      expect(error?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should list all permissions", async () => {
      const response = AccessControlApiMock.permissions.getAllPermissions.success(permissions);

      const { result: allPermissions } = await runCommand<string[]>(`access-control permissions all`);
      expect(allPermissions).to.not.be.undefined;
      expect(allPermissions).to.be.deep.equal(response.permissions);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
