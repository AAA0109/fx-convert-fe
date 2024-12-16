import { Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { clientApiState, userState } from 'atoms';
import { AccountTwoFactorAuthVerification } from 'components/accountActivation';
import {
  PangeaActionCard,
  PangeaButton,
  PangeaSpinner,
} from 'components/shared';

import fs from 'fs';
import { isSafeUrlForRedirect, rules, safeWindow } from 'lib';
import { isError } from 'lodash';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import path from 'path';
import { useEffect, useState } from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

interface LoginInfoContext {
  username?: string;
  password?: string;
}
const LoginPage: NextPage = (props: LoginInfoContext) => {
  const refreshUser = useRecoilRefresher_UNSTABLE(userState);
  const clientApi = useRecoilValue(clientApiState);
  const [username, setUsername] = useState(props.username ?? '');
  const [password, setPassword] = useState(props.password ?? '');
  const [twoFactorNeeded, setTwoFactorNeeded] = useState(false);
  const [ephemeralToken, setEphemeralToken] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const clearError = () => {
    setHasError(false);
    setErrorMsg('');
    setButtonDisabled(false);
    setProcessing(false);
  };
  const handleUsername = useEventCallback((e: any) => {
    setUsername(e.target.value);
    clearError();
  });
  const handlePassword = useEventCallback((e: any) => {
    setPassword(e.target.value);
    clearError();
  });
  const attemptLogin = useEventCallback(async () => {
    setButtonDisabled(true);
    setProcessing(true);
    const loginResponse = await clientApi.logInWithPasswordAsync(
      username,
      password,
    );
    if (loginResponse.method === 'app' && loginResponse.ephemeral_token) {
      setEphemeralToken(loginResponse.ephemeral_token);
      setRedirectUrl(loginResponse.data.cta);
      setTwoFactorNeeded(true);
      setProcessing(false);
      setButtonDisabled(false);
      return;
    }
    if (!clientApi.tokenIsExpired()) {
      refreshUser();
      if (router.query.returnUrl) {
        const returnUrl = decodeURI(router.query.returnUrl.toString());
        if (isSafeUrlForRedirect(returnUrl)) {
          router.push(returnUrl);
          return;
        }
      }
      if (
        loginResponse.data?.cta &&
        isSafeUrlForRedirect(loginResponse.data.cta)
      ) {
        router.push(loginResponse.data.cta);
        return;
      }
      router.push(loginResponse.data.cta ?? '/');
    } else {
      const userExistsResponse = await clientApi
        .getUnauthenticatedApiHelper()
        .getUserExistsStatusAsync(username);

      if (isError(userExistsResponse)) {
        setErrorMsg('Error checking existence of user.');
        return;
      }
      if (userExistsResponse.exists && userExistsResponse.is_active == false) {
        safeWindow()?.setTimeout(
          () =>
            router.push(`/activation/create-account?verify_email=${username}`),
          500,
        );
        return;
      }
      setHasError(true);
      setErrorMsg('Invalid username or password.');
      setPassword('');
    }
    setProcessing(false);
  });
  const handleSubmit = useEventCallback(async (e: any) => {
    e.preventDefault();
    await attemptLogin();
  });

  useEffect(() => {
    if (props.username && props.password) {
      attemptLogin();
    }
  }, [props, attemptLogin]);
  return (
    <>
      <Head>
        <title>Pangea - Login</title>
      </Head>
      {!twoFactorNeeded ? (
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          direction='column'
          textAlign='center'
        >
          <PangeaActionCard>
            <Stack
              margin={4}
              spacing={3}
              direction='column'
              justifyContent='center'
              alignItems='center'
            >
              {!processing ? (
                <Image
                  alt='Pangea logo'
                  itemID='my pangea logo'
                  src={'/images/pangea-icon.svg'}
                  width={59}
                  height={59}
                />
              ) : (
                <PangeaSpinner size={59} />
              )}
              <Stack>
                <Typography marginBottom={1} variant='h5'>
                  Sign in to your account
                </Typography>

                <Typography
                  variant='body1'
                  color={PangeaColors.BlackSemiTransparent60}
                >
                  Welcome back! Please enter your details.
                </Typography>
              </Stack>
              <Paper
                component='form'
                elevation={0}
                onSubmit={handleSubmit}
                sx={{
                  backgroundColor: PangeaColors.White,
                  height: '100%',
                  width: '100%',
                }}
                data-testid='loginForm'
              >
                <Stack spacing={3} direction='column'>
                  {hasError ? (
                    <Typography color='error'>{errorMsg}</Typography>
                  ) : null}
                  <TextField
                    error={hasError}
                    name='Email'
                    label='Email'
                    type='email'
                    autoComplete='username'
                    value={username}
                    onChange={handleUsername}
                    disabled={processing}
                    fullWidth
                  />
                  <TextField
                    error={hasError}
                    name='Password'
                    label='Password'
                    type='password'
                    autoComplete='current-password'
                    value={password}
                    onChange={handlePassword}
                    disabled={processing}
                    fullWidth
                  />

                  <PangeaButton
                    fullWidth
                    size='large'
                    variant='contained'
                    color='primary'
                    type='submit'
                    data-testid='loginButton'
                    disabled={
                      buttonDisabled ||
                      !(password && username && Boolean(rules.email(username)))
                    }
                  >
                    Sign in
                  </PangeaButton>
                </Stack>
                <Stack direction={'row'} mt={3} justifyContent='center'>
                  <PangeaButton
                    href='/activation/create-account/'
                    color='primary'
                    variant='outlined'
                    sx={{ border: 'none', ':hover': { border: 'none' } }}
                  >
                    Create an account
                  </PangeaButton>
                  <PangeaButton
                    href='/forgot_password'
                    color='primary'
                    variant='outlined'
                    sx={{ border: 'none', ':hover': { border: 'none' } }}
                  >
                    Forgot password?
                  </PangeaButton>
                </Stack>
              </Paper>
            </Stack>
          </PangeaActionCard>
        </Grid>
      ) : (
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          direction='column'
          textAlign='center'
        >
          <AccountTwoFactorAuthVerification
            ephemeral_token={ephemeralToken}
            redirect_url={redirectUrl}
            twoFactorNeeded={twoFactorNeeded}
            setTwoFactorNeeded={setTwoFactorNeeded}
          />
        </Grid>
      )}
    </>
  );
};
export async function getServerSideProps() {
  const secretsFileName = path.join(process.cwd(), 'secrets.json');
  if (!fs.existsSync(secretsFileName)) {
    return { props: {} };
  }
  const fileContents = fs.readFileSync(secretsFileName, 'utf8');
  const secretsObj = JSON.parse(fileContents);
  return { props: { ...secretsObj.pangea } };
}
export default LoginPage;
