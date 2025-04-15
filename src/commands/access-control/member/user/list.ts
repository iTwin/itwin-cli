/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { apiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { CustomFlags } from "../../../../extensions/custom-flags.js";

export default class ListUserMembers extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-user-members/",
        name: "Get iTwin User Members",
    };

    static description = 'List all user members of an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin whose user members you want to list.'
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListUserMembers);
  
      const client = await this.getAccessControlMemberClient();
  
      const result = await client.getUserMembers(flags["itwin-id"]);
  
      return this.logAndReturnResult(result.members);
    }
  }
