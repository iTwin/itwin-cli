/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class ITwinInfo extends BaseCommand {
    static description = 'Retrieve metadata for the specified iTwin.';
  
    static flags = {
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin to retrieve information about.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ITwinInfo);
    
      const accessToken = await this.getAccessToken();
      const client = this.getITwinAccessClient();
  
      const response = await client.getAsync(accessToken, flags["itwin-id"], 'representation');

      if(response.error)
      {
        this.error(JSON.stringify(response.error, null, 2));
      }
  
      return this.logAndReturnResult(response.data);
    }
  }
  