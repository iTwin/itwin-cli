/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { trackingResponse } from '../../src/services/changed-elements-client/tracking';
import { createIModel, createITwin } from '../utils/helpers';
import { resultResponse } from '../utils/result-response';

const tests = () => describe('enable + disable + info', () => {
  const testIModelName = `IntegrationTestIModel-${new Date().toISOString()}`;
  let testIModelId: string;
  let testITwinId: string;

  before(async () => {
    const testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
    testITwinId = testITwin.id as string;
    const testIModel = await createIModel(testIModelName, testITwinId);
    testIModelId = testIModel.id;
  });

  after(async () => {
    await runCommand(`imodel delete --imodel-id ${testIModelId}`);
    await runCommand(`itwin delete --itwin-id ${testITwinId}`);
  });

  it('should have enabled change tracking', async () => {
    const enableResponse = await runCommand<resultResponse>(`changed-elements enable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(enableResponse.result?.result).equals('enabled');    

    const infoResponse = await runCommand<trackingResponse>(`changed-elements info --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(infoResponse.result?.enabled).to.be.true;
  });

  it('should disable change tracking for the specified iModel', async () => {
    const disableResponse = await runCommand<resultResponse>(`changed-elements disable --imodel-id ${testIModelId} --itwin-id ${testITwinId}`);
    expect(disableResponse.result?.result).equals('disabled');    
    
    const infoResponse = await runCommand<trackingResponse>(`changed-elements info -m ${testIModelId} -i ${testITwinId}`);
    expect(infoResponse.result?.enabled).to.be.false;
  });
});

export default tests;