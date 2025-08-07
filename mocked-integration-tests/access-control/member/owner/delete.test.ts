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
    const memberId = crypto.randomUUID();

    it("should remove owner member from iTwin", async () => {
      AccessControlApiMock.members.removeiTwinOwnerMember.success(iTwinId, memberId);

      const { result: deleteResult } = await runCommand<ResultResponse>(`access-control member owner delete --itwin-id ${iTwinId} --member-id ${memberId}`);
      expect(deleteResult).to.not.be.undefined;
      expect(deleteResult).to.have.property("result", "deleted");
    });

    it("should return an error when owner member is not found", async () => {
      const response = AccessControlApiMock.members.removeiTwinOwnerMember.memberNotFound(iTwinId, memberId);

      const { error: deleteError } = await runCommand<ResultResponse>(`access-control member owner delete --itwin-id ${iTwinId} --member-id ${memberId}`);
      expect(deleteError).to.not.be.undefined;
      expect(deleteError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when iTwin is not found", async () => {
      const response = AccessControlApiMock.members.removeiTwinOwnerMember.iTwinNotFound(iTwinId, memberId);

      const { error: deleteError } = await runCommand<ResultResponse>(`access-control member owner delete --itwin-id ${iTwinId} --member-id ${memberId}`);
      expect(deleteError).to.not.be.undefined;
      expect(deleteError?.message).to.be.equal(`HTTP error! ${JSON.stringify(response)}`);
    });

    it("should return an error when invalid uuid is provided as --member-id", async () => {
      const { error: deleteError } = await runCommand<ResultResponse>(
        `access-control member owner delete --itwin-id ${crypto.randomUUID()} --member-id an-invalid-uuid`,
      );
      expect(deleteError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });

    it("should return an error when invalid uuid is provided as --itwin-id", async () => {
      const { error: deleteError } = await runCommand<ResultResponse>(
        `access-control member owner delete --itwin-id an-invalid-uuid --member-id ${crypto.randomUUID()}`,
      );
      expect(deleteError).to.not.be.undefined;
      expect(deleteError?.message).to.contain("'an-invalid-uuid' is not a valid UUID.");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
