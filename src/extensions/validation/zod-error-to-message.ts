/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ZodError, ZodIssue } from "zod";

const zodErrorToMessage = (error: ZodError): string => {
  let message = "Following issues were found during schema validation:\n";
  for (const issue of error.issues) {
    message += zodIssueToErrorMessage(issue);
  }

  return message;
};

const zodIssueToErrorMessage = (issue: ZodIssue): string => {
  const path = joinPath(issue.path);
  switch (issue.code) {
    case "invalid_type": {
      return issue.received === "undefined"
        ? `\t- missing required property '${path}' of type '${issue.expected}'\n`
        : `\t- ${path}: expected type '${issue.expected}', received '${issue.received}'\n`;
    }

    case "invalid_string": {
      return `\t- ${path} is not a valid ${issue.validation as string}\n`;
    }

    default: {
      return `\t- ${path}: value is not valid\n`;
    }
  }
};

const joinPath = (path: (number | string)[]): string => {
  let builtPath = "";
  for (const token of path) {
    if (typeof token === "number") {
      builtPath = builtPath.slice(0, -1);
    }

    builtPath += typeof token === "number" || /^\d+$/.test(token) ? `[${token}].` : `${token}.`;
  }

  return builtPath.slice(0, -1);
};

export default zodErrorToMessage;
