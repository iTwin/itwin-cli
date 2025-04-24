/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import isMainModule from "../utils/is-main-module";
import changesetsComparisonTests from "./changesets-comparison";
import enableDisableInfoTests from "./enable-disable-info";

const tests = () => describe('Changed Elements Integration Tests', () => {
  enableDisableInfoTests();
  changesetsComparisonTests();
});

export default tests;

if (isMainModule(import.meta)) {
    tests();
}