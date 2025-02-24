/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class ListGroupMembers extends BaseCommand {
    static description = 'List all group members of an iTwin.';
  
    static flags = {
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin whose group members you want to list.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListGroupMembers);
  
      const client = await this.getAccessControlMemberClient();
  
      const result = await client.getGroupMembers(flags["itwin-id"]);
  
      return this.logAndReturnResult(result.members);
    }
  }
  