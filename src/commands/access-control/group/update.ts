/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../../extensions/base-command.js";

export default class UpdateAccessControlGroup extends BaseCommand {
    static description = 'Update the details of an existing group in an iTwin.';
  
    static examples = [
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --name "Updated Engineering Team" --description "Updated description"`,
        description: 'Example 1: Update group name and description'
      },
      {
        command: `<%= config.bin %> <%= command.id %> --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --members john.doe@example.com --members jane.doe@example.com --imsGroups "Sample IMS Group" --imsGroups "Sample IMS Group"`,
        description: 'Example 2: Update group members and IMS groups'
      }
    ];
      
    static flags = {
      description: Flags.string({
        char: 'd',
        description: 'The updated description of the group.',
        required: false,
      }),
      "group-id": Flags.string({
        char: 'g',
        description: 'The ID of the group to be updated.',
        required: true,
      }),
      "ims-groups": Flags.string({
        description: 'A list of IMS Groups to be linked to the group.',
        multiple: true,
        required: false,
      }),
      "itwin-id": Flags.string({
        char: 'i',
        description: 'The ID of the iTwin where the group exists.',
        required: true,
      }),
      members: Flags.string({
        description: 'A list of members (emails) to be assigned to the group.',
        multiple: true,
        required: false,
      }),
      name: Flags.string({
        char: 'n',
        description: 'The updated name of the group.',
        required: false,
      }),
    };
  
    async run() {
      const { flags } = await this.parse(UpdateAccessControlGroup);
  
      const client = await this.getAccessControlApiClient();
  
      const response = await client.updateGroup(flags["itwin-id"], flags["group-id"], {
        description: flags.description,
        imsGroups: flags["ims-groups"],
        members: flags.members,
        name: flags.name,
      });
  
      return this.logAndReturnResult(response.group);
    }
  }
  