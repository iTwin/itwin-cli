/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel, NamedVersion } from '@itwin/imodels-client-management';
import { ITwin } from '@itwin/itwins-client';
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { changeset } from '../../src/services/changed-elements-client/tracking';
import { createFile, createIModel, createITwin, getRootFolderId } from '../utils/helpers';
import { resultResponse } from '../utils/result-response';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('named-version', () => {
  const testITwinName = 'ITwinCLI_IntegrationTestITwin_iModelNamedVersion';
  const testIModelName = 'ITwinCLI_IntegrationTestIModel_iModelNamedVersion';
  const testFileName = 'test.zip';
  const testFilePath = 'integration-tests/test.zip';
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const filteredITwins = await runCommand<ITwin[]>(`itwin list --name ${testITwinName}`);
    expect(filteredITwins.result).to.not.be.undefined

    if(filteredITwins.result!.length === 0) {
        const testITwin = await createITwin(testITwinName, 'Thing', 'Asset');
        testITwinId = testITwin.id as string;
        const testIModel = await createIModel(testIModelName, testITwinId);
        testIModelId = testIModel.id;

        await runCommand<resultResponse>(`changed-elements enable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);

        const rootFolderId = await getRootFolderId(testITwinId);
        await createFile(rootFolderId, testFileName, testFilePath);

        const result = await runCommand(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath} --connector-type SPPID`);
        expect(result.result).to.have.property('iModelId', testIModelId);
        expect(result.result).to.have.property('iTwinId', testITwinId);
    }
    else {
        testITwinId = filteredITwins.result![0].id!;
        const iModels = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId}`);
        expect(iModels.result).to.not.be.undefined;
        expect(iModels.result?.length).to.be.equal(1);
        testIModelId = iModels.result![0].id;
    }
  }).timeout(30 * 60 * 1000);

  after(async () => {
    const { result: imodelDeleteResult } = await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    const { result: itwinDeleteResult } = await runCommand(`itwin delete --itwin-id ${testITwinId}`);

    expect(imodelDeleteResult).to.have.property('result', 'deleted');
    expect(itwinDeleteResult).to.have.property('result', 'deleted');
  });

  it('should create a new named version with specified changeset', async () => {
    const { result: changesets} = await runCommand<changeset[]>(`changed-elements changesets --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(changesets).to.not.be.undefined;
    expect(changesets!.length).to.be.equal(4);

    const response = await runCommand<NamedVersion>(`imodel named-version create --imodel-id ${testIModelId} --changeset-id ${changesets![0].id} -n "Version 1.0" -d "Some description of the version"`);
    expect(response.result).to.not.be.undefined;
    expect(response.result?.displayName).to.be.equal("Version 1.0");
    expect(response.result?.description).to.be.equal("Some description of the version");
  });

  it('should create a new named version with latest changeset', async () => {
    const response = await runCommand<NamedVersion>(`imodel named-version create --imodel-id ${testIModelId} -n "Version 2.0" -d "Some description of the version"`);
    expect(response.result).to.not.be.undefined;
    expect(response.result?.displayName).to.be.equal("Version 2.0");
    expect(response.result?.description).to.be.equal("Some description of the version");
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);