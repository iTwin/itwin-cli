/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class CreateAccessControlGroup extends BaseCommand {
    static description = 'Create a new group for an iTwin.';
  
    static flags = {
      description: Flags.string({
        description: 'A description of the group.',
        required: false,
      }),
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin where the group is being created.',
        required: true,
      }),
      name: Flags.string({
        description: 'The name of the group to be created.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateAccessControlGroup);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.createGroup(flags["itwin-id"], {
        description: flags.description,
        name: flags.name,
      });
  
      return this.logAndReturnResult(response.group);
    }
  }
  