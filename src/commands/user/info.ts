/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { User } from "../../services/user-client/models/user.js";

export default class UserInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/users/operations/get-users-by-id-list/",
    name: "Get Users by ID List",
  };

  public static description = "Retrieve information about specific users based on their user IDs.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --user-id 0fb913af-1264-497a-8353-63ce4a4f0460 --user-id 66dffaa5-d524-418e-b92c-3e7d85050638 --user-id f7bfef9f-2402-46f7-8f5a-785605a077db`,
      description: "Example 1: Retrieve information about specific users by their user IDs",
    },
  ];

  public static flags = {
    "user-id": Flags.string({
      description: "User IDs to retrieve information for. Max amount of 1000.",
      helpValue: "<string>",
      multiple: true,
      required: true,
    }),
  };

  public async run(): Promise<User[]> {
    const { flags } = await this.parse(UserInfo);

    if (flags["user-id"] !== undefined && flags["user-id"].length > 1000) {
      this.error("A maximum of 1000 user IDs can be provided.");
    }

    const client = await this.getUserApiClient();
    const response = await client.getUsers(flags["user-id"]);

    return this.logAndReturnResult(response.users);
  }
}
