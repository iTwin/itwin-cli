/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import groupMemberTests from './group';
import invitationsMemberTests from './invitations';
import ownerMemberTests from './owner';
import userMemberTests from './user';

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