/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import groupTests from "./group";
import memberTests from "./member/member";
import permissionTests from "./permissions";
import roleTests from "./role";

describe('access-control', () => {

    describe('group', () => {
        groupTests();
    });

    describe('role', () => {
        roleTests();
    });

    describe('permissions', () => {
        permissionTests();
    });

    describe('member', () => {
        memberTests();
    });
});