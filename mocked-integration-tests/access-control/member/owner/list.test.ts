/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module";
import { OwnerMember } from "../../../../src/services/access-control/models/owner-member";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock";

const tests = () =>
  describe("list", () => {
    const iTwinId = crypto.randomUUID();

    it("should list owner members of an iTwin", async () => {
      const response = AccessControlApiMock.members.getiTwinOwnerMembers.success(iTwinId);

      const { result: usersInfo } = await runCommand<OwnerMember[]>(`access-control member owner list --itwin-id ${iTwinId}`);
      expect(usersInfo).to.not.be.undefined;
      expect(usersInfo).to.be.deep.equal(response.members);
    });

    it("should return error when provided iTwin is not found", async () => {
      const response = AccessControlApiMock.members.getiTwinOwnerMembers.iTwinNotFound(iTwinId);

      const { error: listError } = await runCommand<OwnerMember[]>(`access-control member owner list --itwin-id ${iTwinId}`);
      expect(listError).to.not.be.undefined;
      expect(listError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when invalid uuid is provided as --itwin-id", async () => {
      const { error: listError } = await runCommand<OwnerMember>(`access-control member owner list -i an-invalid-uuid`);
      expect(listError).to.not.be.undefined;
      expect(listError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
