import { FormControl, FormHelperText, Grid } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { clientApiState, pangeaAlertNotificationMessageState } from 'atoms';
import { AxiosError, isAxiosError } from 'axios';
import { useLoading } from 'hooks/useLoading';
import { isError } from 'lodash';
import { ChangeEvent, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaButton, PangeaInputHidden } from '../shared';
import { SetNewPasswordForm } from './SetNewPasswordForm';
import React from 'react';

export const AccountChangePassword = () => {
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const { loadingState, loadingPromise } = useLoading();
  const [values, setValues] = useState({
    old_password: '',
    new_password: '',
  });

  const [formValidation, setFormValidation] = useState({
    old_password: true,
    new_password: true,
  });

  const [errorMessageState, setErrorMessageState] = useState({
    new_password: [],
    old_password: [],
  });

  const authHelper = useRecoilValue(clientApiState);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  const handleSubmitNewPassword = async () => {
    const updatePW = async () => {
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.setPasswordAsync(
          values.old_password,
          values.new_password,
        );
        if (res && !isError(res)) {
          // set the successState to true
          setUnsavedChanges(false);
          setPangeaAlertNotificationMessage({
            text: 'You have saved your password changes successfully!',
            severity: 'success',
          });

          setValues({
            old_password: '',
            new_password: '',
          });
        } else if (isAxiosError(res)) {
          const axiosError = res as AxiosError<any>;

          setUnsavedChanges(true);
          // if anything comes back with an error, store it in the errorMessageState
          setErrorMessageState({
            old_password: axiosError?.response?.data?.data?.old_password,
            new_password: axiosError?.response?.data?.data?.new_password,
          });
        }
      } catch {
        setUnsavedChanges(true);
        setPangeaAlertNotificationMessage({
          text: 'At this time your password was not able to be changed',
          severity: 'error',
        });
      }
    };
    await loadingPromise(updatePW());
  };

  const handleSetPasswords = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      const value = event.target.value;
      setUnsavedChanges(true);
      setValues({
        ...values,
        [name]: value,
      });
      setFormValidation({
        ...formValidation,
        [name]: value.length > 7,
      });
    },
  );

  const handleNewPassword = (newPw: string) => {
    setValues({ ...values, new_password: newPw });
    setFormValidation({
      ...formValidation,
      new_password: newPw.length > 7,
    });
  };

  return (
    <React.Fragment>
      <FormControl>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PangeaInputHidden
              name={'old_password'}
              label={'Old Password'}
              value={values.old_password}
              onChange={handleSetPasswords}
              error={errorMessageState?.old_password?.length > 0}
              autoComplete={'current-password'}
            />
            {errorMessageState?.old_password?.map((item: string, i: number) => {
              return (
                <FormHelperText
                  sx={{ color: PangeaColors.RiskBerryMedium }}
                  key={i}
                >
                  {item}
                </FormHelperText>
              );
            })}
          </Grid>
          <Grid item xs={12}>
            <SetNewPasswordForm
              apiErrorMessage={errorMessageState.new_password}
              onNewPasswordSet={handleNewPassword}
              new_password={values.new_password}
              old_password={values.old_password}
              resetPassword
            />
          </Grid>
          <Grid item>
            <PangeaButton
              variant='contained'
              loading={loadingState.isLoading}
              disabled={
                !unsavedChanges ||
                !formValidation.new_password ||
                !formValidation.old_password
              }
              onClick={handleSubmitNewPassword}
            >
              Update Password
            </PangeaButton>
          </Grid>
        </Grid>
      </FormControl>
    </React.Fragment>
  );
};
export default AccountChangePassword;
