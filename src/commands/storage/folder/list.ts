/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListFolders extends BaseCommand {
    static description = "List folders in a parent folder of an iTwin's storage. Optionally, include files in the result.";
  
    static flags = {
      "folder-id": Flags.string({ description: "The ID of the parent folder whose contents you want to list.", required: true }),
      "include-files": Flags.boolean({ description: "Whether to include files in the result." }),
    };
  
    async run() {
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
  