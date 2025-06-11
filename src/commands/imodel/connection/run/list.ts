/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { StorageRunsResponse } from "../../../../services/synchronizationClient/models/storage-run-response.js";

export default class ConnectionRunsListed extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/get-storage-connection-runs/",
    name: "Get Storage Connection Runs",
  };

  public static description = "List all runs for a specific storage connection.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
      description: 'Example 1: List all runs for a specific connection'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --top 10`,
      description: 'Example 2: Limit the results to 10 runs'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --skip 5`,
      description: 'Example 3: Skip the first 5 runs and return the next set'
    }
  ];

  public static flags = {
    "connection-id": Flags.string({ 
      char: 'c', 
      description: "The ID of the storage connection.", 
      helpValue: '<string>',
      required: true 
    }),
    skip: Flags.integer({ 
      description: "Skip a number of runs in the result.", 
      helpValue: '<integer>'
    }),
    top: Flags.integer({ 
      description: "Limit the number of runs returned.", 
      helpValue: '<integer>'
    }),
  };
  
  public async run(): Promise<StorageRunsResponse> {
    const { flags } = await this.parse(ConnectionRunsListed);
  
    const client = await this.getSynchronizationClient();
    const response = await client.getStorageConnectionRuns(flags["connection-id"], flags.top, flags.skip);
  
    return this.logAndReturnResult(response);
  }
}
