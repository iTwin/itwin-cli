/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { apiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";

export default class CreateNamedVersion extends BaseCommand {
    static apiReference: apiReference = {
        link: "https://developer.bentley.com/apis/imodels-v2/operations/create-imodel-named-version/",
        name: "Create Named Version",
    };

    static description = 'Create a new named version for iModel.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5 --name "Version 1.0" --description "Initial release"`,
        description: 'Example 1: Creating a named version with a description'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Version 2.0"`,
        description: 'Example 2: Creating a named version without specifying changesetId (uses the latest changeset)'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id 4b8a5d9e8d534a71b02894f2a2b4e91d --name "Version 3.0"`,
        description: 'Example 3: Creating a named version without a description'
      }
    ];

    static flags = {
      "changeset-id": Flags.string({
        description: 'The ID of the changeset for the named version. Defaults to the latest changeset if not specified.',
        helpValue: '<string>',
        required: false,
      }),
      description: Flags.string({
        char: 'd',
        description: 'A description for the named version.',
        helpValue: '<string>',
        required: false,
      }),
      "imodel-id": CustomFlags.iModelIDFlag({
        description: 'The ID of the iModel where the named version will be created.'
      }),
      name: Flags.string({
        char: 'n',
        description: 'The name of the new named version.',
        helpValue: '<string>',
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
