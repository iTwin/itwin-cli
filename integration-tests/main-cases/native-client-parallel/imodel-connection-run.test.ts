/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';

import iModelConnectionRunTests from '../../imodel/connection/run.test';
import { nativeLoginToCli } from '../../utils/helpers';

describe('Native Client Tests (imodel connection run)', async () => {
    before(async () => {
        await nativeLoginToCli();
        await runCommand(`imodel connection auth`);
    })

    iModelConnectionRunTests();
});