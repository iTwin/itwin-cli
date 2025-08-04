/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FileTyped } from "../../../services/storage/models/file-typed.js";
import { FolderTyped } from "../../../services/storage/models/folder-typed.js";

export default class ListFolders extends BaseCommand {
  public static apiReference: ApiReference[] = [
    {
      link: "https://developer.bentley.com/apis/storage/operations/get-folders-in-folder/",
      name: "List Folders in Folder",
    },
    {
      link: "https://developer.bentley.com/apis/storage/operations/get-folders-and-files-in-folder/",
      name: "List Folders and Files in Folder",
    },
  ];

  public static description = "List folders in a parent folder of an iTwin's storage. Optionally, include files in the result.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI`,
      description: "Example 1: List all folders in a parent folder",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --include-files`,
      description: "Example 2: List all folders and files in a parent folder",
    },
  ];

  public static flags = {
    "folder-id": Flags.string({
      char: "f",
      description: "The ID of the parent folder whose contents you want to list.",
      helpValue: "<string>",
      required: true,
    }),
    "include-files": Flags.boolean({
      description: "Whether to include files in the result.",
    }),
  };

  public async run(): Promise<FileTyped[] | FolderTyped[]> {
    const { flags } = await this.parse(ListFolders);

    const storageApiService = await this.getStorageApiService();

    const result = await storageApiService.getFolders(flags["folder-id"], flags["include-files"]);

    return this.logAndReturnResult(result);
  }
}
