/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import nock from "nock";

import { runCommand } from "@oclif/test";

import runSuiteIfMainModule from "../../integration-tests/utils/run-suite-if-main-module.js";
import { ITP_API_URL } from "../utils/mock-environment.js";

const tests = () =>
  describe("api", () => {
    const fullVersionHeader = "application/vnd.bentley.itwin-platform.v2+json";

    for (const versionHeader of ["2", "v2", fullVersionHeader]) {
      it(`should send '${fullVersionHeader}' as the Accept header for --version-header '${versionHeader}'`, async () => {
        nock(ITP_API_URL)
          .get("/users/me")
          .matchHeader("accept", fullVersionHeader)
          .reply(200, { user: { id: "user-id" } });

        const { error, result } = await runCommand<{ user: { id: string } }>(`api --method GET --path users/me --version-header ${versionHeader}`);
        expect(error).to.be.undefined;
        expect(result?.user.id).to.be.equal("user-id");
      });
    }
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
