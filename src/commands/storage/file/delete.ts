/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { ResultResponse } from "../../../services/general-models/result-response.js";

export default class DeleteFile extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/storage/operations/delete-file/",
    name: "Delete File",
  };

  public static description = "Delete a file from an iTwin's storage.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --file-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI`,
      description: "Example 1:",
    },
  ];

  public static flags = {
    "file-id": Flags.string({
      char: "f",
      description: "The ID of the file to be deleted.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(DeleteFile);

    const storageApiService = await this.getStorageApiService();

    const result = await storageApiService.deleteFile(flags["file-id"]);

    return this.logAndReturnResult(result);
  }
}
