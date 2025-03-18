/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Flags } from "@oclif/core";
import open from 'open';
import { deflate } from "pako";

import BaseCommand from "../../../extensions/base-command.js";

export default class CesiumSandcastle extends BaseCommand {
    static description = "Setup iModel and get url to view it in Cesium Sandcastle";
  
    static flags = {
      "changeset-id": Flags.string({
        description: "Changeset id to be viewed in Cesium Sandcastle.",
        required: true
      }),
      "imodel-id": Flags.string({ 
        description: "iModel id to be viewed in Cesium Sandcastle.", 
        required: true
      }),
      "open": Flags.boolean({
        description: "Open the URL in the browser.",
        required: false,
      }),
    };
  
    htmlData() : string {
        return `<style>
  @import url(../templates/bucket.css);
    #toolbar {
    background: rgba(42, 42, 42, 0.8);
    padding: 4px;
    border-radius: 4px;
  }

  #toolbar input {
    vertical-align: middle;
    padding-top: 2px;
    padding-bottom: 2px;
  }

  #toolbar .header {
    font-weight: bold;
  }
</style>

<div id="cesiumContainer" class="fullSize"></div>
<div id="loadingOverlay"><h1>Loading...</h1></div>
<div id="toolbar">
  <table>
    <tbody>
      <tr>
        <td>iModel Id</td>
        <td>
          <input type="text" size="30" data-bind="value: imodelId">
        </td>
      </tr>
      <tr>
        <td>Changeset Id</td>
        <td>
          <input type="text" size="30" data-bind="value: changesetId">
        </td>
      </tr>
      <tr>
        <td>Access Token</td>
        <td>
          <input type="text" size="30" data-bind="value: accessToken">
        </td>
      </tr>
    </tbody>
  </table>
</div>`
    }

    jsData(iModelId: string, changesetId: string, token: string) : string {
        return `
async function getExistingExport(iModelId, accessToken, changesetId = undefined) {
  console.log("Get Existing Export");
  
  const headers = {
    "Authorization": accessToken,
    "Accept": "application/vnd.bentley.itwin-platform.v1+json",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
  
  let url = \`https://api.bentley.com/mesh-export/?iModelId=\${iModelId}\`;
  if (changesetId) {
    url += \`&changesetId=\${changesetId}\`;
  }
  try {
    console.log(url);
    const response = await fetch(url, {headers});
    const result = await response.json();
    const existingExport = result.exports.find((exp) => exp.request.exportType === "CESIUM");
    return existingExport;
  }
  catch {
    return undefined;
  }
}
    

async function StartExport(iModelId, accessToken, changesetId = undefined) {
  console.log("Starting New Export");
 
  const requestOptions = {
      method: "POST",
      headers: {
        "Authorization": accessToken,
        "Accept": "application/vnd.bentley.itwin-platform.v1+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        iModelId,
        changesetId,
        exportType:"CESIUM",
      }),
    };
 
    // initiate mesh export
    const response = await fetch(\`https://api.bentley.com/mesh-export/\`, requestOptions);
    const result = JSON.parse(JSON.stringify(await response.json()));
    return result.export.id;
}
 
async function GetExport(exportId, accessToken) {
  const headers = {
    Authorization: accessToken,
    Accept: "application/vnd.bentley.itwin-platform.v1+json",
  };
 
  // obtain export for specified export id
  const url = \`https://api.bentley.com/mesh-export/\${exportId}\`;
  try {
    const response = await fetch(url, { headers });
    const result = JSON.parse(JSON.stringify(await response.json()));
    return result;
  } catch (err) {
    return undefined;
  }
}

async function obtainAndAttachTileset(imodelId, accessToken, changesetId = undefined) {
  let tilesetUrl;
  const start = Date.now();
  
  const existingExport = await getExistingExport(imodelId, accessToken, changesetId);
  if (existingExport) {
    tilesetUrl = existingExport._links.mesh.href;
  }
  else {
    console.log("No Existing Export Found");
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const exportId = await StartExport(imodelId, accessToken, changesetId);
 
    let result = await GetExport(exportId, accessToken);
    let status = result.export.status;
    while (status !== "Complete") {
      await delay(3000);
      result = await GetExport(exportId, accessToken);
      status = result.export.status;
      console.log("Export is " + status);
 
      if (Date.now() - start > 300_000) {
        throw new Error("Export did not complete in time.");
      }
    }
    tilesetUrl = result.export._links.mesh.href;
  }

  const splitStr = tilesetUrl.split("?");
  tilesetUrl = splitStr[0] + "/tileset.json?" + splitStr[1];
 
  const tileset = await Cesium.Cesium3DTileset.fromUrl(tilesetUrl);
  viewer.scene.primitives.add(tileset);
  viewer.zoomTo(tileset);
  console.log("Finished in " + ((Date.now() - start) / 1000).toString() + " seconds");
}

async function init() {
  if ((viewModel.imodelId !== undefined) && (viewModel.accessToken !== undefined)) {
    obtainAndAttachTileset(viewModel.imodelId, viewModel.accessToken, viewModel.changesetId);
  }
  else {
    console.log("Define iModel Id and Access Token, then click 'Obtain and Attach Tileset'");
  } 
}

const viewer = new Cesium.Viewer("cesiumContainer");
viewer.scene.globe.show = true;
viewer.scene.debugShowFramesPerSecond = true;

let viewModel = {
  imodelId: "${iModelId}",
  accessToken: "${token}",
  changesetId: "${changesetId}",
};
  
Cesium.knockout.track(viewModel);
const toolbar = document.getElementById("toolbar");
Cesium.knockout.applyBindings(viewModel, toolbar);

Cesium.knockout
  .getObservable(viewModel, "imodelId")
  .subscribe(function (newValue) {
    viewModel.imodelId = newValue;
  });
  
  Cesium.knockout
  .getObservable(viewModel, "changesetId")
  .subscribe(function (newValue) {
    viewModel.changesetId = newValue;
  });

Cesium.knockout
  .getObservable(viewModel, "accessToken")
  .subscribe(function (newValue) {
    viewModel.accessToken = newValue;
  });

Sandcastle.addDefaultToolbarButton("Obtain and Attach Tileset", function () {
  if (viewer.scene.primitive) {
    viewer.scene.primitive.removeAll();
  }
  init()
});
        `;
    }
    
    makeCompressedBase64String(data: string[]) : string {
        let jsonString = JSON.stringify(data);
        jsonString = jsonString.slice(2, 2 + jsonString.length - 4);
        let base64String = Buffer.from(
            deflate(jsonString, { raw: true })
        ).toString('base64');
        base64String = base64String.replace(/=+$/, ''); // remove padding

        return base64String;
    }

    async run() {
      const { flags } = await this.parse(CesiumSandcastle);

      const token = await this.getAccessToken();

      const data = [
        this.jsData(flags["imodel-id"], flags["changeset-id"], token),
        this.htmlData(),
      ];

      const url = `https://sandcastle.cesium.com/#c=${this.makeCompressedBase64String(data)}`;

      if (flags.open) {
        open(url);
      }

      return this.logAndReturnResult({ url });
    }
}


