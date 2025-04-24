/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import isMainModule from '../utils/is-main-module';
import groupTests from './group'
import memberTests from './member/member'

const tests = () => describe('Access Control Tests (Native Client)', () => {
    groupTests();
    memberTests();
});

export default tests;

if (isMainModule(import.meta)) {
    tests();
}
