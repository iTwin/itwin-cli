/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class ConnectionSourceFileDelete extends BaseCommand {
    static description = 'Remove a source file from a storage connection of an iModel.';
  
    static flags = {
      "connection-id": Flags.string({
        description: 'The ID of the storage connection.',
        required: true,
      }),
      "source-file-id": Flags.string({
        description: 'The source file ID to delete.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ConnectionSourceFileDelete);
  
      const client = await this.getSynchronizationClient();
  
      await client.deleteSourceFile(flags["connection-id"], flags["source-file-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  