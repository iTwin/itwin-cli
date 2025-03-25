/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class DeleteRole extends BaseCommand {
    static description = 'Delete an existing role from an iTwin.';

    static examples = [
      `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --role-id role1-id`
    ];

    static flags = {
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the role exists.',
        required: true,
      }),
      "role-id": Flags.string({
        description: 'The ID of the role to be deleted.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteRole);
  
      const client = await this.getAccessControlApiClient();
  
      await client.deleteiTwinRole(flags["itwin-id"], flags["role-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  