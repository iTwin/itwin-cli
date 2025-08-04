/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";

export default class ITwinInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/iTwins/operations/get-itwin/",
    name: "Get iTwin Details",
  };

  public static description = "Retrieve metadata for the specified iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id b1a2c3d4-5678-90ab-cdef-1234567890ab`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin to retrieve information about.",
    }),
  };

  public async run(): Promise<ITwin | undefined> {
    const { flags } = await this.parse(ITwinInfo);

    const service = await this.getITwinsApiService();

    const result = await service.getiTwin(flags["itwin-id"]);

    return this.logAndReturnResult(result);
  }
}
