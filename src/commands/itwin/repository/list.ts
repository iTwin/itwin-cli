/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListRepositories extends BaseCommand {
    static description = 'Retrieve a list of repositories for a specified iTwin.';
  
    static flags = {
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin whose repositories should be retrieved.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListRepositories);
  
      const client = this.getITwinAccessClient();
      const accessToken = await this.getAccessToken();
      
      const response = await client.queryRepositoriesAsync(accessToken, flags["itwin-id"]);

      if(response.error)
      {
        this.error(JSON.stringify(response.error, null, 2));
      }
  
      return this.logAndReturnResult(response.data);
    }
  }
  