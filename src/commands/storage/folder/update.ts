/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class UpdateFolder extends BaseCommand {
    static description = "Update the metadata of a folder in an iTwin's storage, such as its display name or description.";
  
    static flags = {
      description: Flags.string({ char: 'd', description: "A description for the folder." }),
      "folder-id": Flags.string({ char: 'f', description: "The ID of the folder to be updated.", required: true }),
      name: Flags.string({ char: 'n', description: "The new display name for the folder." }),
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
  