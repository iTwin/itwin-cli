/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import accessControlNativeTests from '../../access-control-native/access-control-native.test'
import imodelConnectionCreateNativeTests from '../../imodel-native/connection/create.test';
import userSearchNativeTests from '../../user-native/search.test';
import sharedQuickUseCasesParallel from '../shared-quick-use-cases-parallel';

describe('Native Client Tests', async () => {
    accessControlNativeTests();
    imodelConnectionCreateNativeTests();
    userSearchNativeTests();
    sharedQuickUseCasesParallel();
});