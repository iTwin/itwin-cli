/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FolderTyped } from "../../../services/storage/models/folder-typed.js";

export default class CreateFolder extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/storage/operations/create-folder/",
    name: "Create Folder",
  };

  public static description = "Create a new folder in a specified parent folder in iTwin's storage.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --parent-folder-id ROOT_FOLDER_ID_HERE --name "Project Documents" --description "Folder for all project-related documents"`,
      description: `Example 1: Create a folder inside the root folder with a description\n#Note: You can retrieve the root folder ID using the 'itp storage root-folder' command.`,
    },
    {
      command: `<%= config.bin %> <%= command.id %> --parent-folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name "Design Files"`,
      description: "Example 2: Create a subfolder inside an existing folder",
    },
  ];

  public static flags = {
    description: Flags.string({
      char: "d",
      description: "A description of the folder.",
      helpValue: "<string>",
    }),
    name: Flags.string({
      char: "n",
      description: "The display name of the folder to be created.",
      helpValue: "<string>",
      required: true,
    }),
    "parent-folder-id": Flags.string({
      description: "The ID of the parent folder where the new folder will be created.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<FolderTyped> {
    const { flags } = await this.parse(CreateFolder);

    const client = await this.getStorageApiClient();
    const response = await client.createFolder(flags["parent-folder-id"], {
      description: flags.description,
      displayName: flags.name,
    });

    return this.logAndReturnResult(response.folder);
  }
}
