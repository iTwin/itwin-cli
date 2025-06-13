/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { customFlags } from "../../../extensions/custom-flags.js";
import { NamedVersion } from "@itwin/imodels-client-management";

export default class CreateNamedVersion extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/imodels-v2/operations/create-imodel-named-version/",
    name: "Create Named Version",
  };

  public static description = "Create a new named version for iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5 --name "Version 1.0" --description "Initial release"`,
      description: "Example 1: Creating a named version with a description",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Version 2.0"`,
      description: "Example 2: Creating a named version without specifying changesetId (uses the latest changeset)",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id 4b8a5d9e8d534a71b02894f2a2b4e91d --name "Version 3.0"`,
      description: "Example 3: Creating a named version without a description",
    },
  ];

  public static flags = {
    "changeset-id": Flags.string({
      description: "The ID of the changeset for the named version. Defaults to the latest changeset if not specified.",
      helpValue: "<string>",
      required: false,
    }),
    description: Flags.string({
      char: "d",
      description: "A description for the named version.",
      helpValue: "<string>",
      required: false,
    }),
    "imodel-id": customFlags.iModelIDFlag({
      description: "The ID of the iModel where the named version will be created.",
    }),
    name: Flags.string({
      char: "n",
      description: "The name of the new named version.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<NamedVersion> {
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
