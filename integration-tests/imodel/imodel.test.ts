/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import isMainModule from '../utils/is-main-module';
import connectionTests from './connection';
import createDeleteTests from "./create-delete";
import infoTests from "./info";
import listTests from "./list";
import updateTests from "./update";

const tests = () => describe('iModel Integration Tests', () => {
  createDeleteTests();
  infoTests();
  updateTests();
  listTests();
  connectionTests();
});

export default tests;

if (isMainModule(import.meta)) {
    tests();
}