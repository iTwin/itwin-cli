/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import isMainModule from "../utils/is-main-module";
import infoTests from "./info";
import meTests from "./me"
import searchTests from "./search";

const tests = () => describe('User Integration Tests', () => {
  infoTests();
  meTests();
  searchTests();
});

export default tests;

if (isMainModule(import.meta)) {
    tests();
}