/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";

export default class FileUpdateComplete extends BaseCommand {
    static apiReference : ApiReference = {
        link: 'https://developer.bentley.com/apis/storage/operations/complete-file-creation/',
        name: 'Complete File Creation',
    };

    static description = 'Complete the file creation or content update process by marking the operation as done.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --file-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
        description: 'Example 1: Complete the file creation or update process'
      }
    ];

    static flags = {
      "file-id": Flags.string({ 
        char: 'f', 
        description: 'The ID of the file for which the creation or update is being completed.  ', 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    async run() {
      const { flags } = await this.parse(FileUpdateComplete);
  
      const client = await this.getStorageApiClient();
      const response = await client.completeFileUpload(flags["file-id"]);
  
      return this.logAndReturnResult(response.file);
    }
  }
  