/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class CreateNamedVersion extends BaseCommand {
    static description = 'Create a new named version for a specific changeset in an iModel.';
  
    static flags = {
      "changeset-id": Flags.string({
        description: 'The ID of the changeset for the named version.',
        required: false,
      }),
      description: Flags.string({
        char: 'd',
        description: 'A description for the named version.',
        required: false,
      }),
      "imodel-id": Flags.string({
        char: 'm',
        description: 'The ID of the iModel where the named version will be created.',
        required: true,
      }),
      name: Flags.string({
        char: 'n',
        description: 'The name of the new named version.',
        required: true,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(CreateNamedVersion);
  
      const client = this.getIModelClient();
      const authorization = await this.getAuthorizationCallback();
  
      const createdNameVersion = await client.namedVersions.create({
        authorization,
        iModelId: flags["imodel-id"],
        namedVersionProperties: {
          changesetId: flags["changeset-id"],
          description: flags.description,
          name: flags.name,
        },
      });
  
      return this.logAndReturnResult(createdNameVersion);
    }
  }
  