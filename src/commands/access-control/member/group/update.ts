/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { customFlags } from "../../../../extensions/custom-flags.js";

export default class UpdateGroupMember extends BaseCommand {
    public static apiReference: ApiReference = {
        link: "https://developer.bentley.com/apis/access-control-v2/operations/update-itwin-group-member/",
        name: "Update iTwin Group Member",
    };

    public static description = 'Update the role assignments for a group in an iTwin.';

    public static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id group1-id --role-id role1-id --role-id role2-id`,
        description: 'Example 1:'
      }
    ];
  
    public static flags = {
      "group-id": Flags.string({
        char: 'g',
        description: 'The ID of the group whose roles will be updated.',
        helpValue: '<string>',
        required: true,
      }),
      "itwin-id": customFlags.iTwinIDFlag({
        description: 'The ID of the iTwin to which the groups will be added.'
      }),
      "role-id": Flags.string({
        description: 'A list of role IDs to assign to the group. Max amount of 50.',
        helpValue: '<string>',
        multiple: true,
        required: true,
      }),
    };
  
    public async run() {
      const { flags } = await this.parse(UpdateGroupMember);
  
      if(flags['role-id'] !== undefined && flags["role-id"].length > 50) {
        this.error("A maximum of 50 roles can be assigned.");
      }

      const client = await this.getAccessControlMemberClient();
  
      const response = await client.updateGroupMember(flags["itwin-id"], flags["group-id"], flags["role-id"]);
  
      return this.logAndReturnResult(response.member);
    }
  }
