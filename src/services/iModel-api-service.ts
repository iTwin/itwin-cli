/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

// prettier-ignore
import {
    AuthorizationCallback, Changeset, ChangesetOrderByProperty, Extent, GetChangesetListUrlParams, GetIModelListUrlParams, IModel, IModelsClient,
    OrderByOperator, take, toArray
} from "@itwin/imodels-client-management";

import { ContextService } from "./context-service.js";
import { LoggingCallbacks } from "./general-models/logging-callbacks.js";
import { ResultResponse } from "./general-models/result-response.js";

export class IModelApiService {
  private _iModelsClient: IModelsClient;
  private _contextService: ContextService;
  private _authorizationCallback: AuthorizationCallback;
  private _loggingCallbacks: LoggingCallbacks;

  constructor(iModelsClient: IModelsClient, contextService: ContextService, authorizationCallback: AuthorizationCallback, loggingCallbacks: LoggingCallbacks) {
    this._iModelsClient = iModelsClient;
    this._contextService = contextService;
    this._authorizationCallback = authorizationCallback;
    this._loggingCallbacks = loggingCallbacks;
  }

  public async createIModel(iTwinId: string, name: string, save: boolean, description?: string, extent?: Extent): Promise<IModel> {
    const iModel = await this._iModelsClient.iModels.createEmpty({
      authorization: this._authorizationCallback,
      iModelProperties: {
        description,
        extent,
        iTwinId,
        name,
      },
    });

    if (save) {
      await this._contextService.setContext(iModel.iTwinId, iModel.id);
    }

    return iModel;
  }

  public async deleteIModel(iModelId: string): Promise<ResultResponse> {
    await this._iModelsClient.iModels.delete({
      authorization: this._authorizationCallback,
      iModelId,
    });

    return { result: "deleted" };
  }

  public async getIModel(iModelId: string): Promise<IModel> {
    const iModel = await this._iModelsClient.iModels.getSingle({
      authorization: this._authorizationCallback,
      iModelId,
    });

    return iModel;
  }

  public async getIModels(urlParams: GetIModelListUrlParams): Promise<IModel[]> {
    const iModels = this._iModelsClient.iModels.getRepresentationList({
      authorization: this._authorizationCallback,
      urlParams,
    });

    const result: IModel[] = await (urlParams.$top ? take(iModels, urlParams.$top) : toArray(iModels));

    return result;
  }

  public async updateIModel(iModelId: string, name?: string, description?: string, extent?: Extent): Promise<IModel> {
    if (description === undefined && name === undefined && extent === undefined) {
      this._loggingCallbacks.error("At least one of the update parameters must be provided");
    }

    const iModelInfo = await this._iModelsClient.iModels.getSingle({
      authorization: this._authorizationCallback,
      iModelId,
    });

    const iModel = await this._iModelsClient.iModels.update({
      authorization: this._authorizationCallback,
      iModelId,
      iModelProperties: {
        description,
        extent,
        name: name ?? iModelInfo.name,
      },
    });

    return iModel;
  }

  public async getChangeset(iModelId: string, changesetId?: string, changesetIndex?: number): Promise<Changeset | undefined> {
    if (changesetId) {
      const changesetInfo = await this._iModelsClient.changesets.getSingle({
        authorization: this._authorizationCallback,
        changesetId,
        iModelId,
      });

      return changesetInfo;
    }

    if (changesetIndex) {
      const changesetInfo = await this._iModelsClient.changesets.getSingle({
        authorization: this._authorizationCallback,
        changesetIndex,
        iModelId,
      });

      return changesetInfo;
    }
  }

  public async getChangesets(
    iModelId: string,
    orderBy?: OrderByOperator,
    skip?: number,
    top?: number,
    afterIndex?: number,
    lastIndex?: number,
  ): Promise<Changeset[]> {
    const changesetList = this._iModelsClient.changesets.getRepresentationList({
      authorization: this._authorizationCallback,
      iModelId,
      urlParams: {
        $orderBy: {
          operator: orderBy,
          property: ChangesetOrderByProperty.Index,
        },
        $skip: skip,
        $top: top,
        afterIndex,
        lastIndex,
      },
    });

    const result: Changeset[] = await (top ? take(changesetList, top) : toArray(changesetList));

    return result;
  }
}
