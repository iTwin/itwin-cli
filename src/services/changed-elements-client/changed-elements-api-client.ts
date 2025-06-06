/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwinPlatformApiClient } from "../iTwin-api-client.js";
import { ChangeTrackingRequest, ChangesetComparisonResponse, ChangesetsResponse, TrackingResponse } from "./tracking.js";

export class ChangedElementsApiClient {
    iTwinPlatformApiClient: ITwinPlatformApiClient;

    constructor(client : ITwinPlatformApiClient) {
        this.iTwinPlatformApiClient = client;
    }

    async changeTracking(request: ChangeTrackingRequest) : Promise<void> {
        await this.iTwinPlatformApiClient.sendRequestNoResponse({
            apiPath: 'changedelements/tracking',
            body: request,
            method: 'PUT'
        });
    }

    async getComparison(iTwinId: string, iModelId: string, startChangesetId: string, endChangesetId: string) : Promise<ChangesetComparisonResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: 'changedelements/comparison',
            method: 'GET',
            query: [
                {
                    key: 'iTwinId',
                    value: iTwinId
                },
                {
                    key: 'iModelId',
                    value: iModelId
                },
                {
                    key: 'startChangesetId',
                    value: startChangesetId
                },
                {
                    key: 'endChangesetId',
                    value: endChangesetId
                }
            ]
        });
    }

    getTracking(iModelId: string, iTwinId: string) : Promise<TrackingResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: 'changedelements/tracking',
            method: 'GET',
            query: [
                {
                    key:'iModelId',
                    value: iModelId
                },
                {
                    key: 'iTwinId',
                    value: iTwinId
                }
            ]
        });
    }

    listChangesets(iModelId: string, iTwinId: string, top?: number, skip?: number) : Promise<ChangesetsResponse> {
        return this.iTwinPlatformApiClient.sendRequest({
            apiPath: 'changedelements/changesets',
            method: 'GET',
            query: [
                {
                    key:'iModelId',
                    value: iModelId
                },
                {
                    key: 'iTwinId',
                    value: iTwinId
                },
                {
                    key: '$top',
                    value: top
                },
                {
                    key: '$skip',
                    value: skip
                }
            ]
        });
    }
}