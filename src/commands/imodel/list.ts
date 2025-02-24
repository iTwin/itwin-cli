/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel, IModelOrderByProperty, OrderBy } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class ListIModels extends BaseCommand {
    static description = 'Query iModels in an iTwin';
  
    static flags = {
      "itwin-id": Flags.string({
        description: 'The ID of the iTwin to list iModels for.',
        required: true,
      }),
      name: Flags.string({
        description: 'Filter iModels by their exact name.',
        required: false,
      }),
      "order-by": Flags.string({
        description: "Order the results by 'name' or 'createdDateTime'. Use 'asc' for ascending or 'desc' for descending order.",
        required: false,
      }),
      search: Flags.string({
        description: 'Filter iModels by a string in their name or description.',
        required: false,
      }),
      skip: Flags.integer({
        description: 'Skip a number of items in the result.',
        required: false,
      }),
      state: Flags.string({
        description: 'Filter iModels by their state.',
        options: ['initialized', 'notInitialized'],
        required: false,
      }),
      top: Flags.integer({
        description: 'Limit the number of items returned.',
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListIModels);
  
      const client = this.getIModelClient();
      const authorization = await this.getAuthorizationCallback();
  
      const iModels = client.iModels.getRepresentationList({
        authorization,
        urlParams: {
          $orderBy: flags["order-by"] as unknown as OrderBy<IModel, IModelOrderByProperty>,
          $search: flags.search,
          $skip: flags.skip,
          $top: flags.top,
          iTwinId: flags["itwin-id"],
          name: flags.name,
        },
      });
  
      const result: IModel[] = [];
      for await (const iModel of iModels) {
        result.push(iModel);
      }
  
      return this.logAndReturnResult(result);
    }
  }
  