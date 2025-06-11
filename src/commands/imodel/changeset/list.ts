/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Changeset, ChangesetOrderByProperty, OrderBy, OrderByOperator, take, toArray } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { customFlags } from "../../../extensions/custom-flags.js";

export default class ListChangesets extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/imodels-v2/operations/get-imodel-changesets/",
    name: "List Changesets",
  };

  public static description = 'List all changesets for a specific iModel.';

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --top 10`,
      description: 'Example 1: List the first 10 changesets for a specific iModel'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --skip 5 --top 10`,
      description: 'Example 2: Skip the first 5 changesets and return the next 10'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --after-index 100 --order-by asc`,
      description: 'Example 3: List all changesets after a specific index in ascending order'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --last-index 200 --order-by desc`,
      description: 'Example 4: List all changesets up to a specific index in descending order'
    }
  ];

  public static flags = {
    "after-index": Flags.integer({
      description: 'List changesets after a specific index (exclusive).',
      helpValue: '<integer>',
      required: false,
    }),
    "imodel-id": customFlags.iModelIDFlag({
      description: 'The ID of the iModel whose changesets you want to list.'
    }),
    "last-index": Flags.integer({
      description: 'List changesets up to a specific index (inclusive).',
      helpValue: '<integer>',
      required: false,
    }),
    "order-by": Flags.string({
      description: 'Order the changesets by their index. Can be asc for ascending or desc for descending order.',
      helpValue: '<string>',
      options: ["asc", "desc"],
      required: false,
    }),
    skip: Flags.integer({
      description: 'The number of changesets to skip.',
      helpValue: '<integer>',
      required: false,
    }),
    top: Flags.integer({
      description: 'The maximum number of changesets to return.',
      helpValue: '<integer>',
      required: false,
    }),
  };
  
  public async run(): Promise<Changeset[]> {
    const { flags } = await this.parse(ListChangesets);
    
    const client = this.getIModelClient();
    const authorization = await this.getAuthorizationCallback();
  
    const orderBy: OrderBy<Changeset, ChangesetOrderByProperty> | undefined= flags["order-by"] ? {
      operator: flags["order-by"] as OrderByOperator,
      property: ChangesetOrderByProperty.Index
    } : undefined;

    const urlParams = {
      $orderBy: orderBy,
      $skip: flags.skip,
      $top: flags.top,
      afterIndex: flags["after-index"],
      lastIndex: flags["last-index"]
    };

    const changesetList = client.changesets.getRepresentationList({
      authorization,
      iModelId: flags["imodel-id"],
      urlParams
    });

    const result : Changeset[] = await (flags.top ? take(changesetList, flags.top) : toArray(changesetList));

    return this.logAndReturnResult(result);
  }
}
