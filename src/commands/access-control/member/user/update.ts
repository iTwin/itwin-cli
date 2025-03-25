/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class UpdateUserMember extends BaseCommand {
    static description = 'Update the role assignments for a user in an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --member-id user1-id --role-ids role1-id --role-ids role2-id`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the user is a member.',
        required: true,
      }),
      "member-id": Flags.string({
        description: 'The ID of the user whose roles will be updated.',
        required: true,
      }),
      "role-ids": Flags.string({
        description: 'A list of role IDs to assign to the user.',
        multiple: true,
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateUserMember);
  
      const client = await this.getAccessControlMemberClient();
  
      const response = await client.updateUserMember(flags["itwin-id"], flags["member-id"], flags["role-ids"]);
  
      return this.logAndReturnResult(response.member);
    }
  }
  