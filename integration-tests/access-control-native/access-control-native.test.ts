/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../utils/run-suite-if-main-module";
import groupTests from "./group.test";
import memberTests from "./member/member.test";

const tests = () =>
  describe("Access Control Tests (Native Client)", () => {
    groupTests();
    memberTests();
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
