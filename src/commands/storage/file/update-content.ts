/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class UpdateContent extends BaseCommand {
    static description = 'Update file content.';
  
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