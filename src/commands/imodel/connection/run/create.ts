/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";

export default class CreateConnectionRun extends BaseCommand {
    static apiReference: ApiReference = {
        link: "https://developer.bentley.com/apis/synchronization/operations/run-storage-connection/",
        name: "Run Storage Connection",
    };

    static description = "Run the specified storage connection to synchronize files with an iModel.";

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
        description: 'Example 1: Running a storage connection for an iModel'
      }
    ];

    static flags = {
      "connection-id": Flags.string({ 
        char: 'c', 
        description: 'The ID of the storage connection to run.', 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateConnectionRun);
  
      const client = await this.getSynchronizationClient();
  
      await client.createStorageConnectionRun(flags["connection-id"]);
  
      return this.logAndReturnResult({ result: 'started' });
    }
}
  