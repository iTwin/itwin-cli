/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";
import { addMember } from "../../../../services/access-control-client/models/members.js";

export default class AddUserMembers extends BaseCommand {
    static description = 'Add one or more user members to an iTwin.';
  
    static flags = {
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin to which the users will be added.',
        required: true,
      }),
      members: Flags.string({
        description: 'A list of members to add, each with an email and a list of role IDs.',
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
  