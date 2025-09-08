export interface ItwinShareCreate {
  shareContract?: string;
  expiration?: string;
}

export interface ItwinShareResponse {
  share: ItwinShare;
}

export interface ItwinSharesResponse {
  shares: ItwinShare[];
}

export interface ItwinShare {
  id: string;
  iTwinId: string;
  shareKey: string;
  shareContract: string;
  expiration: string;
}
