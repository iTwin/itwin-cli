/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";
import { validateGuidCSV, validateJson } from "../../../../extensions/validation.js";
import { addMember } from "../../../../services/access-control-client/models/members.js";

export default class AddUserMembers extends BaseCommand {
  static apiReference: apiReference = {
      link: "https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-user-members/",
      name: "Add iTwin User Members",
  };

  static description = 'Add one or more user members to an iTwin.\n\nUsers and their roles can be provided to this command in multiple ways:\n1) Utilizing the `--members` flag, where the necessary data in provided in form of serialized JSON.\n2) Utilizing `--email` and `--role-ids` flags.';

  static examples = [
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

  static flags = {
    "email": Flags.string({
      dependsOn: ['role-ids'],
      description: 'Specify emails of the user to add roles to. This flag can be provided multiple times.',
      helpValue: "<string>",
      multiple: true,
      required: false,
    }),
    "itwin-id": CustomFlags.iTwinIDFlag({      
      description: 'The ID of the iTwin to which the users will be added.'
    }),
    members: Flags.string({
      description: 'A list of members to add, each with an email and a list of role IDs. A maximum of 50 role assignments can be performed. Provided in serialized JSON format.',
      exactlyOne: ['members', 'email'],
      exclusive: ['email', "role-ids"],
      helpValue: '<string>',
      parse: input => validateJson(input),
      required: false,
    }),
    "role-ids": Flags.string({
      dependsOn: ['email'],
      description: 'Specify IDs of roles to be assigned to a user in CSV format without any whitespaces. This flag can be provided multiple times. If the flag is provided only once, the contained list of role IDs will be assigned to all provided group-ids list. If flag is provided multiple times, each role-ids will be used for the corresponding group-id (fist role-ids list for the first group-id, second role-ids list for the second group-id and so on).',
      helpValue: "<string>",
      multiple: true,
      parse: input => validateGuidCSV(input),
      required: false,
    })
  };

  async run() {
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

  // eslint-disable-next-line perfectionist/sort-classes
  private getUserMembers(membersJson: string | undefined, emails: string[] | undefined, roleIds: string[] | undefined): addMember[] {
    let members: addMember[] | undefined = membersJson === undefined ? undefined : JSON.parse(membersJson);
    if (members !== undefined)
      return members;

    if(roleIds!.length !== 1 && emails!.length !== roleIds!.length) {
      this.error("Number of `--role-ids` flags must match the amount of `--group-id` flags or be equal to 1.")
    }

    members = [];
    for (const [i, email] of emails!.entries()) {
      const currentRoleIds = roleIds!.length === 1 ? roleIds![0].split(','): roleIds![i].split(',');
      members.push({email, roleIds: currentRoleIds});
    }

    return members;
  }
}
