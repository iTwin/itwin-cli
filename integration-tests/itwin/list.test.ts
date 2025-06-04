/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import runSuiteIfMainModule from "../utils/run-suite-if-main-module";

const tests = () => describe('list', () => {
  let testITwin1: ITwin;
  let testITwin1Child: ITwin;
  let testITwin2: ITwin;

  before(async () => {
    const result1 = await runCommand<ITwin>(`itwin create --name IntegrationTestITwin_${new Date().toISOString()} --class Thing --sub-class Asset --type Type1 --number ${Math.random().toString(36).slice(2)}`); 
    testITwin1 = result1.result as ITwin;
    const result2 = await runCommand<ITwin>(`itwin create --name IntegrationTestITwinChild_${new Date().toISOString()} --class Thing --sub-class Asset --parent-id ${testITwin1.id} --status Inactive`);
    testITwin1Child = result2.result as ITwin;
    const result3 = await runCommand<ITwin>(`itwin create --name OtherIntegrationTestITwin_${new Date().toISOString()} --class Endeavor --sub-class Project --data-center-location "UK South" --iana-time-zone America/Los_Angeles --geographic-location "San Francisco, CA"`);
    testITwin2 = result3.result as ITwin;
  });

  after(async () => {
    const { result: deleteResult1 } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwin1Child.id}`);
    const { result: deleteResult2 } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwin1.id}`);
    const { result: deleteResult3 } = await runCommand<{result: string}>(`itwin delete --itwin-id ${testITwin2.id}`);

    expect(deleteResult1).to.have.property('result', 'deleted');
    expect(deleteResult2).to.have.property('result', 'deleted');
    expect(deleteResult3).to.have.property('result', 'deleted');
  })

  it('should fail when provided bad subClass', async () => {
    const { error: listError } = await runCommand<ITwin[]>('itwin list --sub-class InvalidSubClass');
    expect(listError).to.be.not.undefined;
    expect(listError!.message).to.include('InvalidSubClass');
  });

  it('should list itwins of specific subClass', async () => {
    const { result: listResult } = await runCommand<ITwin[]>(`itwin list --sub-class ${testITwin2.subClass}`);

    expect(listResult).to.be.an('array').that.is.not.empty;
    expect(listResult!.some(itwin => itwin.id === testITwin1.id!)).to.be.false;
    expect(listResult!.some(itwin => itwin.id === testITwin2.id!)).to.be.true;
    expect(listResult!.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });

  it('should list created active itwins', async () => {
    const { result: listResult } = await runCommand<ITwin[]>(`itwin list`);

    expect(listResult).to.be.an('array').that.is.not.empty;
    expect(listResult!.some(itwin => itwin.id === testITwin1.id!)).to.be.true;
    expect(listResult!.some(itwin => itwin.id === testITwin2.id!)).to.be.true;
    expect(listResult!.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });

  it('should list all created itwins', async () => {
    const { result: listResult } = await runCommand<ITwin[]>(`itwin list --include-inactive --itwin-account-id ${testITwin1.parentId}`);

    expect(listResult).to.be.an('array').that.is.not.empty;
    expect(listResult!.some(itwin => itwin.id === testITwin1.id!)).to.be.true;
    expect(listResult!.some(itwin => itwin.id === testITwin2.id!)).to.be.true;
    expect(listResult!.some(itwin => itwin.id === testITwin1Child.id!)).to.be.true;
  });

  it('should list no itwins when provided invalid itwin account id', async () => {
    const { result: listResult} = await runCommand<ITwin[]>(`itwin list --include-inactive --itwin-account-id ${crypto.randomUUID()}`);

    expect(listResult).to.be.an('array').that.is.empty;
  });

  it('should list itwin by display name', async () => {
    const { result: listResult } = await runCommand<ITwin[]>(`itwin list --name ${testITwin2.displayName}`);

    expect(listResult).to.be.an('array').that.is.not.empty;
    expect(listResult!.some(itwin => itwin.id === testITwin1.id!)).to.be.false;
    expect(listResult!.some(itwin => itwin.id === testITwin2.id!)).to.be.true;
    expect(listResult!.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });


  it('should list itwin by type and number', async () => {
    const { result: listResult } = await runCommand<ITwin[]>(`itwin list --include-inactive --type ${testITwin1.type} --number ${testITwin1.number}`);

    expect(listResult).to.be.an('array').that.is.not.empty;
    expect(listResult!.some(itwin => itwin.id === testITwin1.id!)).to.be.true;
    expect(listResult!.some(itwin => itwin.id === testITwin2.id!)).to.be.false;
    expect(listResult!.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });

  it('should list itwin by parent and status', async () => {
    const { result: listResult } = await runCommand<ITwin[]>(`itwin list --parent-id ${testITwin1.id!} --status ${testITwin1Child.status}`);

    expect(listResult).to.be.an('array').that.is.not.empty;
    expect(listResult!.some(itwin => itwin.id === testITwin1.id!)).to.be.false;
    expect(listResult!.some(itwin => itwin.id === testITwin2.id!)).to.be.false;
    expect(listResult!.some(itwin => itwin.id === testITwin1Child.id!)).to.be.true;
  });

  it('should search for itwins by number', async () => {
    const { result: listResponse } = await runCommand<ITwin[]>(`itwin list --search ${testITwin1.number}`);

    expect(listResponse).to.be.an('array').that.is.not.empty;
    expect(listResponse!.some(itwin => itwin.id === testITwin1.id!)).to.be.true;
    expect(listResponse!.some(itwin => itwin.id === testITwin2.id!)).to.be.false;
    expect(listResponse!.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });

  it('should search for itwins by display name', async () => {
    const { result: listResult } = await runCommand<ITwin[]>(`itwin list --search ${testITwin2.displayName}`);

    expect(listResult).to.be.an('array').that.is.not.empty;
    expect(listResult!.some(itwin => itwin.id === testITwin1.id!)).to.be.false;
    expect(listResult!.some(itwin => itwin.id === testITwin2.id!)).to.be.true;
    expect(listResult!.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });

  it('should list itwins with skip/top', async () => {
    const { result: listResult } = await runCommand<ITwin[]>(`itwin list --include-inactive`);
    const itwinIds: string[] = listResult!.map(itwin => itwin.id!);
    expect(itwinIds).to.be.an('array').that.is.not.empty;

    const { result: filteredListResult } = await runCommand<ITwin[]>(`itwin list --include-inactive --skip 1 --top 2`);
    const filteredITwinIds = filteredListResult!.map(itwin => itwin.id);
    expect(filteredITwinIds).to.be.an('array').that.is.not.empty;
    expect(filteredITwinIds.toString()).to.be.equal(itwinIds.slice(1, 3).toString())
  });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);