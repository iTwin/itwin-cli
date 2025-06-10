/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import accessControlTests from '../access-control/access-control.test';
import apiTests from '../api.test';
import changedElementsTests from '../changed-elements/changed-elements.test';
import contextTests from '../context/context.test';
import imodelTests from '../imodel/imodel.test';
import itwinTests from '../itwin/itwin.test';
import storageTests from '../storage/storage.test';
import userTests from '../user/user.test';

const sharedQuickUseCasesParallel = () => {
  accessControlTests();
  apiTests();
  changedElementsTests();
  contextTests();
  imodelTests();
  itwinTests();
  storageTests();
  userTests();
};

export default sharedQuickUseCasesParallel;