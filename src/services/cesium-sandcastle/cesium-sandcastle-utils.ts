export function htmlData(): string {
  return `
<style>
@import url(../templates/bucket.css);
</style>

<div id="cesiumContainer" class="fullSize"></div>
`;
}

export function jsData(tilesetUrl: string, terrain?: string): string {
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
