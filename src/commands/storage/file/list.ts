/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";

export default class ListFiles extends BaseCommand {
    static apiReference: ApiReference[] = [
      {
        link: "https://developer.bentley.com/apis/storage/operations/get-files-in-folder/",
        name: "List Files in Folder",
      },
      {
        link: "https://developer.bentley.com/apis/storage/operations/get-folders-and-files-in-folder/",
        name: "List Files and Folders in Folder",
      }
    ];

    static description = "List files in a folder of an iTwin's storage. Optionally, include subfolders in the result.";

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --folder-id b1a2c3d4-5678-90ab-cdef-1234567890ab`,
        description: 'Example 1: List files in a specific folder'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --folder-id b1a2c3d4-5678-90ab-cdef-1234567890ab --include-folders`,
        description: 'Example 2: List files and include subfolders in the result'
      }
    ];

    static flags = {
      "folder-id": Flags.string({ 
        char: 'f', 
        description: "The ID of the folder whose files you want to list.", 
        helpValue: '<string>',
        required: true 
      }),
      "include-folders": Flags.boolean({ 
        description: "Whether to include subfolders in the result."
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListFiles);
  
      const client = await this.getStorageApiClient();
  
      if (flags["include-folders"]) {
        const result = await client.getFilesAndFolders(flags["folder-id"]);
        return this.logAndReturnResult(result.items);
      }
 
        const result = await client.getFiles(flags["folder-id"]);
        return this.logAndReturnResult(result.files);
      
    }
  }
