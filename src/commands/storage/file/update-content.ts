/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { FileUpload } from "../../../services/storage-client/models/file-upload.js";

export default class UpdateContent extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/storage/operations/update-file-content/",
    name: "Update File Content",
  };

  public static description = "Update the content of an existing file. A URL is returned to upload the file content.";

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

    const storageApiClient = await this.getStorageApiClient();
    const response = await storageApiClient.updateFileContent(flags["file-id"]);

    return this.logAndReturnResult(response);
  }
}
