/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwin, ITwinsAccessClient, ITwinsQueryArg, RepositoriesQueryArg, Repository } from "@itwin/itwins-client";

import { checkIfRepositoryClassMatchSubclass } from "../../extensions/validation/itwin-repository-classes.js";
import { LoggingCallbacks } from "../general-models/logging-callbacks.js";
import { ResultResponse } from "../general-models/result-response.js";

export class ITwinsApiService {
  private _accessToken: string;
  private _iTwinsAccessClient: ITwinsAccessClient;
  private _loggingCallbacks: LoggingCallbacks;

  constructor(accessToken: string, iTwinsAccessClient: ITwinsAccessClient, loggingCallbacks: LoggingCallbacks) {
    this._accessToken = accessToken;
    this._iTwinsAccessClient = iTwinsAccessClient;
    this._loggingCallbacks = loggingCallbacks;
  }

  public async createiTwin(iTwin: ITwin): Promise<ITwin> {
    const creatediTwin = await this._iTwinsAccessClient.createiTwin(this._accessToken, iTwin);
    if (creatediTwin.error) {
      this._loggingCallbacks.error(JSON.stringify(creatediTwin.error, null, 2));
    }

    if (creatediTwin.data === undefined) {
      this._loggingCallbacks.error("iTwin not found in response.");
    }

    return creatediTwin.data;
  }

  public async deleteITwin(iTwinId: string): Promise<ResultResponse> {
    const response = await this._iTwinsAccessClient.deleteiTwin(this._accessToken, iTwinId);
    if (response.error) {
      this._loggingCallbacks.error(JSON.stringify(response.error, null, 2));
    }

    return { result: "deleted" };
  }

  public async getiTwin(iTwinId: string): Promise<ITwin> {
    const response = await this._iTwinsAccessClient.getAsync(this._accessToken, iTwinId, "representation");

    if (response.error) {
      this._loggingCallbacks.error(JSON.stringify(response.error, null, 2));
    }

    if (response.data === undefined) {
      this._loggingCallbacks.error("iTwin not found in response.");
    }

    return response.data;
  }

  public async getiTwins(queryArgs: ITwinsQueryArg): Promise<ITwin[]> {
    const response = await this._iTwinsAccessClient.queryAsync(this._accessToken, undefined, queryArgs);

    if (response.error) {
      this._loggingCallbacks.error(JSON.stringify(response.error, null, 2));
    }

    if (response.data === undefined) {
      this._loggingCallbacks.error("iTwins not found in response.");
    }

    return response.data;
  }

  public async updateiTwin(iTwinId: string, iTwin: ITwin): Promise<ITwin> {
    const response = await this._iTwinsAccessClient.updateiTwin(this._accessToken, iTwinId, iTwin);

    if (response.error) {
      this._loggingCallbacks.error(JSON.stringify(response.error, null, 2));
    }

    if (response.data === undefined) {
      this._loggingCallbacks.error("iTwin not found in response.");
    }

    return response.data;
  }

  public async createRepository(iTwinId: string, repository: Repository): Promise<Repository> {
    if (repository.subClass !== undefined) {
      const error = checkIfRepositoryClassMatchSubclass(repository.class, repository.subClass);
      if (error !== "") {
        this._loggingCallbacks.error(error);
      }
    }

    const response = await this._iTwinsAccessClient.createRepository(this._accessToken, iTwinId, repository);

    if (response.error) {
      this._loggingCallbacks.error(JSON.stringify(response.error, null, 2));
    }

    if (response.data === undefined) {
      this._loggingCallbacks.error("iTwin repository not found in response.");
    }

    return response.data;
  }

  public async deleteRepository(iTwinId: string, repositoryId: string): Promise<ResultResponse> {
    const response = await this._iTwinsAccessClient.deleteRepository(this._accessToken, iTwinId, repositoryId);
    if (response.error) {
      this._loggingCallbacks.error(JSON.stringify(response.error, null, 2));
    }

    return { result: "deleted" };
  }

  public async getRepositories(iTwinId: string, queryArgs: RepositoriesQueryArg): Promise<Repository[]> {
    if (queryArgs.class !== undefined && queryArgs.subClass !== undefined) {
      const error = checkIfRepositoryClassMatchSubclass(queryArgs.class, queryArgs.subClass);
      if (error !== "") {
        this._loggingCallbacks.error(error);
      }
    }

    const response = await this._iTwinsAccessClient.queryRepositoriesAsync(this._accessToken, iTwinId, queryArgs);

    if (response.error) {
      this._loggingCallbacks.error(JSON.stringify(response.error, null, 2));
    }

    if (response.data === undefined) {
      this._loggingCallbacks.error("iTwin repositories not found in response.");
    }

    return response.data;
  }
}
