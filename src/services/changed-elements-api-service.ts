import { ChangedElementsApiClient } from "./changed-elements-client/changed-elements-api-client.js";
import { Changeset, ChangesetComparison, TrackingResponse } from "./changed-elements-client/tracking.js";
import { LoggingCallbacks } from "./general-models/logging-callbacks.js";
import { ResultResponse } from "./general-models/result-response.js";

export class ChangedElementsApiService {
  private _client: ChangedElementsApiClient;
  private _callbacks: LoggingCallbacks;

  constructor(changedElementsApiClient: ChangedElementsApiClient, callbacks: LoggingCallbacks) {
    this._client = changedElementsApiClient;
    this._callbacks = callbacks;
  }

  public async listChangesets(iTwinId: string, iModelId: string, skip?: number, top?: number): Promise<Changeset[]> {
    const result = await this._client.listChangesets(iModelId, iTwinId, top, skip);

    return result.changesetStatus;
  }

  public async getComparison(iTwinId: string, iModelId: string, changesetId1: string, changesetId2: string): Promise<ChangesetComparison> {
    const result = await this._client.getComparison(iTwinId, iModelId, changesetId1, changesetId2);

    return result.changedElements;
  }

  public async changeTracking(iTwinId: string, iModelId: string, enable: boolean): Promise<ResultResponse> {
    await this._client.changeTracking({
      enable,
      iModelId,
      iTwinId,
    });

    return { result: enable ? "enabled" : "disabled" };
  }

  public async getTracking(iTwinId: string, iModelId: string): Promise<TrackingResponse> {
    const result = await this._client.getTracking(iModelId, iTwinId);

    return result;
  }
}
