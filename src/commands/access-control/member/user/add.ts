/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";
import { addMember } from "../../../../services/access-control-client/models/members.js";

export default class AddUserMembers extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-user-members/",
        name: "Add iTwin User Members",
    };

    static description = 'Add one or more user members to an iTwin.';
  
    static examples = [
     {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --members '[{"email": "user1@example.com", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]}, {"email": "user2@example.com", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1"]}]'`,
      description: 'Example 1: Add multiple users to an iTwin with role IDs'
     } 
    ];

    static flags = {
      "itwin-id": CustomFlags.iTwinIDFlag({      
        description: 'The ID of the iTwin to which the users will be added.'
      }),
      members: Flags.string({
        description: 'A list of members to add, each with an email and a list of role IDs.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(AddUserMembers);
  
      const client = await this.getAccessControlMemberClient();
  
      const members = JSON.parse(flags.members) as addMember[];
      const response = await client.addUserMembers(flags["itwin-id"], {
        members,
      });
  
      return this.logAndReturnResult(response);
    }
  }
