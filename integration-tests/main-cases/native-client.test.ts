/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import accessControlTests from '../access-control/access-control.test'
import accessControlNativeTests from '../access-control-native/access-control-native.test'
import authTests from '../auth/auth.test'
import changedElementsTests from '../changed-elements/changed-elements.test'
import contextTests from '../context/context.test'
import imodelTests from '../imodel/imodel.test'
import itwinTests from '../itwin/itwin.test'
import storageTests from '../storage/storage.test'
import userTests from '../user/user.test'
import { logoutFromCLI, nativeLoginToCli } from '../utils/helpers';

describe('Native Client Tests', async () => {
    before(async () => {
        await nativeLoginToCli();
    })
    
    after(async () => {
        await logoutFromCLI();
    })

    describe('Access Control tests', () => {
        accessControlTests();
        accessControlNativeTests();
    });

    describe('Authentication Integration Tests', async () =>  {
        after(async () => {
            await nativeLoginToCli();
        })
        
        authTests();
    })

    changedElementsTests();
    contextTests();
    imodelTests();
    itwinTests();
    storageTests();
    userTests();
});


