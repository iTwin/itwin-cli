/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export interface Links {
  next: Link;
  prev: Link;
  self: Link;
}

export interface Link {
  /**
   * Hyperlink to the specific entity.
   */
  href?: string;
}
