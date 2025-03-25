/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import BaseCommand from "../../extensions/base-command.js"

export default class Me extends BaseCommand {
  static args = {}

  static description = 'Retrieve information about the currently authenticated user.'

	static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: 'Example 1:'
    }
  ];

  static flags = {}

  async run() {
    const userApiClient = await this.getUserApiClient()
    const userInfo = await userApiClient.getMe();

    return this.logAndReturnResult(userInfo.user);
  }
}
