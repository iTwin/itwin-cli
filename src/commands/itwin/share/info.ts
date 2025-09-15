/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { ItwinShare } from "../../../services/access-control/models/itwin-share.js";

export default class GetItwinShare extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-share/",
    name: "Get iTwin Share",
  };

  public static description = "Retrieves the specified iTwin Share for the specified iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --share-id f012944d-417f-436c-8e9c-ddc70c7a338b`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin.",
    }),
    "share-id": Flags.string({
      description: "iTwin Share ID.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<ItwinShare> {
    const { flags } = await this.parse(GetItwinShare);
    const service = await this.getAccessControlService();
    const result = await service.getiTwinShare(flags["itwin-id"], flags["share-id"]);

    return this.logAndReturnResult(result);
  }
}
