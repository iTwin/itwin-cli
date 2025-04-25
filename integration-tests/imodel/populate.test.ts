/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createFile, createIModel, createITwin, getRootFolderId } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('populate', () => {
  const testFileName = 'test.zip';
  const testFilePath = 'integration-tests/test.zip';
  let testFileId: string;
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id!;
    const testIModel = await createIModel('IntegrationTestIModel', testITwinId);
    testIModelId = testIModel.id!;
    const rootFolderId = await getRootFolderId(testITwinId);
    const testFile = await createFile(rootFolderId, testFileName, testFilePath);
    testFileId = testFile.id!;
  });

  after(async () => {
    const fileDeleteResult = await runCommand(`storage file delete --file-id ${testFileId}`);
    const iModelDeleteResult = await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    const iTwinDeleteResult = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(fileDeleteResult.result).to.have.property('result', 'deleted');
    expect(iModelDeleteResult.result).to.have.property('result', 'deleted');
    expect(iTwinDeleteResult.result).to.have.property('result', 'deleted');
  });

  it('should populate the iModel with the uploaded file', async () => {
    const result = await runCommand(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath} --connector-type SPPID`);
    expect(result.result).to.have.property('iModelId', testIModelId);
  }).timeout(30 * 60 * 1000);
});

export default tests;

runSuiteIfMainModule(import.meta, tests);