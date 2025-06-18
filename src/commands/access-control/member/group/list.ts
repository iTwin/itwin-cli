/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";
import { GroupMemberInfo } from "../../../../services/access-control-client/models/group.js";

export default class ListGroupMembers extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-group-members/",
    name: "Get iTwin Group Members",
  };

  public static description = "List all group members of an iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin whose group members you want to list.",
    }),
  };

  public async run(): Promise<GroupMemberInfo[]> {
    const { flags } = await this.parse(ListGroupMembers);

    const client = await this.getAccessControlMemberClient();

    const result = await client.getGroupMembers(flags["itwin-id"]);

    return this.logAndReturnResult(result.members);
  }
}
