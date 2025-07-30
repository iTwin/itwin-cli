/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FolderTyped } from "../../../services/storage/models/folder-typed.js";

export default class FolderInfo extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/storage/operations/get-folder/",
    name: "Get Folder Info",
  };

  public static description = "Retrieve metadata for a specific folder in an iTwin's storage.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "folder-id": Flags.string({
      char: "f",
      description: "The ID of the folder to retrieve information about.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<FolderTyped> {
    const { flags } = await this.parse(FolderInfo);

    const storageApiService = await this.getStorageApiService();

    const result = await storageApiService.getFolder(flags["folder-id"]);

    return this.logAndReturnResult(result);
  }
}
