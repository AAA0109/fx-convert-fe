import {
  Box,
  FormHelperText,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import {
  activationAboutYouValidationState,
  ibAssociatedIndividualDOBState,
  ibAssociatedIndividualIdentificationState,
  ibAssociatedIndividualNameState,
  ibAssociatedIndividualResidenceState,
  ibAssociatedIndividualTitleState,
} from 'atoms';
import { addYears } from 'date-fns';
import {
  PangeaCitizenshipEnum,
  PangeaCountryEnum,
  PangeaIBAssociatedIndividualTitleCodeEnum,
  PangeaIssuingCountryEnum,
  PangeaLegalResidenceCountryEnum,
  PangeaSalutationEnum,
  standardizeDate,
} from 'lib';
import { isDate } from 'lodash';
import router from 'next/router';
import { ChangeEvent, MouseEvent, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  NamePrefixSelector,
  PangeaErrorFormHelperText,
  StepperShell,
} from '../shared';
import { PangeaCountrySelector } from './PangeaCountrySelector';
import { PangeaJobTitleSelector } from './PangeaJobTitleSelector';

export const AccountDetailsAboutYou = () => {
  const [individualName, setName] = useRecoilState(
    ibAssociatedIndividualNameState,
  );
  const [dob, setDob] = useRecoilState(ibAssociatedIndividualDOBState);
  const [individualIdentification, setIndividualIdentification] =
    useRecoilState(ibAssociatedIndividualIdentificationState);
  const [taxResidence, setTaxResidence] = useRecoilState(
    ibAssociatedIndividualResidenceState,
  );
  const [jobTitle, setJobTitle] = useRecoilState(
    ibAssociatedIndividualTitleState,
  );
  const [firstNameValidationRan, setFirstNameValidationRan] = useState(false);
  const [lastNameValidationRan, setLastNameValidationRan] = useState(false);

  const [checkFormValidation, setCheckFormValidation] = useState(false);
  const formValidation = useRecoilValue(activationAboutYouValidationState);
  const formIsValid = useMemo(
    () => Object.values(formValidation).every((v) => v),
    [formValidation],
  );

  const handleChangeDate = (newValue: Nullable<Date>) => {
    settmpDt(newValue);
    setDob(
      !newValue ||
        !isDate(newValue) ||
        !(newValue instanceof Date) ||
        isNaN(newValue.getTime())
        ? ''
        : standardizeDate(newValue).toISOString().split('T')[0],
    );
  };
  const handleCountrySelect = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setIndividualIdentification({
      ...individualIdentification,
      citizenship: value as PangeaCitizenshipEnum,
      issuing_country: value as PangeaIssuingCountryEnum,
      legal_residence_country: value as PangeaLegalResidenceCountryEnum,
    });
    setTaxResidence({
      ...taxResidence,
      country: value as PangeaCountryEnum,
    });
  };

  const handleJobTitleSelect = (event: SelectChangeEvent) => {
    setJobTitle(
      event.target.value as PangeaIBAssociatedIndividualTitleCodeEnum,
    );
  };

  const handlePrefixSelect = (event: SelectChangeEvent) => {
    setName({
      ...individualName,
      salutation: event.target.value as PangeaSalutationEnum,
    });
  };

  const handleInputUpdate = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target) {
        return;
      }
      const value = event.currentTarget.value;
      const inputName = event.currentTarget.name;

      if (inputName === 'first') {
        setFirstNameValidationRan(true);
      }
      if (inputName === 'last') {
        setLastNameValidationRan(true);
      }
      setName({
        ...individualName,
        [inputName]: value,
      });
    },
  );
  const [tmpDt, settmpDt] = useState<Nullable<Date>>(
    dob && !isNaN(new Date(dob).getTime())
      ? new Date(
          Date.UTC(
            new Date(dob).getFullYear(),
            new Date(dob).getMonth(),
            new Date(dob).getDate(),
          ),
        )
      : null,
  );

  const handleContinueButton = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCheckFormValidation(true);
    if (formIsValid) {
      return router.push('/activation/details/your-address');
    }
  };
  return (
    <StepperShell
      title={'Tell us about yourself'}
      titleDescription={
        "Pangea is legally required to collect personal information due to the financial instruments you'll have access to."
      }
      continueButtonEnabled={true}
      onClickContinueButton={handleContinueButton}
      backButtonHref={'/activation/details/company-address'}
    >
      <Stack spacing={3}>
        <PangeaCountrySelector
          value={individualIdentification.citizenship}
          onChange={handleCountrySelect}
          label={'Primary Citizenship'}
          id={'country'}
          error={!formValidation.citizenship && checkFormValidation}
        />
        <PangeaErrorFormHelperText
          text={'Please select your country of citizenship'}
          visible={!formValidation.citizenship && checkFormValidation}
        />
        <Stack justifyContent={'space-between'} direction={'row'}>
          <Box width={'20%'}>
            <NamePrefixSelector
              value={individualName.salutation}
              onChange={handlePrefixSelect}
            />
            <PangeaErrorFormHelperText
              text={'Please select your prefix'}
              visible={!formValidation.salutation && checkFormValidation}
            />
          </Box>
          <Box width={'35%'}>
            <TextField
              fullWidth
              required
              id='first-name'
              label='Legal First Name'
              name='first'
              variant='filled'
              error={
                (!formValidation.first && firstNameValidationRan) ||
                (!formValidation.first && checkFormValidation)
              }
              value={individualName.first}
              onChange={handleInputUpdate}
              autoComplete={'given-name'}
            />
            <PangeaErrorFormHelperText
              text={'Please enter your first name. Max 18 characters.'}
              visible={
                (!formValidation.first && firstNameValidationRan) ||
                (!formValidation.first && checkFormValidation)
              }
            />
          </Box>
          <Box width={'35%'}>
            <TextField
              fullWidth
              id='last-name'
              label='Legal Last Name'
              variant='filled'
              name='last'
              required
              error={
                (!formValidation.last && lastNameValidationRan) ||
                (!formValidation.last && checkFormValidation)
              }
              value={individualName.last}
              onChange={handleInputUpdate}
              autoComplete={'family-name'}
            />
            <PangeaErrorFormHelperText
              text={'Please enter your last name. Max 50 characters.'}
              visible={
                (!formValidation.last && lastNameValidationRan) ||
                (!formValidation.last && checkFormValidation)
              }
            />
          </Box>
        </Stack>
        <Box width={'28%'}>
          <DesktopDatePicker
            label='Date of Birth'
            format='MM/dd/yyyy'
            onChange={handleChangeDate}
            value={tmpDt}
            maxDate={addYears(Date.now(), -18)}
            slotProps={{
              textField: {
                autoComplete: 'bday',
                variant: 'filled',
                error: !formValidation.dob && checkFormValidation,
              },
              popper: {
                modifiers: [
                  {
                    name: 'viewHeightModifier',
                    enabled: true,
                    phase: 'beforeWrite',
                    fn: ({ state }: { state: Partial<any> }) => {
                      state.styles.popper.height = '320px';
                      if (state.placement.includes('top-start')) {
                        state.styles.popper = {
                          ...state.styles.popper,
                          display: 'flex',
                          alignItems: 'flex-end',
                        };
                      }
                      if (state.placement.includes('bottom')) {
                        state.styles.popper = {
                          ...state.styles.popper,
                          display: 'block',
                        };
                      }
                    },
                  },
                ],
              },
            }}
          />
          <FormHelperText sx={{ margin: '5px 0 0 10px' }}>
            MM/DD/YYYY
          </FormHelperText>
          <PangeaErrorFormHelperText
            text={'Please enter your date of birth'}
            visible={!formValidation.dob && checkFormValidation}
          />
        </Box>
        <Stack>
          <PangeaJobTitleSelector
            value={jobTitle}
            onChange={handleJobTitleSelect}
            label={'Your Job Title'}
          />
          <PangeaErrorFormHelperText
            text={'Please select your position'}
            visible={!formValidation.job_title && checkFormValidation}
          />
          <FormHelperText sx={{ margin: '5px 0 0 10px' }}>
            Examples: CFO, Accountant, etc.
          </FormHelperText>
        </Stack>
      </Stack>
    </StepperShell>
  );
};
export default AccountDetailsAboutYou;
