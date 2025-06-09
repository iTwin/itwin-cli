/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";

export default class FileInfo extends BaseCommand {
    public static apiReference: ApiReference = {
        link: "https://developer.bentley.com/apis/storage/operations/get-file/",
        name: "Get File",
    };

    public static description = "Retrieve metadata for a specific file in an iTwin's storage.";

    public static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --file-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
        description: 'Example 1:'
      }
    ];

    public static flags = {
      "file-id": Flags.string({ 
        char: 'f', 
        description: "The ID of the file to retrieve information about.", 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    public async run() {
      const { flags } = await this.parse(FileInfo);
  
      const client = await this.getStorageApiClient();
      const result = await client.getFile(flags["file-id"]);
  
      return this.logAndReturnResult(result.file);
    }
  }
