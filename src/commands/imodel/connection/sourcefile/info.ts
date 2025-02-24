/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class ConnectionSourceFileInfo extends BaseCommand {
    static description = 'Retrieve details about a specific source file in a storage connection of an iModel.';
  
    static flags = {
      "connection-id": Flags.string({
        description: 'The ID of the storage connection.',
        required: true,
      }),
      "source-file-id": Flags.string({
        description: 'The ID of the source file to retrieve.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ConnectionSourceFileInfo);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.getSourceFile(flags["connection-id"], flags["source-file-id"]);
  
      return this.logAndReturnResult(response.sourceFile);
    }
  }
  