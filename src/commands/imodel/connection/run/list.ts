/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class ConnectionRunsListed extends BaseCommand {
    static description = "List all runs for a specific storage connection of an iModel.";
  
    static flags = {
      "connection-id": Flags.string({ char: 'c', description: "The ID of the storage connection.", required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(ConnectionRunsListed);
  
      const client = await this.getSynchronizationClient();
      const response = await client.getStorageConnectionRuns(flags["connection-id"]);
  
      return this.logAndReturnResult(response);
    }
  }
  