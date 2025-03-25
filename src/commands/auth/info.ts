/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import BaseCommand from '../../extensions/base-command.js';

export default class Info extends BaseCommand {
  static args = {}

  static description = 'Display authentication information. This command access current authentication storage and returns cached information about the current auth profile.'

	static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: 'Example 1:'
    }
  ];

  static flags = {}

  async run() {    
    const authClient = this.getAuthorizationClient();  
    const authInfo = authClient.info();
    return this.logAndReturnResult(authInfo);
  }
}
