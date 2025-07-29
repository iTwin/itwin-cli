/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { AuthorizationCallback, Changeset, ChangesetOrderByProperty, IModelsClient, OrderByOperator, take, toArray } from "@itwin/imodels-client-management";

export class IModelChangesetService {
  private _iModelsClient: IModelsClient;
  private _authorizationCallback: AuthorizationCallback;

  constructor(iModelsClient: IModelsClient, authorizationCallback: AuthorizationCallback) {
    this._iModelsClient = iModelsClient;
    this._authorizationCallback = authorizationCallback;
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
