/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { links } from "../general-models/links.js"

export type changeTrackingRequest = {
    enable: boolean,
    iModelId: string,
    iTwinId: string
}

export type trackingResponse = {
    enabled : boolean
}

export type changesetsResponse = {
    _links: links
    changesetStatus: changeset[]
}

export type changeset = {
    id: string,
    index: number,
    ready: boolean
}

export type changesetComparisonResponse = {
    changedElements: changesetComparison
}

export type changesetComparison = {
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