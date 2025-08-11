/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  AddedGroupMembersResponse,
  GroupMemberResponse,
  GroupMemberRoles,
  GroupMembersResponse,
} from "../../../../src/services/access-control/models/group-member";
import { OwnerMemberListResponse, OwnerMemberResponse } from "../../../../src/services/access-control/models/owner-member";
// prettier-ignore
import {
    AddedUserMembersResponse, UserMemberListResponse, UserMemberResponse, UserMemberRoles
} from "../../../../src/services/access-control/models/user-member";

export class AccessControlMembersResponses {
  public static ownerMemberResponse = {
    internal: (email: string): OwnerMemberResponse => {
      return {
        member: {
          id: "99cf5e21-735c-4598-99eb-fe3940f96353",
          email,
          givenName: "John",
          surname: "Owner",
          organization: "Organization Corp.",
        },
        invitation: null,
      };
    },
    external: (email: string): OwnerMemberResponse => {
      return {
        member: null,
        invitation: {
          createdDate: "1111-12-11T09:29:55.011Z" as unknown as Date,
          expirationDate: "2222-03-22T20:22:22.022Z" as unknown as Date,
          email,
          id: "99cf5e21-735c-4598-99eb-fe3940f96353",
          invitedByEmail: "inviter@example.com",
          roles: [
            {
              id: "4059e871-8397-4929-a569-dd6c42118ce8",
              description: "Owner role",
              displayName: "Owner",
              permissions: ["anything", "everything"],
            },
          ],
          status: "Pending",
        },
      };
    },
  };

  public static addedUserMembersResponse = {
    internal: (members: UserMemberRoles[]): AddedUserMembersResponse => {
      return {
        invitations: null,
        members: members.map((member) => {
          return {
            id: crypto.randomUUID(),
            email: member.email,
            givenName: "Test",
            surname: "Testy",
            organization: "Test organization",
            roles: member.roleIds.map((roleId) => {
              return {
                id: roleId,
                displayName: "Role name",
                description: "Role description",
              };
            }),
          };
        }),
      };
    },
    external: (members: UserMemberRoles[]): AddedUserMembersResponse => {
      return {
        invitations: members.map((member) => {
          return {
            id: crypto.randomUUID(),
            email: member.email,
            invitedByEmail: "inviter@example.com",
            status: "Pending",
            createdDate: "1111-12-11T09:29:55.011Z" as unknown as Date,
            expirationDate: "2222-03-22T20:22:22.022Z" as unknown as Date,
            roles: member.roleIds.map((roleId) => {
              return {
                id: roleId,
                displayName: "Role name",
                description: "Role description",
              };
            }),
          };
        }),
        members: null,
      };
    },
  };

  public static userMemberListResponse = (iTwinId: string): UserMemberListResponse => {
    return {
      members: [
        {
          id: "25407933-cad2-41a2-acf4-5a074c83046b",
          email: "Maria.Miller@example.com",
          givenName: "Maria",
          surname: "Miller",
          organization: "Organization Corp.",
          roles: [
            {
              id: "5abbfcef-0eab-472a-b5f5-5c5a43df34b1",
              displayName: "Read Access",
              description: "Read Access",
            },
          ],
        },
      ],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        self: {
          href: `https://api.bentley.com/iTwins/${iTwinId}/member?$skip=0&$top=100`,
        },
        prev: {
          href: `https://api.bentley.com/iTwins/${iTwinId}/member?$skip=0&$top=100`,
        },
        next: {
          href: `https://api.bentley.com/iTwins/${iTwinId}/member?$skip=100&$top=100`,
        },
      },
    };
  };

  public static userMemberResponse = (memberId: string, roleIds: string[]): UserMemberResponse => {
    return {
      member: {
        id: memberId,
        email: "Thomas.Wilson@example.com",
        givenName: "Thomas",
        surname: "Wilson",
        organization: "Organization Corp.",
        roles: roleIds.map((roleId) => {
          return {
            id: roleId,
            displayName: "Some role name",
          };
        }),
      },
    };
  };

  public static ownerMemberListResponse = (iTwinId: string): OwnerMemberListResponse => {
    return {
      members: [
        {
          id: "99cf5e21-735c-4598-99eb-fe3940f96353",
          email: "John.Owner@example.com",
          givenName: "John",
          surname: "Owner",
          organization: "Organization Corp.",
        },
        {
          id: "25407933-cad2-41a2-acf4-5a074c83046b",
          email: "Maria.Owner@example.com",
          givenName: "Maria",
          surname: "Owner",
          organization: "Organization Corp.",
        },
      ],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        self: {
          href: `https://api.bentley.com/iTwins/${iTwinId}/members/owners?$skip=0&$top=100`,
        },
        prev: {
          href: `https://api.bentley.com/iTwins/${iTwinId}/members/owners?$skip=0&$top=100`,
        },
        next: {
          href: `https://api.bentley.com/iTwins/${iTwinId}/members/owners?$skip=100&$top=100`,
        },
      },
    };
  };

  public static groupMemberResponse = (groupId: string, roleIds: string[]): GroupMemberResponse => {
    return {
      member: {
        id: groupId,
        groupName: "Sample Group",
        groupDescription: "This is a sample group",
        roles: roleIds.map((roleId) => {
          return {
            id: roleId,
            displayName: "Role Name",
            description: "Role Description",
          };
        }),
      },
    };
  };

  public static addedGroupMembersResponse = (groupMembers: GroupMemberRoles[]): AddedGroupMembersResponse => {
    return {
      members: groupMembers.map((groupMember) => {
        return {
          id: groupMember.groupId,
          groupName: "Sample Group",
          groupDescription: "This is a sample group",
          roles: groupMember.roleIds.map((roleId) => {
            return {
              id: roleId,
              displayName: "Role Name",
              description: "Role Description",
            };
          }),
        };
      }),
    };
  };

  public static groupMembersResponse = (groupIds: string[]): GroupMembersResponse => {
    return {
      members: groupIds.map((groupId) => {
        return {
          id: groupId,
          groupName: "Sample Group",
          groupDescription: "This is a sample group",
          roles: [
            {
              id: "5abbfcef-0eab-472a-b5f5-5c5a43df34b1",
              displayName: "Read Access",
              description: "Read Access",
            },
            {
              id: "6abbfcea-0eab-472a-b5f5-5c5a43df34b4",
              displayName: "Write Access",
              description: "Write Access",
            },
          ],
        };
      }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _links: {
        self: {
          href: "https://api.bentley.com/iTwins/806b19d5-c037-48a4-aa98-e297c81453f1/member/groups?$skip=0&$top=100",
        },
        prev: {
          href: "https://api.bentley.com/iTwins/806b19d5-c037-48a4-aa98-e297c81453f1/member/groups?$skip=0&$top=100",
        },
        next: {
          href: "https://api.bentley.com/iTwins/806b19d5-c037-48a4-aa98-e297c81453f1/member/groups?$skip=100&$top=100",
        },
      },
    };
  };
}
