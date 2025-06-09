/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";

export default class ConnectionInfo extends BaseCommand {
    public static apiReference: ApiReference = {
      link: "https://developer.bentley.com/apis/synchronization/operations/get-storage-connection/",
      name: "Get Storage Connection",
    };

    public static description = 'Retrieve details about a specific storage connection of an iModel.';

    public static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
        description: 'Example 1:'
      }
    ];

    public static flags = {
      "connection-id": Flags.string({ 
        char: 'c', 
        description: 'The ID of the storage connection to retrieve.', 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    public async run() {
      const { flags } = await this.parse(ConnectionInfo);
  
      const client = await this.getSynchronizationClient();
  
      const response = await client.getStorageConnection(flags["connection-id"]);
  
      return this.logAndReturnResult(response.connection);
    }
  }
  