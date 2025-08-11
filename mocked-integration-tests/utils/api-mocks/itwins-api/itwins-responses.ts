/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwin, ITwinClass, ITwinSubClass } from "@itwin/itwins-client";

export class ITwinsResponses {
  public static iModelResponse = (iTwinId: string): { iTwin: ITwin } => {
    return {
      iTwin: {
        id: iTwinId,
        class: ITwinClass.Endeavor,
        subClass: ITwinSubClass.Project,
        type: "Construction Project",
        // eslint-disable-next-line id-denylist
        number: "00001-ds-3902795",
        displayName: "White River",
        geographicLocation: "Exton, PA",
        ianaTimeZone: "America/New_York",
        dataCenterLocation: "East US",
        status: "Active",
        parentId: "8a04f48b-1b11-475f-9b61-3083bc69f28f",
        iTwinAccountId: "76c1102e-4f33-4dfa-ad93-bcd9ab717977",
        imageName: null,
        image: null,
        createdDateTime: "2016-01-18T21:03:00.3704659Z",
        createdBy: "abcd0123-e24a-4b35-9faf-f4f5f6f7f8f9",
      },
    };
  };
}
