import { Lock } from '@mui/icons-material';
import SmsIcon from '@mui/icons-material/Sms';
import { Box, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import useEventCallback from '@mui/utils/useEventCallback';
import { clientApiState, userState } from 'atoms';
import { CircledIcon } from 'components/icons';
import { PangeaMFAJWTAccessRefreshResponse, isSafeUrlForRedirect } from 'lib';
import { isError } from 'lodash';
import { useRouter } from 'next/router';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { IconBorder } from '../icons/IconBorder';
import { PangeaButton } from '../shared';
interface AccountTwoFactorAuthVerificationProps {
  ephemeral_token: string;
  redirect_url: string;
  twoFactorNeeded: boolean;
  setTwoFactorNeeded: Dispatch<SetStateAction<boolean>>;
}

export const AccountTwoFactorAuthVerification = (
  props: AccountTwoFactorAuthVerificationProps,
) => {
  const router = useRouter();
  const authHelper = useRecoilValue(clientApiState);
  const [authCode, setAuthCode] = useState('');
  const [signinAnotherWay, setSigninAnotherWay] = useState(false);
  const [noBackupcode, setNoBackupcode] = useState(false);
  const refreshUser = useRecoilRefresher_UNSTABLE(userState);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleAuthCodeUpdate = useEventCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAuthCode(e.currentTarget.value.substring(0, 6));
      setHasError(false);
      setErrorMsg('');
    },
  );

  const handleButtonClick = useEventCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setProcessing(true);
      const api = authHelper.getUnauthenticatedApiHelper();
      const response = await api.authLoginCodeCreateAsync(
        {
          ephemeral_token: props.ephemeral_token,
          code: authCode,
        },
        {},
      );
      if (!isError(response) && response.access != '') {
        attemptLogin(response);
      } else {
        setHasError(true);
        setErrorMsg('Invalid or expired code.');
      }
      setProcessing(false);
    },
  );

  const handleBackupCodeChange = useEventCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAuthCode(e.currentTarget.value.substring(0, 12));
      setHasError(false);
      setErrorMsg('');
    },
  );

  const attemptLogin = useEventCallback(
    async (response: PangeaMFAJWTAccessRefreshResponse) => {
      const loginResponse = await authHelper.logInWithCodeAsync(response);
      if (!authHelper.tokenIsExpired()) {
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
        router.push('/');
      } else {
        setHasError(true);
        setErrorMsg('Invalid username or password.');
      }
      setProcessing(false);
    },
  );

  return signinAnotherWay ? (
    <Box
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius='4px'
      sx={{ backgroundColor: PangeaColors.White }}
      justifyContent='center'
      mt={6}
      px={3}
      py={4}
      mx='auto'
      width='380px'
      textAlign='center'
    >
      {noBackupcode ? (
        <Stack>
          <Typography component='h1' variant='h4' my={4}>
            Contact support
          </Typography>
          <Typography
            mb={1}
            variant='body1'
            color={PangeaColors.BlackSemiTransparent60}
          >
            Email
          </Typography>
          <Typography
            mb={1}
            variant='body1'
            color={PangeaColors.BlackSemiTransparent60}
          >
            support@pangea.io
          </Typography>
          <Typography
            mb={1}
            variant='body1'
            color={PangeaColors.BlackSemiTransparent60}
          >
            phone
          </Typography>
          <Typography
            mb={1}
            variant='body1'
            color={PangeaColors.BlackSemiTransparent60}
          >
            510-224-4655
          </Typography>
          <PangeaButton
            fullWidth
            onClick={() => props.setTwoFactorNeeded(!props.twoFactorNeeded)}
          >
            Back to sign in
          </PangeaButton>
        </Stack>
      ) : (
        <>
          <IconBorder>
            <SmsIcon
              sx={{ color: PangeaColors.SolidSlateMedium }}
              fontSize='large'
            />
          </IconBorder>
          <Typography component='h1' variant='h4' my={4}>
            Enter backup key
          </Typography>
          <Typography
            mb={1}
            variant='body1'
            color={PangeaColors.BlackSemiTransparent60}
          >
            Enter your backup key to disable Two-Step Authentication. Your
            backup key is the 12 character code you received when you activated
            two-step authentication.
          </Typography>
          <Stack
            spacing={2}
            direction='column'
            alignContent='center'
            justifyContent='center'
            textAlign='center'
          >
            <PangeaButton
              size='small'
              variant='text'
              disableElevation
              sx={{ minWidth: 0, minHeight: 0, m: 0, p: 0, ml: 1, pt: 0.4 }}
              onClick={() => {
                setSigninAnotherWay(false);
              }}
            >
              Back to Two-Step Authentication
            </PangeaButton>
            {hasError ? (
              <Typography color='error'>{errorMsg}</Typography>
            ) : null}
            <TextField
              label='Backup code'
              size='medium'
              InputProps={{
                sx: {
                  'input::-webkit-outer-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0,
                  },
                  'input::-webkit-inner-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0,
                  },
                  input: {
                    MozAppearance: 'textfield',
                  },
                },
              }}
              sx={{
                marginTop: 2,
                paddingBottom: 2,
              }}
              value={authCode}
              onChange={handleBackupCodeChange}
              fullWidth
            />
            <PangeaButton
              fullWidth
              variant='contained'
              onClick={handleButtonClick}
              size='large'
              disabled={authCode.length < 6}
              loading={processing}
            >
              Continue
            </PangeaButton>
            <PangeaButton
              fullWidth
              variant='text'
              onClick={() => setNoBackupcode(true)}
            >
              I don&apos;t have a backup code
            </PangeaButton>
          </Stack>
        </>
      )}
    </Box>
  ) : (
    <Box
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius='4px'
      sx={{ backgroundColor: PangeaColors.White }}
      justifyContent='center'
      mt={6}
      px={3}
      py={4}
      mx='auto'
      width='380px'
      textAlign='center'
    >
      <CircledIcon
        icon={
          <Lock
            sx={{
              height: '32px',
              width: '32px',
              color: `${PangeaColors.SolidSlateMedium}`,
            }}
          />
        }
        iconBorderColor={PangeaColors.SolidSlateLighter}
      />
      <Typography component='h1' variant='h4' my={3}>
        Two-Step Authentication
      </Typography>
      <Typography
        mb={3}
        variant='body1'
        color={PangeaColors.BlackSemiTransparent60}
      >
        To continue, please enter the 6-digit verification code generated by
        your authenticator app.
      </Typography>
      <Stack spacing={2}>
        {hasError ? <Typography color='error'>{errorMsg}</Typography> : null}
        <TextField
          label='6-digit code'
          size='medium'
          type='number'
          inputMode='numeric'
          error={hasError}
          InputProps={{
            sx: {
              'input::-webkit-outer-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
              },
              'input::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
              },
              input: {
                MozAppearance: 'textfield',
              },
            },
          }}
          sx={{
            marginTop: 2,
          }}
          value={authCode}
          onChange={handleAuthCodeUpdate}
          fullWidth
        />
        <PangeaButton
          fullWidth
          variant='contained'
          onClick={handleButtonClick}
          size='large'
          disabled={authCode.length < 6}
          loading={processing}
        >
          Continue
        </PangeaButton>
        <PangeaButton
          fullWidth
          variant='text'
          onClick={() => setSigninAnotherWay(true)}
          size='large'
        >
          Sign in another way
        </PangeaButton>
      </Stack>
    </Box>
  );
};
export default AccountTwoFactorAuthVerification;
