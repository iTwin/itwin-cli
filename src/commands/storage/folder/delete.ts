/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class DeleteFolder extends BaseCommand {
    static description = "Delete a folder from an iTwin's storage.";
  
    static flags = {
      "folder-id": Flags.string({ char: 'f', description: "The ID of the folder to be deleted.", required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteFolder);
  
      const client = await this.getStorageApiClient();
      await client.deleteFolder(flags["folder-id"]);
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  