import { Alert, Stack, Typography } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { clientApiState, userState } from 'atoms';
import { PangeaButton, PangeaLoading } from 'components/shared';
import { ServerAuthHelper, isSafeUrlForRedirect } from 'lib';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';

export default function Auto() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isInvalid, setIsInValid] = useState(false);
  const clientApi = useRecoilValue(clientApiState);
  const refreshUser = useRecoilRefresher_UNSTABLE(userState);
  const attemptLogin = useEventCallback(async (token: string) => {
    setIsLoading(true);
    setIsInValid(false);
    const authHelper = new ServerAuthHelper();
    const tokenIsValid = await authHelper.verifyTokenAsync(token);
    if (tokenIsValid) {
      const loginResponse = await clientApi.logInWithCodeAsync(
        { access: token, refresh: '' },
        false,
        true,
      );
      if (!clientApi.tokenIsExpired()) {
        refreshUser();
        if (router.query.returnUrl) {
          const returnUrl = decodeURI(router.query.returnUrl.toString());
          if (isSafeUrlForRedirect(returnUrl)) {
            router.push(returnUrl);
            return;
          }
        }
      }

      if (
        loginResponse.data?.cta &&
        isSafeUrlForRedirect(loginResponse.data.cta)
      ) {
        router.push(loginResponse.data.cta);
        return;
      }
      router.push('/dashboard');
    }
  });

  useEffect(() => {
    const { token } = router.query;
    if (typeof token === 'string') {
      attemptLogin(token);
    } else {
      setIsInValid(true);
    }
  }, [attemptLogin, router, router.query]);

  return (
    <Stack
      sx={{ height: 'calc(100vh - 196px)' }}
      alignItems='center'
      justifyContent='center'
    >
      {isLoading && (
        <PangeaLoading
          centerPhrase
          loadingPhrase={`Logging in as client ...`}
        />
      )}
      {isInvalid && (
        <Stack alignItems='center' spacing={2}>
          <Alert severity='error'>
            <Typography>
              Invalid or expired credentials, try with a username and password
              or contact your administrator
            </Typography>
          </Alert>
          <PangeaButton href='/login'>Go to Login</PangeaButton>
        </Stack>
      )}
    </Stack>
  );
}
