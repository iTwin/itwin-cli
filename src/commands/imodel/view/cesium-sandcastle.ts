/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import open from "open";
import { deflate } from "pako";

import { ChangesetOrderByProperty, OrderByOperator } from "@itwin/imodels-client-management";
import { Flags } from "@oclif/core";

import { ApiReference } from "../../../extensions/api-reference.js";
import BaseCommand from "../../../extensions/base-command.js";
import { CustomFlags } from "../../../extensions/custom-flags.js";
import { Link, Links } from "../../../services/general-models/links.js";

export default class CesiumSandcastle extends BaseCommand {
  public static apiReference: ApiReference = {
    link: "/docs/command-workflows/cesium-sandcastle",
    name: "Cesium Sandcastle",
    sectionName: "Workflow Reference",
  };

  public static description = "> 🔬 This command is currently in Technical Preview.\nSetup iModel and get URL to view it in Cesium Sandcastle.";

  public static examples = [
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d`,
      description: "Example 1: Get a link to an iModel in Cesium Sandcastle",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5`,
      description: "Example 2: Get a link to a specific changeset of an iModel in Cesium Sandcastle",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5 --open`,
      description: "Example 3: Get a link to a specific changeset of an iModel in Cesium Sandcastle and open the URL in the browser",
    },
    {
      command: `<%= config.bin %> <%= command.id %> --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --terrain cesiumWorldTerrain`,
      description: "Example 4: Get a link to a specific changeset of an iModel in Cesium Sandcastle and use cesium world terrain",
    },
  ];

  public static flags = {
    "changeset-id": Flags.string({
      description: "Changeset id to be viewed in Cesium Sandcastle. If not provided, the latest changeset will be used.",
      helpValue: "<string>",
      required: false,
    }),
    "imodel-id": CustomFlags.iModelIDFlag({
      description: "iModel id to be viewed in Cesium Sandcastle.",
    }),
    open: Flags.boolean({
      description: "Open the URL in the browser.",
      required: false,
    }),
    terrain: Flags.string({
      description: "Select which terrain should be used.",
      helpValue: "<string>",
      options: ["cesiumWorldTerrain"],
      required: false,
      type: "option",
    }),
  };

  private async createExport(iModelId: string, changesetId: string): Promise<ExportInfo> {
    const args = [
      "--method",
      "POST",
      "--path",
      "mesh-export",
      "--version-header",
      "application/vnd.bentley.itwin-platform.v1+json",
      "--body",
      JSON.stringify({
        changesetId,
        exportType: "CESIUM",
        iModelId,
      }),
    ];

    const created = await this.runCommand<ExportCreateResponse>("api", args);
    return created.export;
  }

  private async getExports(iModelId: string): Promise<ExportInfo[]> {
    const exportArgs = [
      "--method",
      "GET",
      "--path",
      "mesh-export/",
      "--version-header",
      "application/vnd.bentley.itwin-platform.v1+json",
      "--query",
      `iModelId: ${iModelId}`,
      "--header",
      "Prefer: return=representation",
    ];
    const response = await this.runCommand<ExportResponse>("api", exportArgs);
    return response.exports;
  }

  private async getOrCreateExport(iModelId: string, changesetId: string): Promise<ExportInfo> {
    this.log(`Getting existing exports for iModel: ${iModelId} and changeset: ${changesetId}`);
    let existingExports = await this.getExports(iModelId);
    const existingExport = existingExports.find((exp) => exp.request.exportType === "CESIUM" && exp.request.changesetId === changesetId);

    if (existingExport !== undefined) {
      this.log(`Found existing export with id: ${existingExport.id}`);
      return existingExport;
    }

    this.log(`Creating new export for iModel: ${iModelId} and changeset: ${changesetId}`);
    let newExport = await this.createExport(iModelId, changesetId);
    while (newExport.status !== "Complete") {
      this.log(`Export status is ${newExport.status}. Waiting for export to complete...`);

      existingExports = await this.getExports(iModelId);

      const foundExport = existingExports.find((exp) => exp.id === newExport.id);
      if (foundExport === undefined) this.error("Export creation has failed");

      newExport = foundExport;

      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
    }

    this.log(`Export completed successfully`);
    return newExport;
  }

  public async run(): Promise<{ url: string }> {
    const { flags } = await this.parse(CesiumSandcastle);

    let changesetId = flags["changeset-id"] ?? "";
    if (changesetId === undefined) {
      const iModelService = await this.getIModelService();
      const existingChangesets = await iModelService.getChangesets(flags["imodel-id"], OrderByOperator.Descending, undefined, 1);
      if (existingChangesets.length === 0) {
        this.error(`No changesets found for iModel: ${flags["imodel-id"]}`);
      }

      changesetId = existingChangesets[0].id;
    }

    const exportInfo: ExportInfo = await this.getOrCreateExport(flags["imodel-id"], changesetId);

    this.log(`Extracting tileset URL from export info`);
    const tilesetUrl: string = extractTileSetUrl(exportInfo);

    const data = [jsData(tilesetUrl, flags.terrain), htmlData()];

    const url = `https://sandcastle.cesium.com/#c=${makeCompressedBase64String(data)}`;

    this.log(`Cesium Sandcastle URL:`);
    this.log(url);

    if (flags.open) {
      this.log(`Opening URL in browser...`);
      await open(url);
    }

    return this.logAndReturnResult({ url });
  }
}

interface ExportResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
  exports: ExportInfo[];
}

interface ExportCreateResponse {
  export: ExportInfo;
}

interface ExportInfo {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: {
    mesh: Link;
  };
  displayName: string;
  error?: string;
  id: string;
  lastModified: Date;
  request: ExportRequest;
  status: "Complete" | "InProgress" | "Invalid" | "NotStarted";
}

interface ExportRequest {
  changesetId: string;
  exportType: "3DFT" | "3DTiles" | "CESIUM" | "IMODEL";
  iModelId: string;
}

function extractTileSetUrl(exportInfo: ExportInfo): string {
  if (exportInfo._links.mesh.href === undefined) {
    throw new Error(`No tileset url found for export info id: ${exportInfo.id}`);
  }

  const urlParts = exportInfo._links.mesh.href.split("?");
  return `${urlParts[0]}/tileset.json?${urlParts[1]}`;
}

function makeCompressedBase64String(data: string[]): string {
  let jsonString = JSON.stringify(data);
  jsonString = jsonString.slice(2, 2 + jsonString.length - 4);
  let base64String = Buffer.from(deflate(jsonString, { raw: true })).toString("base64");
  base64String = base64String.replace(/=+$/, ""); // remove padding

  return base64String;
}

function htmlData(): string {
  return `
<style>
@import url(../templates/bucket.css);
</style>

<div id="cesiumContainer" class="fullSize"></div>
`;
}

function jsData(tilesetUrl: string, terrain?: string): string {
  let viewerParams = "";
  if (terrain === "cesiumWorldTerrain") {
    viewerParams += "terrain: Cesium.Terrain.fromWorldTerrain(),";
  }

  return `
const viewer = new Cesium.Viewer("cesiumContainer",{${viewerParams}});
viewer.scene.globe.show = true;
viewer.scene.debugShowFramesPerSecond = true;
const tilesetUrl = '${tilesetUrl}'; 
const tileset = await Cesium.Cesium3DTileset.fromUrl(tilesetUrl);
viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);
`;
}
