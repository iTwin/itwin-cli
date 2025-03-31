/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class InfoGroupMember extends BaseCommand {
    static description = 'Retrieve details about a specific group member in an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id group1-id`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "group-id": Flags.string({
        char: 'g',
        description: 'The ID of the group to retrieve information about.',
        helpValue: '<string>',
        required: true,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the group is a member.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(InfoGroupMember);
  
      const client = await this.getAccessControlMemberClient();
  
      const result = await client.getGroupMember(flags["itwin-id"], flags["group-id"]);
  
      return this.logAndReturnResult(result.member);
    }
  }
  