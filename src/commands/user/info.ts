/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class UserInfo extends BaseCommand {
    static description = "Retrieve information about specific users based on their user IDs.";
  
    static flags = {
      "user-id": Flags.string({ 
        description: "User IDs to retrieve information for.", 
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
  