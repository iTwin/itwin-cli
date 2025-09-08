/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { ItwinShare } from "../../../services/access-control/models/itwin-share.js";

export default class CreateItwinShare extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://https://developer.bentley.com/apis/access-control-v2/operations/create-itwin-share/",
    name: "Create iTwin Share",
  };

  public static description = "Create a new iTwin Share.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: "Example 1:",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --contract Default --expiration 2025-12-31T23:59:59Z`,
      description: "Example 2:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin to be shared.",
    }),
    contract: Flags.string({
      description: "The name of share contract. Defaults to 'Default' name if omitted.",
      helpValue: "<string>",
    }),
    expiration: Flags.string({
      description: "The expiration date for the share. Defaults to the maximum allowed period for the given share contract if omitted",
      helpValue: "<string>",
    }),
  };

  public async run(): Promise<ItwinShare> {
    const { flags } = await this.parse(CreateItwinShare);
    const service = await this.getAccessControlService();
    const result = await service.createiTwinShare(flags["itwin-id"], {
      shareContract: flags.contract,
      expiration: flags.expiration,
    });
    return this.logAndReturnResult(result);
  }
}
