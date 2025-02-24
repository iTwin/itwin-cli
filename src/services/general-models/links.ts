/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export type links = {
    next: link
    prev: link,
    self: link,
}

export type link = {
    /**
     * Hyperlink to the specific entity.
     */
    href?: string;
};