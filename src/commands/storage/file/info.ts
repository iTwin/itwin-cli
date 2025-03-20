/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class FileInfo extends BaseCommand {
    static description = "Retrieve metadata for a specific file in an iTwin's storage.";
  
    static flags = {
      "file-id": Flags.string({ char: 'f', description: "The ID of the file to retrieve information about.", required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(FileInfo);
  
      const client = await this.getStorageApiClient();
      const result = await client.getFile(flags["file-id"]);
  
      return this.logAndReturnResult(result.file);
    }
  }
  