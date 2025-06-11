/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { StorageRun } from "../../../../services/synchronizationClient/models/storage-run.js";

export default class ConnectionRunInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/get-storage-connection-run/",
    name: "Get Storage Connection Run",
  };

  public static description = 'Retrieve details about a specific run of a storage connection.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --connection-id abc12345-6789-4321-abcd-9876543210ef --connection-run-id run98765-4321-abcd-1234-567890abcdef`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    "connection-id": Flags.string({ 
      char: 'c', 
      description: 'The ID of the storage connection associated with the run.', 
      helpValue: '<string>',
      required: true 
    }),
    "connection-run-id": Flags.string({ 
      description: 'The ID of the storage connection run.', 
      helpValue: '<string>',
      required: true }),
  };
  
  public async run(): Promise<StorageRun | undefined> {
    const { flags } = await this.parse(ConnectionRunInfo);
  
    const client = await this.getSynchronizationClient();
  
    const response = await client.getStorageConnectionRun(flags["connection-id"], flags["connection-run-id"]);
  
    return this.logAndReturnResult(response.run);
  }
}
