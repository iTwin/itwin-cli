/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { Group } from "../../../services/access-control-client/models/group.js";

export default class CreateAccessControlGroup extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/create-itwin-group/",
    name: "Create iTwin Group",
  };

  public static description = "Create a new group for an iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Engineering Team" --description "Group handling engineering tasks"`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    description: Flags.string({
      char: "d",
      description: "A description of the group.",
      helpValue: "<string>",
      required: true,
    }),
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin where the group is being created.",
    }),
    name: Flags.string({
      char: "n",
      description: "The name of the group to be created.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<Group> {
    const { flags } = await this.parse(CreateAccessControlGroup);

    const client = await this.getAccessControlApiClient();

    const response = await client.createGroup(flags["itwin-id"], {
      description: flags.description,
      name: flags.name,
    });

    return this.logAndReturnResult(response.group);
  }
}
