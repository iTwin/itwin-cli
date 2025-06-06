/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Role } from "./role.js"

export type Invitation = {
    createdDate: Date,
    email: string,
    expirationDate: Date,
    id: string,
    invitedByEmail: string,
    roles: Role[]
    status: string,
}

export type InvitationsResponse = {
    invitations: Invitation[]
}