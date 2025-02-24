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
    `<%= config.bin %> <%= command.id %>`,
  ]

  static flags = {
    "client-id": Flags.string({
      description: 'Provided client id that will be used for service or website login', 
      required: false
    }),
    "client-secret": Flags.string({
      description: 'Provided client secret that will be user for service type authentication login', 
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
