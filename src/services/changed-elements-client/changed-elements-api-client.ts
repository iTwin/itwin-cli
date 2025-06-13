/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient } from "../iTwin-api-client.js";
import { ChangesetComparisonResponse, ChangesetsResponse, ChangeTrackingRequest, TrackingResponse } from "./tracking.js";

export class ChangedElementsApiClient {
  private _iTwinPlatformApiClient: ITwinPlatformApiClient;

  constructor(client: ITwinPlatformApiClient) {
    this._iTwinPlatformApiClient = client;
  }

  public async changeTracking(request: ChangeTrackingRequest): Promise<void> {
    await this._iTwinPlatformApiClient.sendRequestNoResponse({
      apiPath: "changedelements/tracking",
      body: request,
      method: "PUT",
    });
  }

  public async getComparison(iTwinId: string, iModelId: string, startChangesetId: string, endChangesetId: string): Promise<ChangesetComparisonResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: "changedelements/comparison",
      method: "GET",
      query: [
        {
          key: "iTwinId",
          value: iTwinId,
        },
        {
          key: "iModelId",
          value: iModelId,
        },
        {
          key: "startChangesetId",
          value: startChangesetId,
        },
        {
          key: "endChangesetId",
          value: endChangesetId,
        },
      ],
    });
  }

  public async getTracking(iModelId: string, iTwinId: string): Promise<TrackingResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: "changedelements/tracking",
      method: "GET",
      query: [
        {
          key: "iModelId",
          value: iModelId,
        },
        {
          key: "iTwinId",
          value: iTwinId,
        },
      ],
    });
  }

  public async listChangesets(iModelId: string, iTwinId: string, top?: number, skip?: number): Promise<ChangesetsResponse> {
    return this._iTwinPlatformApiClient.sendRequest({
      apiPath: "changedelements/changesets",
      method: "GET",
      query: [
        {
          key: "iModelId",
          value: iModelId,
        },
        {
          key: "iTwinId",
          value: iTwinId,
        },
        {
          key: "$top",
          value: top,
        },
        {
          key: "$skip",
          value: skip,
        },
      ],
    });
  }
}
