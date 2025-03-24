/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class ListUserMembers extends BaseCommand {
    static description = 'Retrieve details about a specific user member in an iTwin.';
  
    static flags = {
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin whose user members you want to list.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListUserMembers);
  
      const client = await this.getAccessControlMemberClient();
  
      const result = await client.getUserMembers(flags["itwin-id"]);
  
      return this.logAndReturnResult(result.members);
    }
  }
  