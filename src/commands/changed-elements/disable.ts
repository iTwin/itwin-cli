/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { customFlags } from "../../extensions/custom-flags.js";

export default class ChangedElementsDisable extends BaseCommand {
    public static apiReference: ApiReference = {
        link: "https://developer.bentley.com/apis/changed-elements/operations/enable-change-tracking/",
        name: "Disable Change Tracking",
    };

    public static description = "Disable change tracking for a specified iModel.";

    public static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id 1a2b3c4d-5678-90ab-cdef-1234567890ab --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
        description: 'Example 1:'
      }
    ];

    public static flags = {
        "imodel-id": customFlags.iModelIDFlag({ 
          description: "The ID of the iModel where change tracking should be disabled."
        }),
        "itwin-id": customFlags.iTwinIDFlag({ 
          description: "The ID of the iTwin associated with the iModel."
        }),
    };
  
    public async run() {
      const { flags } = await this.parse(ChangedElementsDisable);
  
      const client = await this.getChangeElementApiClient();
  
      await client.changeTracking({
        enable: false,
        iModelId: flags["imodel-id"],
        iTwinId: flags["itwin-id"],
      });
  
      return this.logAndReturnResult({ result: 'disabled' });
    }
  }
