/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";

export default class ListRoles extends BaseCommand {
    static apiReference: ApiReference = {
        link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-roles/",
        name: "Get iTwin Roles",
    };

    static description = 'List all roles for a specific iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin whose roles you want to list.',
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListRoles);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.getiTwinRoles(flags["itwin-id"]);
  
      return this.logAndReturnResult(response.roles);
    }
  }
