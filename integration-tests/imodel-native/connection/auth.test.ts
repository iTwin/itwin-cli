/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { authInfo } from '../../../src/services/synchronizationClient/models/connection-auth';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('imodel connection auth', () => {
  it('should get connection auth info', async () => {
    const { result } = await runCommand<authInfo>(`imodel connection auth`);
    expect(result?.isUserAuthorized).to.be.equal(true);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);