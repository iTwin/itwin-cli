/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export interface Role {
    description?: string,
    displayName?: string,
    id?: string,
    permissions?: string[]

}

export interface RoleResponse {
    role: Role
}

export interface RolesResponse {
    roles: Role[]
}