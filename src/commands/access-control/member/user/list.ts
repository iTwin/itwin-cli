/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { customFlags } from "../../../../extensions/custom-flags.js";

export default class ListUserMembers extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-user-members/",
    name: "Get iTwin User Members",
  };

  public static description = 'List all user members of an iTwin.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    "itwin-id": customFlags.iTwinIDFlag({
      description: 'The ID of the iTwin whose user members you want to list.'
    }),
  };
  
  public async run() {
    const { flags } = await this.parse(ListUserMembers);
  
    const client = await this.getAccessControlMemberClient();
  
    const result = await client.getUserMembers(flags["itwin-id"]);
  
    return this.logAndReturnResult(result.members);
  }
}
