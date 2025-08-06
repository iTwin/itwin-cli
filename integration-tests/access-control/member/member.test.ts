/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import runTestSuiteIfMainModule from "../../utils/run-suite-if-main-module";
import groupMemberTests from "./group.test";
import invitationsMemberTests from "./invitations.test";

const tests = () => {
  describe("group", () => {
    groupMemberTests();
  });

  describe("invitations", () => {
    invitationsMemberTests();
  });
};

export default tests;

runTestSuiteIfMainModule(import.meta, () => describe("Access Control Member Tests", () => tests()));
