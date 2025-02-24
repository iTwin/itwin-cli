/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class MyPermissions extends BaseCommand {
    static description = 'Retrieve a list of your permissions on a specified iTwin.';
  
    static flags = {
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin for which the role is being created.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(MyPermissions);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.getAlliTwinPermissions(flags["itwin-id"]);
  
      return this.logAndReturnResult(response.permissions);
    }
  }
  