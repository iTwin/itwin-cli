/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { Group, GroupUpdate } from "../../../services/access-control/models/group.js";

export default class UpdateAccessControlGroup extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/update-itwin-group/",
    name: "Update iTwin Group",
  };

  public static description = "Update the details of an existing group in an iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --name "Updated Engineering Team" --description "Updated description"`,
      description: "Example 1: Update group name and description",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --member john.doe@example.com --member jane.doe@example.com --ims-group "Sample IMS Group" --ims-group "Sample IMS Group"`,
      description: "Example 2: Update group members and IMS groups",
    },
  ];

  public static flags = {
    description: Flags.string({
      char: "d",
      description: "The updated description of the group.",
      helpValue: "<string>",
    }),
    "group-id": CustomFlags.uuid({
      char: "g",
      description: "The ID of the group to be updated.",
      helpValue: "<string>",
      required: true,
    }),
    "ims-group": Flags.string({
      description: "A list of IMS Groups to be linked to the group. Max amount of 50.",
      helpValue: "<string>",
      multiple: true,
    }),
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin where the group exists.",
    }),
    member: CustomFlags.email({
      description: "A list of members (emails) to be assigned to the group. Max amount of 50.",
      helpValue: "<string>",
      multiple: true,
    }),
    name: Flags.string({
      char: "n",
      description: "The updated name of the group.",
      helpValue: "<string>",
    }),
  };

  public async run(): Promise<Group> {
    const { flags } = await this.parse(UpdateAccessControlGroup);

    const groupUpdate: GroupUpdate = {
      description: flags.description,
      imsGroups: flags["ims-group"],
      members: flags.member,
      name: flags.name,
    };

    const service = await this.getAccessControlService();

    const result = await service.updateGroup(flags["itwin-id"], flags["group-id"], groupUpdate);

    return this.logAndReturnResult(result);
  }
}
