/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../../extensions/base-command.js";

export default class ListSourceFiles extends BaseCommand {
    static description = 'Retrieve details about a specific source file in a storage connection of an iModel.';
  
    static flags = {
      "connection-id": Flags.string({ description: 'The ID of the storage connection.', required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(ListSourceFiles);
  
      const client = await this.getSynchronizationClient();
      const response = await client.getSourceFiles(flags["connection-id"]);
  
      return this.logAndReturnResult(response.sourceFiles);
    }
  }
  