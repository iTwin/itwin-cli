/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";

export default class FileCreate extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/storage/operations/create-file/",
        name: "Create File",
    };

    static description = 'Create a new file in a specified folder in iTwin\'s storage.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --folder-id abc12345-6789-4321-abcd-9876543210ef --name design.dwg`,
        description: 'Example 1: Creating a file with display name only'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --folder-id abc12345-6789-4321-abcd-9876543210ef --name model.ifc --description "Model file for the building design"`,
        description: 'Example 2: Creating a file with display name and description'
      }
    ];

    static flags = {
      description: Flags.string({ 
        char: 'd', 
        description: 'A description for the file.', 
        helpValue: '<string>',
        required: false 
      }),
      "folder-id": Flags.string({ 
        char: 'f', 
        description: 'The ID of the folder where the file will be created.', 
        helpValue: '<string>',
        required: true 
      }),
      name: Flags.string({ 
        char: 'n', 
        description: 'The display name of the file.', 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    async run() {
      const { flags } = await this.parse(FileCreate);
  
      const client = await this.getStorageApiClient();
  
      const response = await client.createFile(flags["folder-id"], flags.name, flags.description);
  
      return this.logAndReturnResult(response);
    }
  }
