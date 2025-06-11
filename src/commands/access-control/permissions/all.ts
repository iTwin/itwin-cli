/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";

export default class ListAllPermissions extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-all-permissions/",
    name: "Get All Permissions",
  };

  public static description = 'Retrieve a list of all iTwin Platform permissions.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: 'Example 1:'
    }
  ];

  public async run(): Promise<string[]> {
    await this.parse(ListAllPermissions);
  
    const client = await this.getAccessControlApiClient();
  
    const response = await client.getAllAvailableiTwinPermissions();
  
    return this.logAndReturnResult(response.permissions);
  }
}
