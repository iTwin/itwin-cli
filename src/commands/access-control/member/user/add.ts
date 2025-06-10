/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { customFlags } from "../../../../extensions/custom-flags.js";
import { validateUuidCSV } from "../../../../extensions/validation/validate-uuid-csv.js";
import { UserMember } from "../../../../services/access-control-client/models/members.js";

export default class AddUserMembers extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-user-members/",
    name: "Add iTwin User Members",
  };

  public static description = 'Add and/or invite one or more user members to an iTwin. When using interactive login, specified users are directly added to the iTwin if they are in the same organization and sent invitation emails otherwise. When using a service client, specified users are sent invitation emails.\n\nUsers and their roles can be provided to this command in multiple ways:\n1) Utilizing the `--members` flag, where the necessary data in provided in form of serialized JSON.\n2) Utilizing `--email` and `--role-ids` flags.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --members '[{"email": "user1@example.com", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]}, {"email": "user2@example.com", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1"]}]'`,
      description: 'Example 1: Add multiple users to an iTwin with role IDs using `--members` flag.'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --email user1@example.com --email user2@example.com --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1,83ee0d80-dea3-495a-b6c0-7bb102ebbcc3 --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1`,
      description: 'Example 2: Add multiple users to an iTwin with role IDs using `--email` and `--role-ids` flags.'
    } ,
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --email user1@example.com --email user2@example.com --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1,83ee0d80-dea3-495a-b6c0-7bb102ebbcc3`,
      description: 'Example 3: Add multiple users to an iTwin with role IDs using `--email` and `--role-ids` flags. Assign the same list of roles to all users.'
    }
  ];

  public static flags = {
    "email": Flags.string({
      dependsOn: ['role-ids'],
      description: 'Specify emails of the user to add roles to. This flag can be provided multiple times.',
      helpValue: "<string>",
      multiple: true,
      required: false,
    }),
    "itwin-id": customFlags.iTwinIDFlag({      
      description: 'The ID of the iTwin to which the users will be added.'
    }),
    members: customFlags.userMembers({
      description: 'A list of members to add, each with an email and a list of role IDs. A maximum of 50 role assignments can be performed. Provided in serialized JSON format.',
      exactlyOne: ['members', 'email'],
      exclusive: ['email', "role-ids"],
      helpValue: '<string>',
      required: false,
    }),
    "role-ids": Flags.string({
      dependsOn: ['email'],
      description: 'Specify IDs of roles to be assigned to a user in CSV format without any whitespaces. This flag can be provided multiple times. If the flag is provided only once, the contained list of role IDs will be assigned to all provided group-ids list. If flag is provided multiple times, each role-ids will be used for the corresponding group-id (fist role-ids list for the first group-id, second role-ids list for the second group-id and so on).',
      helpValue: "<string>",
      multiple: true,
      parse: async input => validateUuidCSV(input),
      required: false,
    })
  };

  public async run() {
    const { flags } = await this.parse(AddUserMembers);

    const client = await this.getAccessControlMemberClient();

    const members = this.getUserMembers(flags.members, flags.email, flags["role-ids"]);

    let roleAssignmentCount = 0;
    for (const member of members)
      roleAssignmentCount += member.roleIds.length;

    if(roleAssignmentCount > 50) {
      this.error("A maximum of 50 role assignments can be performed.");
    }

    const response = await client.addUserMembers(flags["itwin-id"], {
      members,
    });

    return this.logAndReturnResult(response);
  }

  private getUserMembers(members?: UserMember[], emails?: string[], roleIds?: string[]): UserMember[] {
    if (members !== undefined)
      return members;

    if(roleIds === undefined || emails === undefined)
      throw new Error();

    if(roleIds.length !== 1 && emails.length !== roleIds.length) {
      this.error("Number of `--role-ids` flags must match the amount of `--group-id` flags or be equal to 1.");
    }

    members = [];
    for (const [i, email] of emails.entries()) {
      const currentRoleIds = roleIds.length === 1 ? roleIds[0].split(','): roleIds[i].split(',');
      members.push({email, roleIds: currentRoleIds});
    }

    return members;
  }
}
