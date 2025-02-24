/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ChangesetInfo extends BaseCommand {
    static description = 'Retrieve details about a specific changeset of an iModel.';
  
    static flags = {
      "changeset-id": Flags.string({
        description: 'The ID of the changeset.',
        required: true,
      }),
      "imodel-id": Flags.string({
        description: 'The ID of the iModel whose changeset you want to retrieve.',
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
  