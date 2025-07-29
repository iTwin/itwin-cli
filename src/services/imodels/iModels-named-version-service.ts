/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

// prettier-ignore
import {
    AuthorizationCallback, IModelsClient, NamedVersion, NamedVersionOrderByProperty, OrderBy, OrderByOperator, take, toArray
} from "@itwin/imodels-client-management";

export class IModelNamedVersionService {
  private _iModelsClient: IModelsClient;
  private _authorizationCallback: AuthorizationCallback;

  constructor(iModelsClient: IModelsClient, authorizationCallback: AuthorizationCallback) {
    this._iModelsClient = iModelsClient;
    this._authorizationCallback = authorizationCallback;
  }

  public async createNamedVersion(iModelId: string, name: string, description?: string, changesetId?: string): Promise<NamedVersion> {
    const createdNameVersion = await this._iModelsClient.namedVersions.create({
      authorization: this._authorizationCallback,
      iModelId,
      namedVersionProperties: {
        changesetId,
        description,
        name,
      },
    });

    return createdNameVersion;
  }

  public async getNamedVersion(iModelId: string, namedVersionId: string): Promise<NamedVersion> {
    const namedVersionInfo = await this._iModelsClient.namedVersions.getSingle({
      authorization: this._authorizationCallback,
      iModelId,
      namedVersionId,
    });

    return namedVersionInfo;
  }

  public async getNamedVersions(
    iModelId: string,
    name?: string,
    orderByOperator?: OrderByOperator,
    orderByProperty?: NamedVersionOrderByProperty,
    search?: string,
    skip?: number,
    top?: number,
  ): Promise<NamedVersion[]> {
    const orderBy: OrderBy<NamedVersion, NamedVersionOrderByProperty> | undefined =
      orderByOperator && orderByProperty
        ? {
            operator: orderByOperator,
            property: orderByProperty,
          }
        : undefined;

    const namedVersionsList = this._iModelsClient.namedVersions.getRepresentationList({
      authorization: this._authorizationCallback,
      iModelId,
      urlParams: {
        $orderBy: orderBy,
        $search: search,
        $skip: skip,
        $top: top,
        name,
      },
    });

    const result: NamedVersion[] = await (top ? take(namedVersionsList, top) : toArray(namedVersionsList));

    return result;
  }
}
