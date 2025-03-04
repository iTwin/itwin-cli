/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export enum authorizationType {
    Interactive = "Interactive",
    Service = "Service"
}

export type authorizationInformation = {
    apiUrl: string;
    authorizationType: authorizationType;
    clientId: string;
    expirationDate?: Date;
    issuerUrl: string;
}