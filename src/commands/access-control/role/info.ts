/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";

export default class InfoRole extends BaseCommand {
    static description = 'Retrieve details about a specific role in an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --role-id role1-id`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin where the role exists.',
      }),
      "role-id": Flags.string({
        description: 'The ID of the role to retrieve information about.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(InfoRole);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.getiTwinRole(flags["itwin-id"], flags["role-id"]);
  
      return this.logAndReturnResult(response.role);
    }
  }
  