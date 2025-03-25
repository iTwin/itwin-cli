/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class AddOwner extends BaseCommand {
    static description = 'Add a new owner to an iTwin by email.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --email john.owner@example.com`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      email: Flags.string({
        description: 'The email address of the new owner.',
        required: true,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin to which the owner will be added.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(AddOwner);
  
      const client = await this.getAccessControlMemberClient();
  
      const response = await client.addOwner(flags["itwin-id"], flags.email);
  
      return this.logAndReturnResult(response);
    }
  }
  