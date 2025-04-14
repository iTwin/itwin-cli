/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";

export default class ITwinInfo extends BaseCommand {
    static description = 'Retrieve metadata for the specified iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id b1a2c3d4-5678-90ab-cdef-1234567890ab`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin to retrieve information about.'
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
  