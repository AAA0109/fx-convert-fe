import Key from '@mui/icons-material/Key';
import { Box, Grid, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { IconBorder } from 'components/icons';
import {
  PangeaActionCard,
  PangeaButton,
  PangeaErrorFormHelperText,
  PangeaInputHidden,
} from 'components/shared';

import { apiHelper } from 'lib';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { PangeaColors } from 'styles';

const SetNewPassword = () => {
  const [newPasswordState, setNewPasswordState] = useState({
    newPassword: '',
    confirmPassword: '',
    isValid: false,
  });
  const [errorState, setErrorState] = useState('');

  const { isValid, newPassword, confirmPassword } = newPasswordState;
  const router = useRouter();

  const handleNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPasswordState({
      ...newPasswordState,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    setNewPasswordState({
      ...newPasswordState,
      isValid: newPassword === confirmPassword && newPassword.length > 7,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPassword, confirmPassword]);

  const sendNewPassword = async () => {
    const { token } = router.query;
    if (isValid) {
      const response = await apiHelper().resetPasswordAsync(
        newPassword,
        `${token}`,
      );
      if (axios.isAxiosError(response)) {
        // if it is a 400 type message in the response message OR in the status from the response, do the following error message
        if (
          response.message.includes('status code 4') ||
          response?.response?.status.toString().startsWith('4')
        ) {
          setErrorState(
            'There was a problem resetting your password. Please try the process again.',
          );
          // if a custom error message is provided, show it
        } else {
          if (response?.response?.data) {
            setErrorState((response.response.data as any).password.join(' '));
          }
        }
      } else {
        router.push('/password_reset_success');
      }
    }
  };

  return (
    <>
      <Head>
        <title>Set New Password</title>
      </Head>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        direction='column'
        textAlign='center'
      >
        <PangeaActionCard width={'416px'}>
          <Stack
            component='form'
            margin={4}
            spacing={4}
            direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <IconBorder>
              <Key sx={{ height: '32px', width: '32px' }} />
            </IconBorder>

            <Stack direction='column' spacing={1}>
              <Typography mt={2} variant='h5'>
                Set new password
              </Typography>

              <Typography
                variant='body1'
                color={PangeaColors.BlackSemiTransparent60}
              >
                Your new password must be different from previously used
                passwords.
              </Typography>
            </Stack>

            <PangeaInputHidden
              helperText={
                newPassword.length > 7
                  ? ''
                  : 'Password must be at least 8 characters long'
              }
              label='New Password'
              name='newPassword'
              autoComplete='new-password'
              fullWidth
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleNewPassword(e);
              }}
            />

            <PangeaInputHidden
              label='Confirm New Password'
              name='confirmPassword'
              autoComplete='new-password'
              fullWidth
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleNewPassword(e);
              }}
            />

            <Box mt={3}>
              <PangeaErrorFormHelperText
                text={errorState}
                visible={errorState.length > 0}
              />
            </Box>
            <PangeaButton
              disabled={!isValid}
              fullWidth
              size='large'
              sx={{ borderRadius: '10' }}
              onClick={sendNewPassword}
            >
              Update password
            </PangeaButton>
          </Stack>
        </PangeaActionCard>
      </Grid>
    </>
  );
};

export default SetNewPassword;
