/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";

export default class DeleteAccessControlGroup extends BaseCommand {
    static description = 'Delete an existing group from an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "group-id": Flags.string({
        char: 'g',
        description: 'The ID of the group to be deleted.',
        helpValue: '<string>',
        required: true,
      }),
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin where the group exists.',
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteAccessControlGroup);
      
      const client = await this.getAccessControlApiClient();
  
      await client.deleteGroup(flags["itwin-id"], flags["group-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
