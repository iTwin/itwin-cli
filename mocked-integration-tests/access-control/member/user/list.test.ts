/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module.js";
import { Member } from "../../../../src/services/access-control/models/members.js";
import { ResultResponse } from "../../../../src/services/general-models/result-response.js";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock.js";

const tests = () =>
  describe("list", () => {
    const iTwinId = crypto.randomUUID();

    it("should retrieve list of iTwin user members", async () => {
      const response = AccessControlApiMock.members.getiTwinUserMembers.success(iTwinId);

      const { result: listResult } = await runCommand<ResultResponse>(`access-control member user list --itwin-id ${iTwinId}`);
      expect(listResult).to.not.be.undefined;
      expect(listResult).to.be.deep.equal(response.members);
    });

    it("should return an error if provided iTwin was not found", async () => {
      const response = AccessControlApiMock.members.getiTwinUserMembers.iTwinNotFound(iTwinId);

      const { error: listError } = await runCommand<ResultResponse>(`access-control member user list --itwin-id ${iTwinId}`);
      expect(listError).to.not.be.undefined;
      expect(listError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when invalid uuid is provided as --itwin-id", async () => {
      const { error: listError } = await runCommand<Member>(`access-control member user list -i an-invalid-uuid`);
      expect(listError).to.not.be.undefined;
      expect(listError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
