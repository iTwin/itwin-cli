/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import authTests from '../auth/auth.test'
import authTestsService from  '../auth-service/auth-service.test'
import { logoutFromCLI } from '../utils/helpers'

describe('Service Client Tests (serial)', () => {
    before(async () => {
        await logoutFromCLI();
    })
    describe('Authentication Integration Tests', () => {
        authTestsService();
        authTests();
    });
});