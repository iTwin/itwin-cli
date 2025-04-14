/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";

export default class NamedVersionInfo extends BaseCommand {
    static description = 'Retrieve details about a specific named version in an iModel.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --named-version-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42`,
        description: 'Example 1:'
      }
    ];

    static flags = {
      "imodel-id": CustomFlags.iModelIDFlag({
        description: 'The ID of the iModel whose named version you want to retrieve.'
      }),
      "named-version-id": Flags.string({
        description: 'The ID of the named version.',
        helpValue: '<string>',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(NamedVersionInfo);
  
      const client = this.getIModelClient();
      const authorization = await this.getAuthorizationCallback();
  
      const namedVersionInfo = await client.namedVersions.getSingle({
        authorization,
        iModelId: flags["imodel-id"],
        namedVersionId: flags["named-version-id"],
      });
  
      return this.logAndReturnResult(namedVersionInfo);
    }
  }
  