/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { Group } from "../../../services/access-control/models/group.js";

export default class ListAccessControlGroups extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-groups/",
    name: "Get iTwin Groups",
  };

  public static description = "List all groups for a specific iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin whose groups you want to list.",
    }),
  };

  public async run(): Promise<Group[]> {
    const { flags } = await this.parse(ListAccessControlGroups);

    const client = await this.getAccessControlApiClient();

    const response = await client.getGroups(flags["itwin-id"]);

    return this.logAndReturnResult(response.groups);
  }
}
