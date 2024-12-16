import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  activationCompanyDetailValidationState,
  clientApiState,
  ibAppCustomerOrganizationState,
  ibAppCustomersState,
  ibAppOrganizationIdentificationState,
  ibAppOrgTaxResidencyState,
  userCompanyState,
} from 'atoms';
import {
  PangeaIBOrganizationTypeEnum,
  PangeaUsTaxPurposeTypeEnum,
  rules,
} from 'lib';
import router from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  MaskedTextField,
  PangeaErrorFormHelperText,
  StepperShell,
} from '../shared';
import { PangeaIBOrganizationTypeSelect } from './PangeaIBOrganizationTypeSelect';
import { PangeaTaxPurposeSelector } from './PangeaTaxPurposeSelector';

export const ActivationCompanyDetails = () => {
  const authHelper = useRecoilValue(clientApiState);
  const company = useRecoilValue(userCompanyState);
  const [isValidForm, setFormIsValid] = useState(false);
  const [organizationIdentification, setOrganizationIdentification] =
    useRecoilState(ibAppOrganizationIdentificationState);
  const [customer, setCustomer] = useRecoilState(ibAppCustomersState);
  const [organization, setOrganization] = useRecoilState(
    ibAppCustomerOrganizationState,
  );
  const [formValidation, setFormValidation] = useRecoilState(
    activationCompanyDetailValidationState,
  );
  const [checkedFormValidation, setCheckedFormValidation] = useState(false);
  const setTin = useSetRecoilState(ibAppOrgTaxResidencyState);

  const handleInputChange = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const inputName = event.target.name;
      const id = event.target.id;

      if (inputName === 'ein') {
        setTin((previousValue) => ({
          ...previousValue,
          tin: event.target.value,
        }));
      }
      setOrganizationIdentification((currentValue) => ({
        ...currentValue,
        [inputName]: value,
      }));
      setFormValidation((currentValue) => ({
        ...currentValue,
        [id]: rules[id](value),
      }));
    },
  );

  const handleCompanyTypeSelection = (event: SelectChangeEvent) => {
    setOrganization((currentValue) => ({
      ...currentValue,
      type: event.target.value as PangeaIBOrganizationTypeEnum,
    }));
    setFormValidation((currentValue) => ({
      ...currentValue,
      type: true,
    }));
  };

  const handleNonProfitCheckboxChange = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setCustomer((currentValue) => ({
        ...currentValue,
        md_status_nonpro: event.target.checked,
      }));
    },
  );

  const handleTaxPurposeSelect = (event: SelectChangeEvent) => {
    setOrganization((currentValue) => ({
      ...currentValue,
      us_tax_purpose_type: event.target.value as PangeaUsTaxPurposeTypeEnum,
    }));
    setFormValidation((currentValue) => ({
      ...currentValue,
      tax: true,
    }));
  };

  useEffect(() => {
    setFormIsValid(
      Object.values(formValidation).every((value) => value === true),
    );
  }, [formValidation]);

  const handleContinueActivationFlow = async (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setCheckedFormValidation(true);
    if (isValidForm) {
      const api = authHelper.getAuthenticatedApiHelper();
      if (company) {
        await api.updatePartialCompanyAsync({
          id: company.id,
          legal_name: organizationIdentification.name,
          ein: organizationIdentification?.identification,
        });
        return router.push('/activation/details/company-address');
      }
    }
  };

  return (
    <StepperShell
      title='Tell us about your company'
      backButtonVisible={false}
      onClickContinueButton={handleContinueActivationFlow}
      titleDescription='This information will be used to create your company profile.'
      continueButtonEnabled={true}
    >
      <FormGroup>
        <Stack spacing={2}>
          <Stack>
            <TextField
              variant='filled'
              id='name'
              name='name'
              label='Legal company name'
              onChange={handleInputChange}
              value={organizationIdentification?.name ?? ''}
              error={checkedFormValidation && !formValidation.name}
            />
            <PangeaErrorFormHelperText
              text='Please enter the company name'
              visible={checkedFormValidation && !formValidation.name}
            />
          </Stack>
          <PangeaIBOrganizationTypeSelect
            id='type'
            value={organization?.type ?? ''}
            label='Company type'
            name='type'
            onChange={handleCompanyTypeSelection}
            error={!formValidation.type && checkedFormValidation}
          />

          <PangeaErrorFormHelperText
            text='Please select the type of organization'
            visible={!formValidation.type && checkedFormValidation}
          />
          <PangeaTaxPurposeSelector
            error={!formValidation.tax && checkedFormValidation}
            value={organization?.us_tax_purpose_type ?? ''}
            onChange={handleTaxPurposeSelect}
          />
          <PangeaErrorFormHelperText
            text='Please select the tax purpose of your company'
            visible={!formValidation.tax && checkedFormValidation}
          />
          <Stack>
            <MaskedTextField
              type='ein'
              variant='filled'
              id='ein'
              label='Employer Identification Number (EIN)'
              name='identification'
              inputProps={{
                sx: { width: '50%' },
                disabled: !!company?.ein,
                placeholder: 'Employer Identification Number',
              }}
              error={!formValidation.ein && checkedFormValidation}
              value={organizationIdentification?.identification ?? ''}
              onChange={handleInputChange}
            />
            <PangeaErrorFormHelperText
              text='Please enter the employer identification number'
              visible={!formValidation.ein && checkedFormValidation}
            />
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                checked={customer.md_status_nonpro}
                onChange={handleNonProfitCheckboxChange}
              />
            }
            label='This is a nonprofit organization'
          />
        </Stack>
      </FormGroup>
    </StepperShell>
  );
};
export default ActivationCompanyDetails;
