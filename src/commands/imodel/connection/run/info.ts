/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class ConnectionRunInfo extends BaseCommand {
    static description = 'Get connector run info.';
  
    static flags = {
      "connection-id": Flags.string({ description: 'The id of the connection.', required: true }),
      "connection-run-id": Flags.string({ description: 'The id of the connection run.', required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(ConnectionRunInfo);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.getStorageConnectionRun(flags["connection-id"], flags["connection-run-id"]);
  
      return this.logAndReturnResult(response.run);
    }
  }
  