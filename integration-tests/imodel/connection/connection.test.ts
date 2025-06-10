/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../../utils/run-suite-if-main-module";
import createTests from './create.test';
import deleteTests from './delete.test';
import infoTests from './info.test';
import listTests from './list.test';
import sourcefileTests from './sourcefile.test';
import updateTests from './update.test';

const tests = () => describe('connection', async () => {
  createTests();
  deleteTests();
  infoTests();
  listTests();
  sourcefileTests();
  updateTests();
});

export default tests;

runSuiteIfMainModule(import.meta, tests);