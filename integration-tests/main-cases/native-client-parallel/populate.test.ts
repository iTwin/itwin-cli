/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import iModelNamedVersionTests from '../../imodel/named-version.test';
import iModelPopulateTests from '../../imodel/populate.test';
import { nativeLoginToCli } from '../../utils/helpers';

describe('Native Client Tests (imodel populate)', async () => {
    before(async function() {
        this.timeout(30 * 60 * 1000);
        await nativeLoginToCli();
    })

    iModelNamedVersionTests();
    iModelPopulateTests();
});