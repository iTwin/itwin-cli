/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class CreateRole extends BaseCommand {
    static description = 'Create a new role for an iTwin. To assign permissions after creation, use itp access-control role update.';
  
    static flags = {
      description: Flags.string({
        char: 'd',
        description: 'A description of your Role.',
        required: true,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin to retrieve permissions.',
        required: true,
      }),
      name: Flags.string({
        char: 'n',
        description: 'The display name of your Role.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateRole);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.createiTwinRole(flags["itwin-id"], {
        description: flags.description,
        displayName: flags.name,
      });
  
      return this.logAndReturnResult(response.role);
    }
  }
  