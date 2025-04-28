/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createITwin } from "../utils/helpers";
import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () => describe('delete', () => {
  let testITwin: ITwin;

  before(async () => {
    testITwin = await createITwin('IntegrationTestITwin', 'Thing', 'Asset');
  });

  it('should delete the iTwin', async () => {
    const result = await runCommand(`itwin delete --itwin-id ${testITwin.id}`);
    const deleteResult = JSON.parse(result.stdout);
    expect(deleteResult).to.have.property('result', 'deleted');

    const itwinChildResult = await runCommand(`itwin info --itwin-id ${testITwin.id}`);
    expect(itwinChildResult.error).to.be.not.undefined;
    expect(itwinChildResult.error!.message).to.include('iTwinNotFound');
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);