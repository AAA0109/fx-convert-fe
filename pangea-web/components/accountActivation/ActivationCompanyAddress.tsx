import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  clientApiState,
  CompanyAddressForm,
  ibCompanyAddressFormIsValidState,
  ibCompanyAddressIsValidState,
  ibCompanyAddressState,
} from 'atoms';
import { PangeaCountryEnum, PangeaStateEnum } from 'lib';
import { isError } from 'lodash';
import router from 'next/router';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import {
  PangeaErrorFormHelperText,
  PangeaStateSelector,
  StepperShell,
} from '../shared';
import { PangeaCountrySelector } from './PangeaCountrySelector';

export const ActivationCompanyAddress = () => {
  const authHelper = useRecoilValue(clientApiState);

  // user tried to submit the form this turns to true
  const [checkFormValidation, setCheckFormValidation] = useState(false);

  // validation state for entire form
  const formIsValid = useRecoilValue(ibCompanyAddressFormIsValidState);
  const compMailAddrValid = useRecoilValue(ibCompanyAddressIsValidState);
  const [compMailAddr, setCompMailAddr] = useRecoilState(ibCompanyAddressState);
  // app state for mailing address
  const mailingAddress = compMailAddr.mailing;

  // state for legal address
  const placeOfBusiness = compMailAddr.pob;

  const handleCountrySelect = (event: SelectChangeEvent) => {
    const section = event.target.name === 'mail_country' ? 'mailing' : 'pob';
    setCompMailAddr((val) => ({
      ...val,
      [section]: {
        ...val[section],
        country: event.target.value as PangeaCountryEnum,
      },
    }));
  };

  const handleStateSelect = useEventCallback((event: SelectChangeEvent) => {
    const section = event.target.name === 'mail_state' ? 'mailing' : 'pob';
    setCompMailAddr((val) => ({
      ...val,
      [section]: {
        ...val[section],
        state: event.target.value as PangeaStateEnum,
      },
    }));
  });

  const handleMailingAddressCheckBox = useEventCallback(
    (_, checked: boolean) => {
      setCompMailAddr((val: CompanyAddressForm) => ({
        ...val,
        use_same_addr: checked,
      }));
    },
  );

  const handleInputUpdate = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target) {
        return;
      }
      const value = event.target.value;
      const inputName = event.target.name;
      const id = event.target.id;

      const section = id.includes('mail_') ? 'mailing' : 'pob';
      setCompMailAddr((val) => ({
        ...val,
        [section]: {
          ...val[section],
          [inputName]: value,
        },
      }));
    },
  );

  const continueButtonClicked = async (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event?.preventDefault();
    setCheckFormValidation(true);
    if (formIsValid) {
      const api = authHelper.getAuthenticatedApiHelper();
      const company = await api.getCompanyAsync();
      if (company && !isError(company)) {
        await api.updatePartialCompanyAsync({
          id: company.id,
          address_1: placeOfBusiness.street_1,
          address_2: placeOfBusiness.street_2,
          city: placeOfBusiness.city,
          state: placeOfBusiness.state,
          zip_code: placeOfBusiness.postal_code,
        });
        router.push('/activation/details/about-you');
      }
    }
  };
  return (
    <StepperShell
      title='Company Address'
      titleDescription='Please enter the legal address, the ‘place of business.’'
      onClickContinueButton={continueButtonClicked}
      continueButtonEnabled
      backButtonHref='/activation/details/company-details'
    >
      <FormControl>
        <Stack spacing={2}>
          <PangeaCountrySelector
            label='Country'
            name='country'
            id='country'
            value={placeOfBusiness?.country ?? ''}
            onChange={handleCountrySelect}
            error={!compMailAddrValid.pob.country && checkFormValidation}
          />
          <PangeaErrorFormHelperText
            text={'Please select the legal address country for your company'}
            visible={!compMailAddrValid.pob.country && checkFormValidation}
          />
          <Stack direction='row' spacing={3}>
            <Stack width='65%'>
              <TextField
                name='street_1'
                id='street_1'
                autoComplete='address-line1'
                onChange={handleInputUpdate}
                label='Street Address Line 1'
                value={placeOfBusiness?.street_1 ?? ''}
                error={!compMailAddrValid.pob.street_1 && checkFormValidation}
              />
              <PangeaErrorFormHelperText
                text={'Please enter the company mailing street address'}
                visible={!compMailAddrValid.pob.street_1 && checkFormValidation}
              />
            </Stack>
            <Stack sx={{ width: '35%' }}>
              <TextField
                name='street_2'
                id='street_2'
                autoComplete='address-line2'
                onChange={handleInputUpdate}
                label='Street Address Line 2'
                value={placeOfBusiness?.street_2 ?? ''}
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
                label='City'
                name='city'
                id='city'
                autoComplete='address-level2'
                value={placeOfBusiness?.city ?? ''}
                error={!compMailAddrValid.pob.city && checkFormValidation}
                onChange={handleInputUpdate}
              />
              <PangeaErrorFormHelperText
                text={'Please enter the mailing address city'}
                visible={!compMailAddrValid.pob.city && checkFormValidation}
              />
            </Stack>
            <Box minWidth={'100px'} flexGrow={1}>
              <PangeaStateSelector
                id='state'
                name='state'
                value={placeOfBusiness?.state ?? ''}
                onChange={handleStateSelect}
                error={!compMailAddrValid.pob.state && checkFormValidation}
              />
              <PangeaErrorFormHelperText
                text={"Please select the company's mailing address state"}
                visible={!compMailAddrValid.pob.state && checkFormValidation}
              />
            </Box>

            <Stack
              sx={{
                width: '25%',
              }}
            >
              <TextField
                id='postal_code'
                name='postal_code'
                autoComplete='postal-code'
                label='ZIP Code'
                variant='filled'
                error={
                  !compMailAddrValid.pob.postal_code && checkFormValidation
                }
                value={placeOfBusiness?.postal_code ?? ''}
                onChange={handleInputUpdate}
              />
              <PangeaErrorFormHelperText
                text={'Select mailing state'}
                visible={
                  !compMailAddrValid.pob.postal_code && checkFormValidation
                }
              />
            </Stack>
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                checked={compMailAddr.use_same_addr}
                onChange={handleMailingAddressCheckBox}
              />
            }
            label='Mailing address is the same'
          />
          <PangeaErrorFormHelperText
            text='If the mailing address is different, please enter it. Otherwise, check the box to indicate legal and mailing address are the same.'
            visible={
              !compMailAddr.use_same_addr && checkFormValidation && !formIsValid
            }
          />
        </Stack>

        {!compMailAddr.use_same_addr ? (
          <>
            <Divider
              sx={{
                marginTop: '1rem',
                borderColor: `${PangeaColors.Gray}`,
              }}
            />{' '}
            <Stack mt={3} spacing={2}>
              <Typography variant='body1'>
                Please enter your company mailing address.
              </Typography>
              <Stack spacing={2}>
                <PangeaCountrySelector
                  label='Country'
                  name='mail_country'
                  id='mail_country'
                  value={mailingAddress?.country ?? ''}
                  onChange={handleCountrySelect}
                  error={
                    !compMailAddrValid.mailing.country && checkFormValidation
                  }
                />
                <PangeaErrorFormHelperText
                  text={'Please select the mailing country for your company'}
                  visible={
                    !compMailAddrValid.mailing.country && checkFormValidation
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
                      value={mailingAddress?.street_1 ?? ''}
                      error={
                        !compMailAddrValid.mailing.street_1 &&
                        checkFormValidation
                      }
                    />
                    <PangeaErrorFormHelperText
                      text={'Please enter the company mailing street address'}
                      visible={
                        !compMailAddrValid.mailing.street_1 &&
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
                      value={mailingAddress?.street_2 ?? ''}
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
                      value={mailingAddress?.city ?? ''}
                      error={
                        !compMailAddrValid.mailing.city && checkFormValidation
                      }
                    />
                    <PangeaErrorFormHelperText
                      text={'Please enter the mailing address city'}
                      visible={
                        !compMailAddrValid.mailing.city && checkFormValidation
                      }
                    />
                  </Stack>
                  <Box minWidth={'100px'} flexGrow={1}>
                    <PangeaStateSelector
                      id='mail_state'
                      name='mail_state'
                      value={mailingAddress?.state ?? ''}
                      onChange={handleStateSelect}
                      error={
                        !compMailAddrValid.mailing.state && checkFormValidation
                      }
                    />
                    <PangeaErrorFormHelperText
                      text={"Please select the company's mailing address state"}
                      visible={
                        !compMailAddrValid.mailing.state && checkFormValidation
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
                      value={mailingAddress?.postal_code ?? ''}
                      error={
                        !compMailAddrValid.mailing.postal_code &&
                        checkFormValidation
                      }
                    />
                    {/* Error state runs if there is no postal code AND the touched the postal code box AND they have a diff mail and legal address...
                    ... OR there is no postal code AND they tried to hit the submit button AND the mail and legal address are diff....
                    ... it is set up this way so that there isn't an error message on load */}
                    <PangeaErrorFormHelperText
                      text={'Please enter the postal code'}
                      visible={
                        !compMailAddrValid.mailing.postal_code &&
                        checkFormValidation
                      }
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </>
        ) : null}
      </FormControl>
    </StepperShell>
  );
};
export default ActivationCompanyAddress;
