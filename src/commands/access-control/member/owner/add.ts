/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class AddOwner extends BaseCommand {
    static description = 'Add a new owner to an iTwin by email.';
  
    static flags = {
      email: Flags.string({
        description: 'The email address of the new owner.',
        required: true,
      }),
      "itwin-id": Flags.string({
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
  