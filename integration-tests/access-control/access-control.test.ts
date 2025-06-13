/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from "../utils/run-suite-if-main-module";
import groupTests from "./group.test";
import memberTests from "./member/member.test";
import permissionTests from "./permissions.test";
import roleTests from "./role.test";

const tests = () =>
  describe("Access Control Tests", () => {
    describe("group", () => {
      groupTests();
    });

    describe("role", () => {
      roleTests();
    });

    describe("permissions", () => {
      permissionTests();
    });

    describe("member", () => {
      memberTests();
    });
  });

export default tests;

runSuiteIfMainModule(import.meta, tests);
