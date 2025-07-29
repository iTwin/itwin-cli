/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Changeset } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";

export default class ChangesetInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/imodels-v2/operations/get-imodel-changeset-details/",
    name: "Get Changeset Details",
  };

  public static description = `Retrieve details about a specific changeset of an iModel. Exactly one of ['changeset-id', 'changeset-index'] flags needs to be provided.`;

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "changeset-id": Flags.string({
      description: "The ID of the changeset. Mutually exclusive with --changeset-index flag.",
      exactlyOne: ["changeset-id", "changeset-index"],
      helpValue: "<string>",
      required: false,
    }),
    "changeset-index": Flags.integer({
      description: "The index of the changeset. Mutually exclusive with --changeset-id flag.",
      helpValue: "<number>",
      required: false,
    }),
    "imodel-id": CustomFlags.iModelIDFlag({
      description: "The ID of the iModel whose changeset you want to retrieve.",
    }),
  };

  public async run(): Promise<Changeset | undefined> {
    const { flags } = await this.parse(ChangesetInfo);

    const iModelService = await this.getIModelChangesetService();
    const result = await iModelService.getChangeset(flags["imodel-id"], flags["changeset-id"], flags["changeset-index"]);

    return this.logAndReturnResult(result);
  }
}
