import nock from "nock";

import { ITP_API_URL } from "../environment";

export class AccessControlApiStubber {
  public static removeiTwinOwnerMember = {
    success: (iTwinId: string, memberId: string): void => {
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/owners/${memberId}`).reply(204);
    },
    iTwinNotFound: (iTwinId: string, memberId: string): void => {
      nock(ITP_API_URL)
        .delete(`/accesscontrol/itwins/${iTwinId}/members/owners/${memberId}`)
        .reply(404, {
          error: {
            code: "ItwinNotFound",
            message: "Requested iTwin is not available.",
          },
        });
    },
    memberNotFound: (iTwinId: string, memberId: string): void => {
      nock(ITP_API_URL)
        .delete(`/accesscontrol/itwins/${iTwinId}/members/owners/${memberId}`)
        .reply(404, {
          error: {
            code: "TeamMemberNotFound",
            message: "Requested team member is not available.",
          },
        });
    },
  };

  public static removeiTwinUserMember = {
    success: (iTwinId: string, memberId: string): void => {
      nock(ITP_API_URL).delete(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`).reply(204);
    },
    iTwinNotFound: (iTwinId: string, memberId: string): void => {
      nock(ITP_API_URL)
        .delete(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`)
        .reply(404, {
          error: {
            code: "ItwinNotFound",
            message: "Requested iTwin is not available.",
          },
        });
    },
    memberNotFound: (iTwinId: string, memberId: string): void => {
      nock(ITP_API_URL)
        .delete(`/accesscontrol/itwins/${iTwinId}/members/users/${memberId}`)
        .reply(404, {
          error: {
            code: "TeamMemberNotFound",
            message: "Requested team member is not available.",
          },
        });
    },
  };
}
