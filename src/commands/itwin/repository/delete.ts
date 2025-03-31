/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class DeleteRepository extends BaseCommand {
    static description = 'Delete a specified repository from an iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --repository-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin to which the repository belongs.',
        helpValue: '<string>',
        required: true,
      }),
      "repository-id": Flags.string({
        description: 'The ID of the repository to delete.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(DeleteRepository);
  
      const client = this.getITwinAccessClient();
      const accessToken = await this.getAccessToken();
      
      const response = await client.deleteRepository(accessToken, flags["itwin-id"], flags["repository-id"]);
      if(response.error)
      {
          this.error(JSON.stringify(response.error, null, 2));
      }
  
      return this.logAndReturnResult({ result: 'deleted' });
    }
  }
  