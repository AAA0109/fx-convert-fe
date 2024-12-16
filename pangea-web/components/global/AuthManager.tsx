import { clientApiState, isLoggedInState, userState } from 'atoms';
import { isSafeUrlForRedirect, safeWindow } from 'lib';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

// Protected routes (routes requiring authentication) should be added to this list
// it is a RegExp that is compared to the value of router.asPath (the path after
// the host name in the URL, e.g. '/create/cashflow-details-onetime?cashflow_id=1').
const protectedRoutes: RegExp[] = [
  /^\/create[\d]?\/.*/,
  /^\/cashflow($|(\/.*))/,
  /^\/manage($|(\/.*))/,
  /^\/account($|(\/.*))/,
  /^\/dashboard($|(\/.*))/,
  /^\/wallets($|(\/.*))/,
  /^\/transactions($|(\/.*))/,
  /^\/bulk($|(\/.*))/,
  /^\/payments($|(\/.*))/,
  /* To exclude an additional route besides 'create-account', use the following format: ^\/activation($|((\/(?!(create-account|bar))).*)) */
  /^\/activation($|(\/(?!(create-account|verify-email))).*)/,
];

export const AuthManager = memo(function AuthManager() {
  const [calledRouterPush, setCalledRouterPush] = useState(false);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const refreshUser = useRecoilRefresher_UNSTABLE(userState);
  const authHelper = useRecoilValue(clientApiState);
  const router = useRouter();
  const componentIsMounted = useRef(false);
  const redirectUri = '/login';
  const doRedirect = useCallback(() => {
    if (
      router &&
      redirectUri &&
      isSafeUrlForRedirect(redirectUri) &&
      componentIsMounted.current
    ) {
      const returnUrl = safeWindow()?.location.href.substring(
        safeWindow()?.location.href.indexOf('/', 10) ?? -1,
      );
      const redirectingTo =
        redirectUri +
        `${
          returnUrl && returnUrl != '/login' && isSafeUrlForRedirect(returnUrl)
            ? '?returnUrl=' + encodeURI(returnUrl)
            : ''
        }`;
      if (calledRouterPush) {
        return;
      }
      safeWindow()?.setTimeout(
        (url: string) => {
          router.push(url);
        },
        300,
        redirectingTo,
      );
      setCalledRouterPush(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  const onLoggedInHandler = useCallback(
    (loggedIn?: boolean) => {
      const isLoggedIn = Boolean(loggedIn).valueOf();
      setIsLoggedIn(isLoggedIn);
      if (!isLoggedIn) {
        doRedirect();
      }
    },
    [setIsLoggedIn, doRedirect],
  );
  useEffect(() => {
    componentIsMounted.current = true;
    return () => {
      componentIsMounted.current = false;
    };
  }, []);
  useEffect(() => {
    authHelper.onLoggedIn.subscribe(onLoggedInHandler);
    return () => {
      authHelper.onLoggedIn.unsubscribe(onLoggedInHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isProtectedRoute = protectedRoutes.reduce(
      (prev, current) => prev || current.test(router.asPath),
      false,
    );
    if (!isProtectedRoute || !router.isReady) {
      return;
    }
    const tokenWasExpired = authHelper.tokenIsExpired();
    (tokenWasExpired ? authHelper.refreshTokenAsync() : Promise.resolve()).then(
      () => {
        const loggedInNow = !authHelper.tokenIsExpired();
        setIsLoggedIn(loggedInNow);
        if (loggedInNow) {
          if (tokenWasExpired) {
            refreshUser();
          }
          return;
        }
        doRedirect();
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return null;
});
export default AuthManager;
