/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../general-models/links.js"

export type ChangeTrackingRequest = {
    enable: boolean,
    iModelId: string,
    iTwinId: string
}

export type TrackingResponse = {
    enabled : boolean
}

export type ChangesetsResponse = {
    _links: Links
    changesetStatus: Changeset[]
}

export type Changeset = {
    id: string,
    index: number,
    ready: boolean
}

export type ChangesetComparisonResponse = {
    changedElements: ChangesetComparison
}

export type ChangesetComparison = {
    classIds: string[],
    elements: string[],
    modelIds: string[],
    newChecksums: string[][],
    oldCheckSsms: string[][],
    opcodes: number[],
    parentClassIds: string[]
    parentIds: string[],
    properties: string[][],
    type: number[],
}