/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";

export default class UpdateGroupMember extends BaseCommand {
    static description = 'Update the role assignments for a group in an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id group1-id --role-ids role1-id --role-ids role2-id`,
        description: 'Example 1:'
      }
    ];
  
    static flags = {
      "group-id": Flags.string({
        char: 'g',
        description: 'The ID of the group whose roles will be updated.',
        helpValue: '<string>',
        required: true,
      }),
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin to which the groups will be added.'
      }),
      "role-id": Flags.string({
        description: 'A list of role IDs to assign to the group.',
        helpValue: '<string>',
        multiple: true,
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateGroupMember);
  
      const client = await this.getAccessControlMemberClient();
  
      const response = await client.updateGroupMember(flags["itwin-id"], flags["group-id"], flags["role-id"]);
  
      return this.logAndReturnResult(response.member);
    }
  }
  