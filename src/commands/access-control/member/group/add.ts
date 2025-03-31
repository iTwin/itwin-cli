/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";
import { GroupMember } from "../../../../services/access-control-client/models/group.js";

export default class AddGroupMembers extends BaseCommand {
    static description = 'Add one or more groups as members to an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --groups '[{"groupId": "group1-id", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]}, {"groupId": "group2-id", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1"]}]',`,
        description: 'Example 1: Add one or more groups as members to an iTwin.'
      }
    ];
  
    static flags = {
      groups: Flags.string({
        description: 'A list of groups to add, each with a groupId and roleIds.',
        helpValue: '<string>',
        required: true
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin to which the groups will be added.',
        helpValue: '<string>',
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
