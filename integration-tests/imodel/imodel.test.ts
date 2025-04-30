/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from '../utils/run-suite-if-main-module';
import connectionTests from './connection.test';
import createDeleteTests from "./create-delete.test";
import infoTests from "./info.test";
import listTests from "./list.test";
import updateTests from "./update.test";

const tests = () => describe('iModel Integration Tests', () => {
  createDeleteTests();
  infoTests();
  updateTests();
  listTests();
  connectionTests();
});

export default tests;

runSuiteIfMainModule(import.meta, tests);