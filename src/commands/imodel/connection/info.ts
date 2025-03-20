/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ConnectionInfo extends BaseCommand {
    static description = 'Get connector info.';
  
    static flags = {
      "connection-id": Flags.string({ char: 'c', description: 'The id of the connection.', required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(ConnectionInfo);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.getStorageConnection(flags["connection-id"]);
  
      return this.logAndReturnResult(response.connection);
    }
  }
  