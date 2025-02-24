/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class UserInfo extends BaseCommand {
    static description = "Retrieve information about specific users based on their user IDs.";
  
    static flags = {
      "user-ids": Flags.string({ 
        description: "A comma-separated list of user IDs to retrieve information for.", 
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UserInfo);
  
      const client = await this.getUserApiClient();
      const users = flags["user-ids"].split(',');
      const response = await client.getUsers(users);
  
      return this.logAndReturnResult(response.users);
    }
  }
  