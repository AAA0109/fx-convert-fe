import { PangeaCompanyContactOrder, PangeaUser } from 'lib';
import { atom, selectorFamily } from 'recoil';
import { clientApiState } from './';

export const accountContactsState = selectorFamily<
  Nullable<PangeaUser[]>,
  Optional<number>
>({
  key: 'AccountContactsState',
  get:
    (companyId) =>
    async ({ get }) => {
      if (!companyId) {
        return null;
      }
      const api = get(clientApiState);
      const apiHelper = api.getAuthenticatedApiHelper();
      return (await apiHelper.loadAllContactsAsync(companyId)) as PangeaUser[];
    },
});

export const accountContactOrderState = selectorFamily<
  Nullable<PangeaCompanyContactOrder[]>,
  Optional<number>
>({
  key: 'AccountContactOrderState',
  get:
    (companyId) =>
    async ({ get }) => {
      if ((companyId ?? 0) <= 0) {
        return [];
      }
      get(contactOrdersRequestState);
      try {
        const argObj = {
          companyPk: companyId ?? -1,
        };
        const api = get(clientApiState);
        const apiHelper = api.getAuthenticatedApiHelper();
        return (await apiHelper.loadAllCompanyContactOrdersAsync(
          argObj,
        )) as PangeaCompanyContactOrder[];
      } catch (e) {
        console.error('getting contact order error', e);
        return [];
      }
    },
});

export const contactOrdersRequestState = atom<number>({
  key: 'ContactOrdersRequestState',
  default: Number(new Date()),
});
