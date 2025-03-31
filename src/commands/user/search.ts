/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class UserSearch extends BaseCommand {
    static description = "Search for users based on filter criteria.";

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --search "John Doe"`,
        description: 'Example 1: Search for users by a name string'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --search john.doe@example.com`,
        description: 'Example 2: Search for users by email'
      }
    ];

    static flags = {
      search: Flags.string({ 
        description: "A string to search for users by name, email, or other attributes.", 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UserSearch);
  
      const client = await this.getUserApiClient();
      const response = await client.searchUsers(flags.search);
  
      return this.logAndReturnResult(response.users);
    }
  }
  