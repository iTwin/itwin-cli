/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from '@oclif/core';

import BaseCommand from '../../extensions/base-command.js';
import { customFlags } from '../../extensions/custom-flags.js';
import { ApiReference } from '../../extensions/api-reference.js';

export default class GetRootFolder extends BaseCommand {
  public static apiReference: ApiReference = {
    link: 'https://developer.bentley.com/apis/storage/operations/get-top-level-folders-and-files-by-project/',
    name: 'Get Top-Level Folders and Files',
  };

  public static description = 'Retrieve the top-level folders and files in an iTwin\'s storage.';

	public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51`,
      description: 'Example 1:'
    }
  ];

  public static flags = {
    "itwin-id": customFlags.iTwinIDFlag({
      description: 'The ID of the iTwin whose top-level folders and files you want to retrieve.'
    }),
    skip: Flags.integer({
      description: 'The skip query option requests the number of items in the queried collection that are to be skipped and not included in the result.',
      helpValue: '<integer>',
      required: false,
    }),
    top: Flags.integer({
      description: 'The top system query option requests the number of items in the queried collection to be included in the result.',
      helpValue: '<integer>',
      required: false,
    }),
  };

  public async run() {
    const { flags } = await this.parse(GetRootFolder);
    
    const client = await this.getStorageApiClient();

    const response = await client.getTopLevelFoldersAndFiles(flags['itwin-id'], flags.top, flags.skip);

    return this.logAndReturnResult(response);
  }
}
