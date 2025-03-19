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

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id;
  });

  after(async () => {
    await deleteITwin(testITwinId);
  });

  it('should create a new iTwin repository', async () => {
    const { stdout } = await runCommand(`itwin repository create --itwin-id ${testITwinId} --class GeographicInformationSystem --sub-class WebMapService --uri https://example.com/gis-repo`);
    const createdITwinRepository = JSON.parse(stdout);
    
    expect(createdITwinRepository).to.have.property('repository');
    expect(createdITwinRepository.repository).to.have.property('id');
    expect(createdITwinRepository.repository).to.have.property('class', 'GeographicInformationSystem');
    expect(createdITwinRepository.repository).to.have.property('subClass', 'WebMapService');
    expect(createdITwinRepository.repository).to.have.property('uri', 'https://example.com/gis-repo');

    testRepositoryId = createdITwinRepository.repository.id;
  });

  it('should list iTwin repositories for the specified iTwin', async () => {
    const { stdout } = await runCommand(`itwin repository list --itwin-id ${testITwinId}`);
    const repositories = JSON.parse(stdout);

    expect(repositories).to.be.an('array').that.is.not.empty;
    // expect repositories list to contain the created repository
    expect(repositories.some((repository: { id: string; }) => repository.id === testRepositoryId)).to.be.true;
  });

  it('should delete the iTwin repository', async () => {
    const { stdout } = await runCommand(`itwin repository delete --itwin-id ${testRepositoryId}`);
    const result = JSON.parse(stdout);
    
    expect(result).to.have.property('result', 'deleted');
  });

});

export default tests;