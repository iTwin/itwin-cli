/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinSubClass } from "@itwin/itwins-client";
import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class ListITwins extends BaseCommand {
    static description = 'List of iTwins';
  
    static flags = {
      "display-name": Flags.string({
        char: 'n',
        description: 'Find iTwins with the exact display name specified.',
        required: false,
      }),
      "include-inactive": Flags.boolean({
        description: 'Include Inactive iTwins in the result.',
        required: false
      }),
      "itwin-account-id": Flags.string({
        description: 'Filter by the iTwin Account ID.',
        required: false
      }),
      number: Flags.string({
        description: 'Find iTwins with the exact number specified.',
        required: false,
      }),
      "parent-id": Flags.string({
        description: 'Filter by the parent iTwin ID.',
        required: false
      }),
      search: Flags.string({
        description: 'Search iTwins by a string in the number or display name.',
        required: false,
      }),
      skip: Flags.integer({
        char: 's',
        description: 'Skip a number of items in the result.',
        required: false,
      }),
      status: Flags.string({
        description: 'Filter by the status of the iTwin.',
        options: ['Active', 'Inactive', 'Trial'],
        required: false
      }),
      "sub-class": Flags.string({
        description: 'Filter by a specific iTwin subClass.',
        options: Object.values(ITwinSubClass),
        required: false
      }),
      top: Flags.integer({
        char: 't',
        description: 'Limit the number of items returned.',
        required: false,
      }),
      type: Flags.string({
        description: "Filter by the iTwin's Type.",
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(ListITwins);
  
      const accessToken = await this.getAccessToken();
      const client = this.getITwinAccessClient();
  
      const response = await client.queryAsync(accessToken, undefined, {
        displayName: flags["display-name"],
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
  