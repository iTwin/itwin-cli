/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from '@oclif/core';

import BaseCommand from '../../extensions/base-command.js';

export default class Login extends BaseCommand {
  static args = {}

  static description = 'Authenticate itp with Bentley. This command initiates the login process to obtain the necessary authentication tokens.'

	static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: 'Example 1:'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --client-id native-a1254s86d4a5s4d`,
      description: 'Example 2:'
    },
    {
      command: `<%= config.bin %> <%= command.id %> --client-id service-a1254s86d4a5s4d --client-secret a456a7s89da46s5f4a6f16a5sdf3as2d1f65a4sdf13`,
      description: 'Example 3:'
    }
  ];

  static flags = {
    "client-id": Flags.string({
      description: 'Provided client id that will be used for service or website login', 
      helpValue: '<string>',
      required: false
    }),
    "client-secret": Flags.string({
      description: 'Provided client secret that will be user for service type authentication login', 
      helpValue: '<string>',
      required: false
    })
  }

  async run(): Promise<void> {    
    const { flags } = await this.parse(Login);

    const authClient = this.getAuthorizationClient();
  
    try {
      const authInfo = await authClient.login(flags["client-id"], flags["client-secret"]);
  
      if (!authInfo.authToken) {
        this.error('User login was not successful');
      }
  
      this.log(`User successfully logged in using ${authInfo.authenticationType} login`);
    } catch {
      this.error('User login was not successful');
    }
  }
}
