/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class GetChangesetStatus extends BaseCommand {
    static description = 'Get the processing status of changesets in an iModel to see which are ready for comparison.';
  
    static flags = {
      "imodel-id": Flags.string({ description: 'The ID of the iModel.', required: true }),
      "itwin-id": Flags.string({ description: 'The ID of the iTwin.', required: true }),
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
  