/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Links } from "../general-models/links.js";

export interface ChangeTrackingRequest {
  enable: boolean,
  iModelId: string,
  iTwinId: string
}

export interface TrackingResponse {
  enabled : boolean
}

export interface ChangesetsResponse { 
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links
  changesetStatus: Changeset[]
}

export interface Changeset {
  id: string,
  index: number,
  ready: boolean
}

export interface ChangesetComparisonResponse {
  changedElements: ChangesetComparison
}

export interface ChangesetComparison {
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