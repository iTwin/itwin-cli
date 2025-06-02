/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";

export default class ListSourceFiles extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/synchronization/operations/get-storage-connection-sourcefiles/",
        name: "Get Storage Connection SourceFiles",
    };

    static description = 'List all source files in a specific storage connection.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
        description: 'Example 1: List all source files in a specific storage connection'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --top 10`,
        description: 'Example 2: Limit the results to 10 source files'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --skip 5`,
        description: 'Example 3: Skip the first 5 source files and return the next set'
      }
    ];

    static flags = {
      "connection-id": Flags.string({ 
        char: 'c', 
        description: 'The ID of the storage connection.', 
        helpValue: '<string>',
        required: true 
      }),
      skip: Flags.integer({ 
        description: 'Skip a number of source files in the result.', 
        helpValue: '<integer>',
        required: false,
      }),
      top: Flags.integer({ 
        description: 'Limit the number of source files returned.', 
        helpValue: '<integer>',
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListSourceFiles);
  
      const client = await this.getSynchronizationClient();
      const response = await client.getSourceFiles(flags["connection-id"], flags.top, flags.skip);
  
      return this.logAndReturnResult(response.sourceFiles);
    }
  }
