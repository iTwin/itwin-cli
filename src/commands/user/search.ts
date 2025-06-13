/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { User } from "../../services/user-client/models/user.js";

export default class UserSearch extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/users/operations/get-users/",
    name: "Search Users",
  };

  public static description =
    "Search for users based on filter criteria.\nNOTE: Only users in the same organization are returned by this command. Because of this, no results will be returned when this command is called by a service client. This is because service clients are not a part of service client owner's organization.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --search "John Doe"`,
      description: "Example 1: Search for users by a name string",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --search john.doe@example.com`,
      description: "Example 2: Search for users by email",
    },
  ];

  public static flags = {
    search: Flags.string({
      description: "A string to search for users by name, email, or other attributes.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<User[]> {
    const { flags } = await this.parse(UserSearch);

    const client = await this.getUserApiClient();
    const response = await client.searchUsers(flags.search);

    return this.logAndReturnResult(response.users);
  }
}
