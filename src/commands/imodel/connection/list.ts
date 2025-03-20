/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListConnections extends BaseCommand {
    static description = 'List all storage connections for a specific iModel.';
  
    static flags = {
      "imodel-id": Flags.string({
        char: 'm', 
        description: 'The ID of the iModel whose storage connections you want to list.', 
        required: true 
      }),
      skip: Flags.integer({
        char: 's', 
        description: 'The number of changesets to skip.', 
        required: false 
      }),
      top: Flags.integer({
        char: 't', 
        description: 'The maximum number of changesets to return.', 
        required: false 
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListConnections);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.getStorageConnections(flags["imodel-id"], flags.skip, flags.top);
  
      return this.logAndReturnResult(response);
    }
  }
