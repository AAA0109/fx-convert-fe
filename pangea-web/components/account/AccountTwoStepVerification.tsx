import { SettingsCell } from '@mui/icons-material';
import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  clientApiState,
  pangeaAlertNotificationMessageState,
  userTwoFactorAuthMethods,
} from 'atoms';
import { PangeaMFAActiveUserMethod } from 'lib';
import { isError } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from '../../styles/colors';
import {
  AddGoogleAuthDialog,
  BackupAuthCodes,
  RegisterPangeaAuthStep,
  VerifyGoogleAuthOtcStep,
} from '../modals';

export const AccountTwoStepVerification = () => {
  const [processing, setProcessing] = useState(false);
  const setErrorMsg = useSetRecoilState(pangeaAlertNotificationMessageState);
  const [authCode, setAuthCode] = useState<string>('');
  const handleOtcChange = useEventCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAuthCode(e.currentTarget.value.substring(0, 6));
    },
  );

  const stepsLabels = [
    {
      label: 'Register Pangea',
      component: <RegisterPangeaAuthStep />,
    },
    {
      label: 'Verify',
      component: (
        <VerifyGoogleAuthOtcStep
          authCode={authCode}
          handleOtcChange={handleOtcChange}
          deactivate={false}
        />
      ),
    },
    {
      label: 'Backup',
      component: <BackupAuthCodes />,
    },
  ];

  const deactivationStepsLabels = [
    {
      label: 'Deactivation',
      component: (
        <VerifyGoogleAuthOtcStep
          authCode={authCode}
          handleOtcChange={handleOtcChange}
          deactivate={true}
        />
      ),
    },
  ];

  const setUserTwoFactorAuthMethods = useSetRecoilState(
    userTwoFactorAuthMethods,
  );

  const userTwoFactorAuthMethodsValue = useRecoilValue(
    userTwoFactorAuthMethods,
  );

  const isMFAMethodApp = userTwoFactorAuthMethodsValue.find(
    (e: PangeaMFAActiveUserMethod) => e.name === 'app',
  );

  const authHelper = useRecoilValue(clientApiState);
  const api = authHelper.getAuthenticatedApiHelper();

  useEffect(() => {
    setProcessing(true);
    api.getUserAuthActiveMethodsAsync().then((res) => {
      if (res && !isError(res)) {
        setUserTwoFactorAuthMethods(res);
        setProcessing(false);
      } else if (res && isError(res)) {
        setErrorMsg({
          severity: 'error',
          text: 'Error getting user two factor auth methods.',
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack justifyContent={'space-around'} spacing={3}>
      <Typography variant='h5'>Two-Step Authentication</Typography>
      <Stack>
        <Typography variant='body1'>Add a verification method</Typography>
        {!processing ? (
          <Box
            sx={{
              width: '526px',
              marginLeft: 0,
              borderWidth: '1px',
              borderColor: PangeaColors.Gray,
              borderStyle: 'solid',
              padding: 1.3125,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <Stack
                  direction={'row'}
                  justifyItems={'space-between'}
                  alignItems={'center'}
                  spacing={1}
                  sx={{ width: '500px', height: '63px' }}
                >
                  <SettingsCell />
                  <Box>
                    <Typography variant={'body1'}>Authenticator App</Typography>
                    <Typography
                      variant={'body2'}
                      color={PangeaColors.SolidSlateLight}
                    >
                      Using Google Authenticator App
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <AddGoogleAuthDialog
                  stepsLabels={
                    isMFAMethodApp ? deactivationStepsLabels : stepsLabels
                  }
                  modalButtonText={isMFAMethodApp ? 'manage' : 'set up'}
                  title='Two-Step Authentication'
                  authCode={authCode}
                  setAuthCode={setAuthCode}
                  deactivate={isMFAMethodApp ? true : false}
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Skeleton height={100} />
        )}
      </Stack>
    </Stack>
  );
};
export default AccountTwoStepVerification;
