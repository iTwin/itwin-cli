/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { Role } from "../../../services/access-control/models/role.js";

export default class InfoRole extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-role/",
    name: "Get iTwin Role Info",
  };

  public static description = "Retrieve details about a specific role in an iTwin.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --role-id 752b5a3d-b9f2-4845-824a-99dd310b4898`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "itwin-id": CustomFlags.iTwinIDFlag({
      description: "The ID of the iTwin where the role exists.",
    }),
    "role-id": CustomFlags.uuid({
      description: "The ID of the role to retrieve information about.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<Role> {
    const { flags } = await this.parse(InfoRole);

    const service = await this.getAccessControlService();

    const result = await service.getiTwinRole(flags["itwin-id"], flags["role-id"]);

    return this.logAndReturnResult(result);
  }
}
