/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../../extensions/api-reference.js";
import BaseCommand from "../../../../extensions/base-command.js";
import { ResultResponse } from "../../../../services/general-models/result-response.js";

export default class ConnectionSourceFileDelete extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/remove-storage-connection-sourcefile/",
    name: "Remove Storage Connection SourceFile",
  };

  public static description = "Remove a source file from a storage connection of an iModel.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --source-file-id 297c8ab9-53a3-4fe5-adf8-79b4c1a95cbb`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "connection-id": Flags.string({
      char: "c",
      description: "The ID of the storage connection.",
      helpValue: "<string>",
      required: true,
    }),
    "source-file-id": Flags.string({
      description: "The source file ID to delete.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(ConnectionSourceFileDelete);

    const client = await this.getSynchronizationClient();

    await client.deleteSourceFile(flags["connection-id"], flags["source-file-id"]);

    return this.logAndReturnResult({ result: "deleted" });
  }
}
