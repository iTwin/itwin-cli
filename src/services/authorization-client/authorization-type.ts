/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export enum AuthorizationType {
    Interactive = "Interactive",
    Service = "Service"
}

export type AuthorizationInformation = {
    apiUrl: string;
    authorizationType: AuthorizationType;
    clientId: string;
    expirationDate?: Date;
    issuerUrl: string;
}