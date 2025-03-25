/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class ListOwners extends BaseCommand {
    static description = 'List all owners of a specific iTwin.';

    static examples = [
      `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`
    ];

    static flags = {
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin whose owners you want to list.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListOwners);
  
      const client = await this.getAccessControlMemberClient();
  
      const result = await client.getOwnerList(flags["itwin-id"]);
  
      return this.logAndReturnResult(result.members);
    }
  }
  