import { TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import {
  ibApplicationsState,
  ibAssociatedIndividualIdentificationState,
  ibAssociatedIndividualTaxResidencyState,
} from 'atoms';
import { getIPAddressAsync, redirect, rules } from 'lib';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaErrorFormHelperText, StepperShell } from '../shared';

import { clientApiState, pangeaAlertNotificationMessageState } from 'atoms';
import axios from 'axios';
import { useLoading } from 'hooks';
import { isError } from 'lodash';

export const ActivationIbPortalAccess = () => {
  const [error, setError] = useState(false);
  const { loadingPromise, loadingState } = useLoading();
  const ibApplication = useRecoilState(ibApplicationsState);
  const authHelper = useRecoilValue(clientApiState);
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const [individualIdentification, setIndividualIdentification] =
    useRecoilState(ibAssociatedIndividualIdentificationState);
  const setTaxResidency = useSetRecoilState(
    ibAssociatedIndividualTaxResidencyState,
  );

  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaxResidency((prevValue) => ({ ...prevValue, tin: event.target.value }));
    setIndividualIdentification((prevValue) => ({
      ...prevValue,
      ssn: event.target.value,
    }));
    setError(!rules.ssn(event.target.value));
  };

  const handleSubmitIbApplication = async () => {
    if (error || individualIdentification.ssn == undefined) {
      return;
    }
    const submit = async () => {
      try {
        const ipAddress = await getIPAddressAsync();
        const api = authHelper.getAuthenticatedApiHelper();
        let compData = await api.getCompanyAsync();
        if (!isError(compData) && compData.ibkr_application[0]?.username) {
          try {
            const ssoUrl = await api.getSsoUrlAsync(
              compData.ibkr_application[0].username,
              ipAddress,
            );
            if (isError(ssoUrl)) {
              setApiErrorMessage(
                'Failed to get portal URL. Please try again or contact customer support.',
              );
              return;
            }

            redirect(ssoUrl.url);
          } catch (e) {
            console.error(e);
          }
          return;
        }

        const res = await api.submitIbAccountApplicationAsync(ibApplication[0]);
        if (res && !isError(res)) {
          compData = await api.getCompanyAsync();
          if (
            isError(compData) ||
            !compData.ibkr_application ||
            compData.ibkr_application.length == 0
          ) {
            setApiErrorMessage(
              'There was a problem submitting your application. Please try again or contact customer support.',
            );
            return;
          }

          const ssoUrl = await api.getSsoUrlAsync(
            compData.ibkr_application[0].username,
            ipAddress,
          );
          if (isError(ssoUrl)) {
            setApiErrorMessage(
              'Failed to get portal URL. Please try again or contact customer support.',
            );
            return;
          }
          redirect(ssoUrl.url);
        } else if (axios.isAxiosError(res)) {
          if (
            res.message.includes('status code 4') ||
            res?.response?.status.toString().startsWith('4')
          ) {
            setApiErrorMessage(
              'There was a problem submitting your application. Please try the process again.',
            );
          } else {
            if (res?.response?.data) {
              setApiErrorMessage(
                (res.response.data as any).application.join(' '),
              );
            }
          }
          setPangeaAlertNotificationMessage({
            text: 'At this time your application was not able to be completed',
            severity: 'error',
          });
        }
      } catch {
        setPangeaAlertNotificationMessage({
          text: 'At this time your application was not able to be completed',
          severity: 'error',
        });
      }
    };
    await loadingPromise(submit());
  };
  return (
    <StepperShell
      title='Activate IB Portal Access'
      titleDescription='Enter your SSN to generate a secure link to InteractiveBrokers to finish the onboarding process. '
      backButtonHref='/activation/finalization/collecting-documents'
      continueButtonHref=''
      continueButtonEnabled={true}
      continueButtonText='submit and enter secure portal'
      continueButtonProps={{ loading: loadingState.isLoading }}
      onClickContinueButton={handleSubmitIbApplication}
    >
      <Stack spacing={2} width='50%'>
        <TextField
          label='SSN'
          name='ssn'
          variant='filled'
          helperText='This will not be stored by Pangea'
          type={'password'}
          error={error}
          onChange={handleInputChange}
        />
        <PangeaErrorFormHelperText
          text={'Please enter your nine digit ssn'}
          visible={error}
        />
        <PangeaErrorFormHelperText
          visible={apiErrorMessage.length > 0}
          text={apiErrorMessage}
        />
      </Stack>
      <Typography variant='body1'>
        Please ensure all information at this stage is complete and accurate
        before proceeding. Errors can cause delays in the activation process.
      </Typography>
    </StepperShell>
  );
};
export default ActivationIbPortalAccess;
