/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class UpdateGroupMember extends BaseCommand {
    static description = 'Update the role assignments for a group in an iTwin.';
  
    static flags = {
      "group-id": Flags.string({
        description: 'The ID of the group whose roles will be updated.',
        required: true,
      }),
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin to which the groups will be added.',
        required: true,
      }),
      "role-ids": Flags.string({
        description: 'A list of role IDs to assign to the group.',
        multiple: true,
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateGroupMember);
  
      const client = await this.getAccessControlMemberClient();
  
      const response = await client.updateGroupMember(flags["itwin-id"], flags["group-id"], flags["role-ids"]);
  
      return this.logAndReturnResult(response.member);
    }
  }
  