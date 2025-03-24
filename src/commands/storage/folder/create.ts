/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class CreateFolder extends BaseCommand {
    static description = "Create a new folder in a specified parent folder in iTwin's storage.";
  
    static flags = {
      description: Flags.string({ char: 'd', description: "A description of the folder." }),
      "display-name": Flags.string({ char: 'n', description: "The display name of the folder to be created.", required: true }),
      "parent-folder-id": Flags.string({ description: "The ID of the parent folder where the new folder will be created.", required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateFolder);
  
      const client = await this.getStorageApiClient();
      const response = await client.createFolder(flags["parent-folder-id"], {
        description: flags.description,
        displayName: flags["display-name"],
      });
  
      return this.logAndReturnResult(response.folder);
    }
  }
  