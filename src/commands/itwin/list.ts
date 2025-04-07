/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinSubClass } from "@itwin/itwins-client";
import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class ListITwins extends BaseCommand {
    static description = 'List of iTwins';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %>`,
        description: 'Example 1: Getting all itwins'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --sub-class Project --status Active`,
        description: 'Example 2: Filtering by subClass and status'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --sub-class Program --type Luxury --top 10`,
        description: 'Example 3: Limiting the number of returned results and filtering by type'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --sub-class Asset --name "Solar Farm" --include-inactive`,
        description: 'Example 4: Searching by display name and including inactive iTwins'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --sub-class WorkPackage --parent-id b1a2c3d4-5678-90ab-cdef-1234567890ab --skip 5`,
        description: 'Example 5: Filtering by parent iTwin ID and skipping the first 5 results'
      }
    ];

    static flags = {
      "include-inactive": Flags.boolean({
        description: 'Include Inactive iTwins in the result.',
        required: false
      }),
      "itwin-account-id": Flags.string({
        description: 'Filter by the iTwin Account ID.',
        helpValue: '<string>',
        required: false
      }),
      name: Flags.string({
        char: 'n',
        description: 'Find iTwins with the exact display name specified.',
        helpValue: '<string>',
        required: false,
      }),
      number: Flags.string({
        description: 'Find iTwins with the exact number specified.',
        helpValue: '<string>',
        required: false,
      }),
      "parent-id": Flags.string({
        description: 'Filter by the parent iTwin ID.',
        helpValue: '<string>',
        required: false
      }),
      search: Flags.string({
        description: 'Search iTwins by a string in the number or display name.',
        helpValue: '<string>',
        required: false,
      }),
      skip: Flags.integer({
        description: 'Skip a number of items in the result.',
        helpValue: '<integer>',
        required: false,
      }),
      status: Flags.string({
        description: 'Filter by the status of the iTwin.',
        helpValue: '<string>',
        options: ['Active', 'Inactive', 'Trial'],
        required: false
      }),
      "sub-class": Flags.string({
        description: 'Filter by a specific iTwin subClass.',
        helpValue: '<string>',
        options: Object.values(ITwinSubClass),
        required: false
      }),
      top: Flags.integer({
        description: 'Limit the number of items returned.',
        helpValue: '<integer      >',
        required: false,
      }),
      type: Flags.string({
        description: "Filter by the iTwin's Type.",
        helpValue: '<string>',
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListITwins);
  
      const accessToken = await this.getAccessToken();
      const client = this.getITwinAccessClient();
  
      const response = await client.queryAsync(accessToken, undefined, {
        displayName: flags.name,
        iTwinAccountId: flags["itwin-account-id"],
        includeInactive: flags["include-inactive"],
        number: flags.number,
        parentId: flags["parent-id"],
        resultMode: 'representation',
        search: flags.search,
        skip: flags.skip,
        status: flags.status,
        subClass: flags["sub-class"] as ITwinSubClass,
        top: flags.top,
        type: flags.type
      })

      if(response.error)
      {
        this.error(JSON.stringify(response.error, null, 2));
      }
  
      return this.logAndReturnResult(response.data);
    }
  }
  