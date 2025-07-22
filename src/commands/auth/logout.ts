/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import BaseCommand from "../../extensions/base-command.js";

export default class Logout extends BaseCommand {
  public static description = "Log out of the Bentley authentication session. This command clears the current authentication tokens and configuration.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: "Example 1:",
    },
  ];

  public static flags = {};

  public async run(): Promise<void> {
    const authorizationService = this.getAuthorizationService();
    await authorizationService.logout();
  }
}
