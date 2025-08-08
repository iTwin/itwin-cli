/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module";
import { ResultResponse } from "../../../../src/services/general-models/result-response";
import { AccessControlApiMock } from "../../../utils/api-mocks/access-control-api/access-control-api-mock";

const tests = () =>
  describe("delete", () => {
    const iTwinId = crypto.randomUUID();
    const groupId = crypto.randomUUID();

    it("should remove group member from iTwin", async () => {
      AccessControlApiMock.members.removeiTwinGroupMember.success(iTwinId, groupId);

      const { result: deleteResult } = await runCommand<ResultResponse>(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId}`);
      expect(deleteResult).to.not.be.undefined;
      expect(deleteResult).to.have.property("result", "deleted");
    });

    it("should return an error when group member is not found", async () => {
      const response = AccessControlApiMock.members.removeiTwinGroupMember.teamMemberNotFound(iTwinId, groupId);

      const { error: deleteError } = await runCommand<ResultResponse>(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId}`);
      expect(deleteError).to.not.be.undefined;
      expect(deleteError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when iTwin is not found", async () => {
      const response = AccessControlApiMock.members.removeiTwinGroupMember.iTwinNotFound(iTwinId, groupId);

      const { error: deleteError } = await runCommand<ResultResponse>(`access-control member group delete --itwin-id ${iTwinId} --group-id ${groupId}`);
      expect(deleteError).to.not.be.undefined;
      expect(deleteError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
