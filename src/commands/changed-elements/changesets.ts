/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class GetChangesetStatus extends BaseCommand {
    static description = 'Get the processing status of changesets in an iModel to see which are ready for comparison.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id 1a2b3c4d-5678-90ab-cdef-1234567890ab --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --top 10`,
        description: 'Example 1: Retrieve the processing status of the first 10 changesets for a specific iModel'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id 1a2b3c4d-5678-90ab-cdef-1234567890ab --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --skip 5 --top 10`,
        description: 'Example 2: Skip the first 5 changesets and return the next set'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id 1a2b3c4d-5678-90ab-cdef-1234567890ab --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
        description: 'Example 3: Retrieve all changesets for a specific iModel'
      }
    ];

    static flags = {
      "imodel-id": Flags.string({ char: 'm', description: 'The ID of the iModel.', required: true }),
      "itwin-id": Flags.string({ char: 'i', description: 'The ID of the iTwin.', required: true }),
      skip: Flags.integer({ description: 'Skip a number of changesets in the result.' }),
      top: Flags.integer({ description: 'Limit the number of changesets returned.' }),
    };
  
    async run() {
      const { flags } = await this.parse(GetChangesetStatus);
  
      const client = await this.getChangeElementApiClient();
      const result = await client.listChangesets(flags["imodel-id"], flags["itwin-id"], flags.top, flags.skip);
  
      return this.logAndReturnResult(result.changesetStatus);
    }
  }
  