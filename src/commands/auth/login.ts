/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";

import BaseCommand from "../../extensions/base-command.js";
import { Environment, environments } from "../../extensions/configuration.js";
import { AuthorizationType } from "../../services/authorization/authorization-type.js";

export default class Login extends BaseCommand {
  public static customDocs = true;

  public static description = "Authenticate itp with Bentley. This command initiates the login process to obtain the necessary authentication tokens.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %>`,
      description: "Example 1:",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --client-id native-a1254s86d4a5s4d`,
      description: "Example 2:",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --client-id service-a1254s86d4a5s4d --client-secret a456a7s89da46s5f4a6f16a5sdf3as2d1f65a4sdf13`,
      description: "Example 3:",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --env qa`,
      description: "Example 4:",
    },
  ];

  public static flags = {
    "client-id": Flags.string({
      description: "Provided client id that will be used for service or website login",
      helpValue: "<string>",
      required: false,
    }),
    "client-secret": Flags.string({
      description: "Provided client secret that will be user for service type authentication login",
      helpValue: "<string>",
      required: false,
    }),
    env: Flags.string({
      description:
        "iTwin Platform environment to log in to. Overrides the ITP_ISSUER_URL and ITP_API_URL environment variables. Subsequent commands use the environment of the current login.",
      helpValue: "<string>",
      options: Object.keys(environments),
      required: false,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Login);

    const currentAuthorizationInfo = await this.authorizationService.info();

    await this.authorizationService.login(flags["client-id"], flags["client-secret"], flags.env as Environment | undefined);

    const newAuthorizationInfo = await this.authorizationService.info();
    // If the same service client is utilized, do not clear context
    if (
      currentAuthorizationInfo.authorizationType === AuthorizationType.Service &&
      newAuthorizationInfo.authorizationType === AuthorizationType.Service &&
      currentAuthorizationInfo.issuerUrl === newAuthorizationInfo.issuerUrl &&
      currentAuthorizationInfo.apiUrl === newAuthorizationInfo.apiUrl &&
      currentAuthorizationInfo.clientId === newAuthorizationInfo.clientId
    ) {
      return;
    }

    // Otherwise clear the context
    await this.contextService.clearContext();
  }
}
