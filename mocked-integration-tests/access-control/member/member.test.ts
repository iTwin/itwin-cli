/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../../../integration-tests/utils/run-suite-if-main-module";
import groupTests from "./group/group.test";
import ownerTests from "./owner/owner.test";
import userTests from "./user/user.test";

const tests = () =>
  describe("member", () => {
    groupTests();
    userTests();
    ownerTests();
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
