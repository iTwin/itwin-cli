/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import * as dotenv from "dotenv";
import { GetInboxRequest, GetMessageRequest, MailinatorClient } from "mailinator-client";
import fs from "node:fs";
import os from "node:os";
import { inflate } from "pako";

import { IModel } from "@itwin/imodels-client-management";
import { ITwin } from "@itwin/itwins-client";
import { getTestAccessToken, TestBrowserAuthorizationClientConfiguration, TestUserCredentials } from "@itwin/oidc-signin-tool";
import { runCommand } from "@oclif/test";

import { AuthTokenInfo } from "../../src/services/authorization-client/auth-token-info.js";
import { AuthorizationType } from "../../src/services/authorization-client/authorization-type.js";
import { ResultResponse } from "../../src/services/general-models/result-response.js";
import { FileTyped } from "../../src/services/storage-client/models/file-typed.js";
import { FileUpload } from "../../src/services/storage-client/models/file-upload.js";
import { FolderTyped } from "../../src/services/storage-client/models/folder-typed.js";
import { ItemsWithFolderLink } from "../../src/services/storage-client/models/items-with-folder-link.js";
import { ITP_ISSUER_URL, ITP_MAILINATOR_API_KEY, ITP_NATIVE_TEST_CLIENT_ID, ITP_TEST_USER_EMAIL, ITP_TEST_USER_PASSWORD } from "./environment.js";

export async function serviceLoginToCli(): Promise<void> {
  const result = await runCommand("auth login");
  expect(result.stdout).to.contain("User successfully logged in using Service login");
}

export async function createFile(folderId: string, displayName: string, filePath: string, description?: string): Promise<FileTyped> {
  // 1. Create meta data
  const { result: createdFile } = await runCommand<FileUpload>(
    `storage file create --folder-id ${folderId} --name "${displayName}" --description "${description}"`,
  );

  expect(createdFile).to.have.property("_links");
  expect(createdFile!._links).to.have.property("completeUrl");
  expect(createdFile!._links).to.have.property("uploadUrl");
  const uploadUrl = createdFile!._links!.uploadUrl!.href;

  // extract file id from completeUrl that looks like this: "https://api.bentley.com/storage/files/TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI/complete"
  const completeUrl = createdFile!._links!.completeUrl!.href;
  const fileId = completeUrl!.split("/").at(-2);

  // 2. Upload file
  const { result: uploadedFile } = await runCommand<ResultResponse>(`storage file upload --upload-url "${uploadUrl}" --file-path ${filePath}`);

  expect(uploadedFile).to.have.property("result", "uploaded");

  // 3. Confirm upload complete
  const { result: completedFile } = await runCommand<FileTyped>(`storage file update-complete --file-id ${fileId}`);

  expect(completedFile).to.not.be.undefined;
  expect(completedFile).to.have.property("id", fileId);

  return completedFile as FileTyped;
}

export async function createFolder(parentFolderId: string, displayName: string, description?: string): Promise<FolderTyped> {
  const { result: createdFolder } = await runCommand<FolderTyped>(
    `storage folder create --parent-folder-id ${parentFolderId} --name "${displayName}" --description "${description}"`,
  );

  expect(createdFolder).to.not.be.undefined;
  expect(createdFolder!.type).to.be.equal("folder");
  expect(createdFolder!.displayName).to.be.equal(displayName);
  expect(createdFolder!.parentFolderId).to.be.equal(parentFolderId);
  return createdFolder as FolderTyped;
}

export async function createITwin(displayName: string, classType: string, subClassType: string): Promise<ITwin> {
  const { result: createdITwin } = await runCommand<ITwin>(`itwin create --name "${displayName}" --class ${classType} --sub-class ${subClassType}`);

  expect(createdITwin).to.not.be.undefined;
  expect(createdITwin).to.have.property("id");
  return createdITwin as ITwin;
}

export async function createIModel(name: string, iTwinId: string): Promise<IModel> {
  const { result: createdIModel } = await runCommand<IModel>(`imodel create --itwin-id ${iTwinId} --name "${name}"`);

  expect(createdIModel).to.not.be.undefined;
  expect(createdIModel).to.have.property("id");
  return createdIModel as IModel;
}

export async function deleteFile(fileId: string): Promise<void> {
  const { result: deleteResult } = await runCommand<ResultResponse>(`storage file delete --file-id ${fileId}`);
  expect(deleteResult).to.have.property("result", "deleted");
}

export async function deleteFolder(folderId: string): Promise<void> {
  const { result: deleteResult } = await runCommand<ResultResponse>(`storage folder delete --folder-id ${folderId}`);
  expect(deleteResult).to.have.property("result", "deleted");
}

export async function deleteITwin(id: string): Promise<void> {
  const { result: deleteResult } = await runCommand<ResultResponse>(`itwin delete --itwin-id ${id}`);
  expect(deleteResult).to.have.property("result", "deleted");
}

export async function deleteIModel(id: string): Promise<void> {
  const { result: deleteResult } = await runCommand<ResultResponse>(`imodel delete --imodel-id ${id}`);
  expect(deleteResult).to.have.property("result", "deleted");
}

export async function getRootFolderId(iTwinId: string): Promise<string> {
  const { result: topFolders } = await runCommand<ItemsWithFolderLink>(`storage root-folder --itwin-id ${iTwinId}`);
  const rootFolderId = topFolders?._links?.folder?.href?.split("/").pop();
  expect(rootFolderId).to.not.be.undefined;
  return rootFolderId as string;
}

/**
 * Fetches emails from the specified inbox and then finds and returns the invitation link for iTwinName iTwin.
 * NOTE: This function only works for email addresses, that are accessible using the Mailinator API.
 * @param inbox Inbox to fetch the invitation email from.
 * @param iTwinName Name of the iTwin.
 * @returns Invitation link for joining the iTwin.
 */
export async function fetchEmailsAndGetInvitationLink(inbox: string, iTwinName: string): Promise<string> {
  await new Promise<void>((resolve) => {
    setTimeout((_) => resolve(), 45 * 1000);
  });

  expect(ITP_MAILINATOR_API_KEY).to.not.be.undefined;

  const client = new MailinatorClient(ITP_MAILINATOR_API_KEY);
  const inboxResponse = await client.request(new GetInboxRequest("private", inbox, undefined, 10));
  expect(inboxResponse.result).to.not.be.null;

  for (const message of inboxResponse.result!.msgs) {
    if (message.subject !== "You have been invited to collaborate") continue;

    const messageResponse = await client.request(new GetMessageRequest("private", message.id));
    expect(messageResponse.result).to.not.be.null;
    const messageBody = messageResponse.result!.parts[0].body;
    if (!messageBody.includes(iTwinName)) continue;

    const invitationTokenRegex = /href=".*?invitationToken.*?"/;
    const matches = messageBody.match(invitationTokenRegex);
    expect(matches).to.not.be.null;
    expect(matches).to.have.lengthOf(1);
    return matches![0].slice('href="'.length, -1);
  }

  throw new Error("Email was not found in inbox.");
}

export async function nativeLoginToCli(): Promise<void> {
  if (isNativeAuthAccessTokenCached()) return;

  const authTokenObject = {
    clientId: ITP_NATIVE_TEST_CLIENT_ID,
    authToken: await getNativeAuthAccessToken(),
    authenticationType: "Interactive",
    expirationDate: new Date(Date.now() + 1000 * 60 * 59),
  };

  fs.writeFileSync(getTokenPathByOS(), JSON.stringify(authTokenObject), "utf8");
}

export async function logoutFromCLI(): Promise<void> {
  const result = await runCommand("auth logout");
  expect(result.stdout).to.contain("User successfully logged out");
}

const getNativeAuthAccessToken = async (): Promise<string> => {
  dotenv.config({ path: ".env" });
  expect(ITP_NATIVE_TEST_CLIENT_ID, "ITP_NATIVE_TEST_CLIENT_ID").to.not.be.undefined;
  expect(ITP_ISSUER_URL, "ITP_ISSUER_URL").to.not.be.undefined;
  const config: TestBrowserAuthorizationClientConfiguration = {
    authority: ITP_ISSUER_URL,
    clientId: ITP_NATIVE_TEST_CLIENT_ID!,
    redirectUri: "http://localhost:3301/signin-callback",
    scope: "itwin-platform",
  };

  expect(ITP_TEST_USER_EMAIL, "ITP_TEST_USER_EMAIL").to.not.be.undefined;
  expect(ITP_TEST_USER_PASSWORD, "ITP_TEST_USER_PASSWORD").to.not.be.undefined;
  const user: TestUserCredentials = {
    email: ITP_TEST_USER_EMAIL!,
    password: ITP_TEST_USER_PASSWORD!,
  };

  const accessToken = await getTestAccessToken(config, user);
  expect(accessToken, "Access token").to.not.be.undefined;
  return accessToken!;
};

export const isNativeAuthAccessTokenCached = (): boolean => {
  const tokenPath = getTokenPathByOS();
  if (fs.existsSync(tokenPath)) {
    const tokenJson = fs.readFileSync(tokenPath, "utf8");
    const tokenObj: AuthTokenInfo = JSON.parse(tokenJson);
    if (tokenObj.authenticationType === AuthorizationType.Interactive && new Date(tokenObj.expirationDate).getTime() > Date.now()) return true;
    fs.rmSync(tokenPath);
  }

  return false;
};

export const getTokenPathByOS = (): string => {
  switch (os.type()) {
    case "Linux": {
      const cachePath = `${os.homedir()}/.cache/itp`;
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
      return `${cachePath}/token.json`;
    }

    case "Windows_NT": {
      return `${process.env.LOCALAPPDATA}/itp/token.json`;
    }

    default: {
      throw new Error("Unknown OS");
    }
  }
};

export const decodeCompressedBase64 = (base64String: string): string => {
  const buffer = Buffer.from(base64String, "base64");
  return inflate(buffer, { raw: true, to: "string" });
};
