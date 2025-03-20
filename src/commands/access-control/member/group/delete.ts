/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class DeleteGroupMember extends BaseCommand {
    static description = 'Remove a group from an iTwin.';
  
    static flags = {
      "group-id": Flags.string({
        char: 'g',
        description: 'The ID of the group to remove from the iTwin.',
        required: true,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the group is a member.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteGroupMember);
  
      const client = await this.getAccessControlMemberClient();
  
      await client.deleteGroupMember(flags["itwin-id"], flags["group-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  