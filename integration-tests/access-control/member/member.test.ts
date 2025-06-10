/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import runTestSuiteIfMainModule from '../../utils/run-suite-if-main-module';
import groupMemberTests from './group.test';
import invitationsMemberTests from './invitations.test';
import ownerMemberTests from './owner.test';
import userMemberTests from './user.test';

const tests = () => 
{ 
  describe('group', () => {
    groupMemberTests();
  });

  describe('user', () => {
    userMemberTests();
  });

  describe('invitations', () => {
    invitationsMemberTests();
  });

  describe('owner', () => {
    ownerMemberTests();
  });
};

export default tests;

runTestSuiteIfMainModule(import.meta, () => describe("Access Control Member Tests", () => tests()));