/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class FileCreate extends BaseCommand {
    static description = 'Create a new file in a specified folder in iTwin\'s storage.';
  
    static flags = {
      description: Flags.string({ char: 'd', description: 'A description for the file.', required: false }),
      "folder-id": Flags.string({ char: 'f', description: 'The ID of the folder where the file will be created.', required: true }),
      name: Flags.string({ char: 'n', description: 'The display name of the file.', required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(FileCreate);
  
      const client = await this.getStorageApiClient();
  
      const response = await client.createFile(flags["folder-id"], flags.name, flags.description);
  
      return this.logAndReturnResult(response);
    }
  }
  