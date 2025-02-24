/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListAccessControlGroups extends BaseCommand {
    static description = 'List all groups for a specific iTwin.';
  
    static flags = {
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin whose groups you want to list.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListAccessControlGroups);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.getGroups(flags["itwin-id"]);
  
      return this.logAndReturnResult(response.groups);
    }
  }
  