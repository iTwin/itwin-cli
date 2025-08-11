/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { GroupMember, GroupResponse, GroupsResponse } from "../../../../src/services/access-control/models/group.js";
import { RoleResponse, RolesResponse } from "../../../../src/services/access-control/models/role.js";

export class AccessControlResponses {
  public static groupResponse = (groupId: string, name: string, description: string, members: GroupMember[] = [], imsGroups: string[] = []): GroupResponse => {
    return {
      group: {
        id: groupId,
        name,
        description,
        members,
        imsGroups,
      },
    };
  };

  public static groupsResponse = (groupIds: string[]): GroupsResponse => {
    return {
      groups: groupIds.map((groupId) => {
        return {
          id: groupId,
          name: "Sample Group",
          description: "This is a group for a sample",
          members: [
            {
              userId: crypto.randomUUID(),
              email: "Thomas.Wilson@example.com",
              givenName: "Thomas",
              surname: "Wilson",
              organization: "Organization Corp.",
            },
          ],
          imsGroups: ["Sample IMS Group"],
        };
      }),
    };
  };

  public static roleResponse = (roleId: string, name: string, description: string): RoleResponse => {
    return {
      role: {
        id: roleId,
        displayName: name,
        description,
      },
    };
  };

  public static rolesResponse = (roleIds: string[]): RolesResponse => {
    return {
      roles: roleIds.map((roleId) => {
        return {
          id: roleId,
          displayName: "Role name",
          description: "Role description",
          permissions: ["read", "write", "execute"],
        };
      }),
    };
  };
}
