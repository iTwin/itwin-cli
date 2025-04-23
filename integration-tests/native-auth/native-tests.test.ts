/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { nativeLogoutFromCli } from '../utils/helpers';
import accessControlTests from './access-control/access-control.test'

describe('Native Client Tests', () => {
    after(async () => {
        nativeLogoutFromCli();
    })

    accessControlTests();
});


