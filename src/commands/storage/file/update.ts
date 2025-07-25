/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FileTyped } from "../../../services/storage/models/file-typed.js";

export default class UpdateCommand extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/storage/operations/update-file/",
    name: "Update File",
  };

  public static description = "Update the metadata of a file in an iTwin's storage, such as display name or description.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --file-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name "Updated Design File"`,
      description: "Example 1: Update file display name",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --file-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name "New Model File" --description "Updated model with new specifications"`,
      description: "Example 2: Update file description and display name",
    },
  ];

  public static flags = {
    description: Flags.string({
      char: "d",
      description: "A description for the file.",
      helpValue: "<string>",
    }),
    "file-id": Flags.string({
      char: "f",
      description: "The ID of the file to be updated.",
      helpValue: "<string>",
      required: true,
    }),
    name: Flags.string({
      char: "n",
      description: "The new display name for the file.",
      helpValue: "<string>",
    }),
  };

  public async run(): Promise<FileTyped | undefined> {
    const { flags } = await this.parse(UpdateCommand);

    const client = await this.getStorageApiClient();
    const response = await client.updateFile(flags["file-id"], flags.name, flags.description);

    return this.logAndReturnResult(response.file);
  }
}
