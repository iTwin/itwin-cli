/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createITwin, deleteITwin } from '../utils/helpers';

const tests = () => describe('repository', () => {
  let testRepositoryId: string;
  let testITwinId: string;
  let iModelClass: string;
  let iModelSubclass: string;
  let iModelUri: string;

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
  });

  after(async () => {
    await deleteITwin(testITwinId);
  });

  it('should create a new iTwin repository', async () => {
    iModelClass = 'GeographicInformationSystem';
    iModelSubclass = 'WebMapService';
    iModelUri = 'https://example.com/gis-repo'
    
    const { stdout } = await runCommand(`itwin repository create --itwin-id ${testITwinId} --class ${iModelClass} --sub-class ${iModelSubclass} --uri ${iModelUri}`);
    const createdITwinRepository = JSON.parse(stdout);
    
    expect(createdITwinRepository).to.have.property('id');
    expect(createdITwinRepository).to.have.property('class', iModelClass);
    expect(createdITwinRepository).to.have.property('subClass', iModelSubclass);
    expect(createdITwinRepository).to.have.property('uri', iModelUri);

    testRepositoryId = createdITwinRepository.id;
  });

  it('should list iTwin repositories for the specified iTwin', async () => {
    const { stdout } = await runCommand(`itwin repository list --itwin-id ${testITwinId}`);
    const repositories = JSON.parse(stdout);

    expect(repositories).to.be.an('array').that.is.not.empty;
    // expect repositories list to contain the created repository
    expect(repositories.some((repository: { id: string; }) => repository.id === testRepositoryId)).to.be.true;
  });

  it('should list iTwin repositories for the specified iTwin (class/subclass found)', async () => {
    const { stdout } = await runCommand(`itwin repository list -i ${testITwinId} --class ${iModelClass} --sub-class ${iModelSubclass}`);
    const repositories = JSON.parse(stdout);

    expect(repositories).to.be.an('array').that.is.not.empty;
    // expect repositories list to contain the created repository
    expect(repositories.some((repository: { id: string; }) => repository.id === testRepositoryId)).to.be.true;
  });

  it('should list iTwin repositories for the specified iTwin (class/subclass not found)', async () => {
    const { stdout } = await runCommand(`itwin repository list -i ${testITwinId} --class ${iModelClass} --sub-class MapServer`);

    const repositories = JSON.parse(stdout);
    expect(repositories).to.be.an('array').that.is.empty;
  });

  it('should delete the iTwin repository', async () => {
    const { stdout } = await runCommand(`itwin repository delete --itwin-id ${testITwinId} --repository-id ${testRepositoryId}`);
    const result = JSON.parse(stdout);
    expect(result).to.have.property('result', 'deleted');
  });

});

export default tests;