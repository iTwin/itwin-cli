/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import isMainModule from '../utils/is-main-module';
import groupTests from "./group";
import memberTests from "./member/member";
import permissionTests from "./permissions";
import roleTests from "./role";

const tests = () => describe('access-control', () => {
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

export default tests;

if (isMainModule(import.meta)) {
    tests();
}