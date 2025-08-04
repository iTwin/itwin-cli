/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { LoggingCallbacks } from "../general-models/logging-callbacks.js";
import { MeshExportApiClient } from "./mesh-export-api-client.js";
import { ExportInfo } from "./models/export-info.js";

export class MeshExportApiService {
  private _meshExportApiClient: MeshExportApiClient;
  private _loggingCallbacks: LoggingCallbacks;

  constructor(meshExportApiClient: MeshExportApiClient, loggingCallbacks: LoggingCallbacks) {
    this._meshExportApiClient = meshExportApiClient;
    this._loggingCallbacks = loggingCallbacks;
  }

  public async getOrCreateExport(iModelId: string, changesetId: string): Promise<ExportInfo> {
    this._loggingCallbacks.log(`Getting existing exports for iModel: ${iModelId} and changeset: ${changesetId}`);
    const existingExportsResponse = await this._meshExportApiClient.getExports(iModelId);
    let existingExports = existingExportsResponse.exports;
    const existingExport = existingExports.find((exp) => exp.request.exportType === "CESIUM" && exp.request.changesetId === changesetId);

    if (existingExport !== undefined) {
      this._loggingCallbacks.log(`Found existing export with id: ${existingExport.id}`);
      return existingExport;
    }

    this._loggingCallbacks.log(`Creating new export for iModel: ${iModelId} and changeset: ${changesetId}`);
    const newExportResponse = await this._meshExportApiClient.createExport(iModelId, changesetId);
    let newExport = newExportResponse.export;
    while (newExport.status !== "Complete") {
      this._loggingCallbacks.log(`Export status is ${newExport.status}. Waiting for export to complete...`);

      existingExports = (await this._meshExportApiClient.getExports(iModelId)).exports;

      const foundExport = existingExports.find((exp) => exp.id === newExport.id);
      if (foundExport === undefined) this._loggingCallbacks.error("Export creation has failed");

      newExport = foundExport;

      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
    }

    this._loggingCallbacks.log(`Export completed successfully`);
    return newExport;
  }
}
