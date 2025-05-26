/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";
import { validateGuidCSV } from "../../../../extensions/validation.js";
import { GroupMember } from "../../../../services/access-control-client/models/group.js";

export default class AddGroupMembers extends BaseCommand {
  static apiReference: apiReference = {
      link: "https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-group-members/",
      name: "Add iTwin Group Members",
  };

  static description = 'Add one or more groups as members to an iTwin.\n\nGroups and their roles can be provided to this command in multiple ways:\n1) Utilizing the `--groups` option, where the necessary data in provided in form of serialized JSON.\n2) Utilizing `--group-id` and `--role-ids` options, in which case all of `--role-id` roles will be applied to each `--group-id` group.';

  static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --groups '[{"groupId": "605e6f1e-b774-40f4-87cb-94ca7392c182", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]}, {"groupId": "fb23fed5-182a-4ed1-b378-3b214fd3f043", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1"]}]'`,
      description: 'Example 1: Add multiple groups as members to an iTwin using `--groups` option. Each specified group can be assigned different lists of roles.'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id 605e6f1e-b774-40f4-87cb-94ca7392c182 --group-id fb23fed5-182a-4ed1-b378-3b214fd3f043 --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1,83ee0d80-dea3-495a-b6c0-7bb102ebbcc3`,
      description: 'Example 2: Add multiple groups as members to an iTwin using `--group-id` and `--role-ids` options. Each specified group is assigned the same list of roles.'
    }
  ];

  static flags = {
    "group-id": Flags.string({
      dependsOn: ['role-ids'],
      description: 'Specify id of the group to add roles to. This flag can be provided multiple times.',
      helpValue: "<string>",
      multiple: true,
      required: false,
    }),
    groups: Flags.string({
      description: 'A list of groups to add, each with a groupId and roleIds. A maximum of 50 role assignments can be performed. Provided in serialized JSON format.',
      exactlyOne: ['groups', 'group-id'],
      exclusive: ['group-id', "role-ids"],
      helpValue: '<string>',
      required: false,
    }),
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: 'The ID of the iTwin to which the groups will be added.'
    }),
    "role-ids": Flags.string({
      dependsOn: ['group-id'],
      description: `Specify a list of role IDs to be assigned to all of 'group-id' groups. Provided in CSV format without whitespaces.`,
      helpValue: "<string>",
      parse: input => validateGuidCSV(input),
      required: false,
    })
  };

  async run() {
    const { flags } = await this.parse(AddGroupMembers);

    const client = await this.getAccessControlMemberClient();
    
    const members = this.getGroupMembers(flags["group-id"], flags["role-ids"], flags.groups);

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

  // eslint-disable-next-line perfectionist/sort-classes
  private getGroupMembers(groupIds: string[] | undefined, roleIds: string | undefined, groupsJson?: string): GroupMember[] {
    let groups: GroupMember[] | undefined = groupsJson === undefined ? undefined : JSON.parse(groupsJson);
    if (groups !== undefined)
      return groups;

    groups = [];
    for (const groupId of groupIds!) {
      const currentRoleIds = roleIds!.split(',');
      groups.push({groupId, roleIds: currentRoleIds});
    }

    return groups;
  }
}
  
