/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import accessControlTests from '../access-control/access-control.test'
import authTests from '../auth/auth.test'
import authTestsService from  '../auth-service/auth-service.test'
import changedElementsTests from '../changed-elements/changed-elements.test'
import contextTests from '../context/context.test'
import imodelTests from '../imodel/imodel.test'
import itwinTests from '../itwin/itwin.test'
import storageTests from '../storage/storage.test'
import userTests from '../user/user.test'

describe('Service Client Tests', () => {
    accessControlTests();

    describe('Authentication Integration Tests', () => {
        authTests();
        authTestsService();
    });

    changedElementsTests();
    contextTests();
    imodelTests();
    itwinTests();
    storageTests();
    userTests();
});