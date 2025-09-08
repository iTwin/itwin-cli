/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { ResultResponse } from "../../../services/general-models/result-response.js";

export default class RevokeItwinShare extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/revoke-itwin-share/",
    name: "Revokes a specified share for a specified iTwin.",
  };

  public static description = "Revokes a specified share for a specified iTwin. Any future requests made with the associated shareKey will no longer work.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --share-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin to be shared.",
    }),
    "share-id": Flags.string({
      description: "iTwin Share ID.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(RevokeItwinShare);
    const service = await this.getAccessControlService();
    const result = await service.deleteiTwinShare(flags["itwin-id"], flags["share-id"]);

    return this.logAndReturnResult(result);
  }
}
