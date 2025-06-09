/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";

export default class ListFolders extends BaseCommand {
    public static apiReference: ApiReference[] = [
      {
        link: "https://developer.bentley.com/apis/storage/operations/get-folders-in-folder/",
        name: "List Folders in Folder",
      },
      {
        link: "https://developer.bentley.com/apis/storage/operations/get-folders-and-files-in-folder/",
        name: "List Folders and Files in Folder",
      }
    ];

    public static description = "List folders in a parent folder of an iTwin's storage. Optionally, include files in the result.";

    public static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --folder-id a1b2c3d4-5678-90ab-cdef-1234567890ab`,
        description: 'Example 1: List all folders in a parent folder'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --folder-id a1b2c3d4-5678-90ab-cdef-1234567890ab --include-files`,
        description: 'Example 2: List all folders and files in a parent folder'
      }
    ];

    public static flags = {
      "folder-id": Flags.string({ 
        char: 'f',
        description: "The ID of the parent folder whose contents you want to list.",
        helpValue: '<string>',
        required: true 
      }),
      "include-files": Flags.boolean({ 
        description: "Whether to include files in the result.",
      }),
    };
  
    public async run() {
      const { flags } = await this.parse(ListFolders);
  
      const client = await this.getStorageApiClient();
  
      if (flags["include-files"]) {
        const result = await client.getFilesAndFolders(flags["folder-id"]);
        return this.logAndReturnResult(result.items);
      }
 
        const response = await client.getFolders(flags["folder-id"]);
        return this.logAndReturnResult(response.folders);
      
    }
  }
