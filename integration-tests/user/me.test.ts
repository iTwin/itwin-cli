/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { User } from '../../src/services/user-client/models/user';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('me', () => {
  it('should retrieve the currently authenticated user', async () => {
    const { stdout } = await runCommand<User>('user me');
    const userInfo = JSON.parse(stdout);
  
    expect(userInfo.id).to.not.be.undefined;
    expect(userInfo.displayName).to.not.be.undefined;
    expect(userInfo.email).to.not.be.undefined;
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);