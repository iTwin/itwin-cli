/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { ResultResponse } from "../../../services/general-models/result-response.js";

export default class FileUpload extends BaseCommand {
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
    "Upload a new or updated file to the specified URL within iTwin storage. This command is part of the following workflows:\n\n" +
    "'Upload File to iTwin storage' workflow:\n1) Create an empty file with provided metadata using 'itp storage file create' command.\n2) Upload the file using 'itp storage file upload' command.\n3) Confirm file upload using 'itp storage file update-complete' command.\n\n" +
    "'Update iTwin storage file content' workflow:\n1) Specify which file needs to have its content updated using 'itp storage file update-content' command.\n2) Upload the updated file using 'itp storage file upload' command.\n3) Confirm file content update using 'itp storage file update-complete' command.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --upload-url https://example.com/upload-url --file-path /path/to/your/file.pdf`,
      description: "Example 1: Upload a PDF file to the storage",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --upload-url https://example.com/image-upload-url --file-path /path/to/your/image.jpg`,
      description: "Example 2: Upload an image file to the storage",
    },
  ];

  public static flags = {
    "file-path": Flags.string({
      char: "f",
      description: "The path to the file you want to upload.",
      helpValue: "<string>",
      required: true,
    }),
    "upload-url": Flags.string({
      char: "u",
      description: "The URL where the file should be uploaded.",
      helpValue: "<string>",
      required: true,
    }),
  };

  public async run(): Promise<ResultResponse> {
    const { flags } = await this.parse(FileUpload);

    const storageApiService = await this.getStorageApiService();

    const result = await storageApiService.uploadFile(flags["file-path"], flags["upload-url"]);

    return this.logAndReturnResult(result);
  }
}
