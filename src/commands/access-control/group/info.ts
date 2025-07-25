/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { Group } from "../../../services/access-control/models/group.js";

export default class AccessControlGroupInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-group/",
    name: "Get iTwin Group Info",
  };

  public static description = "Retrieve details about a specific group in an iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "group-id": CustomFlags.uuid({
      char: "g",
      description: "The ID of the group to retrieve information about.",
      helpValue: "<string>",
      required: true,
    }),
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin where the group exists.",
    }),
  };

  public async run(): Promise<Group> {
    const { flags } = await this.parse(AccessControlGroupInfo);

    const client = await this.getAccessControlApiClient();

    const response = await client.getGroup(flags["itwin-id"], flags["group-id"]);

    return this.logAndReturnResult(response.group);
  }
}
