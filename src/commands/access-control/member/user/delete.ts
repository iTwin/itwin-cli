/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";
import { ResultResponse } from "../../../../services/general-models/result-response.js";

export default class DeleteUserMember extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/remove-itwin-user-member/",
    name: "Remove iTwin User Member",
  };

  public static description = "Remove a user from an iTwin.";

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
    "member-id": CustomFlags.uuid({
      description: "The ID of the user to remove from the iTwin.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(DeleteUserMember);

    const service = await this.getAccessControlMemberService();

    const result = await service.deleteUserMember(flags["itwin-id"], flags["member-id"]);

    return this.logAndReturnResult(result);
  }
}
