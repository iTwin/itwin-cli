/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { NamedVersion, NamedVersionOrderByProperty, OrderBy, OrderByOperator } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListNamedVersions extends BaseCommand {
    static description = 'List all named versions for a specific iModel.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --top 10`,
        description: 'Example 1: List the first 10 named versions for a specific iModel'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --skip 5 --top 10`,
        description: 'Example 2: Skip the first 5 named versions and return the next set'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --search "Milestone"`,
        description: `Example 3: Search for named versions containing 'Milestone'`
      },
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Version 2.0" --order-by "changesetIndex desc"`,
        description: 'Example 4: Filter named versions by exact name and sort in descending order by changesetIndex'
      }
    ];

    static flags = {
      "imodel-id": Flags.string({
        char: 'm',
        description: 'The ID of the iModel whose named versions you want to list.',
        required: true,
      }),
      name: Flags.string({
        char: 'n',
        description: 'Filter named versions by exact name.',
        required: false,
      }),
      "order-by": Flags.string({
        description: 'Sort by changesetIndex or createdDateTime, in asc or desc order (ex: "changesetIndex desc").',
        required: false,
      }),
      search: Flags.string({
        description: 'Search named versions by name or description.',
        required: false,
      }),
      skip: Flags.integer({
        description: 'Skip a number of named versions in the result.',
        required: false,
      }),
      top: Flags.integer({
        description: 'Limit the number of named versions returned.',
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListNamedVersions);
  
      const client = this.getIModelClient();
      const authorization = await this.getAuthorizationCallback();

      const orderBy : OrderBy<NamedVersion, NamedVersionOrderByProperty> | undefined = flags["order-by"] ? {
        operator: flags["order-by"].split(" ")[1] === "desc" ? OrderByOperator.Descending : OrderByOperator.Ascending,
        property: flags["order-by"].split(" ")[0] as NamedVersionOrderByProperty,
      } : undefined;
  
      const namedVersionsList = client.namedVersions.getRepresentationList({
        authorization,
        iModelId: flags["imodel-id"],
        urlParams: {
          $orderBy: orderBy,
          $search: flags.search,
          $skip: flags.skip,
          $top: flags.top,
          name: flags.name,  
        }
      });
      
      const result: NamedVersion[] = [];
      for await (const namedVersion of namedVersionsList) {
        result.push(namedVersion);
      }
  
      return this.logAndReturnResult(result);
    }
  }
