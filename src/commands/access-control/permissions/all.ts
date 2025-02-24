/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import BaseCommand from "../../../extensions/base-command.js";

export default class ListAllPermissions extends BaseCommand {
    static description = 'List all iTwin permissions.';
  
    async run() {
      await this.parse(ListAllPermissions);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.getAllAvailableiTwinPermissions();
  
      return this.logAndReturnResult(response.permissions);
    }
  }
  