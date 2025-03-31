/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class UpdateFolder extends BaseCommand {
    static description = "Update the metadata of a folder in an iTwin's storage, such as its display name or description.";

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --folder-id a1b2c3d4-5678-90ab-cdef-1234567890ab --name "Updated Project Documents"`,
        description: 'Example 1: Update folder display name'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --folder-id b2c3d4e5-6789-01ab-cdef-2345678901bc --name "Updated Design Files" --description "Folder containing updated design documents"`,
        description: 'Example 2: Update file description and display name'
      }
    ];

    static flags = {
      description: Flags.string({ 
        char: 'd', 
        description: "A description for the folder.",
        helpValue: '<string>',
      }),
      "folder-id": Flags.string({ 
        char: 'f', 
        description: "The ID of the folder to be updated.", 
        helpValue: '<string>',
        required: true 
      }),
      name: Flags.string({ 
        char: 'n', 
        description: "The new display name for the folder.",
        helpValue: '<string>',
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateFolder);
  
      const client = await this.getStorageApiClient();
      const response = await client.updateFolder(flags["folder-id"], {
        description: flags.description,
        displayName: flags.name,
      });
  
      return this.logAndReturnResult(response.folder);
    }
  }
  