/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module";
import { GroupMemberInfo } from "../../../../src/services/access-control/models/group-member";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock";

const tests = () =>
  describe("list", () => {
    const iTwinId = crypto.randomUUID();

    it("should retrieve list of iTwin group members", async () => {
      const response = AccessControlApiMock.members.getiTwinGroupMembers.success(iTwinId);

      const { result: listResult } = await runCommand<GroupMemberInfo[]>(`access-control member group list --itwin-id ${iTwinId}`);
      expect(listResult).to.not.be.undefined;
      expect(listResult).to.be.deep.equal(response.members);
    });

    it("should return an error if provided iTwin was not found", async () => {
      const response = AccessControlApiMock.members.getiTwinGroupMembers.iTwinNotFound(iTwinId);

      const { error: listError } = await runCommand<GroupMemberInfo[]>(`access-control member group list --itwin-id ${iTwinId}`);
      expect(listError).to.not.be.undefined;
      expect(listError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
