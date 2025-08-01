/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../../integration-tests/utils/run-suite-if-main-module";
import memberTests from "./member/member.test";

const tests = () =>
  describe("Access Control command tests", () => {
    memberTests();
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
