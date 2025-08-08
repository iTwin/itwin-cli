/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ErrorResponse } from "../../../../src/services/general-models/error-response";

export class AccessControlErrors {
  public static iTwinNotFound: ErrorResponse = {
    error: {
      code: "ItwinNotFound",
      message: "Requested iTwin is not available.",
    },
  };

  public static teamMemberNotFound: ErrorResponse = {
    error: {
      code: "TeamMemberNotFound",
      message: "Requested team member is not available.",
    },
  };

  public static ownerAlreadyExists: ErrorResponse = {
    error: {
      code: "OwnerAlreadyExists",
      message: "Requested user is already an iTwin Owner.",
      target: "email",
    },
  };

  public static roleNotFound: ErrorResponse = {
    error: {
      code: "RoleNotFound",
      message: "Requested Role is not available.",
      target: "members[0].roleIds[0]",
    },
  };

  public static groupNotFound: ErrorResponse = {
    error: {
      code: "GroupNotFound",
      message: "Requested group is not available.",
    },
  };

  public static imsGroupNotFound: ErrorResponse = {
    error: {
      code: "ImsGroupNotFound",
      message: "Requested IMS group is not available.",
      target: "imsGroups[0]",
    },
  };

  public static permissionNotFound: ErrorResponse = {
    error: {
      code: "PermissionNotFound",
      message: "Requested permission is not available.",
      target: "permissions[0]",
    },
  };
}
