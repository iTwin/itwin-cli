/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import nock from "nock";

import { ITwin } from "@itwin/itwins-client";

import { ITP_API_URL } from "../../mock-environment";
import { ITwinsResponses } from "./itwins-responses";

export class ITwinsApiMock {
  public static getITwin = {
    success: (iTwinId: string): { iTwin: ITwin } => {
      const response = ITwinsResponses.iModelResponse(iTwinId);
      nock(ITP_API_URL).get(`/itwins/${iTwinId}`).reply(200, response);
      return response;
    },
  };

  public static deleteITwin = {
    success: (iTwinId: string): void => {
      nock(ITP_API_URL).delete(`/itwins/${iTwinId}`).reply(204);
    },
  };
}
