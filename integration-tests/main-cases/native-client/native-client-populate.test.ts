/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import iModelPopulateTests from '../../imodel/populate.test';
import { logoutFromCLI, nativeLoginToCli } from '../../utils/helpers';

describe('Native Client Tests (imodel populate)', async () => {
    before(async () => {
        await nativeLoginToCli();
    })
    
    after(async () => {
        await logoutFromCLI();
    })

    iModelPopulateTests();
});