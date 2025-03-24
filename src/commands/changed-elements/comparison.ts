/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";

export default class ChangedElementsComparison extends BaseCommand {
    static description = 'Compare changes between two changesets in an iModel.';
  
    static flags = {
      "changeset-id1": Flags.string({ description: 'The ID of the first changeset to compare.', required: true }),
      "changeset-id2": Flags.string({ description: 'The ID of the second changeset to compare.', required: true }),
      "imodel-id": Flags.string({ char: 'm', description: 'The ID of the iModel to compare changesets for.', required: true }),
      "itwin-id": Flags.string({ char: 'i',description: 'The ID of the iTwin associated with the iModel.', required: true})
    };
  
    async run() {
      const { flags } = await this.parse(ChangedElementsComparison);
  
      const client = await this.getChangeElementApiClient();
      const result = await client.getComparison(flags["itwin-id"], flags["imodel-id"], flags["changeset-id1"], flags["changeset-id2"]);
  
      return this.logAndReturnResult(result.changedElements);
    }
  }
  