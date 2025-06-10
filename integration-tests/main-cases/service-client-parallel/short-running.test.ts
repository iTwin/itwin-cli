/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import imodelConnectionCreateServiceTests from '../../imodel-service/connection/create.test';
import sharedQuickUseCasesParallel from '../shared-quick-use-cases-parallel';

describe('Service Client Tests', () => {
  imodelConnectionCreateServiceTests();
  sharedQuickUseCasesParallel();
});