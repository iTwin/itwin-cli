/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class UpdateCommand extends BaseCommand {
    static description = "Update the metadata of a file in an iTwin's storage, such as display name or description.";
  
    static flags = {
      description: Flags.string({ description: "A description for the file." }),
      "display-name": Flags.string({ description: "The new display name for the file." }),
      "file-id": Flags.string({ description: "The ID of the file to be updated.", required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateCommand);
  
      const client = await this.getStorageApiClient();
      const response = await client.updateFile(flags["file-id"], flags["display-name"], flags.description);
  
      return this.logAndReturnResult(response.file);
    }
  }
  