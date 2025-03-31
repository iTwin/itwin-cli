/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ChangesetInfo extends BaseCommand {
    static description = 'Retrieve details about a specific changeset of an iModel.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "changeset-id": Flags.string({
        description: 'The ID of the changeset.',
        helpValue: '<string>',
        required: true,
      }),
      "imodel-id": Flags.string({
        char: 'm',
        description: 'The ID of the iModel whose changeset you want to retrieve.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ChangesetInfo);
  
      const client = this.getIModelClient();
      const authorization = await this.getAuthorizationCallback();
  
      const changesetInfo = await client.changesets.getSingle({
        authorization,
        changesetId: flags["changeset-id"],
        iModelId: flags["imodel-id"],
      });
  
      return this.logAndReturnResult(changesetInfo);
    }
  }
  