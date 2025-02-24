/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export type UserResponse = {
    user: User
}

export type UsersResponse = {
    users: User[]
}

export type User = {
    alternateEmail: string,
    city?: string,
    country: string,
    createdDateTime: Date
    displayName: string,
    email: string,
    givenName: string,
    id: string,
    language: string,
    organizationName: string,
    phone?: string,
}