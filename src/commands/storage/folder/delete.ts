/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";

export default class DeleteFolder extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/storage/operations/delete-folder/",
        name: "Delete Folder",
    };

    static description = "Delete a folder from an iTwin's storage.";

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --folder-id a1b2c3d4-5678-90ab-cdef-1234567890ab`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "folder-id": Flags.string({ 
        char: 'f', 
        description: "The ID of the folder to be deleted.", 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteFolder);
  
      const client = await this.getStorageApiClient();
      await client.deleteFolder(flags["folder-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
