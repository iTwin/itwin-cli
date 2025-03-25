/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from '@oclif/core';

import BaseCommand from '../../extensions/base-command.js';

export default class GetRootFolder extends BaseCommand {
  static description = 'Retrieve the top-level folders and files in an iTwin\'s storage.';

	static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: 'Example 1:'
    }
  ];

  static flags = {
    "itwin-id": Flags.string({
      char: 'i',
      description: 'The ID of the iTwin whose top-level folders and files you want to retrieve.',
      required: true,
    }),
    skip: Flags.integer({
      description: 'The skip query option requests the number of items in the queried collection that are to be skipped and not included in the result.',
      required: false,
    }),
    top: Flags.integer({
      description: 'The top system query option requests the number of items in the queried collection to be included in the result.',
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(GetRootFolder);
    
    const client = await this.getStorageApiClient();

    const response = await client.getTopLevelFoldersAndFiles(flags['itwin-id'], flags.top, flags.skip);

    return this.logAndReturnResult(response);
  }
}
