/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../extensions/api-reference.js";
import BaseCommand from "../../extensions/base-command.js";
import { CustomFlags } from "../../extensions/custom-flags.js";

export default class ChangedElementsComparison extends BaseCommand {
    static apiReference: ApiReference = {
        link: "https://developer.bentley.com/apis/changed-elements/operations/get-comparison/",
        name: "Get Comparison",
    };

    static description = 'Compare changes between two changesets in an iModel.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id 89337c07-ab59-4080-81cc-5e237be55369 --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id1 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5 --changeset-id2 4b8a5d9e8d534a71b02894f2a2b4e91d`,
        description: 'Example 1: Compare two changesets in an iModel'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id 89337c07-ab59-4080-81cc-5e237be55369 --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id1 5d9e8b2f6744a71b02894f1a2b4e91d7 --changeset-id2 6b8e4f7a7348a81b93754c2d5d8f7e12`,
        description: 'Example 2: Comparing another set of changesets in the same iModel'
      }
    ];

    static flags = {
      "changeset-id1": Flags.string({ 
        description: 'The ID of the first changeset to compare.',
        helpValue: '<string>',
        required: true 
      }),
      "changeset-id2": Flags.string({ 
        description: 'The ID of the second changeset to compare.',
        helpValue: '<string>',
        required: true 
      }),
      "imodel-id": CustomFlags.iModelIDFlag({ 
        description: 'The ID of the iModel to compare changesets for.'
      }),
      "itwin-id": CustomFlags.iTwinIDFlag({ 
        description: 'The ID of the iTwin associated with the iModel.'
      })
    };
  
    async run() {
      const { flags } = await this.parse(ChangedElementsComparison);
  
      const client = await this.getChangeElementApiClient();
      const result = await client.getComparison(flags["itwin-id"], flags["imodel-id"], flags["changeset-id1"], flags["changeset-id2"]);
  
      return this.logAndReturnResult(result.changedElements);
    }
  }
