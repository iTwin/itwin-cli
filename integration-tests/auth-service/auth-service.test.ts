/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { authorizationInformation } from "../../src/services/authorization-client/authorization-type";
import { serviceLoginToCli } from '../utils/helpers';
import isMainModule from '../utils/is-main-module';

const tests = () => {
  it('should log in successfully using service authentication', async () => {
    await serviceLoginToCli();
  });

  it('should return auth info', async () => {
    const result = await runCommand<authorizationInformation>('auth info');
    expect(result.result).to.be.not.undefined;
    expect(result.result!.apiUrl).to.be.equal(process.env.ITP_API_URL);
    expect(result.result!.authorizationType).to.be.not.undefined;
    expect(result.result!.clientId).to.be.equal(process.env.ITP_SERVICE_CLIENT_ID);
    expect(result.result!.issuerUrl).to.be.equal(process.env.ITP_ISSUER_URL);
  });
};

export default tests;

if (isMainModule(import.meta)) {
  describe('Authentication Integration Tests (Service Client)', () => tests());
}