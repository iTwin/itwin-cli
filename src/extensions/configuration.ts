/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export interface Configuration {
  apiUrl: string;
  clientId: string;
  clientSecret: string | undefined;
  issuerUrl: string;
}
