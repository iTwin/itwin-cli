/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export interface TaskError {
  bridgeExitCode?: number;
  canUserFix?: boolean;
  category?: string;
  description?: string;
  descriptionKey?: string;
  details?: string;
  errorCode?: string;
  kbArticleLink?: string;
  message?: string;
  phase?: string;
  system?: string;
}
