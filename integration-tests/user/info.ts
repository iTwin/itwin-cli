/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

const tests = () => describe('info', () => {
  it('should retrieve information about a specific user', async () => {
    const meResult = await runCommand('user me');
    const testUserId = JSON.parse(meResult.stdout).id;

    const infoResult = await runCommand(`user info --user-id ${testUserId}`);
    const users = JSON.parse(infoResult.stdout);

    expect(users).to.be.an('array').that.is.not.empty;
    
    const userInfo = users[0];
    expect(userInfo).to.have.property('id', testUserId);
    expect(userInfo).to.have.property('email');
    expect(userInfo).to.have.property('givenName');
    expect(userInfo).to.have.property('organizationName');
  });

  it('should return an error for invalid user IDs', async () => {
    const result = await runCommand('user info --user-id invalid-user-id');
    expect(result.error).to.be.not.undefined;
    expect(result.error!.message).to.include('Invalid request body');
  });
});

export default tests;