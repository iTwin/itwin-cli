/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { customFlags } from "../../../extensions/custom-flags.js";

export default class CreateRole extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/access-control-v2/operations/create-iTwin-role/",
    name: "Create iTwin Role",
  };

  public static description = 'Create a new role for an iTwin. To assign permissions after creation, use `itp access-control role update`.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Project Manager" --description "Manages all aspects of the project"`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    description: Flags.string({
      char: 'd',
      description: 'A description of the role.',
      helpValue: '<string>',
      required: true,
    }),
    "itwin-id": customFlags.iTwinIDFlag({
      description: 'The ID of the iTwin for which the role is being created.'
    }),
    name: Flags.string({
      char: 'n',
      description: 'The name of the role to be created.',
      helpValue: '<string>',
      required: true,
    }),
  };
  
  public async run() {
    const { flags } = await this.parse(CreateRole);
  
    const client = await this.getAccessControlApiClient();
  
    const response = await client.createiTwinRole(flags["itwin-id"], {
      description: flags.description,
      displayName: flags.name,
    });
  
    return this.logAndReturnResult(response.role);
  }
}
