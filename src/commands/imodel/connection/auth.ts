/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { AuthInfo } from "../../../services/synchronization/models/connection-auth.js";

export default class ConnectionAuth extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "https://developer.bentley.com/apis/synchronization/operations/get-authorization-information/",
    name: "Get Authorization Information",
  };

  public static description =
    "Ensures the user has a valid token for long-running connection tasks. This must be called before starting a connection run with User authenticationType.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: "Example 1:",
    },
  ];

  public async run(): Promise<AuthInfo> {
    await this.parse(ConnectionAuth);

    const synchronizationApiService = await this.getSynchronizationApiService();

    const result = await synchronizationApiService.authorize();

    return this.logAndReturnResult(result);
  }
}
