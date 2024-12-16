import axios from 'axios';
import { startOfDay } from 'date-fns';
import {
  ClientAuthHelper,
  PangeaAccount,
  PangeaAlert,
  PangeaBrokerCorpayFxBalanceHistoryListParams,
  PangeaCompany,
  PangeaCurrency,
  PangeaDraftFxForward,
  PangeaFXBalanceAccountsResponseItem,
  PangeaFxPair,
  PangeaFxSpot,
  PangeaGroup,
  PangeaMFAActiveUserMethod,
  PangeaPaginatedFXBalanceAccountHistoryRowList,
  PangeaUser,
  UserState,
  UserStateType,
  apiHelper,
} from 'lib';
import { isError, isUndefined } from 'lodash';
import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { currentForwardHedgeItem, localStorageEffect } from './';

/**
 * @brief
 * The currency list
 * @see {@link PangeaCurrency}
 */
export const currencyListState = selector<PangeaCurrency[]>({
  key: 'currencyList',
  get: async ({ get }) => {
    const isLoggedIn = get(isLoggedInState);
    const companyId = get(userCompanyState)?.id;
    const currenciesResponse =
      isLoggedIn && !isUndefined(companyId)
        ? await get(clientApiState)
            .getAuthenticatedApiHelper()
            .getCompanyCurrenciesAsync(companyId)
        : await apiHelper().getCurrenciesAsync();
    if (!isError(currenciesResponse)) {
      return currenciesResponse;
    } else {
      return [];
    }
  },
});

/**
 * @brief
 * The fxpairs from API
 * @see {@link PangeaFxPair}
 */
export const fxPairsState = selector<PangeaFxPair[]>({
  key: 'fxPairs',
  get: async () => await apiHelper().loadFxPairsAsync(),
});

/**
 * @brief
 * The FxPair information for the given pair id.
 * @see {@link PangeaFxPair}
 */
export const fxPairState = selectorFamily<PangeaFxPair, number>({
  key: 'fxPair',
  get:
    (fxPairId) =>
    ({ get }) => {
      const fxPairs = get(fxPairsState);
      return fxPairs?.find((p) => p.id === fxPairId) as PangeaFxPair;
    },
});

const eodRateLoaderState = selectorFamily<PangeaFxSpot[], Date>({
  key: 'eodRateLoader',
  get:
    (asOfDate) =>
    async ({ get }) => {
      const fxPairs = get(fxPairsState);
      return await apiHelper().loadMarketDataAsync(fxPairs, asOfDate);
    },
});

/**
 * @brief
 * The EOD rates for the given dates.
 * @see {@link PangeaFxSpotEod}
 */
export const latestEodRatesForFxPairsState = atomFamily<PangeaFxSpot[], Date>({
  key: 'latestEodRatesForFxPairs',
  default: eodRateLoaderState(startOfDay(new Date())),
  effects: (asOfDate) => [
    ({ onSet, setSelf, trigger, getPromise }) => {
      if (trigger === 'get') {
        getPromise(eodRateLoaderState(asOfDate)).then((r) => setSelf(r));
      }
      onSet((_newValue, _oldValue, isReset) => {
        if (isReset) {
          getPromise(eodRateLoaderState(asOfDate)).then((r) => setSelf(r));
        }
      });
    },
  ],
});

// /**
//  * @brief
//  * The user.
//  * @see {@link PangeaUser}
//  */
// export const userState = atom<Nullable<PangeaUser>>({
//   key: 'user',
//   default: null,
// });

export const userState = selector<Nullable<PangeaUser>>({
  key: 'user',
  get: async ({ get }) => {
    const loggedIn = get(isLoggedInState);
    if (!loggedIn) {
      return null;
    }
    const cancelTokenSource = axios.CancelToken.source();
    try {
      const user = await ClientAuthHelper.getInstance()
        .getAuthenticatedApiHelper()
        .loadUserAsync(cancelTokenSource.token);
      if (isError(user)) {
        return null;
      }
      return user;
    } catch {
      return null;
    }
  },
});

export const allAccountsState = selector<PangeaAccount[]>({
  key: 'allAccounts',
  get: async ({ get }) => {
    get(userState); // Throw away
    const loggedIn = get(isLoggedInState);
    if (!loggedIn) {
      return [];
    }
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const accountsResp = await api.loadAllAccountsAsync();
    if (isError(accountsResp)) {
      return [];
    }
    return accountsResp;
  },
});

export const userAccountByIdState = selectorFamily<
  Optional<PangeaAccount>,
  number
>({
  key: 'userAccountById',
  get:
    (accountId: number) =>
    ({ get }) => {
      const userAccounts = get(allAccountsState);
      return userAccounts.find((a) => a.id === accountId);
    },
});

/**
 * @brief
 * The user's company selected from the user.
 * @see {@link userState}
 * @see {@link PangeaCompany}
 */
export const userCompanyState = selector<Nullable<PangeaCompany>>({
  key: 'userCompany',
  get: async ({ get }) => {
    const user = get(userState);
    if (!user) {
      return null;
    }

    return user.company;
  },
});

export const clientApiState = selector<ClientAuthHelper>({
  key: 'clientApi',
  get: () => ClientAuthHelper.getInstance(),
  dangerouslyAllowMutability: true,
});

export const isLoggedInState = atom<boolean>({
  key: 'isLoggedIn',
  default: false,
});

export const pangeaAlertNotificationMessageState = atom<Nullable<PangeaAlert>>({
  key: 'pangeaAlertNotificationMessage',
  default: null,
});

export const pangeaTwoFactorAuthBackupCodes = atom<string[]>({
  key: 'pangeaTwoFactorAuthBackupCodes',
  default: [],
});

export const pangeaTwoFactorAuthSecret = atom<string>({
  key: 'pangeaTwoFactorAuthSecret',
  default: '',
});

export const userTwoFactorAuthMethods = atom<PangeaMFAActiveUserMethod[]>({
  key: 'userTwoFactorAuthMethods',
  default: [],
});

export const openSimpleDialogState = atom<boolean>({
  key: 'openSimpleDialogState',
  default: false,
});

export const dialogDontShowState = atomFamily<boolean, string>({
  key: 'dialogDontShow',
  default: false,
  effects: (dialogKey) => [localStorageEffect(dialogKey)],
});

export const userStatusState = selector<UserStateType>({
  key: 'userStatus',
  get: async ({ get }) => {
    const DEFAULT_RESPONSE = {
      state: UserState.Unknown,
      data: { cta: '/login' },
    } as UserStateType;
    const isLoggedIn = get(isLoggedInState);
    if (!isLoggedIn) {
      return DEFAULT_RESPONSE;
    }

    const authHelper = get(clientApiState);
    const response = await authHelper.getUserStatusAsync();
    if (isError(response)) {
      return DEFAULT_RESPONSE;
    }
    return response;
  },
});

export const userAccountGroupsState = selector<Nullable<PangeaGroup[]>>({
  key: 'userAccountGroups',
  get: ({ get }) => {
    const user = get(userState);
    if (!user) return null;
    return user.groups;
  },
});

export const userAccountPermissionsState = selector<Nullable<string[]>>({
  key: 'userAccountPermissions',
  get: ({ get }) => {
    const user = get(userState);
    if (!user) return null;
    return user.groups.flatMap((group) =>
      group.permissions.map((permission) => permission.codename),
    );
  },
});

export const selectedWalletDetailedActivity =
  atom<PangeaFXBalanceAccountsResponseItem | null>({
    key: 'selectedWalletDetailedActivity',
    default: null,
  });

export const hideDashboardState = atom<boolean>({
  key: 'hideDashboardState',
  default: false,
});

export const walletActivityDataState = selectorFamily<
  Nullable<PangeaPaginatedFXBalanceAccountHistoryRowList>,
  {
    fx_balance_id?: string;
    include_details: boolean;
  }
>({
  key: 'walletActivityData',
  get:
    (payload) =>
    async ({ get }) => {
      const api = get(clientApiState).getAuthenticatedApiHelper();

      const walletData = await api.getWalletDetailsAsync(
        payload as PangeaBrokerCorpayFxBalanceHistoryListParams,
      );
      if (isError(walletData)) {
        return null;
      }
      return walletData;
    },
});

interface settlementDefaultDetailsState extends PangeaDraftFxForward {
  cash_settle_account: string;
  origin_account: string;
  destination_account: string;
  funding_account: string;
  purpose_of_payment: string;
}
const settlementDefaultDetailsSelector =
  selector<settlementDefaultDetailsState>({
    key: 'settlementDefaultDetailsDefault',
    get: ({ get }) => {
      const currentForwardHedge = get(currentForwardHedgeItem);

      return {
        cash_settle_account: '',
        origin_account: '',
        destination_account: '',
        funding_account: '',
        purpose_of_payment: '',
        ...currentForwardHedge,
      } as settlementDefaultDetailsState;
    },
  });
export const editSettlementDetailsState = atom<settlementDefaultDetailsState>({
  key: 'editSettlementDetails',
  default: settlementDefaultDetailsSelector,
});

export const settlementDetailsState = selector<settlementDefaultDetailsState>({
  key: 'settlementDetails',
  get: ({ get }) => {
    const details = get(editSettlementDetailsState);
    return details as settlementDefaultDetailsState;
  },
  set: ({ set }, newValue) => {
    set(editSettlementDetailsState, {
      ...newValue,
    } as settlementDefaultDetailsState);
  },
});
