import {
  ApiHelper,
  ClientAuthHelper,
  PangeaUser,
  ServerAuthHelper,
  UserState,
  UserStateType,
} from 'lib';
import { isError } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next/types';

const getUserStateAsync = async (
  api: ApiHelper,
): Promise<{ state: UserState; user?: PangeaUser }> => {
  const user = await api.loadUserAsync();
  if (!user || isError(user)) {
    return { user: undefined, state: UserState.Unknown };
  }

  const isAccountOwner = user.id === user.company?.account_owner;

  if (!user.is_active) {
    return { user, state: UserState.NoAccount };
  }

  if (!user.phone_confirmed) {
    return { user, state: UserState.NeedPhone };
  }

  if (!user.company || user.company.id <= 0) {
    return { user, state: UserState.NeedCompany };
  }

  // If corPay only configuration don't continue to check for cashflow
  if (user.company.settings.corpay.wallet && !user.company.settings.ibkr.spot) {
    return { user, state: UserState.CorpayOnlyAccount };
  }

  if (!user.company.onboarded) {
    if (
      !user.company.ibkr_application ||
      user.company.ibkr_application.length == 0
    ) {
      return {
        user,
        state: isAccountOwner
          ? UserState.NeedIbApplication
          : UserState.CompanyOnboardingIncomplete,
      };
    }

    if (
      isAccountOwner &&
      (!user.company.settings.ibkr.spot ||
        (await (async function () {
          const registrationTasksResponse = await api.getRegistrationTasksAsync(
            {
              broker_account_id: user.company.ibkr_application[0].account,
            },
          );
          if (
            isError(registrationTasksResponse) ||
            !registrationTasksResponse.registrationTasks
          ) {
            return false;
          }
          const remainingTasks =
            registrationTasksResponse.registrationTasks.filter(
              (t) => !t.isComplete,
            );
          return remainingTasks.length >= 1;
        })()))
    ) {
      return { user, state: UserState.HaveIbTasks };
    } else if (!isAccountOwner && !user.company.settings.ibkr.spot) {
      return { user, state: UserState.CompanyOnboardingIncomplete };
    }
  }
  if (!user.company.settings.payment.stripe) {
    return {
      user,
      state: isAccountOwner
        ? UserState.NeedStripe
        : UserState.CompanyOnboardingIncomplete,
    };
  }

  // if( /*? No idea what condition would go here ?*/ ){
  //   return UserState.NeedMeeting;
  // }

  const cashflowsOrDrafts = await Promise.all([
    api.loadAllCashflowsAsync(1),
    api.loadAllDraftsAsync(1),
  ]);
  const cashflow = cashflowsOrDrafts[0];
  const draft = cashflowsOrDrafts[1];
  if ((!cashflow || cashflow.length == 0) && (!draft || draft.length == 0)) {
    return { user, state: UserState.NoCashflowsOrDrafts };
  }

  if (!cashflow || cashflow.length == 0) {
    return { user, state: UserState.NoCashflows };
  }

  // TODO: Optimize and uncomment this when we resume
  // having the Performance Tab visible on the dashboard

  // const perfData: Error | IAccountPerfData =
  //   await api.getPerformanceDataAsync();
  // if (isError(perfData)) {
  //   throw perfData;
  // }
  // if (
  //   !perfData ||
  //   (perfData[-1]?.hedgedData?.length ?? 0) < 2 ||
  //   perfData[-1].hedgedData.every((v) => v.amount == 0)
  // ) {
  //   return { user, state: UserState.NoPerfData };
  // }

  return { user, state: UserState.Active };
};
const ctaMap: Pick<UserStateType, 'state' | 'data'>[] = [
  {
    state: UserState.NoAccount,
    data: { cta: '/activation/create-account' },
  },
  {
    state: UserState.NotActive,
    data: { cta: '/activation/create-account?verify_email={{USER_EMAIL}}' },
  },
  { state: UserState.NeedPhone, data: { cta: '/activation/verify-mobile' } },
  {
    state: UserState.NeedCompany,
    data: { cta: '/activation/successful-verification' },
  },
  {
    state: UserState.NeedIbApplication,
    data: { cta: '/activation/details/company-details' },
  },
  {
    state: UserState.HaveIbTasks,
    data: { cta: '/activation/finalization/interactive-broker-application' },
  },
  {
    state: UserState.NeedStripe,
    data: { cta: '/activation/finishing-up/fee-payment-method' },
  },
  {
    state: UserState.NeedMeeting,
    data: { cta: '/activation/finishing-up/schedule-a-meeting' },
  },
  {
    state: UserState.NoCashflowsOrDrafts,
    data: { cta: '/dashboard/transactions' },
  },
  { state: UserState.NoCashflows, data: { cta: '/dashboard/transactions' } },
  {
    state: UserState.CorpayOnlyAccount,
    data: { cta: '/dashboard/transactions' },
  },
  { state: UserState.NoPerfData, data: { cta: '/dashboard/transactions' } },
  { state: UserState.Active, data: { cta: '/dashboard/transactions' } },
  { state: UserState.Unknown, data: { cta: '/login' } },
  {
    state: UserState.CompanyOnboardingIncomplete,
    data: { cta: '/activation/company-onboarding-incomplete' },
  },
];

export const getUserStatusWithCtaAsync = async (
  api: ApiHelper,
): Promise<UserStateType> => {
  const userstatus = await getUserStateAsync(api);
  const res = {
    ...userstatus,
    data: ctaMap.find((c) => c.state == userstatus.state)?.data ?? undefined,
    isAccountOwner:
      0 ==
      (userstatus?.user?.id ?? NaN) -
        (userstatus?.user?.company?.account_owner ?? NaN),
  } as UserStateType;
  if (res.data?.cta) {
    res.data.cta = res.data.cta.replace(
      '{{USER_EMAIL}}',
      userstatus.user?.email ?? '',
    );
  }

  return res;
};

export const getUserStateHandlerAsync = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  // Get authorization header
  const accessToken = req.headers['authorization']?.split(' ')[1];
  if (!accessToken) {
    return res.status(403).send('A token is required for authentication');
  }
  // verify token
  //console.log(accessToken);
  const authHelper = new ServerAuthHelper();
  const tokenIsValid = await authHelper.verifyTokenAsync(accessToken);
  if (!tokenIsValid) {
    return res.status(401.3).send('unauthorized');
  }

  const api = ClientAuthHelper.getInstance().getAuthenticatedApiHelper({
    access: accessToken,
    refresh: 'not used',
  });
  const userState = await getUserStatusWithCtaAsync(api);
  return res.status(200).send(userState);
};

export default getUserStateHandlerAsync;
