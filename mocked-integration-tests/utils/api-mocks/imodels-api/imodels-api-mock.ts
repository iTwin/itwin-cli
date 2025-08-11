/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import nock from "nock";

import { IModelResponse } from "@itwin/imodels-client-management";

import { ITP_API_URL } from "../../mock-environment";
import { IModelsResponses } from "./imodels-responses";

export class IModelsApiMock {
  public static getIModel = {
    success: (iTwinId: string, iModelId: string): IModelResponse => {
      const response = IModelsResponses.iModelResponse(iTwinId, iModelId);
      nock(ITP_API_URL).get(`/imodels/${iModelId}`).reply(200, response);
      return response;
    },
  };

  public static deleteIModel = {
    success: (iModelId: string): void => {
      nock(ITP_API_URL).delete(`/imodels/${iModelId}`).reply(204);
    },
  };
}
