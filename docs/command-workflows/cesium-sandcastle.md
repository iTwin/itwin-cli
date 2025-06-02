# Cesium Sandcastle Export

The Cesium Sandcastle export command allows you to generate a URL to view an iModel in Cesium Sandcastle. This URL can be used to visualize 3D tilesets in a Cesium environment.

**Workflow steps:**

1. **Start Export**  
   Use the [Start Export](https://developer.bentley.com/apis/mesh-export/operations/start-export/) API to start a new export for the specified iModel and changeset.  
   - Input: iModel ID, changeset ID, and export type (`CESIUM`).
   - Output: Export ID and status.

2. **Check Export Status**  
   Use the [Get Exports](https://developer.bentley.com/apis/mesh-export/operations/get-exports/) API to check the status of the export.  
   - Poll the export status until it is marked as `Complete`.

3. **Extract Tileset URL**  
   Parse the `_links.mesh.href` property from the completed export to retrieve the tileset URL.

4. **Generate Sandcastle URL**  
   Compress the tileset URL and embed it into a Cesium Sandcastle URL.  
   - Use the `deflate` function to compress the data and encode it in Base64 format.

5. **Select Terrain (Optional)**
   The `--terrain` flag can be used to select which terrain to use:
   - `cesiumWorldTerrain` - [cesium world terrain](https://cesium.com/platform/cesium-ion/content/cesium-world-terrain/) is used.

6. **Open in Browser (Optional)**  
   If the `--open` flag is provided, open the generated URL in the default browser.

## Notes

1. The export type must be `CESIUM` to generate a tileset compatible with Cesium Sandcastle.
2. The tileset URL is extracted from the `_links.mesh.href` property of the export response.
3. The generated URL can be opened directly in a browser or shared with others.

## References

- [Cesium Sandcastle](https://sandcastle.cesium.com/)
- [Start Export API](https://developer.bentley.com/apis/mesh-export/operations/start-export/)
- [Get Exports API](https://developer.bentley.com/apis/mesh-export/operations/get-exports/)
- [Cesium World Terrain](https://cesium.com/platform/cesium-ion/content/cesium-world-terrain/) 

