/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { customFlags } from "../../extensions/custom-flags.js";

export default class DeleteITwin extends BaseCommand {
    public static apiReference: ApiReference = {
        link: "https://developer.bentley.com/apis/itwins/operations/delete-itwin/",
        name: "Delete iTwin",
    };

    public static description = 'Delete the specified iTwin.';

    public static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id b1a2c3d4-5678-90ab-cdef-1234567890ab`,
        description: 'Example 1:'
      }
    ];

    public static flags = {
      "itwin-id": customFlags.iTwinIDFlag({
        description: 'The ID of the iTwin to be deleted.'
      }),
    };
  
    public async run() {
      const { flags } = await this.parse(DeleteITwin);  
      
      const accessToken = await this.getAccessToken();
      const client = this.getITwinAccessClient();
  
      const response = await client.deleteiTwin(accessToken, flags["itwin-id"]);
      if(response.error)
      {
        this.error(JSON.stringify(response.error, null, 2));
      }
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
