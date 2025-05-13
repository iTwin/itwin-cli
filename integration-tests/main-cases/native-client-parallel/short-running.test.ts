/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import accessControlNativeTests from '../../access-control-native/access-control-native.test'
import { nativeLoginToCli } from '../../utils/helpers';
import sharedQuickUseCasesParallel from '../shared-quick-use-cases-parallel';

describe('Native Client Tests', async () => {
    before(async function() {
        this.timeout(30 * 60 * 1000);
        await nativeLoginToCli();
    })
    
    accessControlNativeTests();
    sharedQuickUseCasesParallel();

});