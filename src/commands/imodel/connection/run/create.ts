/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { ResultResponse } from "../../../../services/general-models/result-response.js";

export default class CreateConnectionRun extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/run-storage-connection/",
    name: "Run Storage Connection",
  };

  public static description = "Run the specified storage connection to synchronize files with an iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
      description: 'Example 1: Running a storage connection for an iModel'
    }
  ];

  public static flags = {
    "connection-id": Flags.string({ 
      char: 'c', 
      description: 'The ID of the storage connection to run.', 
      helpValue: '<string>',
      required: true 
    }),
  };
  
  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(CreateConnectionRun);
  
    const client = await this.getSynchronizationClient();
  
    await client.createStorageConnectionRun(flags["connection-id"]);
  
    return this.logAndReturnResult({ result: 'started' });
  }
}
  