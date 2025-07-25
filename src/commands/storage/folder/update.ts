/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FolderTyped } from "../../../services/storage/models/folder-typed.js";

export default class UpdateFolder extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/storage/operations/update-folder/",
    name: "Update Folder",
  };

  public static description = "Update the metadata of a folder in an iTwin's storage, such as its display name or description.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name "Updated Project Documents"`,
      description: "Example 1: Update folder display name",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name "Updated Design Files" --description "Folder containing updated design documents"`,
      description: "Example 2: Update folder display name and description",
    },
  ];

  public static flags = {
    description: Flags.string({
      char: "d",
      description: "A description for the folder.",
      helpValue: "<string>",
    }),
    "folder-id": Flags.string({
      char: "f",
      description: "The ID of the folder to be updated.",
      helpValue: "<string>",
      required: true,
    }),
    name: Flags.string({
      char: "n",
      description: "The new display name for the folder.",
      helpValue: "<string>",
    }),
  };

  public async run(): Promise<FolderTyped> {
    const { flags } = await this.parse(UpdateFolder);

    const client = await this.getStorageApiClient();
    const response = await client.updateFolder(flags["folder-id"], {
      description: flags.description,
      displayName: flags.name,
    });

    return this.logAndReturnResult(response.folder);
  }
}
