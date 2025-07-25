/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { Invitation } from "../../../services/access-control/models/invitations.js";

export default class AccessControlMemberInvitations extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-member-invitations/",
    name: "Get iTwin Member Invitations",
  };

  public static description = "Retrieve the list of pending invitations for an iTwin's members.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin whose member invitations you want to retrieve.",
    }),
  };

  public async run(): Promise<Invitation[]> {
    const { flags } = await this.parse(AccessControlMemberInvitations);

    const client = await this.getAccessControlMemberClient();

    const response = await client.getMemberInvitations(flags["itwin-id"]);

    return this.logAndReturnResult(response.invitations);
  }
}
