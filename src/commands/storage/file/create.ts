/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FileUpload } from "../../../services/storage/models/file-upload.js";

export default class FileCreate extends BaseCommand {
  public static apiReference: ApiReference[] = [
    {
      link: "https://developer.bentley.com/apis/storage/operations/create-file/",
      name: "Create File",
    },
    {
      link: "/docs/workflows/itwin-upload-files-storage",
      name: "Upload File to iTwin storage",
      sectionName: "Workflow Reference",
    },
  ];

  public static description =
    "Create an empty file with provided metadata in a specified folder in iTwin storage. This command is part of the 'Upload File to iTwin storage' workflow:\n" +
    "1) Create an empty file with provided metadata using 'itp storage file create' command.\n2) Upload the file using 'itp storage file upload' command.\n3) Confirm file upload using 'itp storage file update-complete' command.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name design.dwg`,
      description: "Example 1: Creating a file with display name only",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name model.ifc --description "Model file for the building design"`,
      description: "Example 2: Creating a file with display name and description",
    },
  ];

  public static flags = {
    description: Flags.string({
      char: "d",
      description: "A description for the file.",
      helpValue: "<string>",
      required: false,
    }),
    "folder-id": Flags.string({
      char: "f",
      description: "The ID of the folder where the file will be created.",
      helpValue: "<string>",
      required: true,
    }),
    name: Flags.string({
      char: "n",
      description: "The display name of the file.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<FileUpload> {
    const { flags } = await this.parse(FileCreate);

    const storageApiService = await this.getStorageApiService();

    const result = await storageApiService.initiateFileCreation(flags["folder-id"], flags.name, flags.description);

    return this.logAndReturnResult(result);
  }
}
