/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { ItwinShare } from "../../../services/access-control/models/itwin-share.js";

export default class ListItwinShare extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-shares/",
    name: "Get a list of created iTwin Shares",
  };

  public static description = "Retrieves a list of available iTwin shares that are currently active for a specified iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin.",
    }),
  };

  public async run(): Promise<ItwinShare[]> {
    const { flags } = await this.parse(ListItwinShare);
    const service = await this.getAccessControlService();
    const result = await service.getiTwinShares(flags["itwin-id"]);

    return this.logAndReturnResult(result);
  }
}
