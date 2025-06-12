/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../utils/run-suite-if-main-module";
import changesetsComparisonTests from "./changesets-comparison.test";
import enableDisableInfoTests from "./enable-disable-info.test";

const tests = () =>
  describe("Changed Elements Integration Tests", () => {
    enableDisableInfoTests();
    changesetsComparisonTests();
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
