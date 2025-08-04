/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FileUpload } from "../../../services/storage/models/file-upload.js";

export default class UpdateContent extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/storage/operations/update-file-content/",
    name: "Update File Content",
  };

  public static description =
    "Specify which file in iTwin storage needs to have its content updated. This command is part of the 'Update iTwin storage file content' workflow:\n" +
    "1) Specify which file needs to have its content updated using 'itp storage file update-content' command.\n2) Upload the updated file using 'itp storage file upload' command.\n3) Confirm file content update using 'itp storage file update-complete' command.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --file-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI`,
      description: "Example 1: Get URL to update file content",
    },
  ];

  public static flags = {
    "file-id": Flags.string({
      char: "f",
      description: "The ID of the file to update the content for.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<FileUpload> {
    const { flags } = await this.parse(UpdateContent);

    const storageApiService = await this.getStorageApiService();

    const result = await storageApiService.initiateFileContentUpdate(flags["file-id"]);

    return this.logAndReturnResult(result);
  }
}
