/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class InfoUserMember extends BaseCommand {
    static description = 'Retrieve details about a specific user member in an iTwin.';

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
        description: 'The ID of the user to retrieve information about.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(InfoUserMember);
  
      const client = await this.getAccessControlMemberClient();
  
      const result = await client.getUserMember(flags["itwin-id"], flags["member-id"]);
  
      return this.logAndReturnResult(result.member);
    }
  }
  