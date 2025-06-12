/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModel } from "@itwin/imodels-client-management";
import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { customFlags } from "../../extensions/custom-flags.js";

export class IModelInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/imodels-v2/operations/get-imodel-details/",
    name: "Get iModel Details",
  };

  public static description = "Retrieve metadata of an iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "imodel-id": customFlags.iModelIDFlag({
      description: "The ID of the iModel to retrieve information for.",
    }),
  };

  public async run(): Promise<IModel> {
    const { flags } = await this.parse(IModelInfo);

    const iModelClient = this.getIModelClient();

    const iModel = await iModelClient.iModels.getSingle({
      authorization: await this.getAuthorizationCallback(),
      iModelId: flags["imodel-id"],
    });

    return this.logAndReturnResult(iModel);
  }
}
