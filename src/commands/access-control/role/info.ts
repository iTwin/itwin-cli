/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { customFlags } from "../../../extensions/custom-flags.js";
import { Role } from "../../../services/access-control-client/models/role.js";

export default class InfoRole extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-role/",
    name: "Get iTwin Role Info",
  };

  public static description = 'Retrieve details about a specific role in an iTwin.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --role-id role1-id`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    "itwin-id": customFlags.iTwinIDFlag({
      description: 'The ID of the iTwin where the role exists.',
    }),
    "role-id": Flags.string({
      description: 'The ID of the role to retrieve information about.',
      helpValue: '<string>',
      required: true,
    }),
  };
  
  public async run(): Promise<Role> {
    const { flags } = await this.parse(InfoRole);
  
    const client = await this.getAccessControlApiClient();
  
    const response = await client.getiTwinRole(flags["itwin-id"], flags["role-id"]);
  
    return this.logAndReturnResult(response.role);
  }
}
