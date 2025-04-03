/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ITwin } from "@itwin/itwins-client";
import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { deleteITwin } from "../utils/helpers";

const tests = () => describe('list', () => {
  let testITwin1: ITwin;
  let testITwin1Child: ITwin;
  let testITwin2: ITwin;

  before(async () => {
    const result1 = await runCommand<ITwin>(`itwin create --name IntegrationTestITwin --class Thing --sub-class Asset --type Type1 --number ${Math.random().toString(36).slice(2)}`); 
    testITwin1 = result1.result as ITwin;
    const result2 = await runCommand<ITwin>(`itwin create --name IntegrationTestITwinChild --class Thing --sub-class Asset --parent-id ${testITwin1.id} --status Inactive`);
    testITwin1Child = result2.result as ITwin;
    const result3 = await runCommand<ITwin>(`itwin create --name OtherIntegrationTestITwin --class Endeavor --sub-class Project --data-center-location "UK South" --iana-time-zone America/Los_Angeles --geographic-location "San Francisco, CA"`);
    testITwin2 = result3.result as ITwin;
  });

  after(async () => {
    await deleteITwin(testITwin1Child.id!);
    await deleteITwin(testITwin1.id!);
    await deleteITwin(testITwin2.id!)
  })

  it('should fail when provided bad subClass', async () => {
    const result = await runCommand('itwin list --sub-class InvalidSubClass');
    expect(result.error).to.be.not.undefined;
    expect(result.error!.message).to.include('InvalidSubClass');
  });

  it('should list itwins of specific subClass', async () => {
    const result = await runCommand(`itwin list --sub-class ${testITwin2.subClass}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwin1.id!)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwin2.id!)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });

  it('should list created active itwins', async () => {
    const result = await runCommand(`itwin list`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwin1.id!)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwin2.id!)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });

  it('should list all created itwins', async () => {
    const result = await runCommand(`itwin list --include-inactive --itwin-account-id ${testITwin1.parentId}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwin1.id!)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwin2.id!)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwin1Child.id!)).to.be.true;
  });

  it('should list no itwins when provided invalid itwin account id', async () => {
    const result = await runCommand(`itwin list --include-inactive --itwin-account-id ${crypto.randomUUID()}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.empty;
  });

  it('should list itwin by display name', async () => {
    const result = await runCommand(`itwin list --name ${testITwin2.displayName}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwin1.id!)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwin2.id!)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });


  it('should list itwin by type and number', async () => {
    const result = await runCommand(`itwin list --include-inactive --type ${testITwin1.type} --number ${testITwin1.number}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwin1.id!)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwin2.id!)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });

  it('should list itwin by parent and status', async () => {
    const result = await runCommand(`itwin list --parent-id ${testITwin1.id!} --status ${testITwin1Child.status}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwin1.id!)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwin2.id!)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwin1Child.id!)).to.be.true;
  });

  it('should search for itwins by number', async () => {
    const result = await runCommand(`itwin list --search ${testITwin1.number!.slice(2, 4)}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwin1.id!)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwin2.id!)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });

  it('should search for itwins by display name', async () => {
    const result = await runCommand(`itwin list --search ${testITwin2.displayName}`);
    const resultArr: ITwin[] = JSON.parse(result.stdout);

    expect(resultArr).to.be.an('array').that.is.not.empty;
    expect(resultArr.some(itwin => itwin.id === testITwin1.id!)).to.be.false;
    expect(resultArr.some(itwin => itwin.id === testITwin2.id!)).to.be.true;
    expect(resultArr.some(itwin => itwin.id === testITwin1Child.id!)).to.be.false;
  });

  it('should list itwins with skip/top', async () => {
    const result = await runCommand(`itwin list --include-inactive`);
    const itwinIds: string[] = (JSON.parse(result.stdout) as ITwin[]).map(itwin => itwin.id!);
    expect(itwinIds).to.be.an('array').that.is.not.empty;

    const resultFiltered = await runCommand(`itwin list --include-inactive --skip 1 --top 2`);
    const filteredITwinIds = (JSON.parse(resultFiltered.stdout) as ITwin[]).map(itwin => itwin.id);
    expect(filteredITwinIds).to.be.an('array').that.is.not.empty;
    expect(filteredITwinIds.toString()).to.be.equal(itwinIds.slice(1, 3).toString())
  });
});

export default tests;