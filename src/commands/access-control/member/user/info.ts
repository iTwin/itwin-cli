/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class InfoUserMember extends BaseCommand {
    static description = 'Retrieve details about a specific user member in an iTwin.';
  
    static flags = {
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the user is a member.',
        required: true,
      }),
      "member-id": Flags.string({
        description: 'The ID of the user to retrieve information about.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(InfoUserMember);
  
      const client = await this.getAccessControlMemberClient();
  
      const result = await client.getUserMember(flags["itwin-id"], flags["member-id"]);
  
      return this.logAndReturnResult(result.member);
    }
  }
  