/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module";
import addTests from "./add.test";
import deleteTests from "./delete.test";
import infoTests from "./info.test";
import listTests from "./list.test";
import updateTests from "./update.test";

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
