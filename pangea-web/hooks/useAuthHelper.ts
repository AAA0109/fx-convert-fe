import {
  clientApiState,
  isLoggedInState,
  userState,
  userStatusState,
} from 'atoms';
import { UserState, UserStateType } from 'lib';
import { useEffect, useMemo, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';

export const useAuthHelper = () => {
  const authHelper = useRecoilValue(clientApiState);
  const refreshUser = useRecoilRefresher_UNSTABLE(userState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const userStatusLoadable = useRecoilValueLoadable(userStatusState);
  const [canTrade, setCanTrade] = useState<Optional<boolean>>();
  const [userStatus, setUserStatus] = useState<Optional<UserStateType>>();
  useEffect(() => {
    if (userStatusLoadable.state == 'hasValue') {
      setUserStatus(userStatusLoadable.getValue());
      setCanTrade(
        [
          UserState.Active,
          UserState.NoCashflows,
          UserState.NoCashflowsOrDrafts,
          UserState.NoPerfData,
          UserState.CorpayOnlyAccount,
        ].includes(userStatusLoadable.getValue().state),
      );
    }
  }, [userStatusLoadable, setCanTrade, setUserStatus]);
  const authenticatedApiHelper = useMemo(
    () =>
      isLoggedIn
        ? authHelper.getAuthenticatedApiHelper()
        : authHelper.getUnauthenticatedApiHelper(),
    [authHelper, isLoggedIn],
  );
  const unAuthenticatedApiHelper = useMemo(
    () => authHelper.getUnauthenticatedApiHelper(),
    [authHelper],
  );
  return useMemo(() => {
    return {
      authHelper,
      apiHelper: authenticatedApiHelper,
      anonymousApiHelper: unAuthenticatedApiHelper,
      isLoggedIn,
      refreshUser,
      canTrade,
      userStatus,
    };
  }, [
    refreshUser,
    authHelper,
    authenticatedApiHelper,
    unAuthenticatedApiHelper,
    isLoggedIn,
    canTrade,
    userStatus,
  ]);
};
