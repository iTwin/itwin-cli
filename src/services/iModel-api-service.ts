import { AuthorizationCallback, Extent, IModel, IModelsClient } from "@itwin/imodels-client-management";

import { ContextService } from "./context-service.js";

export class IModelApiService {
  private _iModelsClient: IModelsClient;
  private _contextService: ContextService;
  private _authorizationCallback: AuthorizationCallback;

  constructor(iModelsClient: IModelsClient, contextService: ContextService, authorizationCallback: AuthorizationCallback) {
    this._iModelsClient = iModelsClient;
    this._contextService = contextService;
    this._authorizationCallback = authorizationCallback;
  }

  public async createIModel(iTwinId: string, name: string, save: boolean, description?: string, extent?: Extent): Promise<IModel> {
    const iModel = await this._iModelsClient.iModels.createEmpty({
      authorization: this._authorizationCallback,
      iModelProperties: {
        description,
        extent,
        iTwinId,
        name,
      },
    });

    if (save) {
      await this._contextService.setContext(iModel.iTwinId, iModel.id);
    }

    return iModel;
  }
}
