/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";
import { Member } from "../../../../services/access-control-client/models/members.js";

export default class InfoUserMember extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-user-member/",
    name: "Get iTwin User Member",
  };

  public static description = "Retrieve details about a specific user member in an iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --member-id 69e0284a-1331-4462-9c83-9cdbe2bdaa7f`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin where the user is a member.",
    }),
    "member-id": Flags.string({
      description: "The ID of the user to retrieve information about.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<Member> {
    const { flags } = await this.parse(InfoUserMember);

    const client = await this.getAccessControlMemberClient();

    const result = await client.getUserMember(flags["itwin-id"], flags["member-id"]);

    return this.logAndReturnResult(result.member);
  }
}
