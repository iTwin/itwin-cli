/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../../integration-tests/utils/run-suite-if-main-module.js";
import { ResultResponse } from "../../../src/services/general-models/result-response.js";
import { AccessControlApiStubber } from "../../utils/api-stubs/access-control-api-stubber.js";

const tests = () =>
  describe("Access Control Member User Tests", () => {
    const iTwinId = crypto.randomUUID();
    const memberId = crypto.randomUUID();

    it("Should remove user member from iTwin", async () => {
      AccessControlApiStubber.removeiTwinUserMember.success(iTwinId, memberId);

      const { result: deleteResult } = await runCommand<ResultResponse>(`access-control member user delete --itwin-id ${iTwinId} --member-id ${memberId}`);
      expect(deleteResult).to.not.be.undefined;
      expect(deleteResult).to.have.property("result", "deleted");
    });

    it("delete command should return an error when owner member is not found", async () => {
      AccessControlApiStubber.removeiTwinUserMember.memberNotFound(iTwinId, memberId);

      const { error: deleteError } = await runCommand<ResultResponse>(`access-control member user delete --itwin-id ${iTwinId} --member-id ${memberId}`);
      expect(deleteError).to.not.be.undefined;
      expect(deleteError?.message).to.contain("HTTP error!");
    });

    it("delete command should return an error when iTwin is not found", async () => {
      AccessControlApiStubber.removeiTwinUserMember.iTwinNotFound(iTwinId, memberId);

      const { error: deleteError } = await runCommand<ResultResponse>(`access-control member user delete --itwin-id ${iTwinId} --member-id ${memberId}`);
      expect(deleteError).to.not.be.undefined;
      expect(deleteError?.message).to.contain("HTTP error!");
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
