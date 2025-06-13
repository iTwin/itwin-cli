/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { customFlags } from "../../../../extensions/custom-flags.js";
import { OwnerResponse } from "../../../../services/access-control-client/models/owner.js";

export default class AddOwner extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-owner-member/",
    name: "Add iTwin Owner",
  };

  public static description =
    "Add or invite a new owner to an iTwin by email. When using interactive login, specified user is directly added to the iTwin as an owner if they are in the same organization and sent an invitation email otherwise. When using a service client, specified user is sent an invitation email.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --email john.owner@example.com`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    email: Flags.string({
      description: "The email address of the new owner.",
      helpValue: "<string>",
      required: true,
    }),
    "itwin-id": customFlags.iTwinIDFlag({
      description: "The ID of the iTwin to which the owner will be added.",
    }),
  };

  public async run(): Promise<OwnerResponse> {
    const { flags } = await this.parse(AddOwner);

    const client = await this.getAccessControlMemberClient();

    const response = await client.addOwner(flags["itwin-id"], flags.email);

    return this.logAndReturnResult(response);
  }
}
