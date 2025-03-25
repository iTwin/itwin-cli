/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class UpdateContent extends BaseCommand {
    static description = 'Update file content.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --file-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
        description: 'Example 1: Get URL to update file content'
      }
    ];

    static flags = {
      "file-id": Flags.string({ char: 'f', description: 'The file id.', required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateContent);

      const storageApiClient = await this.getStorageApiClient();
      const response = await storageApiClient.updateFileContent(flags["file-id"]);
  
      return this.logAndReturnResult(response);
    }
  }