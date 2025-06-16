/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { ResultResponse } from "../../../services/general-models/result-response.js";

export default class DeleteConnection extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/delete-storage-connection/",
    name: "Delete Storage Connection",
  };

  public static description = "Delete a storage connection of an iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --connection-id MWplZe9Uf0iR1IDMqyOMLuL24kbZK4VNvgn4ev3etXI`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "connection-id": Flags.string({
      char: "c",
      description: "The ID of the storage connection to delete.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(DeleteConnection);

    const client = await this.getSynchronizationClient();

    await client.deleteStorageConnection(flags["connection-id"]);

    return this.logAndReturnResult({ result: "deleted" });
  }
}
