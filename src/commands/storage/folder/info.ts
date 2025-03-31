/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class FolderInfo extends BaseCommand {
    static description = "Retrieve metadata for a specific folder in an iTwin's storage.";

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --folder-id a1b2c3d4-5678-90ab-cdef-1234567890ab`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "folder-id": Flags.string({ 
        char: 'f', 
        description: "The ID of the folder to retrieve information about.", 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    async run() {
      const { flags } = await this.parse(FolderInfo);
  
      const client = await this.getStorageApiClient();
      const response = await client.getFolder(flags["folder-id"]);
  
      return this.logAndReturnResult(response.folder);
    }
  }
  