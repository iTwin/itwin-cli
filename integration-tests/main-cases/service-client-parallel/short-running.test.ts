/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { logoutFromCLI } from '../../utils/helpers'
import sharedQuickUseCasesParallel from '../shared-quick-use-cases-parallel';

describe('Service Client Tests', () => {
    before(async function() {
        this.timeout(30 * 60 * 1000);
        await logoutFromCLI();
    })

    sharedQuickUseCasesParallel();
});