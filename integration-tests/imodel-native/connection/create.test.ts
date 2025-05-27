/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { authenticationType } from '../../../src/services/synchronizationClient/models/authentication-type';
import { storageConnection } from '../../../src/services/synchronizationClient/models/storage-connection';
import { createFile, createIModel, createITwin, getRootFolderId } from '../../utils/helpers';
import runSuiteIfMainModule from '../../utils/run-suite-if-main-module';

const tests = () => describe('imodel connection create tests (Native Client)', () => {
  let testITwinId: string;
  let testIModelId: string;
  let testFileId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(`cli-imodel-integration-test-${new Date().toISOString()}`, testITwinId);
    testIModelId = testIModel.id;
    const rootFolderId = await getRootFolderId(testITwinId);
    const testFile = await createFile(rootFolderId, 'test.zip', 'integration-tests/test.zip');
    testFileId = testFile.id as string;
  });

  after(async () => {
    const { result: imodelDeleteResult } = await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it(`should create a 'User' authentication-type connection by default`, async () => {
    const { result } = await runCommand<storageConnection>(`imodel connection create -m ${testIModelId} -f ${testFileId} --connector-type SPPID -n TestConnection`);
    expect(result).to.not.be.undefined;
    expect(result?.authenticationType).to.be.equal(authenticationType.USER);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);