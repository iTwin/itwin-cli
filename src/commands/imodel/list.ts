/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel, IModelOrderByProperty, OrderBy } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import { apiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";

export default class ListIModels extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/imodels-v2/operations/get-itwin-imodels/",
        name: "List iModels",
    };

    static description = 'Retrieve a list of iModels belonging to the specified iTwin.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
        description: 'Example 1: List all iModels for a specific iTwin'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --top 10 --order-by "name desc"`,
        description: 'Example 2: List the first 10 iModels, ordered by name in descending order'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --search "Sun City"`,
        description: 'Example 3: Search for iModels with "Sun City" in their name or description'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --state initialized`,
        description: 'Example 4: List only initialized iModels'
      }
    ];

    static flags = {
      "itwin-id": CustomFlags.iTwinIDFlag({
        description: 'The ID of the iTwin to list iModels for.'
      }),
      name: Flags.string({
        char: 'n',
        description: 'Filter iModels by their exact name.',
        helpValue: '<string>',
        required: false,
      }),
      "order-by": Flags.string({
        description: "Order the results by 'name' or 'createdDateTime'. Use 'asc' for ascending or 'desc' for descending order.",
        helpValue: '<string>',
        required: false,
      }),
      search: Flags.string({
        description: 'Filter iModels by a string in their name or description.',
        helpValue: '<string>',
        required: false,
      }),
      skip: Flags.integer({
        description: 'Skip a number of items in the result.',
        helpValue: '<integer>',
        required: false,
      }),
      state: Flags.string({
        description: 'Filter iModels by their state.',
        helpValue: '<string>',
        options: ['initialized', 'notInitialized'],
        required: false,
      }),
      top: Flags.integer({
        description: 'Limit the number of items returned.',
        helpValue: '<integer>',
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
