/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";

export default class UpdateRole extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/access-control-v2/operations/update-itwin-role/",
        name: "Update iTwin Role",
    };

    static description = 'Update the details of an existing role in an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --role-id role1-id --name "Lead Engineer" --description "Oversees engineering tasks"`,
        description: 'Example 1: Update role name and description'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --role-id role1-id --name "Admin Role" --permission Permission1 --permission Permission2 --permission Permission3`,
        description: 'Example 2: Update role permissions along with the name'
      }
    ];

    static flags = {
      description: Flags.string({
        char: 'd',
        description: 'The updated description of the role.',
        helpValue: '<string>',
        required: false,
      }),
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin where the role exists.'
      }),
      name: Flags.string({
        char: 'n',
        description: 'The updated name of the role.',
        helpValue: '<string>',
        required: false,
      }),
      permission: Flags.string({
        description: 'A list of permissions to assign to the role.',
        helpValue: '<string>',
        multiple: true,
        required: false,
      }),
      "role-id": Flags.string({
        description: 'The ID of the role to be updated.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateRole);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.updateiTwinRole(flags["itwin-id"], flags["role-id"], {
        description: flags.description,
        displayName: flags.name,
        permissions: flags.permission,
      });
  
      return this.logAndReturnResult(response.role);
    }
  }
