/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../../../../integration-tests/utils/run-suite-if-main-module";
import addTests from "./add.test";
import deleteTests from "./delete.test";
import listTests from "./list.test";

const tests = () =>
  describe("owner", () => {
    addTests();
    deleteTests();
    listTests();
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
