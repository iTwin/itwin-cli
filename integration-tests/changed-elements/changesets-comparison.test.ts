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
    const { result: filteredITwins } = await runCommand<ITwin[]>(`itwin list --name ${testITwinName}`);
    expect(filteredITwins).to.not.be.undefined

    if(filteredITwins!.length === 0) {
        const testITwin = await createITwin(testITwinName, 'Thing', 'Asset');
        testITwinId = testITwin.id as string;
        const testIModel = await createIModel(testIModelName, testITwinId);
        testIModelId = testIModel.id;

        await runCommand<resultResponse>(`changed-elements enable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);

        const rootFolderId = await getRootFolderId(testITwinId);
        await createFile(rootFolderId, testFileName, testFilePath);
        const { result: populateResult } = await runCommand(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath} --connector-type SPPID`);
        expect(populateResult).to.have.property('iModelId', testIModelId);
        expect(populateResult).to.have.property('iTwinId', testITwinId);
    }
    else {
        testITwinId = filteredITwins![0].id!;
        const { result: iModels } = await runCommand<IModel[]>(`imodel list --itwin-id ${testITwinId}`);
        expect(iModels).to.not.be.undefined;
        expect(iModels).to.have.lengthOf(1);
        testIModelId = iModels![0].id;
    }
  });

  it('should get changesets', async () => {
    const { result: fullResult}  = await runCommand<changeset[]>(`changed-elements changesets --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(fullResult).to.not.be.undefined;
    expect(fullResult).to.have.lengthOf(4);

    const { result: filteredResult } = await runCommand<changeset[]>(`changed-elements changesets --imodel-id ${testIModelId} --itwin-id ${testITwinId} --skip 2 --top 2`);
    expect(filteredResult).to.not.be.undefined;
    expect(filteredResult).to.have.lengthOf(2);
    expect(filteredResult?.map(x => x.id)).to.be.deep.equal(fullResult?.map(x => x.id).slice(2))
  });

  it('should compare 2 changesets', async () => {
    const { result: listResponse } = await runCommand<changeset[]>(`changed-elements changesets --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(listResponse).to.not.be.undefined;
    expect(listResponse).to.have.lengthOf(4);
    
    const { result: comparisonResponse } = await runCommand<changesetComparison>(`changed-elements comparison --imodel-id ${testIModelId} --itwin-id ${testITwinId} --changeset-id1 ${listResponse![0].id} --changeset-id2 ${listResponse![3].id}`);
    expect(comparisonResponse).to.not.be.undefined;
    expect(comparisonResponse!.opcodes).to.have.lengthOf(1);
    expect(comparisonResponse!.opcodes[0]).to.be.equal(18); // Element was inserted
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);