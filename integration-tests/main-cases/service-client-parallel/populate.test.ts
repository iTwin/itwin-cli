/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import iModelNamedVersionTests from '../../imodel/named-version.test';
import iModelPopulateTests from '../../imodel/populate.test'
import { logoutFromCLI } from '../../utils/helpers';

describe('Service Client Tests (imodel populate)', () => {
    before(async () => {
        await logoutFromCLI();
    })
    
    iModelNamedVersionTests();
    iModelPopulateTests();
});