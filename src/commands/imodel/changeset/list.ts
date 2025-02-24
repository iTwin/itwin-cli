/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Changeset } from "@itwin/imodels-client-management";

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListChangesets extends BaseCommand {
    static description = 'List all changesets for a specific iModel.';
  
    static flags = {
      "imodel-id": Flags.string({
        description: 'The ID of the iModel whose changesets you want to list.',
        required: true,
      }),
      skip: Flags.integer({
        description: 'The number of changesets to skip.',
        required: false,
      }),
      top: Flags.integer({
        description: 'The maximum number of changesets to return.',
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListChangesets);
    
      const client = this.getIModelClient();
      const authorization = await this.getAuthorizationCallback();
  
      const changesetList = client.changesets.getRepresentationList({
          authorization,
          iModelId: flags["imodel-id"],
          urlParams: {
              $skip: flags.skip,
              $top: flags.top,
          },
      });

      const result: Changeset[] = [];
      for await (const changeset of changesetList) {
        result.push(changeset);
      }
  
      return this.logAndReturnResult(result);
    }
  }
  