/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";
import { ResultResponse } from "../../../../services/general-models/result-response.js";

export default class DeleteGroupMember extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/remove-itwin-group-member/",
    name: "Remove iTwin Group Member",
  };

  public static description = "Remove a group from an iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id 10f1209f-ecc2-4457-9cb0-39c99d7c4414`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "group-id": CustomFlags.uuid({
      char: "g",
      description: "The ID of the group to remove from the iTwin.",
      helpValue: "<string>",
      required: true,
    }),
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin where the group is a member.",
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(DeleteGroupMember);

    const client = await this.getAccessControlMemberClient();

    await client.deleteGroupMember(flags["itwin-id"], flags["group-id"]);

    return this.logAndReturnResult({ result: "deleted" });
  }
}
