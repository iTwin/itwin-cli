/* eslint-disable no-await-in-loop */

/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import http2 from "node:http2";
import open from 'open';

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";

export default class ConnectionAuth extends BaseCommand {
  static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/get-authorization-information/",
    name: "Get Authorization Information",
  };

  static description = 'Ensures the user has a valid token for long-running connection tasks. This must be called before starting a connection run with User authenticationType.';

	static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: 'Example 1:'
    }
  ];

  async run() {
    await this.parse(ConnectionAuth);

    const client = await this.getSynchronizationClient();
    let response = await client.authorizeUserForConnection();
    
    // User is already logged in, no need to check it again
    if(response.authorizationInformation.isUserAuthorized) {
      return this.logAndReturnResult(response.authorizationInformation);
    }

    if(!response.authorizationInformation._links.authorizationUrl.href) {
      this.error('Connection authorization for user provided empty url');
    }

    // Create and start a server
    const server = http2.createServer();
    
    // Provide what kind of response server will return on a callback
    server.on('stream', (stream, headers) => {
      const reqPath = headers[':path'];
      if (reqPath === '/callback') {
        stream.respond({ ':status': 200, 'content-type': 'text/plain' });
        stream.end('Login successful! You can close this window.');
        this.debug('Login successful!');
        server.close();
      }
    });

    // Provide which port the server is using
    server.listen(3301, () => {
      this.debug('Waiting for login callback on http://localhost:3301/callback');
    });

    // Open page where authentication should happen
    await open(response.authorizationInformation._links.authorizationUrl.href);
    
    // Query regularly and check if authentication was successful.
    let index = 0;
    while (!response.authorizationInformation.isUserAuthorized && index++ < 10) 
    {
      response = await client.authorizeUserForConnection();
      this.debug(`Current state of user connection authentication is ${response.authorizationInformation.isUserAuthorized}`);
      await new Promise(r => {setTimeout(r, 3000 * index)});
    }
    
    server.close();

    return this.logAndReturnResult(response.authorizationInformation);
  }
}
