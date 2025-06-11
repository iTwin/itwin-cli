/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { customFlags } from "../../../../extensions/custom-flags.js";
import { Member } from "../../../../services/access-control-client/models/members.js";

export default class UpdateUserMember extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/update-itwin-user-member/",
    name: "Update iTwin User Member",
  };

  public static description = 'Update the role assignments for a user in an iTwin.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --member-id user1-id --role-id role1-id --role-id role2-id`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    "itwin-id": customFlags.iTwinIDFlag({
      description: 'The ID of the iTwin where the user is a member.',
    }),
    "member-id": Flags.string({
      description: 'The ID of the user whose roles will be updated.',
      helpValue: '<string>',
      required: true,
    }),
    "role-id": Flags.string({
      description: 'A list of role IDs to assign to the user. Max amount of 50.',
      helpValue: '<string>',
      multiple: true,
      required: true,
    }),
  };
  
  public async run(): Promise<Member> {
    const { flags } = await this.parse(UpdateUserMember);
  
    if (flags['role-id'] !== undefined && flags["role-id"].length > 50) {
      this.error("A maximum of 50 roles can be assigned.");
    }

    const client = await this.getAccessControlMemberClient();
  
    const response = await client.updateUserMember(flags["itwin-id"], flags["member-id"], flags["role-id"]);
  
    return this.logAndReturnResult(response.member);
  }
}
