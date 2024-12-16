import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  activationYourAddressMailingValidationState,
  activationYourAddressValidationState,
  ibAssociatedIndividualMailingAddressState,
  ibAssociatedIndividualResidenceState,
  individualMailAndResidenceEqualState,
} from 'atoms';
import { PangeaErrorFormHelperText } from 'components/shared';
import { PangeaCountryEnum, PangeaStateEnum } from 'lib';
import router from 'next/router';
import { ChangeEvent, MouseEvent, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaStateSelector, StepperShell } from '../shared';
import { PangeaCountrySelector } from './PangeaCountrySelector';

export const ActivationDetailsYourAddress = () => {
  const [checkFormValidation, setCheckFormValidation] = useState(false);
  const [residence, setResidence] = useRecoilState(
    ibAssociatedIndividualResidenceState,
  );
  const formValidation = useRecoilValue(activationYourAddressValidationState);
  const formIsValid = useMemo(
    () => Object.values(formValidation).every((v) => v),
    [formValidation],
  );
  const [mailingAddress, setMailingAddress] = useRecoilState(
    ibAssociatedIndividualMailingAddressState,
  );
  const mailingValidation = useRecoilValue(
    activationYourAddressMailingValidationState,
  );
  // validation state for entire mailing address form being valid
  const mailingAddressValidForm = useMemo(
    () => Object.values(mailingValidation).every((v) => v),
    [mailingValidation],
  );

  const [mailAndResidenceEqual, setMailAndResidenceEqual] = useRecoilState(
    individualMailAndResidenceEqualState,
  );
  const handleCountrySelect = useEventCallback((event: SelectChangeEvent) => {
    if (event.target.name === 'mail_country') {
      setMailingAddress({
        ...mailingAddress,
        country: event.target.value as PangeaCountryEnum,
      });
    } else {
      if (mailAndResidenceEqual) {
        setMailingAddress({
          ...residence,
          country: event.target.value as PangeaCountryEnum,
        });
      }
      setResidence({
        ...residence,
        country: event.target.value as PangeaCountryEnum,
      });
    }
  });

  const handleStateSelect = useEventCallback((event: SelectChangeEvent) => {
    const value = event.target.value;
    const inputName = event.target.name;
    if (inputName === 'mail_state') {
      setMailingAddress({
        ...mailingAddress,
        state: value as PangeaStateEnum,
      });
    } else {
      if (mailAndResidenceEqual) {
        setMailingAddress({
          ...residence,
          state: value as PangeaStateEnum,
        });
      }
      setResidence({
        ...residence,
        state: value as PangeaStateEnum,
      });
    }
  });

  const handleInputUpdate = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.currentTarget) {
        return;
      }
      const value = event.currentTarget.value;
      const inputName = event.currentTarget.name;
      const id = event.currentTarget.id;

      // if the field is a mailing field, do mailing validation
      // not validating for street_2 because we don't care if it is there or not
      if (id.includes('mail')) {
        setMailingAddress({
          ...mailingAddress,
          [inputName]: value,
        });
        // otherwise do generic legal and form validation
      } else {
        if (mailAndResidenceEqual) {
          setMailingAddress({
            ...residence,
            [inputName]: value,
          });
        }
        setResidence({
          ...residence,
          [inputName]: value,
        });
      }
    },
  );

  const handleSameAddressCheckbox = useEventCallback(() => {
    const newMailAndResidenceEqual = !mailAndResidenceEqual;
    setMailAndResidenceEqual(newMailAndResidenceEqual);

    // reset the values to  be empty if the user had the mailing address as the same (this makes the values of mailing and residence the same) and then selects it to not be
    if (newMailAndResidenceEqual) {
      setMailingAddress({ ...residence });
    } else {
      setMailingAddress({
        country: '' as PangeaCountryEnum,
        state: '' as PangeaStateEnum,
        city: '',
        postal_code: '',
        street_1: '',
        street_2: '', // setting it to an empty space because checking for '' values for validation
      });
    }
  });
  const ContinueActivationFlow = async (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event?.preventDefault();
    setCheckFormValidation(true);
    if (formIsValid) {
      router.push('/activation/finalization/collecting-documents');
    }
  };

  return (
    <StepperShell
      title="What's your legal address?"
      titleDescription="Pangea is legally required to collect personal information due to the financial instruments you'll have access to."
      continueButtonEnabled
      onClickContinueButton={ContinueActivationFlow}
      backButtonHref={'/activation/details/about-you'}
    >
      <Stack spacing={3}>
        <PangeaCountrySelector
          id='country'
          name='country'
          label='Country'
          value={residence.country ?? ''}
          onChange={handleCountrySelect}
          error={!formValidation.country && checkFormValidation}
        />
        <PangeaErrorFormHelperText
          text={'Please select your country'}
          visible={!formValidation.country && checkFormValidation}
        />
        <Stack direction='row' spacing={3}>
          <Stack width='65%'>
            <TextField
              id='street_1'
              name='street_1'
              autoComplete='address-line1'
              label='Street Address Line 1'
              variant='filled'
              sx={{ width: '100%' }}
              error={!formValidation.street_1 && checkFormValidation}
              value={residence.street_1}
              onChange={handleInputUpdate}
            />
            <PangeaErrorFormHelperText
              text={'Please enter your address of residence'}
              visible={!formValidation.street_1 && checkFormValidation}
            />
          </Stack>
          <Stack sx={{ width: '35%' }}>
            <TextField
              id='street_2'
              name='street_2'
              autoComplete='address-line2'
              label='Street Address Line 2'
              variant='filled'
              sx={{ width: '100%' }}
              value={residence.street_2}
              onChange={handleInputUpdate}
            />
          </Stack>
        </Stack>

        <Stack direction='row' justifyContent='space-between'>
          <Stack sx={{ width: '49%' }}>
            <TextField
              id='city'
              name='city'
              autoComplete='address-level2'
              label='City'
              variant='filled'
              onChange={handleInputUpdate}
              value={residence.city}
              error={!formValidation.city && checkFormValidation}
            />
            <PangeaErrorFormHelperText
              text={'Please enter city of residence'}
              visible={!formValidation.city && checkFormValidation}
            />
          </Stack>
          <Box width='20%'>
            <PangeaStateSelector
              id='state'
              name='state'
              value={residence.state ?? ''}
              onChange={handleStateSelect}
              error={!formValidation.state && checkFormValidation}
            />
            <PangeaErrorFormHelperText
              text={'Please select your state of residence'}
              visible={!formValidation.state && checkFormValidation}
            />
          </Box>
          <Stack sx={{ width: '23%' }}>
            <TextField
              id='postal_code'
              name='postal_code'
              autoComplete='postal-code'
              label='ZIP Code'
              onChange={handleInputUpdate}
              variant='filled'
              value={residence.postal_code}
              error={!formValidation.postal_code && checkFormValidation}
            />
            <PangeaErrorFormHelperText
              text={'Please select your state of residence'}
              visible={!formValidation.postal_code && checkFormValidation}
            />
          </Stack>
        </Stack>
        <FormControlLabel
          control={
            <Checkbox
              checked={mailAndResidenceEqual}
              onChange={handleSameAddressCheckbox}
            />
          }
          label='Mailing address is the same'
        />
        <PangeaErrorFormHelperText
          text='If the mailing address is different, please enter it. Otherwise, check the box to indicate legal and mailing address are the same.'
          visible={
            !mailAndResidenceEqual &&
            checkFormValidation &&
            !mailingAddressValidForm
          }
        />
      </Stack>
      <Stack>
        {!mailAndResidenceEqual ? (
          <>
            <Divider
              sx={{
                marginTop: '1rem',
                borderColor: `${PangeaColors.Gray}`,
              }}
            />
            <Stack mt={3} spacing={2}>
              <Typography variant='body1'>
                Please enter your mailing address.
              </Typography>
              <Stack spacing={2}>
                <PangeaCountrySelector
                  label='Country'
                  name='mail_country'
                  id='mail_country'
                  value={mailingAddress.country ?? ''}
                  onChange={handleCountrySelect}
                  error={
                    !mailingValidation.country &&
                    checkFormValidation &&
                    !mailAndResidenceEqual
                  }
                />
                <PangeaErrorFormHelperText
                  text={'Please select the mailing country for your company'}
                  visible={
                    !mailingValidation.country &&
                    checkFormValidation &&
                    !mailAndResidenceEqual
                  }
                />
                <Stack direction='row' spacing={3}>
                  <Stack width='65%'>
                    <TextField
                      name='street_1'
                      id='mail_street_1'
                      autoComplete='address-line1'
                      onChange={handleInputUpdate}
                      label='Street Address Line 1'
                      value={mailingAddress.street_1}
                      error={
                        !mailingValidation.street_1 &&
                        !mailAndResidenceEqual &&
                        checkFormValidation
                      }
                    />
                    <PangeaErrorFormHelperText
                      text={'Please enter the company mailing street address'}
                      visible={
                        !mailingValidation.street_1 &&
                        !mailAndResidenceEqual &&
                        checkFormValidation
                      }
                    />
                  </Stack>
                  <Stack sx={{ width: '35%' }}>
                    <TextField
                      name='street_2'
                      id='mail_street_2'
                      autoComplete='address-line2'
                      onChange={handleInputUpdate}
                      label='Street Address Line 2'
                      value={mailingAddress.street_2}
                    />
                  </Stack>
                </Stack>
                <Stack direction={'row'} spacing={2}>
                  <Stack
                    sx={{
                      width: '56%',
                    }}
                  >
                    <TextField
                      id='mail_city'
                      label='City'
                      name='city'
                      autoComplete='address-level2'
                      onChange={handleInputUpdate}
                      value={mailingAddress.city}
                      error={
                        !mailingValidation.city &&
                        !mailAndResidenceEqual &&
                        checkFormValidation
                      }
                    />
                    <PangeaErrorFormHelperText
                      text={'Please enter the mailing address city'}
                      visible={
                        !mailingValidation.city &&
                        !mailAndResidenceEqual &&
                        checkFormValidation
                      }
                    />
                  </Stack>
                  <Box minWidth={'100px'} flexGrow={1}>
                    <PangeaStateSelector
                      id='mail_state'
                      name='mail_state'
                      value={mailingAddress.state ?? ''}
                      onChange={handleStateSelect}
                      error={
                        !mailingValidation.state &&
                        checkFormValidation &&
                        !mailAndResidenceEqual
                      }
                    />
                    <PangeaErrorFormHelperText
                      text={"Please select the company's mailing address state"}
                      visible={
                        !mailingValidation.state &&
                        checkFormValidation &&
                        !mailAndResidenceEqual
                      }
                    />
                  </Box>

                  <Stack
                    sx={{
                      width: '25%',
                    }}
                  >
                    <TextField
                      id='mail_postal_code'
                      name='postal_code'
                      autoComplete='postal-code'
                      label='ZIP Code'
                      variant='filled'
                      onChange={handleInputUpdate}
                      value={mailingAddress.postal_code}
                      error={
                        !mailingValidation.postal_code &&
                        !mailAndResidenceEqual &&
                        checkFormValidation
                      }
                    />
                    {/* Error state runs if there is no postal code AND the touched the postal code box AND they have a diff mail and legal address...
                    ... OR there is no postal code AND they tried to hit the submit button AND the mail and legal address are diff....
                    ... it is set up this way so that there isn't an error message on load */}
                    <PangeaErrorFormHelperText
                      text={'Please enter the postal code'}
                      visible={
                        !mailingValidation.postal_code &&
                        !mailAndResidenceEqual &&
                        checkFormValidation
                      }
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </>
        ) : null}
      </Stack>
    </StepperShell>
  );
};
export default ActivationDetailsYourAddress;
