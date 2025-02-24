/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class AccessControlGroupInfo extends BaseCommand {
    static description = 'Retrieve details about a specific group in an iTwin.';
  
    static flags = {
      "group-id": Flags.string({
        description: 'The ID of the group to retrieve information about.',
        required: true,
      }),
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin where the group exists.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(AccessControlGroupInfo);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.getGroup(flags["itwin-id"], flags["group-id"]);
  
      return this.logAndReturnResult(response.group);
    }
  }
  