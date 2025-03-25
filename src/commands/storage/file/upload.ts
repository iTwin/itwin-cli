/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";
import fs from "node:fs"

import BaseCommand from "../../../extensions/base-command.js";

export default class FileUpload extends BaseCommand {
    static description = 'Upload a new file.';

    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --upload-url https://example.com/upload-url --file-path /path/to/your/file.pdf`,
        description: 'Example 1: Upload a PDF file to the storage'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --upload-url https://example.com/image-upload-url --file-path /path/to/your/image.jpg`,
        description: 'Example 2: Upload an image file to the storage'
      }
    ];

    static flags = {
      "file-path": Flags.string({ char: 'f', description: 'The path to the file.', required: true }),
      "upload-url": Flags.string({ char: 'u', description: 'The url for the file to be uploaded to.', required: true }),
    };
  
    async run() {
      const { flags } = await this.parse(FileUpload);
  
      const client = await this.getStorageApiClient();
  
      const fileBuffer = fs.readFileSync(flags["file-path"]);
      const fileArrayBuffer = this.toArrayBuffer(fileBuffer);
  
      const response = await client.uploadFile(flags["upload-url"], fileArrayBuffer);
      if (response.status < 200 || response.status >= 300) {
        this.error(`Encountered a problem when placing information to blob storage: ${response.statusText}`);
      }
  
      const returnObject = { result: 'uploaded' };
      return this.logAndReturnResult(returnObject);
    }
  
    toArrayBuffer(buffer: Buffer) {
      const arrayBuffer = new ArrayBuffer(buffer.length);
      const view = new Uint8Array(arrayBuffer);
      for (const [i, element] of buffer.entries()) {
        view[i] = element;
      }

      return arrayBuffer;
    }
  }
  