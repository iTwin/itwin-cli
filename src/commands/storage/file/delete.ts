/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class DeleteFile extends BaseCommand {
    static description = "Delete a file from an iTwin's storage.";
  
    static flags = {
      "file-id": Flags.string({
        char: 'f',
        description: 'The ID of the file to be deleted.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteFile);
  
      const client = await this.getStorageApiClient();
  
      await client.deleteFile(flags["file-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  