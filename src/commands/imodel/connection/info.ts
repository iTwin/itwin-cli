/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ConnectionInfo extends BaseCommand {
    static description = 'Get connector info.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "connection-id": Flags.string({ 
        char: 'c', 
        description: 'The id of the connection.', 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ConnectionInfo);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.getStorageConnection(flags["connection-id"]);
  
      return this.logAndReturnResult(response.connection);
    }
  }
  