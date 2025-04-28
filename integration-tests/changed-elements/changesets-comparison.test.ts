/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModel } from '@itwin/imodels-client-management';
import { ITwin } from '@itwin/itwins-client';
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { changeset, changesetComparison } from '../../src/services/changed-elements-client/tracking';
import { createFile, createIModel, createITwin, getRootFolderId } from '../utils/helpers';
import { resultResponse } from '../utils/result-response';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('changesets + comparison', () => {
  const testITwinName = 'ITwinCLI_IntegrationTestITwin_ChangedElements';
  const testIModelName = 'ITwinCLI_IntegrationTestIModel_ChangedElements';
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
  });

  it('should get changesets', async () => {
    const response = await runCommand<changeset[]>(`changed-elements changesets --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(response.result).to.not.be.undefined;
    expect(response.result?.length).to.be.equal(4);

    const responseFiltered = await runCommand<changeset[]>(`changed-elements changesets --imodel-id ${testIModelId} --itwin-id ${testITwinId} --skip 2 --top 2`);
    expect(responseFiltered.result).to.not.be.undefined;
    expect(responseFiltered.result?.length).to.be.equal(2);
    expect(responseFiltered.result?.map(x => x.id)).to.be.deep.equal(response.result?.map(x => x.id).slice(2))
  });

  it('should compare 2 changesets', async () => {
    const response = await runCommand<changeset[]>(`changed-elements changesets --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(response.result).to.not.be.undefined;
    expect(response.result?.length).to.be.equal(4);
    
    const comparisonResponse = await runCommand<changesetComparison>(`changed-elements comparison --imodel-id ${testIModelId} --itwin-id ${testITwinId} --changeset-id1 ${response.result![0].id} --changeset-id2 ${response.result![3].id}`);
    expect(comparisonResponse.result).to.not.be.undefined;
    expect(comparisonResponse.result!.opcodes.length).to.be.equal(1);
    expect(comparisonResponse.result!.opcodes[0]).to.be.equal(18); // Element was inserted
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);