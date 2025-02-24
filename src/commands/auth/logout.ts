/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import BaseCommand from '../../extensions/base-command.js';

export default class Logout extends BaseCommand {
  static args = {}

  static description = 'Log out of the Bentley authentication session. This command clears the current authentication tokens and configuration.'

  static examples = [
    `<%= config.bin %> <%= command.id %>`,
  ]

  static flags = {}

  async run(): Promise<void> {
    const authClient = this.getAuthorizationClient();
    
    try {
      await authClient.logout();
      this.log('User successfully logged out');
    } catch (error) {
        this.error(`User logout encountered an error: ${error}`);
    }
  }
}
