/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FileTyped } from "../../../services/storage-client/models/file-typed.js";

export default class ListFiles extends BaseCommand {
  public static apiReference: ApiReference[] = [
    {
      link: "https://developer.bentley.com/apis/storage/operations/get-files-in-folder/",
      name: "List Files in Folder",
    },
    {
      link: "https://developer.bentley.com/apis/storage/operations/get-folders-and-files-in-folder/",
      name: "List Files and Folders in Folder",
    }
  ];

  public static description = "List files in a folder of an iTwin's storage. Optionally, include subfolders in the result.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --folder-id b1a2c3d4-5678-90ab-cdef-1234567890ab`,
      description: 'Example 1: List files in a specific folder'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --folder-id b1a2c3d4-5678-90ab-cdef-1234567890ab --include-folders`,
      description: 'Example 2: List files and include subfolders in the result'
    }
  ];

  public static flags = {
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
  
  public async run(): Promise<FileTyped[]> {
    const { flags } = await this.parse(ListFiles);
  
    const client = await this.getStorageApiClient();
  
    if (flags["include-folders"]) {
      const filesAndFoldersResult = await client.getFilesAndFolders(flags["folder-id"]);
      return this.logAndReturnResult(filesAndFoldersResult.items);
    }
 
    const filesResult = await client.getFiles(flags["folder-id"]);
    return this.logAndReturnResult(filesResult.files);
  }
}
