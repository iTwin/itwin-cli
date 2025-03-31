/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class DeleteUserMember extends BaseCommand {
    static description = 'Remove a user from an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --member-id user1-id`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the user is a member.',
        helpValue: '<string>',
        required: true,
      }),
      "member-id": Flags.string({
        description: 'The ID of the user to remove from the iTwin.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteUserMember);
  
      const client = await this.getAccessControlMemberClient();
  
      await client.deleteUserMember(flags["itwin-id"], flags["member-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  