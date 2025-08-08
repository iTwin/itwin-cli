/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../../integration-tests/utils/run-suite-if-main-module.js";
import deleteTests from "./delete.test.js";

const tests = () =>
  describe("itwin", () => {
    deleteTests();
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
