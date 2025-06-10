/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";

export default class ConnectionSourceFileInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/get-storage-connection-sourcefile/",
    name: "Get Storage Connection SourceFile",
  };

  public static description = 'Retrieve details about a specific source file in a storage connection of an iModel.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --source-file-id 297c8ab9-53a3-4fe5-adf8-79b4c1a95cbb`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    "connection-id": Flags.string({
      char: 'c',
      description: 'The ID of the storage connection.',
      helpValue: '<string>',
      required: true,
    }),
    "source-file-id": Flags.string({
      description: 'The ID of the source file to retrieve.',
      helpValue: '<string>',
      required: true,
    }),
  };
  
  public async run() {
    const { flags } = await this.parse(ConnectionSourceFileInfo);
  
    const client = await this.getSynchronizationClient();
  
    const response = await client.getSourceFile(flags["connection-id"], flags["source-file-id"]);
  
    return this.logAndReturnResult(response.sourceFile);
  }
}
