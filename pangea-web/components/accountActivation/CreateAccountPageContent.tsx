import {
  Box,
  Button,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import axios, { AxiosError } from 'axios';
import { PangeaButton } from 'components/shared';
import { PangeaTimezoneEnum, PangeaUserCreation, rules } from 'lib';
import { isError } from 'lodash';
import Head from 'next/head';
import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { PangeaColors } from 'styles';
import { SetNewPasswordForm } from '../account/SetNewPasswordForm';
import { useLoading } from 'hooks';
import { useAuthHelper } from 'hooks/useAuthHelper';
import { ClientAuthHelper } from 'lib';
import { useRouter } from 'next/router';
import React from 'react';
import { SuccessStateForCreateAccount } from './SuccessStateForCreateAccount';
import { pangeaAlertNotificationMessageState } from 'atoms';
import { useSetRecoilState } from 'recoil';

export const CreateAccountPageContent = () => {
  const router = useRouter();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [validForm, setValidForm] = useState<boolean>(false);
  const {
    loadingPromise: promiseVerifyToken,
    loadingState: loadingVerifyToken,
  } = useLoading();
  const { anonymousApiHelper } = useAuthHelper();
  const [successState, setSuccessState] = useState<boolean>(false);
  const { invitation_token, verify_email } = router.query;
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const [newUserProfile, setNewUserProfile] = useState<PangeaUserCreation>({
    first_name: '',
    last_name: '',
    email: verify_email?.toString() ?? '',
    timezone: Intl.DateTimeFormat().resolvedOptions()
      .timeZone as PangeaTimezoneEnum,
    password: '',
    confirm_password: '',
  });
  const [formValidation, setFormValidation] = useState<{
    first_name: boolean;
    last_name: boolean;
    email: boolean;
    password: boolean;
    confirm_password: boolean;
  }>({
    first_name: true,
    last_name: true,
    email: true,
    password: true,
    confirm_password: true,
  });
  const [errorMessageState, setErrorMessageState] = useState({
    first_name: [],
    last_name: [],
    email: [],
    password: [],
  });

  const createUserData = useCallback(async () => {
    try {
      if (invitation_token) {
        const acceptInviteResponse =
          await anonymousApiHelper.inviteConfirmAsync({
            firstName: newUserProfile.first_name,
            lastName: newUserProfile.last_name,
            password: newUserProfile.password,
            confirm_password: newUserProfile.confirm_password,
            invitation_token: invitation_token.toString(),
          });
        if (!isError(acceptInviteResponse)) {
          await ClientAuthHelper.getInstance().logInWithPasswordAsync(
            newUserProfile.email.trim(),
            newUserProfile.password,
          );
          const api =
            ClientAuthHelper.getInstance().getAuthenticatedApiHelper();

          let me = await api.loadUserAsync();
          if (!me || isError(me)) {
            return;
          }
          me = await api.updatePartialUserAsync(
            {
              first_name: newUserProfile.first_name?.trim() ?? '',
              last_name: newUserProfile.last_name?.trim() ?? '',
            },
            me.id,
          );
          if (isError(me)) {
            setErrorMessageState({
              first_name: (me as AxiosError<any>).response?.data?.first_name,
              last_name: (me as AxiosError<any>).response?.data?.last_name,
              email: [],
              password: [],
            });
            return;
          }
          return;
        }
      }
      const createUserResponse = await anonymousApiHelper.createUserAsync({
        ...newUserProfile,
        first_name: newUserProfile.first_name?.trim(),
        last_name: newUserProfile.last_name?.trim(),
        email: newUserProfile.email.trim(),
      } as PangeaUserCreation);
      if (createUserResponse && !isError(createUserResponse)) {
        setSuccessState(true);
      } else if (axios.isAxiosError(createUserResponse)) {
        const axiosError = createUserResponse as AxiosError<any>;

        // if anything comes back with an error, store it in the errorMessageState
        setErrorMessageState({
          password: axiosError?.response?.data?.password,
          email: axiosError?.response?.data?.email,
          first_name: axiosError?.response?.data?.first_name,
          last_name: axiosError?.response?.data?.last_name,
          // phone: axiosError?.response?.data?.phone,
        });
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitation_token, newUserProfile]);

  const handleNewPassword = (newPw: string) => {
    setNewUserProfile({
      ...newUserProfile,
      password: newPw,
      confirm_password: newPw,
    });
  };

  const handleChange = useEventCallback((e: ChangeEvent<HTMLInputElement>) => {
    handleProfileUpdate(e);
    handleFormValidation(e);
  });

  // validation for everything other than confirm_password
  const handleFormValidation = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const name = event.target.name;
      setFormValidation({
        ...formValidation,
        [name]: rules[name](value),
      });
    },
  );

  const handleProfileUpdate = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUnsavedChanges(true);
      setErrorMessageState({
        ...errorMessageState,
        [event.target.name]: [],
      });
      setNewUserProfile({
        ...newUserProfile,
        [event.target.name]: event.target.value,
      });
    },
  );

  useEffect(() => {
    // if every value in the formValidation object is true (so everything is valid and true) AND there is a value in every input box the form is valid
    setValidForm(
      Object.values(formValidation).every((value) => value) &&
        Object.values(newUserProfile).every((value) => value != ''),
    );
  }, [setValidForm, formValidation, newUserProfile]);

  useEffect(() => {
    if (invitation_token) {
      const verifyInvitationToken = async () => {
        const response = await anonymousApiHelper.inviteVerifyTokenAsync({
          invitation_token: invitation_token.toString(),
        });
        if (response && !isError(response)) {
          setNewUserProfile({
            ...newUserProfile,
            email: response.email,
          });
        } else {
          setPangeaAlertNotificationMessage({
            text: 'The invitation token is invalid or has expired',
            severity: 'error',
            timeout: 5000,
          });
        }
      };
      promiseVerifyToken(verifyInvitationToken());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitation_token]);

  // on submit there are no unsaved changes and
  const handleSubmit = () => {
    setUnsavedChanges(false);
    createUserData();
  };

  return (
    <React.Fragment>
      <Head>
        <title>Pangea - Create Account</title>
      </Head>
      {!successState && !verify_email ? (
        <Grid
          py={5}
          border={`1px solid ${PangeaColors.Gray}`}
          borderRadius='4px'
          sx={{ backgroundColor: PangeaColors.White }}
          container
          justifyContent={'center'}
          mx={'auto'}
          mt={6}
          maxWidth={'420px'}
        >
          <Box
            component='form'
            minWidth={'370px'}
            sx={{
              '& .MuiFormHelperText-root': {
                color: PangeaColors.RiskBerryMedium,
              },
            }}
          >
            <Stack spacing={3} marginBottom={3} alignItems='center' mx={2}>
              <Image
                src={'/images/pangea-icon.svg'}
                width={45}
                height={45}
                alt='Pangea icon'
              />
              <Typography variant='h5' marginTop={5}>
                {invitation_token ? 'Setup Account' : 'Create an account'}
              </Typography>
              <Typography
                variant='body1'
                color={PangeaColors.BlackSemiTransparent60}
                textAlign='center'
              >
                {invitation_token
                  ? 'We just need to collect a little information to get you started.'
                  : 'Start your hedging journey today.'}
              </Typography>
              <PangeaButton
                variant='outlined'
                sx={{ padding: '0px' }}
                loading={loadingVerifyToken.isLoading}
                onClick={() => false}
              >
                {newUserProfile.email ? newUserProfile.email : '...'}&nbsp;
              </PangeaButton>
            </Stack>
            <Stack marginBottom={3} spacing={3} mx={2}>
              <Stack
                direction={'row'}
                columnGap={2}
                justifyContent='space-between'
              >
                <Stack flex={1}>
                  <TextField
                    error={!formValidation.first_name}
                    name='first_name'
                    label='First Name'
                    value={newUserProfile.first_name}
                    onChange={handleChange}
                    autoComplete={'given-name'}
                  />
                  {!formValidation.first_name ? (
                    <FormHelperText
                      color={PangeaColors.BlackSemiTransparent60}
                      id='first-name-helper-text'
                    >
                      Please enter your name
                    </FormHelperText>
                  ) : null}
                  {errorMessageState.first_name?.map((item, i) => {
                    return <FormHelperText key={i}>{item}</FormHelperText>;
                  })}
                </Stack>
                <Stack flex={1}>
                  <TextField
                    error={!formValidation.last_name}
                    name='last_name'
                    label='Last Name'
                    value={newUserProfile.last_name}
                    onChange={handleChange}
                    autoComplete={'family-name'}
                  />
                  {!formValidation.last_name ? (
                    <FormHelperText
                      color={PangeaColors.BlackSemiTransparent60}
                      id='last_name-helper-text'
                    >
                      Please enter your last name
                    </FormHelperText>
                  ) : null}
                  {errorMessageState.last_name?.map((item, i) => {
                    return <FormHelperText key={i}>{item}</FormHelperText>;
                  })}
                </Stack>
              </Stack>

              <SetNewPasswordForm
                apiErrorMessage={errorMessageState.password}
                onNewPasswordSet={handleNewPassword}
                new_password={newUserProfile.password}
                old_password={''}
              />

              <Button
                variant='contained'
                color='primary'
                onClick={handleSubmit}
                disabled={!validForm || !unsavedChanges}
                size='large'
              >
                Get started
              </Button>
              <Box
                marginTop={3}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Typography
                  variant='body2'
                  color={PangeaColors.BlackSemiTransparent60}
                  component='span'
                  marginRight={1}
                >
                  Already have an account?
                </Typography>
                <PangeaButton
                  sx={{ minWidth: 'auto', padding: '0px' }}
                  variant='text'
                  href='/login'
                >
                  Sign in
                </PangeaButton>
              </Box>
            </Stack>
          </Box>
        </Grid>
      ) : (
        <SuccessStateForCreateAccount email={newUserProfile.email} />
      )}
    </React.Fragment>
  );
};
export default CreateAccountPageContent;
