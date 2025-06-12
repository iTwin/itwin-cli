/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { customFlags } from "../../../extensions/custom-flags.js";
import { ResultResponse } from "../../../services/general-models/result-response.js";

export default class DeleteRole extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/delete-itwin-role/",
    name: "Delete iTwin Role",
  };

  public static description = "Delete an existing role from an iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --role-id role1-id`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": customFlags.iTwinIDFlag({
      description: "The ID of the iTwin where the role exists.",
    }),
    "role-id": Flags.string({
      description: "The ID of the role to be deleted.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(DeleteRole);

    const client = await this.getAccessControlApiClient();

    await client.deleteiTwinRole(flags["itwin-id"], flags["role-id"]);

    return this.logAndReturnResult({ result: "deleted" });
  }
}
