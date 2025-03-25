/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class DeleteITwin extends BaseCommand {
    static description = 'Delete an iTwin';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id b1a2c3d4-5678-90ab-cdef-1234567890ab`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "itwin-id": Flags.string({
        char: 'i',
        description: 'iTwin id.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteITwin);  
      
      const accessToken = await this.getAccessToken();
      const client = this.getITwinAccessClient();
  
      const response = await client.deleteiTwin(accessToken, flags["itwin-id"])
      if(response.error)
      {
        this.error(JSON.stringify(response.error, null, 2));
      }
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  