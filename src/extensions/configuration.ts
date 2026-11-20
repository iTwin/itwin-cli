/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import * as fs from "node:fs";
import * as path from "node:path";

export const environments = {
  prod: {
    apiUrl: "https://api.bentley.com",
    issuerUrl: "https://ims.bentley.com/",
    nativeClientId: "native-QJi5VlgxoujsCRwcGHMUtLGMZ",
  },
  qa: {
    apiUrl: "https://qa-api.bentley.com",
    issuerUrl: "https://qa-ims.bentley.com/",
    nativeClientId: "native-lDDu0I9pMgtRDapQbmRgB6r8G",
  },
} as const;

export type Environment = keyof typeof environments;

export class Configuration {
  public readonly apiUrl: string;
  public readonly clientId: string;
  public readonly clientSecret: string | undefined;
  public readonly issuerUrl: string;

  private readonly _configDir: string;

  /**
   * @param environment When provided, its API and issuer URLs take precedence over `config.json` and the
   * `ITP_API_URL`/`ITP_ISSUER_URL` environment variables, and its native client is used unless another client is configured.
   */
  constructor(configDir: string, environment?: Environment) {
    this._configDir = configDir;

    const defaults = environments[environment ?? "prod"];
    this.apiUrl = defaults.apiUrl;
    this.clientId = defaults.nativeClientId;
    this.issuerUrl = defaults.issuerUrl;

    const configPath = path.join(configDir, "config.json");

    if (fs.existsSync(configPath)) {
      const file = fs.readFileSync(configPath, "utf8");
      const configJson = JSON.parse(file);

      this.apiUrl = configJson.apiUrl;
      this.clientId = configJson.clientId;
      this.clientSecret = configJson.clientSecret;
      this.issuerUrl = configJson.issuerUrl;
    }

    if (process.env.ITP_SERVICE_CLIENT_ID && process.env.ITP_SERVICE_CLIENT_SECRET) {
      this.clientId = process.env.ITP_SERVICE_CLIENT_ID;
      this.clientSecret = process.env.ITP_SERVICE_CLIENT_SECRET;
    } else {
      if (process.env.ITP_NATIVE_CLIENT_ID) {
        this.clientId = process.env.ITP_NATIVE_CLIENT_ID;
      }
    }

    if (environment) {
      this.apiUrl = defaults.apiUrl;
      this.issuerUrl = defaults.issuerUrl;
      return;
    }

    if (process.env.ITP_ISSUER_URL) {
      this.issuerUrl = process.env.ITP_ISSUER_URL;
    }

    if (process.env.ITP_API_URL) {
      this.apiUrl = process.env.ITP_API_URL;
    }
  }

  public forEnvironment(environment: Environment): Configuration {
    return new Configuration(this._configDir, environment);
  }
}
