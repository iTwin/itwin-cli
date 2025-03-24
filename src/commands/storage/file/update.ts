/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class UpdateCommand extends BaseCommand {
    static description = "Update the metadata of a file in an iTwin's storage, such as display name or description.";
  
    static flags = {
      description: Flags.string({ char: 'd', description: "A description for the file." }),
      "file-id": Flags.string({ char: 'f', description: "The ID of the file to be updated.", required: true }),
      name: Flags.string({ char: 'n', description: "The new display name for the file." }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateCommand);
  
      const client = await this.getStorageApiClient();
      const response = await client.updateFile(flags["file-id"], flags.name, flags.description);
  
      return this.logAndReturnResult(response.file);
    }
  }
  