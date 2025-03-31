/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class ChangedElementsInfo extends BaseCommand {
    static description = "Retrieve change tracking information for a specified iModel.";

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id 1a2b3c4d-5678-90ab-cdef-1234567890ab --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "imodel-id": Flags.string({ 
        char: 'm', 
        description: "The ID of the iModel to retrieve tracking information for.", 
        helpValue: '<string>',
        required: true }),
      "itwin-id": Flags.string({ 
        char: 'i', 
        description: "The ID of the iTwin associated with the iModel.", 
        helpValue: '<string>',
        required: true 
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ChangedElementsInfo);
  
      const client = await this.getChangeElementApiClient();
      const result = await client.getTracking(flags["imodel-id"], flags["itwin-id"]);
  
      return this.logAndReturnResult(result);
    }
  }
  