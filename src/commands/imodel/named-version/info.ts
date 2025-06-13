/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { customFlags } from "../../../extensions/custom-flags.js";
import { NamedVersion } from "@itwin/imodels-client-management";

export default class NamedVersionInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/imodels-v2/operations/get-imodel-named-version-details/",
    name: "Get Named Version Details",
  };

  public static description = "Retrieve details about a specific named version in an iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --named-version-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "imodel-id": customFlags.iModelIDFlag({
      description: "The ID of the iModel whose named version you want to retrieve.",
    }),
    "named-version-id": Flags.string({
      description: "The ID of the named version.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<NamedVersion> {
    const { flags } = await this.parse(NamedVersionInfo);

    const client = this.getIModelClient();
    const authorization = await this.getAuthorizationCallback();

    const namedVersionInfo = await client.namedVersions.getSingle({
      authorization,
      iModelId: flags["imodel-id"],
      namedVersionId: flags["named-version-id"],
    });

    return this.logAndReturnResult(namedVersionInfo);
  }
}
