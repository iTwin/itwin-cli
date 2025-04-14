import { IModel } from "@itwin/imodels-client-management";
import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { loginToCli } from "../utils/helpers";

describe('Context Integration Tests', () => {
    let iTwin: ITwin;
    let iModel: IModel;
    let anotherITwin: ITwin;
    
    before(async () => {
      await loginToCli();
      const name = `IntegrationTestITwin_${new Date().toISOString()}`;
      const iTwinResult = await runCommand<ITwin>(`itwin create --name "${name}" --class Thing --sub-class Asset`);
      expect(iTwinResult.error).to.be.undefined;
      expect(iTwinResult.result).to.not.be.undefined;
      iTwin = iTwinResult.result as ITwin;

      const iModelName = `IntegrationTestIModel_${new Date().toISOString()}`;
      const iModelResult = await runCommand(`imodel create --name "${iModelName}" --itwin-id ${iTwin.id}`);
      expect(iModelResult.error).to.be.undefined;
      expect(iModelResult.result).to.not.be.undefined;
      iModel = iModelResult.result as IModel;

      const anotherITwinName = `AnotherITwin_${new Date().toISOString()}`;
      const anotherITwinResult = await runCommand<ITwin>(`itwin create --name "${anotherITwinName}" --class Thing --sub-class Asset`);
      expect(anotherITwinResult.error).to.be.undefined;
      expect(anotherITwinResult.result).to.not.be.undefined;
      anotherITwin = anotherITwinResult.result as ITwin;
    });

    after(async () => {
      await runCommand(`itwin delete --id ${iTwin.id}`);
      await runCommand(`itwin delete --id ${anotherITwin.id}`);
    });

    beforeEach(async () => {
        const output = await runCommand('context clear');
        expect(output.error).to.be.undefined;
    });
  
    it('should clear the context', async () => {
        const output = await runCommand('context clear');
        expect(output.error).to.be.undefined;
        expect(output.stdout).to.contain('Context cleared.');

        const outputInfo = await runCommand('context info');
        expect(outputInfo.error).to.be.undefined;
        expect(outputInfo.result).to.be.undefined;
    });

    it('should set the context', async () => {
        const output = await runCommand(`context set --itwin-id ${iTwin.id} --imodel-id ${iModel.id}`);
        expect(output.error).to.be.undefined;
        expect(output.result).to.deep.equal({ iModelId: iModel.id, iTwinId: iTwin.id });
    });

    it('should fail to set context with invalid iTwin ID', async () => {
        const invalidITwinId = "invalid-id";
        const output = await runCommand(`context set --itwin-id ${invalidITwinId}`);
        expect(output.error).to.not.be.undefined;
        expect(output.error?.message).to.contain('Requested iTwin is not available.');
    });

    it('should fail to set context with mismatched iModel and iTwin IDs', async () => {
        const output = await runCommand(`context set --itwin-id ${anotherITwin.id} --imodel-id ${iModel.id}`);
        expect(output.error).to.not.be.undefined;
        expect(output.error?.message).to.contain(`The iModel ID ${iModel.id} does not belong to the specified iTwin ID ${anotherITwin.id}.`);
    });

    it('should fail to set context without iTwin or iModel ID', async () => {
        const output = await runCommand('context set');
        expect(output.error).to.not.be.undefined;
        expect(output.error?.message).to.contain('Either --itwin-id or --imodel-id must be provided.');
    });

    it('should display the current context', async () => {
        await runCommand(`context set --itwin-id ${iTwin.id} --imodel-id ${iModel.id}`);
        const output = await runCommand('context info');
        expect(output.error).to.be.undefined;
        expect(output.result).to.deep.equal({ iModelId: iModel.id, iTwinId: iTwin.id });
    });

    it('should display undefined context after clearing', async () => {
        await runCommand('context clear');
        const output = await runCommand('context info');
        expect(output.error).to.be.undefined;
        expect(output.result).to.be.undefined;
    });

    it('should clear context multiple times without error', async () => {
        await runCommand('context clear');
        const output = await runCommand('context clear');
        expect(output.error).to.be.undefined;
        expect(output.stdout).to.contain('Context cleared.');
    });

    it('should set the context with only an iTwin ID', async () => {
        const output = await runCommand(`context set --itwin-id ${iTwin.id}`);
        expect(output.error).to.be.undefined;
        expect(output.result).to.deep.equal({ iModelId: undefined, iTwinId: iTwin.id });
    });

    it('should set the context with only an iModel ID and resolve the correct iTwin ID', async () => {
        const output = await runCommand(`context set --imodel-id ${iModel.id}`);
        expect(output.error).to.be.undefined;
        expect(output.result).to.deep.equal({ iModelId: iModel.id, iTwinId: iTwin.id });
    });

    it('should fail to set context with only an iModel ID if the iModel does not exist', async () => {
        const invalidIModelId = "invalid-id";
        const output = await runCommand(`context set --imodel-id ${invalidIModelId}`);
        expect(output.error).to.not.be.undefined;
        expect(output.error?.message).to.contain('Requested iModel is not available.');
    });
});