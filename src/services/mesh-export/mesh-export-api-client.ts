/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient } from "../itwins/iTwin-api-client.js";
import { ExportInfo } from "./models/export-info.js";

export class MeshExportApiClient {
  private _iTwinPlatformApiClient: ITwinPlatformApiClient;

  constructor(client: ITwinPlatformApiClient) {
    this._iTwinPlatformApiClient = client;
  }

  public async getExports(iModelId: string): Promise<ExportInfo[]> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: "mesh-export",
      method: "GET",
      query: [
        {
          key: "iModelId",
          value: iModelId,
        },
      ],
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Prefer: "return=representation",
      },
    });
  }

  public async createExport(iModelId: string, changesetId: string): Promise<ExportInfo> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: "mesh-export",
      method: "POST",
      body: JSON.stringify({
        changesetId,
        exportType: "CESIUM",
        iModelId,
      }),
    });
  }
}
