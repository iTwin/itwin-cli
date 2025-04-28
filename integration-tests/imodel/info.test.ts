/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createIModel, createITwin } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('info', () => {
  const testIModelName = `cli-imodel-integration-test-${new Date().toISOString()}`;
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(testIModelName, testITwinId);
    testIModelId = testIModel.id;
  });

  after(async () => {
    const { result: imodelDeleteResult } = await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should get the iModel info', async () => {
    const { stdout } = await runCommand(`imodel info --imodel-id ${testIModelId}`);
    const iModelInfo = JSON.parse(stdout);

    expect(iModelInfo).to.have.property('id', testIModelId);
    expect(iModelInfo).to.have.property('name', testIModelName);
    expect(iModelInfo).to.have.property('iTwinId', testITwinId);
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);