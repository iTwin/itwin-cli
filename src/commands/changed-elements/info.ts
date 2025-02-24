/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class ChangedElementsInfo extends BaseCommand {
    static description = "Retrieve change tracking information for a specified iModel.";
  
    static flags = {
      "imodel-id": Flags.string({ description: "The ID of the iModel to retrieve tracking information for.", required: true }),
      "itwin-id": Flags.string({ description: "The ID of the iTwin associated with the iModel.", required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(ChangedElementsInfo);
  
      const client = await this.getChangeElementApiClient();
      const result = await client.getTracking(flags["imodel-id"], flags["itwin-id"]);
  
      return this.logAndReturnResult(result);
    }
  }
  