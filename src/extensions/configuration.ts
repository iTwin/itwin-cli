/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import * as fs from "node:fs";
import * as path from "node:path";

export class Configuration {
  public readonly apiUrl: string = "https://api.bentley.com";
  public readonly clientId: string = "native-QJi5VlgxoujsCRwcGHMUtLGMZ";
  public readonly clientSecret: string | undefined;
  public readonly issuerUrl: string = "https://ims.bentley.com/";

  constructor(configDir: string) {
    const configPath = path.join(configDir, "config.json");

    if (fs.existsSync(configPath)) {
      const file = fs.readFileSync(configPath, "utf8");
      const configJson = JSON.parse(file);

      this.apiUrl = configJson.apiUrl;
      this.clientId = configJson.clientId;
      this.clientSecret = configJson.clientSecret;
      this.issuerUrl = configJson.issuerUrl;
    }

    if (process.env.ITP_SERVICE_CLIENT_ID) {
      this.clientId = process.env.ITP_SERVICE_CLIENT_ID;
    }

    if (process.env.ITP_SERVICE_CLIENT_SECRET) {
      this.clientSecret = process.env.ITP_SERVICE_CLIENT_SECRET;
    }

    if (process.env.ITP_ISSUER_URL) {
      this.issuerUrl = process.env.ITP_ISSUER_URL;
    }

    if (process.env.ITP_API_URL) {
      this.apiUrl = process.env.ITP_API_URL;
    }
  }
}
