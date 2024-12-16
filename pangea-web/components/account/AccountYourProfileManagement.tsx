import { VerifyMobileAccountManagement } from 'components/account';
import { MuiTelInput } from 'mui-tel-input';
import { parseBoolean } from 'lib';
import { Box, FormHelperText, Grid, Skeleton, TextField } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  clientApiState,
  pangeaAlertNotificationMessageState,
  userState,
} from 'atoms';
import axios, { AxiosError } from 'axios';
import { PangeaButton, PangeaTimezoneSelector } from 'components/shared';
import { useLoading } from 'hooks/useLoading';
import { PangeaTimezoneEnum, PangeaUserUpdate, rules } from 'lib';
import { isEqual, isError } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import Dialog from '@mui/material/Dialog';
import styled from '@mui/system/styled';

const CustomDialog = styled(Dialog)(() => ({
  '.MuiPaper-root': {
    bgcolor: PangeaColors.StoryWhiteMedium,
  },
  '& .MuiDialog-paper': {
    width: '480px',
    height: 'fit-content',
    maxWidth: '100%',
    backgroundColor: PangeaColors.StoryWhiteMedium,
    paddingBottom: '50px',
  },
}));

export const AccountYourProfileManagement = () => {
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [validForm, setValidForm] = useState<boolean>(false);
  const authHelper = useRecoilValue(clientApiState);
  const user = useRecoilValue(userState);
  const refreshUser = useRecoilRefresher_UNSTABLE(userState);
  const { loadingState, loadingPromise } = useLoading();
  const [newYourProfileData, setNewYourProfileData] =
    useState<Nullable<PangeaUserUpdate>>();

  const [modalData, setModalData] = useState({
    isOpen: false,
  });

  const handlePhoneUpdate = (value: string) => {
    if (!newYourProfileData) {
      return;
    }

    setUnsavedChanges(true);

    setNewYourProfileData({
      ...newYourProfileData,
      phone: value,
    });
  };

  const toggleModalOpen = () => {
    setModalData({
      ...modalData,
      isOpen: !modalData.isOpen.valueOf(),
    });
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    setNewYourProfileData({
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      phone: user?.phone,
      timezone:
        user?.timezone ??
        (Intl.DateTimeFormat().resolvedOptions()
          .timeZone as PangeaTimezoneEnum),
    } as PangeaUserUpdate);

    // we only want this useEffect to run one time when userState is loaded to the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [errorMessageState, setErrorMessageState] = useState({
    email: [],
    phone: [],
    first_name: [],
    last_name: [],
  });

  const [formValidation, setFormValidation] = useState({
    first_name: true,
    last_name: true,
    phone: true,
    email: true,
  });

  useEffect(() => {
    // check if there is any difference between yourProfileReceivedData and newYourProfileData
    // if there are no changes in the values, then setUnsavedData(false);
    if (!user || !newYourProfileData) {
      return;
    }

    // because yourProfileReceivedData and newYourProfileData are not identical due to some extra arrays in yourProfileReceivedData...
    // ... we have to drill down into the values we are actually trying to compare

    if (
      isEqual(user.email, newYourProfileData.email) &&
      isEqual(user.phone, newYourProfileData.phone) &&
      isEqual(user.first_name, newYourProfileData.first_name) &&
      isEqual(user.last_name, newYourProfileData.last_name) &&
      isEqual(user.timezone, newYourProfileData.timezone)
    ) {
      return setUnsavedChanges(false);
    }
  }, [user, newYourProfileData]);

  const handleInputUpdate = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!newYourProfileData) {
        return;
      }

      if (!event.target) {
        return;
      }

      const value = event.target.value;
      const name = event.target.name;

      setFormValidation({
        ...formValidation,
        [name]: rules[name](value),
      });

      setUnsavedChanges(true);

      setErrorMessageState({
        ...errorMessageState,
        [event.target.name]: [],
      });

      setNewYourProfileData({
        ...newYourProfileData,
        [event.target.name]: event.target.value,
      });
    },
  );

  useEffect(() => {
    if (!newYourProfileData) {
      return;
    }

    setValidForm(
      Object.values(formValidation).every((value) => value === true) &&
        Object.values(newYourProfileData).every(
          (value) => value != '' && value != undefined,
        ),
    );
  }, [setValidForm, formValidation, newYourProfileData]);

  const handleSaveChanges = async () => {
    if (user?.id) {
      const cleanedNewPhone = newYourProfileData?.phone?.replace(/[^\d+]/g, '');

      if (cleanedNewPhone !== user.phone) {
        await handleConfirmNumber();
      }

      await loadingPromise(updateUser());
    }
  };

  const handleConfirmNumber = async () => {
    const cleanedNewPhone = newYourProfileData?.phone?.replace(/[^\d+]/g, '');

    const api = authHelper.getAuthenticatedApiHelper();
    const response = await api.sendOtcToPhoneAsync(cleanedNewPhone ?? '');

    if (isError(response) || !parseBoolean(response.status)) {
      setPangeaAlertNotificationMessage({
        text: 'Failed to send one-time code. Please try again.',
        severity: 'error',
      });

      return;
    }

    setModalData({
      isOpen: true,
    });
  };

  const updateUser = async () => {
    if (user?.id) {
      if (!newYourProfileData) {
        return;
      }

      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.updateUserAsync(newYourProfileData, user.id);

        if (res && !isError(res)) {
          refreshUser();
          setUnsavedChanges(false);
          setPangeaAlertNotificationMessage({
            text: 'You have saved your changes successfully!',
            severity: 'success',
          });
        }

        if (axios.isAxiosError(res)) {
          const axiosError = res as AxiosError<any>;
          setUnsavedChanges(true);

          setPangeaAlertNotificationMessage({
            text: 'There was an error and your changes did not save successfully',
            severity: 'error',
          });

          // if anything comes back with an error, store it in the errorMessageState
          setErrorMessageState({
            phone: axiosError?.response?.data?.phone,
            email: axiosError?.response?.data?.email,
            first_name: axiosError?.response?.data?.first_name,
            last_name: axiosError?.response?.data?.last_name,
          });
        }
      } catch {
        setPangeaAlertNotificationMessage({
          text: 'There was an error and your changes did not save successfully',
          severity: 'error',
        });
      }
    }
  };

  const handleTimezoneSelect = (event: SelectChangeEvent) => {
    if (!newYourProfileData) {
      return;
    }

    setUnsavedChanges(true);

    setNewYourProfileData({
      ...newYourProfileData,
      timezone: event.target.value as PangeaTimezoneEnum,
    });
  };

  if (!newYourProfileData) {
    return <Skeleton height={'329px'} width={'100%'} />;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }} component='form'>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              id='first-name'
              label='First Name'
              name='first_name'
              variant='filled'
              error={!formValidation.first_name}
              value={newYourProfileData.first_name}
              onChange={handleInputUpdate}
            />
            {!formValidation.first_name && (
              <FormHelperText
                sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                id='first-name-helper-text'
              >
                Please enter your name
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id='last-name'
              label='Last Name'
              variant='filled'
              name='last_name'
              required
              error={!formValidation.last_name}
              value={newYourProfileData.last_name}
              onChange={handleInputUpdate}
            />
            {!formValidation.last_name && (
              <FormHelperText
                sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                id='last_name-helper-text'
              >
                Please enter your last name
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id='email'
              label='Email Address'
              variant='filled'
              name='email'
              type='email'
              error={!formValidation.email}
              value={newYourProfileData.email}
              required
              onChange={handleInputUpdate}
            />
            {!formValidation.email && (
              <FormHelperText
                sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                id='email-helper-text'
              >
                Please enter a valid email
              </FormHelperText>
            )}
            {errorMessageState?.email?.map((item, i) => {
              return (
                <FormHelperText
                  sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                  key={i}
                >
                  {item}
                </FormHelperText>
              );
            })}
          </Grid>
          <Grid item xs={12}>
            <MuiTelInput
              defaultCountry='US'
              fullWidth
              id='phone'
              label='Phone Number'
              variant='filled'
              error={!formValidation.phone}
              value={newYourProfileData.phone ?? ''}
              required
              onChange={handlePhoneUpdate}
            />
            {!formValidation.phone && (
              <FormHelperText
                sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                id='email-helper-text'
              >
                Please enter a valid phone number
              </FormHelperText>
            )}
            {!user?.phone_confirmed && (
              <>
                <FormHelperText
                  sx={{ pt: 1, color: `${PangeaColors.RiskBerryMedium}` }}
                  id='email-helper-text'
                >
                  Phone number not confirmed.
                </FormHelperText>
                <PangeaButton
                  size='small'
                  disableElevation
                  sx={{
                    mt: 1,
                  }}
                  onClick={handleConfirmNumber}
                >
                  Confirm your number
                </PangeaButton>
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            <PangeaTimezoneSelector
              value={newYourProfileData.timezone ?? `US/Eastern`}
              onChange={handleTimezoneSelect}
            />
          </Grid>
        </Grid>
      </Box>
      <PangeaButton
        sx={{ width: 'fit-content' }}
        variant='contained'
        loading={loadingState.isLoading}
        onClick={handleSaveChanges}
        disabled={!validForm || !unsavedChanges}
      >
        Save Changes
      </PangeaButton>

      <CustomDialog onClose={toggleModalOpen} open={modalData.isOpen}>
        <VerifyMobileAccountManagement
          phone={newYourProfileData.phone ?? ''}
          toggleModalOpen={toggleModalOpen}
        />
      </CustomDialog>
    </>
  );
};
export default AccountYourProfileManagement;
