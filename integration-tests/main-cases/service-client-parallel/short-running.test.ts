/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import iModelConnectionAuthTests from '../../imodel-service/connection/auth.test'
import { logoutFromCLI } from '../../utils/helpers'
import sharedQuickUseCasesParallel from '../shared-quick-use-cases-parallel';

describe('Service Client Tests', () => {
    before(async () => {
        await logoutFromCLI();
    })

    iModelConnectionAuthTests();
    sharedQuickUseCasesParallel();
});