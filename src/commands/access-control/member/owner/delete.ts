/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";

export default class DeleteOwner extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/access-control-v2/operations/remove-itwin-owner-member/",
        name: "Remove iTwin Owner",
    };

    static description = 'Remove an owner from an iTwin by their member ID.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --member-id user1-id`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin from which the owner will be removed.'
      }),
      "member-id": Flags.string({
        description: 'The ID of the owner to be removed.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteOwner);
  
      const client = await this.getAccessControlMemberClient();
  
      await client.deleteOwner(flags["itwin-id"], flags["member-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
