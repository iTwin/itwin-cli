/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import ownerTests from './owner.test';
import userTests from './user.test'

export default () => describe('member', () => {
    userTests();
    ownerTests();
});

