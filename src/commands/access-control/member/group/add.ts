/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";
import { GroupMember } from "../../../../services/access-control-client/models/group.js";

export default class AddGroupMembers extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-group-members/",
        name: "Add iTwin Group Members",
    };

    static description = 'Add one or more groups as members to an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --groups '[{"groupId": "group1-id", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]}, {"groupId": "group2-id", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1"]}]',`,
        description: 'Example 1: Add one or more groups as members to an iTwin.'
      }
    ];
  
    static flags = {
      groups: Flags.string({
        description: 'A list of groups to add, each with a groupId and roleIds. A maximum of 50 role assignments can be performed.',
        helpValue: '<string>',
        required: true
      }),
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin to which the groups will be added.'
      }),
    };
  
    async run() {
      const { flags } = await this.parse(AddGroupMembers);
  
      const client = await this.getAccessControlMemberClient();
      
      const members = JSON.parse(flags.groups) as GroupMember[];

      let roleAssignmentCount = 0;
      for (const member of members)
        roleAssignmentCount += member.roleIds.length;
  
      if(roleAssignmentCount > 50) {
        this.error("A maximum of 50 role assignments can be performed.");
      }

      const response = await client.addGroupMember(flags["itwin-id"], {
        members,
      });
  
      return this.logAndReturnResult(response.members);
    }
  }
