/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class UpdateCommand extends BaseCommand {
    static description = "Update the metadata of a file in an iTwin's storage, such as display name or description.";

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --file-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --name "Updated Design File"`,
        description: 'Example 1: Update file display name'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --file-id c9f2b8a5-345d-4cfa-b3e5-123456789abc --name "New Model File" --description "Updated model with new specifications"`,
        description: 'Example 2: Update file description and display name'
      }
    ];

    static flags = {
      description: Flags.string({ 
        char: 'd', 
        description: "A description for the file." ,
        helpValue: '<string>',
      }),
      "file-id": Flags.string({ 
        char: 'f', 
        description: "The ID of the file to be updated.", 
        helpValue: '<string>',
        required: true 
      }),
      name: Flags.string({ 
        char: 'n', 
        description: "The new display name for the file.",
        helpValue: '<string>',
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateCommand);
  
      const client = await this.getStorageApiClient();
      const response = await client.updateFile(flags["file-id"], flags.name, flags.description);
  
      return this.logAndReturnResult(response.file);
    }
  }
  