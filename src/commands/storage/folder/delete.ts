/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { ResultResponse } from "../../../services/general-models/result-response.js";

export default class DeleteFolder extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/storage/operations/delete-folder/",
    name: "Delete Folder",
  };

  public static description = "Delete a folder from an iTwin's storage.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "folder-id": Flags.string({
      char: "f",
      description: "The ID of the folder to be deleted.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(DeleteFolder);

    const client = await this.getStorageApiClient();
    await client.deleteFolder(flags["folder-id"]);

    return this.logAndReturnResult({ result: "deleted" });
  }
}
