/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

const tests = () => describe('search', () => {
  it.skip('should search for users with a valid query', async () => {
    const meResult = await runCommand('user me').then((result) => JSON.parse(result.stdout));
    const testUserId = meResult.id;
    const testUserEmail = meResult.email;

    const { stdout } = await runCommand(`user search --search "${testUserEmail}"`);
    const users = JSON.parse(stdout);

    expect(users).to.be.an('array').that.is.not.empty;
    const userInfo = users[0];
    
    expect(userInfo).to.have.property('id', testUserId);
    expect(userInfo).to.have.property('email', testUserEmail);
  });

  it('should return an empty list when no users match the search', async () => {
    const searchQuery = 'non-existent-user';
    const { stdout } = await runCommand(`user search --search ${searchQuery}`);
    const users = JSON.parse(stdout);
    
    expect(users).to.be.an('array').that.is.empty;
  });
});

export default tests;