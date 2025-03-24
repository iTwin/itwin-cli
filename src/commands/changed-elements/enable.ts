/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class ChangedElementsEnable extends BaseCommand {
    static description = "Enable change tracking for a specified iModel.";
  
    static flags = {
      "imodel-id": Flags.string({ char: 'm', description: "The ID of the iModel where change tracking should be enabled.", required: true }),
      "itwin-id": Flags.string({ char: 'i', description: "The ID of the iTwin associated with the iModel.", required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(ChangedElementsEnable);
  
      const client = await this.getChangeElementApiClient();
  
      await client.changeTracking({
        enable: true,
        iModelId: flags["imodel-id"],
        iTwinId: flags["itwin-id"],
      });
  
      return this.logAndReturnResult({ result: 'enabled' });
    }
  }
  