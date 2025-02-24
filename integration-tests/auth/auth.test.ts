/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { loginToCli } from '../utils/helpers';

describe('Authentication Integration Tests', () => {
  it('should log in successfully using service authentication', async () => {
    await loginToCli();
  });

  it('should fail with incorrect credentials', async () => {
    const result = await runCommand('auth login --client-id invalid-id --client-secret wrong-secret');
    expect(result.error).to.be.not.undefined;
    expect(result.error!.message).to.include('User login was not successful');
  });

  it('should log out successfully', async () => {
    const { stdout } = await runCommand('auth logout');
    
    expect(stdout).to.include('User successfully logged out');
  });
});
