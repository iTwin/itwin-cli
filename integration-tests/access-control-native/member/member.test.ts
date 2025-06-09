/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';
import ownerTests from './owner.test';
import userTests from './user.test';

const tests = () => describe('member', () => {
    userTests();
    ownerTests();
});

export default tests;

runSuiteIfMainModule(import.meta, tests);