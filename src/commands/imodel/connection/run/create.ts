/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class CreateConnectionRun extends BaseCommand {
    static description = 'Create a new connector run.';
  
    static flags = {
      "connection-id": Flags.string({ description: 'The id of the connection.', required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateConnectionRun);
  
      const client = await this.getSynchronizationClient();
  
      await client.createStorageConnectionRun(flags["connection-id"]);
  
      return this.logAndReturnResult({ result: 'started' });
    }
  }
  