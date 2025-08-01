/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../utils/run-suite-if-main-module";
import groupTests from "./group.test";

const tests = () =>
  describe("Access Control Tests (Native Client)", () => {
    groupTests();
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
