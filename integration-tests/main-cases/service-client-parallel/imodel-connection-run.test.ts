/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import iModelConnectionRunTests from '../../imodel/connection/run.test';
import { logoutFromCLI } from '../../utils/helpers';

describe('Service Client Tests (imodel connection run)', async () => {
    before(async function() {
        this.timeout(5 * 60 * 1000);
        await logoutFromCLI();
    })
    
    iModelConnectionRunTests();
});