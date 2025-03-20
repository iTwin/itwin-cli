/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class NamedVersionInfo extends BaseCommand {
    static description = 'Retrieve details about a specific named version in an iModel.';
  
    static flags = {
      "imodel-id": Flags.string({
        char: 'm',
        description: 'The ID of the iModel whose named version you want to retrieve.',
        required: true,
      }),
      "named-version-id": Flags.string({
        description: 'The ID of the named version.',
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
  