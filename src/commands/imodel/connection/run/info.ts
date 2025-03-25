/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class ConnectionRunInfo extends BaseCommand {
    static description = 'Get connector run info.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --connection-id abc12345-6789-4321-abcd-9876543210ef --connection-run-id run98765-4321-abcd-1234-567890abcdef`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "connection-id": Flags.string({ char: 'c', description: 'The id of the connection.', required: true }),
      "connection-run-id": Flags.string({ description: 'The id of the connection run.', required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(ConnectionRunInfo);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.getStorageConnectionRun(flags["connection-id"], flags["connection-run-id"]);
  
      return this.logAndReturnResult(response.run);
    }
  }
  