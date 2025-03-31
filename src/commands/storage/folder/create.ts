/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class CreateFolder extends BaseCommand {
    static description = "Create a new folder in a specified parent folder in iTwin's storage.";

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --parent-folder-id ROOT_FOLDER_ID_HERE --name "Project Documents" --description "Folder for all project-related documents"`,
        description: `Example 1: Create a folder inside the root folder with a description
          Note: You can retrieve the root folder ID using the 'itp storage root-folder' command.`
      },
      {
        command: `<%= config.bin %> <%= command.id %> --parent-folder-id b2c3d4e5-6789-01ab-cdef-2345678901bc --name "Design Files"`,
        description: 'Example 2: Create a subfolder inside an existing folder'
      }
    ];

    static flags = {
      description: Flags.string({ 
        char: 'd', 
        description: "A description of the folder.",
        helpValue: '<string>'
      }),
      name: Flags.string({ 
        char: 'n', 
        description: "The display name of the folder to be created.", 
        helpValue: '<string>',
        required: true 
      }),
      "parent-folder-id": Flags.string({ 
        description: "The ID of the parent folder where the new folder will be created.", 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateFolder);
  
      const client = await this.getStorageApiClient();
      const response = await client.createFolder(flags["parent-folder-id"], {
        description: flags.description,
        displayName: flags.name,
      });
  
      return this.logAndReturnResult(response.folder);
    }
  }
  