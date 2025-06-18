/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";
import { ResultResponse } from "../../services/general-models/result-response.js";

export default class DeleteIModel extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/imodels-v2/operations/delete-imodel/",
    name: "Delete iModel",
  };

  public static description = "Delete an existing iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "imodel-id": CustomFlags.iModelIDFlag({
      description: "The ID of the iModel to delete.",
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(DeleteIModel);

    const client = this.getIModelClient();
    const authorization = await this.getAuthorizationCallback();

    await client.iModels.delete({
      authorization,
      iModelId: flags["imodel-id"],
    });

    return this.logAndReturnResult({ result: "deleted" });
  }
}
