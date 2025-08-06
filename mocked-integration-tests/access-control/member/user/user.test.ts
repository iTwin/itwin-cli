/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module.js";
import addTests from "./add.test.js";
import deleteTests from "./delete.test.js";
import infoTests from "./info.test.js";
import listTests from "./list.test.js";
import updateTests from "./update.test.js";

const tests = () =>
  describe("user", () => {
    addTests();
    deleteTests();
    infoTests();
    listTests();
    updateTests();
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
