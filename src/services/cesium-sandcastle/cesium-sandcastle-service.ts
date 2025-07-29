import { htmlData, jsData } from "./cesium-sandcastle-utils.js";

export class CesiumSandcastleService {
  public async generateUrl(tilesetUrl: string, terrain?: string): string {
    const data = [jsData(tilesetUrl, terrain), htmlData()];

    return `https://sandcastle.cesium.com/#c=${makeCompressedBase64String(data)}`;
  }
}
