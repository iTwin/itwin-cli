/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export interface ExportRequest {
  changesetId: string;
  exportType: "3DFT" | "3DTiles" | "CESIUM" | "IMODEL";
  iModelId: string;
}
