/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { NamedVersion, NamedVersionOrderByProperty, OrderBy, OrderByOperator } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class ListNamedVersions extends BaseCommand {
    static description = 'List all named versions for a specific iModel.';
  
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
