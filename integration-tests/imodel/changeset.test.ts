/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Changeset, IModel } from '@itwin/imodels-client-management';
import { ITwin } from '@itwin/itwins-client';
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createIModel, createITwin } from '../utils/helpers';
import { resultResponse } from '../utils/result-response';
import runSuiteIfMainModule from '../utils/run-suite-if-main-module';

const tests = () => describe('changeset', () => {
  const testITwinName = 'ITwinCLI_IntegrationTestITwin_IModelChangeset';
  const testIModelName = 'ITwinCLI_IntegrationTestIModel_IModelChangeset';
  const testFilePath = 'examples/datasets/ExtonCampus.dgn';
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

        const result = await runCommand(`imodel populate --imodel-id ${testIModelId} --file ${testFilePath} --connector-type MSTN`);
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

  it('should get specific changeset by index', async () => {
    const { result: infoResult } = await runCommand<Changeset>(`imodel changeset info --imodel-id ${testIModelId} --changeset-index 7`);
    expect(infoResult).to.not.be.undefined;
    expect(infoResult?.index).to.be.equal(7);
  });

  it('should list changesets and get specific changeset by id', async () => {
    const { result: listResult } = await runCommand<Changeset[]>(`imodel changeset list --imodel-id ${testIModelId}`);
    expect(listResult).to.not.be.undefined;
    expect(listResult).to.have.lengthOf(15);

    const { result: infoResult } = await runCommand<Changeset>(`imodel changeset info --imodel-id ${testIModelId} --changeset-id ${listResult![0].id}`);
    expect(infoResult).to.not.be.undefined;
  });

  it('should only list changesets after index (exclusive)', async () => {
    const { result: listResult } = await runCommand<Changeset[]>(`imodel changeset list --imodel-id ${testIModelId} --after-index 5`);
    expect(listResult).to.not.be.undefined;
    expect(listResult?.every((result) => result.index > 5)).to.be.true;
  });

  it('should only list changesets until index (inclusive)', async () => {
    const { result: listResult } = await runCommand<Changeset[]>(`imodel changeset list --imodel-id ${testIModelId} --last-index 10`);
    expect(listResult).to.not.be.undefined;
    expect(listResult?.every((result) => result.index <= 10)).to.be.true;
  });

  it('should skip 5 changesets and list 4', async () => {
    const { result: listResult } = await runCommand<Changeset[]>(`imodel changeset list --imodel-id ${testIModelId} --skip 5 --top 4`);
    expect(listResult).to.not.be.undefined;
    expect(listResult).to.have.lengthOf(4);
    expect(listResult?.every((result) => result.index > 5 && result.index <= 9)).to.be.true;
  })

  it('should order returned changesets by index', async () => {
    const { result: listResultDesc } = await runCommand<Changeset[]>(`imodel changeset list --imodel-id ${testIModelId} --order-by desc`);
    expect(listResultDesc).to.not.be.undefined;
    const indexesDesc = listResultDesc!.map(changeset => changeset.index);
    expect(indexesDesc).to.be.deep.equal([...indexesDesc].sort((a, b) => b - a));

    const { result: listResultAsc } = await runCommand<Changeset[]>(`imodel changeset list --imodel-id ${testIModelId} --order-by asc`);
    expect(listResultAsc).to.not.be.undefined;
    const indexesAsc = listResultAsc!.map(changeset => changeset.index);
    expect(indexesAsc).to.be.deep.equal([...indexesAsc].sort((a, b) => a - b));
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);