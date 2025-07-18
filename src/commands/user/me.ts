/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../extensions/api-reference.js"; // Added import
import BaseCommand from "../../extensions/base-command.js";
import { User } from "../../services/user-client/models/user.js";

export default class Me extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/users/operations/me/",
    name: "User Me",
  };

  public static args = {};

  public static description = "Retrieve information about the currently authenticated user.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: "Example 1:",
    },
  ];

  public static flags = {};

  public async run(): Promise<User> {
    const userApiService = await this.getUserApiService();
    const result = userApiService.getMe();

    return this.logAndReturnResult(result);
  }
}
