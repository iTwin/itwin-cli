/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListFiles extends BaseCommand {
    static description = "List files in a folder of an iTwin's storage. Optionally, include subfolders in the result.";
  
    static flags = {
      "folder-id": Flags.string({ description: "The ID of the folder whose files you want to list.", required: true }),
      "include-folders": Flags.boolean({ description: "Whether to include subfolders in the result." }),
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
  