import { IModel } from "@itwin/imodels-client-management";
import { ITwin } from "@itwin/itwins-client";
import { runCommand } from "@oclif/test";
import { expect } from "chai";

import { User } from "../src/services/user-client/models/user.js";
import { createITwin } from "./utils/helpers.js";
import runSuiteIfMainModule from "./utils/run-suite-if-main-module.js";

const tests = () => describe("API Integration Tests", () => {
    let iTwin: ITwin;
    let iModel: IModel;

    before(async () => {
        const date = new Date();
        const iTwinRespone = await runCommand<ITwin>(`itwin create --class Thing --sub-class Asset --name itwin-cli-test-${date.toISOString()}`);
        expect(iTwinRespone.error).to.be.undefined;
        iTwin = iTwinRespone.result!;
        const iModelResponse = await runCommand<IModel>(`imodel create --name imodel-cli-test-${date.toISOString()} --itwin-id ${iTwin.id}`);
        expect(iModelResponse.error).to.be.undefined;
        iModel = iModelResponse.result!;
    });

    after(async () => {
        const { result: itwinDeleteResult } = await runCommand<{result: string}>(`itwin delete --itwin-id ${iTwin.id}`);
        expect(itwinDeleteResult).to.have.property('result', 'deleted');
    });

    it("should send a GET request and get user me info", async () => {
        const apiResponse = await runCommand("api --method GET --path users/me");       
        expect(apiResponse.error).to.be.undefined;
        const userApiInfo = JSON.parse(apiResponse.stdout);
        
        const userCommandInfo = await runCommand<User>("user me");

        expect(userApiInfo).to.have.property("user").that.is.an("object");
        expect(userApiInfo.user).to.deep.equal(userCommandInfo.result);
    });

    it("should send a GET request with query parameters", async () => {
        const apiResponse = await runCommand(`api --method GET --path itwins --query displayName:${iTwin.displayName}`);
        expect(apiResponse.error).to.be.undefined;
        const apiResponseJSON = JSON.parse(apiResponse.stdout);

        expect(apiResponseJSON).to.have.property("iTwins").that.is.an("array").with.lengthOf(1);
        expect(apiResponseJSON.iTwins[0]).to.have.property("displayName", iTwin.displayName);
        expect(apiResponseJSON.iTwins[0]).to.have.property("id", iTwin.id);
    });

    it("should send a POST request with body parameters", async () => {
        const user = await runCommand<User>("user me");
        const apiResponse = await runCommand(`api --method POST --path users/getbyidlist --body ["${user.result?.id}"]`);
        expect(apiResponse.error).to.be.undefined;
        const apiResponseJSON = JSON.parse(apiResponse.stdout);

        expect(apiResponseJSON).to.have.property("users").that.is.an("array").with.lengthOf(1);
        expect(apiResponseJSON.users[0]).to.have.property("id", user.result?.id);
        expect(apiResponseJSON.users[0]).to.have.property("email", user.result?.email);
    });

    it("should update an iTwin with a PATCH request", async () => {
        const updatedName = `itwin-cli-test-updated-${new Date().toISOString()}`;
        // eslint-disable-next-line no-useless-escape
        const apiResponse = await runCommand(`api --method PATCH --path itwins/${iTwin.id} --body "{\"displayName\": \"${updatedName}\"}"`);
        expect(apiResponse.error).to.be.undefined;
        const apiResponseJSON = JSON.parse(apiResponse.stdout);

        expect(apiResponseJSON).to.have.property("iTwin").that.is.an("object").and.not.undefined;
        expect(apiResponseJSON.iTwin).to.have.property("id", iTwin.id);
        expect(apiResponseJSON.iTwin).to.have.property("displayName", updatedName);
    });

    it("should send a DELETE request to delete the iTwin", async () => {
        const createdItwin = await createITwin(`cli-itwin-integration-test-${new Date().toISOString()}`, "Thing", "Asset");

        const {result: deleteResponse} = await runCommand(`api --method DELETE --path itwins/${createdItwin.id} --empty-response`);
        expect(deleteResponse).to.have.property("result").that.is.equal("success");
    });

    it('should send the header to the API (iModel minimal)', async () => {
        const minimalApiResponse = await runCommand(`api --method GET --path imodels/?iTwinId=${iTwin.id} --header "Prefer: return=minimal"`);
        expect(minimalApiResponse.error).to.be.undefined;
        const minimalApiResponseJSON = JSON.parse(minimalApiResponse.stdout);

        expect(minimalApiResponseJSON).to.have.property("iModels").that.is.an("array").with.lengthOf(1);
        expect(minimalApiResponseJSON.iModels[0]).to.have.property("id", iModel.id);
        expect(minimalApiResponseJSON.iModels[0]).to.have.property("displayName", iModel.displayName);
        expect(minimalApiResponseJSON.iModels[0]).to.not.have.property("createdDateTime");
        expect(minimalApiResponseJSON.iModels[0]).to.not.have.property("iTwinId");
    });

    it('should send the header to the API (iModel representation)', async () => {
        const minimalApiResponse = await runCommand(`api --method GET --path imodels/?iTwinId=${iTwin.id} --header "Prefer: return=representation"`);
        expect(minimalApiResponse.error).to.be.undefined;
        const minimalApiResponseJSON = JSON.parse(minimalApiResponse.stdout);

        expect(minimalApiResponseJSON).to.have.property("iModels").that.is.an("array").with.lengthOf(1);
        expect(minimalApiResponseJSON.iModels[0]).to.have.property("id", iModel.id);
        expect(minimalApiResponseJSON.iModels[0]).to.have.property("displayName", iModel.displayName);
        expect(minimalApiResponseJSON.iModels[0]).to.have.property("createdDateTime");
        expect(minimalApiResponseJSON.iModels[0]).to.have.property("iTwinId", iModel.iTwinId);
    });

    it('should handle version header correctly (Echo V1)', async () => {
        const apiResponse = await runCommand(`api --method GET --path echo/context --version-header application/vnd.bentley.itwin-platform.v1+json`);
        expect(apiResponse.error).to.be.undefined;
        const apiResponseJSON = JSON.parse(apiResponse.stdout);

        expect(apiResponseJSON).to.have.property("api").that.is.an("object").and.not.undefined;
        expect(apiResponseJSON.api).to.have.property("version").that.is.an("string").and.not.undefined;
        expect(apiResponseJSON.api.version).to.equal("v1");
    });

    it('should return an error if serialized JSON provided to `--body` flag is invalid', async () => {
        const apiResponse = await runCommand(`api --method PATCH --path itwins/${iTwin.id} --body not-a-serialized-json-string`);
        expect(apiResponse.error).is.not.undefined;
        expect(apiResponse.error?.message).to.match(/'not-a-serialized-json-string' is not valid serialized JSON./)
    });
});

export default tests;

runSuiteIfMainModule(import.meta, tests);