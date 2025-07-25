/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";
import { TrackingResponse } from "../../services/changed-elements/tracking.js";

export default class ChangedElementsInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/changed-elements/operations/get-tracking/",
    name: "Get Tracking Info",
  };

  public static description = "Retrieve change tracking information for a specified iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id 1a2b3c4d-5678-90ab-cdef-1234567890ab --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "imodel-id": CustomFlags.iModelIDFlag({
      description: "The ID of the iModel to retrieve tracking information for.",
    }),
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin associated with the iModel.",
    }),
  };

  public async run(): Promise<TrackingResponse> {
    const { flags } = await this.parse(ChangedElementsInfo);

    const changedElementsApiService = await this.getChangedElementsApiService();
    const result = await changedElementsApiService.getTracking(flags["itwin-id"], flags["imodel-id"]);

    return this.logAndReturnResult(result);
  }
}
