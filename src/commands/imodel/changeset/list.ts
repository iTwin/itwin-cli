/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Changeset, ChangesetOrderByProperty, OrderBy, OrderByOperator } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListChangesets extends BaseCommand {
    static description = 'List all changesets for a specific iModel.';
  
    static flags = {
      "after-index": Flags.integer({
        description: 'List changesets after a specific index (exclusive).',
        required: false,
      }),
      "imodel-id": Flags.string({
        char: 'm',
        description: 'The ID of the iModel whose changesets you want to list.',
        required: true,
      }),
      "last-index": Flags.integer({
        description: 'List changesets up to a specific index (inclusive).',
        required: false,
      }),
      "order-by": Flags.string({
        description: 'Order the changesets by their index. Can be asc for ascending or desc for descending order.',
        options: ["asc", "desc"],
        required: false,
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
  
      const orderBy: OrderBy<Changeset, ChangesetOrderByProperty> | undefined= flags["order-by"] ? {
        operator: flags["order-by"] as OrderByOperator,
        property: ChangesetOrderByProperty.Index
      } : undefined;

      const changesetList = client.changesets.getRepresentationList({
          authorization,
          iModelId: flags["imodel-id"],
          urlParams: {
              $orderBy: orderBy,
              $skip: flags.skip,
              $top: flags.top,
              afterIndex: flags["after-index"],
              lastIndex: flags["last-index"]
          },
      });

      const result: Changeset[] = [];
      for await (const changeset of changesetList) {
        result.push(changeset);
      }
  
      return this.logAndReturnResult(result);
    }
  }
  