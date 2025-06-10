/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { customFlags } from "../../../../extensions/custom-flags.js";

export default class DeleteOwner extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/remove-itwin-owner-member/",
    name: "Remove iTwin Owner",
  };

  public static description = 'Remove an owner from an iTwin by their member ID.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --member-id user1-id`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    "itwin-id": customFlags.iTwinIDFlag({
      description: 'The ID of the iTwin from which the owner will be removed.'
    }),
    "member-id": Flags.string({
      description: 'The ID of the owner to be removed.',
      helpValue: '<string>',
      required: true,
    }),
  };
  
  public async run() {
    const { flags } = await this.parse(DeleteOwner);
  
    const client = await this.getAccessControlMemberClient();
  
    await client.deleteOwner(flags["itwin-id"], flags["member-id"]);
  
    return this.logAndReturnResult({ result: 'deleted' });
  }
}
