/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";

export default class UserInfo extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/users/operations/get-users-by-id-list/",
        name: "Get Users by ID List",
    };

    static description = "Retrieve information about specific users based on their user IDs.";

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --user-id user1-id --user-id user2-id --user-id user3-id`,
        description: 'Example 1: Retrieve information about specific users by their user IDs'
      }
    ];

    static flags = {
      "user-id": Flags.string({ 
        description: "User IDs to retrieve information for.", 
        helpValue: '<string>',
        multiple: true,
        required: true
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UserInfo);
  
      const client = await this.getUserApiClient();
      const response = await client.getUsers(flags["user-id"]);
  
      return this.logAndReturnResult(response.users);
    }
  }
