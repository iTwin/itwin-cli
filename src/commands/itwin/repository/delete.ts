/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { ResultResponse } from "../../../services/general-models/result-response.js";

export default class DeleteRepository extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/iTwins/operations/delete-repository/",
    name: "Delete Repository",
  };

  public static description = "Delete a specified repository from an iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --repository-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin that the repository belongs to.",
    }),
    "repository-id": CustomFlags.uuid({
      description: "The ID of the repository to delete.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(DeleteRepository);

    const accessToken = await this.getAccessToken();

    const response = await this.iTwinAccessClient.deleteRepository(accessToken, flags["itwin-id"], flags["repository-id"]);
    if (response.error) {
      this.error(JSON.stringify(response.error, null, 2));
    }

    return this.logAndReturnResult({ result: "deleted" });
  }
}
