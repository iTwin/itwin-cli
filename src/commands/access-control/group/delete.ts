/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class DeleteAccessControlGroup extends BaseCommand {
    static description = 'Delete an existing group from an iTwin.';
  
    static flags = {
      "group-id": Flags.string({
        char: 'g',
        description: 'The ID of the group to be deleted.',
        required: true,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the group exists.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteAccessControlGroup);
      
      const client = await this.getAccessControlApiClient();
  
      await client.deleteGroup(flags["itwin-id"], flags["group-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  