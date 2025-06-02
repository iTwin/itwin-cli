/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { User } from '../../src/services/user-client/models/user';
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () => describe('info', () => {
  it('should retrieve information about a specific user', async () => {
    const { result: meResult } = await runCommand<User>('user me');
    expect(meResult?.id).to.not.be.undefined;
    const testUserId = meResult!.id;

    const { result: users } = await runCommand<User[]>(`user info --user-id ${testUserId}`);
    expect(users).to.be.an('array').that.is.not.empty;
    
    const userInfo = users![0];
    expect(userInfo.id).to.be.equal(testUserId);
    expect(userInfo.email).to.not.be.undefined;
    expect(userInfo.givenName).to.not.be.undefined;
    expect(userInfo.organizationName).to.not.be.undefined;
  });

  it('should return an error for invalid user IDs', async () => {
    const { error } = await runCommand<User[]>('user info --user-id invalid-user-id');
    expect(error).to.be.not.undefined;
    expect(error!.message).to.include('Invalid request body');
  });

  it('should return an error for too many user IDs', async () => {
    let command = "user info"
    for(let i = 0; i < 1001; i++) {
      command += ` --user-id ${crypto.randomUUID()}`
    }

    const { error } = await runCommand(command);
    expect(error).to.be.not.undefined;
    expect(error?.message).to.be.equal('A maximum of 1000 user IDs can be provided.')
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);