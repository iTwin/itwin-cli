/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";

export default class MyPermissions extends BaseCommand {
    static apiReference: ApiReference = {
        link: "https://developer.bentley.com/apis/access-control-v2/operations/get-iTwin-permissions/",
        name: "Get My iTwin Permissions",
    };

    static description = 'Retrieve a list of your permissions on a specified iTwin.';

	static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id e9a0d55a-65aa-42bd-9aa3-fd1c68d5e7b5`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin for which the role is being created.'
      }),
    };
  
    async run() {
      const { flags } = await this.parse(MyPermissions);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.getAlliTwinPermissions(flags["itwin-id"]);
  
      return this.logAndReturnResult(response.permissions);
    }
  }
