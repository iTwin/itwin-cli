/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class DeleteUserMember extends BaseCommand {
    static description = 'Remove a user from an iTwin.';
  
    static flags = {
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the user is a member.',
        required: true,
      }),
      "member-id": Flags.string({
        description: 'The ID of the user to remove from the iTwin.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteUserMember);
  
      const client = await this.getAccessControlMemberClient();
  
      await client.deleteUserMember(flags["itwin-id"], flags["member-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  