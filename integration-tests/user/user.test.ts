/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../utils/run-suite-if-main-module";
import infoTests from "./info.test";
import meTests from "./me.test"
import searchTests from "./search.test";

const tests = () => describe('User Integration Tests', () => {
  infoTests();
  meTests();
  searchTests();
});

export default tests;

runSuiteIfMainModule(import.meta, tests);