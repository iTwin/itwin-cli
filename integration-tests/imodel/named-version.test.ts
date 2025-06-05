/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { NamedVersion } from '@itwin/imodels-client-management';
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { PopulateResponse } from '../../src/commands/imodel/populate'
import { changeset } from '../../src/services/changed-elements-client/tracking';
import { createIModel, createITwin } from '../utils/helpers';
import { resultResponse } from '../utils/result-response';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('named-version', () => {
  const testITwinName = 'ITwinCLI_IntegrationTestITwin_iModelNamedVersion';
  const testIModelName = 'ITwinCLI_IntegrationTestIModel_iModelNamedVersion';
  const testFilePath = 'examples/datasets/ExtonCampus.dgn';
  let testIModelId: string;
  let testITwinId: string;

  before(async function() {
    this.timeout(30 * 60 * 1000);
    
    const testITwin = await createITwin(testITwinName, 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(testIModelName, testITwinId);
    testIModelId = testIModel.id;

    await runCommand<resultResponse>(`changed-elements enable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);

    const { result } = await runCommand<PopulateResponse>(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath} --connector-type MSTN`);
    expect(result).to.have.property('iModelId', testIModelId);
    expect(result).to.have.property('iTwinId', testITwinId);
  });

  after(async () => {
    const { result: imodelDeleteResult } = await runCommand<{result: string}>(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwinId}`);

    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should create a new named version with specified changeset', async () => {
    const { result: changesets} = await runCommand<changeset[]>(`changed-elements changesets --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(changesets).to.not.be.undefined;
    expect(changesets).to.have.lengthOf(15);

    const { result: createResult } = await runCommand<NamedVersion>(`imodel named-version create --imodel-id ${testIModelId} --changeset-id ${changesets![0].id} -n "Version 1.0" -d "Some description of the version"`);
    expect(createResult).to.not.be.undefined;
    expect(createResult?.displayName).to.be.equal("Version 1.0");
    expect(createResult?.description).to.be.equal("Some description of the version");
  });

  it('should create a new named version with latest changeset', async () => {
    const { result: createResult } = await runCommand<NamedVersion>(`imodel named-version create --imodel-id ${testIModelId} -n "Version 2.0" -d "Some description of the version"`);
    expect(createResult).to.not.be.undefined;
    expect(createResult?.displayName).to.be.equal("Version 2.0");
    expect(createResult?.description).to.be.equal("Some description of the version");
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);