/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createIModel, createITwin } from '../utils/helpers';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('list', () => {
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

  it('should list all iModels for the specified iTwin', async () => {
    const { stdout } = await runCommand(`imodel list --itwin-id ${testITwinId}`);
    const iModelList = JSON.parse(stdout);

    expect(iModelList).to.not.be.undefined;
    expect(iModelList).to.be.an('array').that.is.not.empty;
    expect(iModelList.some((imodel: { id: string; }) => imodel.id === testIModelId)).to.be.true;
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);