/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export type Role = {
    description?: string,
    displayName?: string,
    id?: string,
    permissions?: string[]

}

export type RoleResponse = {
    role: Role
}

export type RolesResponse = {
    roles: Role[]
}