/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FileTyped } from "../../../services/storage/models/file-typed.js";

export default class FileInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/storage/operations/get-file/",
    name: "Get File",
  };

  public static description = "Retrieve metadata for a specific file in an iTwin's storage.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --file-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "file-id": Flags.string({
      char: "f",
      description: "The ID of the file to retrieve information about.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<FileTyped | undefined> {
    const { flags } = await this.parse(FileInfo);

    const client = await this.getStorageApiClient();
    const result = await client.getFile(flags["file-id"]);

    return this.logAndReturnResult(result.file);
  }
}
