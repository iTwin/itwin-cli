/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FileTyped } from "../../../services/storage/models/file-typed.js";

export default class FileUpdateComplete extends BaseCommand {
  public static apiReference: ApiReference[] = [
    {
      link: "https://developer.bentley.com/apis/storage/operations/complete-file-creation/",
      name: "Complete File Creation",
    },
    {
      link: "/docs/workflows/itwin-upload-files-storage",
      name: "Upload File to iTwin storage",
      sectionName: "Workflow Reference",
    },
  ];

  public static description =
    "Complete the file creation or content update process by marking the operation as done. This command is part of the following workflows:\n\n" +
    "'Upload File to iTwin storage' workflow:\n1) Create an empty file with provided metadata using 'itp storage file create' command.\n2) Upload the file using 'itp storage file upload' command.\n3) Confirm file upload using 'itp storage file update-complete' command.\n\n" +
    "'Update iTwin storage file content' workflow:\n1) Specify which file needs to have its content updated using 'itp storage file update-content' command.\n2) Upload the updated file using 'itp storage file upload' command.\n3) Confirm file content update using 'itp storage file update-complete' command.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --file-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI`,
      description: "Example 1: Complete the file creation or update process",
    },
  ];

  public static flags = {
    "file-id": Flags.string({
      char: "f",
      description: "The ID of the file for which the creation or update is being completed.  ",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<FileTyped | undefined> {
    const { flags } = await this.parse(FileUpdateComplete);

    const storageApiService = await this.getStorageApiService();

    const result = await storageApiService.completeFileUpload(flags["file-id"]);

    return this.logAndReturnResult(result);
  }
}
