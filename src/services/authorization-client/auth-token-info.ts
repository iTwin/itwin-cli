/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { authorizationType } from "./authorization-type.js"

export type authTokenInfo = {
    authToken?: string,
    authenticationType?: authorizationType,
    expirationDate?: Date
}