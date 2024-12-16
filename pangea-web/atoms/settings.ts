import {
  ClientAuthHelper,
  PangeaCompanyJoinRequestStatusEnum,
  PangeaUser,
} from 'lib';
import { isError } from 'lodash';
import { selector } from 'recoil';

export const joinRequestsState = selector<
  {
    approver: PangeaUser | undefined;
    created: string;
    modified: string;
    status: PangeaCompanyJoinRequestStatusEnum;
    id: number;
    requestor: PangeaUser | undefined;
    company_id: number;
  }[]
>({
  key: 'joinRequests',
  get: async () => {
    const api = ClientAuthHelper.getInstance().getAuthenticatedApiHelper();
    const me = await api.loadUserAsync();
    if (!me || isError(me)) {
      return [];
    }
    const allCompanyContacts = await api.loadAllContactsAsync(me.company.id);
    if (!allCompanyContacts || isError(allCompanyContacts)) {
      return [];
    }
    const joinRequestsResponse = await api.getJoinRequestsAsync(me.company.id);
    if (isError(joinRequestsResponse)) {
      return [];
    }

    return joinRequestsResponse
      .filter((j) => j.status == PangeaCompanyJoinRequestStatusEnum.Pending)
      .map((j) => ({
        approver: allCompanyContacts.find((c) => c.id == j.approver),
        created: j.created,
        modified: j.modified,
        status: j.status,
        id: j.id,
        requestor: allCompanyContacts.find((c) => c.id == j.requester),
        company_id: me.company.id,
      }));
  },
});
