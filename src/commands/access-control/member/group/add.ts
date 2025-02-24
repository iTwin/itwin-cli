/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";
import { GroupMember } from "../../../../services/access-control-client/models/group.js";

export default class AddGroupMembers extends BaseCommand {
    static description = 'Add one or more groups as members to an iTwin.';
  
    static flags = {
      groups: Flags.string({
        description: 'A list of groups to add, each with a groupId and roleIds.',
        required: true,
      }),
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin to which the groups will be added.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(AddGroupMembers);
  
      const client = await this.getAccessControlMemberClient();
      
      const members = JSON.parse(flags.groups);
      const parsed = members as GroupMember[];
  
      const response = await client.addGroupMember(flags["itwin-id"], {
        members: parsed,
      });
  
      return this.logAndReturnResult(response.members);
    }
  }
  