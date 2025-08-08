import { IModelResponse, IModelState } from "@itwin/imodels-client-management";

export class IModelsResponses {
  public static iModelResponse = (iTwinId: string, iModelId: string): IModelResponse => {
    return {
      iModel: {
        id: iModelId,
        displayName: "Sun City Renewable-energy Plant",
        dataCenterLocation: "East US",
        name: "Sun City Renewable-energy Plant",
        description: "Overall model of wind and solar farms in Sun City",
        state: IModelState.Initialized,
        createdDateTime: "2020-10-20T10:51:33.1700000Z",
        iTwinId,
        extent: {
          southWest: {
            latitude: 46.13267702834806,
            longitude: 7.672120009938448,
          },
          northEast: {
            latitude: 46.302763954781234,
            longitude: 7.835541640797823,
          },
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        _links: {
          creator: {
            href: "https://api.bentley.com/imodels/5e19bee0-3aea-4355-a9f0-c6df9989ee7d/users/42101fba-847a-4f4e-85a8-a4bed89065e4",
          },
          changesets: {
            href: "https://api.bentley.com/imodels/5e19bee0-3aea-4355-a9f0-c6df9989ee7d/changesets",
          },
          namedVersions: {
            href: "https://api.bentley.com/imodels/5e19bee0-3aea-4355-a9f0-c6df9989ee7d/namedversions",
          },
          complete: undefined,
          upload: undefined,
        },
      },
    } as IModelResponse;
  };
}
