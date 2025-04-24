/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { serviceLoginToCli } from '../utils/helpers';
import isMainModule from '../utils/is-main-module';

const tests = () => {
  it('should log in successfully using service authentication', async () => {
    await serviceLoginToCli();
  });
};

export default tests;

if (isMainModule(import.meta)) {
  describe('Authentication Integration Tests (Service Client)', () => tests());
}