/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class UpdateRole extends BaseCommand {
    static description = 'Update the details of an existing role in an iTwin.';
  
    static flags = {
      description: Flags.string({
        char: 'd',
        description: 'The updated description of the role.',
        required: false,
      }),
      "display-name": Flags.string({
        char: 'n',
        description: 'The updated name of the role.',
        required: false,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the role exists.',
        required: true,
      }),
      permissions: Flags.string({
        description: 'A list of permissions to assign to the role.',
        multiple: true,
        required: false,
      }),
      "role-id": Flags.string({
        description: 'The ID of the role to be updated.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateRole);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.updateiTwinRole(flags["itwin-id"], flags["role-id"], {
        description: flags.description,
        displayName: flags["display-name"],
        permissions: flags.permissions,
      });
  
      return this.logAndReturnResult(response.role);
    }
  }
  