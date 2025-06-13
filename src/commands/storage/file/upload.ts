/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";
import fs from "node:fs";

import BaseCommand from "../../../extensions/base-command.js";
import { ApiReference } from "../../../extensions/api-reference.js";
import { ResultResponse } from "../../../services/general-models/result-response.js";

export default class FileUpload extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/storage/operations/upload-file/",
    name: "Upload File",
  };

  public static description = "Upload a new file to a specified URL within iTwin storage.";

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

    const client = await this.getStorageApiClient();

    const fileBuffer = fs.readFileSync(flags["file-path"]);
    const fileArrayBuffer = this.toArrayBuffer(fileBuffer);

    const response = await client.uploadFile(flags["upload-url"], fileArrayBuffer);
    if (response.status < 200 || response.status >= 300) {
      this.error(`Encountered a problem when placing information to blob storage: ${response.statusText}`);
    }

    const returnObject = { result: "uploaded" };
    return this.logAndReturnResult(returnObject);
  }

  private toArrayBuffer(buffer: Buffer): ArrayBuffer {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (const [i, element] of buffer.entries()) {
      view[i] = element;
    }

    return arrayBuffer;
  }
}
