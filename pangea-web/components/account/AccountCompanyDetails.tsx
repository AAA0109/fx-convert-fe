import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  SelectChangeEvent,
  Skeleton,
  TextField,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  clientApiState,
  pangeaAlertNotificationMessageState,
  userCompanyState,
} from 'atoms';
import axios, { AxiosError } from 'axios';
import { useLoading } from 'hooks/useLoading';
import { PangeaCompany, PangeaStateEnum, PangeaTimezoneEnum, rules } from 'lib';
import { isEqual, isError } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import {
  MaskedTextField,
  PangeaButton,
  PangeaStateSelector,
  PangeaTimezoneSelector,
} from '../shared';
type Props = {
  isEditable?: boolean;
};
export const AccountCompanyDetails = ({ isEditable = false }: Props) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [validForm, setValidForm] = useState<boolean>(false);
  const companyDetailsReceivedData = useRecoilValue(userCompanyState);
  const authHelper = useRecoilValue(clientApiState);
  const [newDetailsData, setNewDetailsData] = useState<Nullable<PangeaCompany>>(
    companyDetailsReceivedData,
  );
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const { loadingState, loadingPromise } = useLoading();

  // This is being set for what might come back with an error from the api
  const [errorMessageState, setErrorMessageState] = useState({
    name: [],
    legal_name: [],
    phone: [],
    address_1: [],
    city: [],
    state: [],
    zip_code: [],
    ein: [],
  });

  // Once we get the company data from the api, set it locally to newDetailsData
  useEffect(() => {
    if (!companyDetailsReceivedData) {
      return;
    }
    setNewDetailsData(companyDetailsReceivedData);
  }, [companyDetailsReceivedData]);

  const [formValidation, setFormValidation] = useState({
    id: true,
    currency: true,
    status: true,
    timezone: true,
    name: true,
    phone: true,
    ein: true,
  });

  const handleUSStateChange = (event: SelectChangeEvent) => {
    if (!newDetailsData) return;
    setNewDetailsData({
      ...newDetailsData,
      state: event.target.value as PangeaStateEnum,
    });
  };

  useEffect(() => {
    // check if there is any difference between companyDetailsReceivedData and newDetailsData
    // if there are no changes in the values, then setUnsavedData(false);

    if (isEqual(companyDetailsReceivedData, newDetailsData)) {
      setUnsavedChanges(false);
    } else {
      setUnsavedChanges(true);
    }
  }, [companyDetailsReceivedData, newDetailsData]);

  const handleTimeZoneSelect = (e: SelectChangeEvent) => {
    if (!newDetailsData) return;
    setUnsavedChanges(true);
    setNewDetailsData({
      ...newDetailsData,
      timezone: e.target.value as PangeaTimezoneEnum,
    });
  };

  const handleUpdateInput = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const name = event.target.name;

      if (rules[name]) {
        setFormValidation({
          ...formValidation,
          [name]: rules[name](value),
        });
        // EIN and phone number are not required, but if it is input it needs to undergo local validation
        if (name === 'ein' || name === 'phone') {
          if (value.length < 1) {
            setFormValidation({
              ...formValidation,
              [name]: true,
            });
          }
        }
      }
      if (!newDetailsData) return;

      setNewDetailsData({
        ...newDetailsData,
        [event.target.name]: event.target.value,
      });
    },
  );

  const handleNonProfitCheckboxChange = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!newDetailsData) return;
      setNewDetailsData({
        ...newDetailsData,
        nonprofit: event.target.checked,
      });
    },
  );

  // Not all info has to be filled out, only what is required is set up that way
  useEffect(() => {
    // if every value in the formValidation object is true (so everything is valid and true) then validForm is now true
    setValidForm(
      Object.values(formValidation).every((value) => value === true),
    );
  }, [setValidForm, formValidation]);

  const handleSaveChanges = async () => {
    if (!companyDetailsReceivedData?.id) {
      return;
    }
    const updateCompanyDetails = async () => {
      const api = authHelper.getAuthenticatedApiHelper();
      if (!newDetailsData) return;

      try {
        const res = await api.updateCompanyAsync(
          newDetailsData,
          companyDetailsReceivedData.id,
        );
        if (res && !isError(res)) {
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
            name: axiosError?.response?.data?.name,
            legal_name: axiosError?.response?.data?.legal_name,
            phone: axiosError?.response?.data?.phone,
            address_1: axiosError?.response?.data?.address_1,
            city: axiosError?.response?.data?.city,
            state: axiosError?.response?.data?.state,
            zip_code: axiosError?.response?.data?.zip_code,
            ein: axiosError?.response?.data?.ein,
          });
        }
      } catch {
        setPangeaAlertNotificationMessage({
          text: 'There was an error and your changes did not save successfully',
          severity: 'error',
        });
      }
    };
    await loadingPromise(updateCompanyDetails());
  };

  if (!newDetailsData) {
    return <Skeleton variant='rectangular' height='650px' />;
  }

  return (
    <>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id='name'
              label='Company Name'
              name='name'
              variant='filled'
              required
              error={
                !formValidation.name || errorMessageState?.name?.length > 0
              }
              value={newDetailsData?.name}
              onChange={handleUpdateInput}
              disabled={!isEditable}
            />
            {errorMessageState?.name?.map((item: string, i: number) => {
              return (
                <FormHelperText
                  sx={{ color: PangeaColors.RiskBerryMedium }}
                  key={i}
                >
                  {item}
                </FormHelperText>
              );
            })}
            {!formValidation.name && (
              <FormHelperText
                sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                id='name-helper-text'
              >
                Please enter your company&apos;s name
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id='legal_name'
              label='Legal Company Name'
              name='legal_name'
              variant='filled'
              error={errorMessageState?.legal_name?.length > 0}
              value={newDetailsData?.legal_name}
              onChange={handleUpdateInput}
              disabled={!isEditable}
            />
            {errorMessageState?.legal_name?.map((item: string, i: number) => {
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
            <MaskedTextField
              type='phone'
              fullWidth
              id='phone'
              label='Phone Number'
              variant='filled'
              name='phone'
              error={!formValidation.phone}
              value={newDetailsData?.phone}
              onChange={handleUpdateInput}
              apiErrorMessages={errorMessageState?.phone}
              disabled={!isEditable}
            />
            {errorMessageState?.phone?.map((item: string, i: number) => {
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
          <Grid item xs={4}>
            <TextField
              id='address_1'
              label='Street Address'
              name='address_1'
              variant='filled'
              error={errorMessageState?.address_1?.length > 0}
              value={newDetailsData?.address_1}
              onChange={handleUpdateInput}
              disabled={!isEditable}
            />
            {errorMessageState?.address_1?.map((item: string, i: number) => {
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
          <Grid item xs={2}>
            <TextField
              id='zip_code'
              label='Zip'
              name='zip_code'
              variant='filled'
              error={errorMessageState?.zip_code?.length > 0}
              value={newDetailsData?.zip_code}
              onChange={handleUpdateInput}
              disabled={!isEditable}
            />
            {errorMessageState?.zip_code?.map((item: string, i: number) => {
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
          <Grid item xs={4}>
            <TextField
              id='city'
              label='City'
              name='city'
              variant='filled'
              error={errorMessageState?.city?.length > 0}
              value={newDetailsData?.city}
              onChange={handleUpdateInput}
              disabled={!isEditable}
            />
            {errorMessageState?.city?.map((item: string, i: number) => {
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
          <Grid item xs={2}>
            <PangeaStateSelector
              value={newDetailsData?.state?.toString() ?? 'NY'}
              onChange={handleUSStateChange}
              disabled={!isEditable}
            />
          </Grid>
          <Grid item xs={12}>
            <MaskedTextField
              fullWidth
              id='ein'
              type='ein'
              label='EIN'
              name='ein'
              variant='filled'
              value={newDetailsData?.ein}
              error={!formValidation.ein || errorMessageState?.ein?.length > 0}
              onChange={handleUpdateInput}
              disabled={!isEditable}
            />
            {errorMessageState?.ein?.map((item: string, i: number) => {
              return (
                <FormHelperText
                  sx={{ color: PangeaColors.RiskBerryMedium }}
                  key={i}
                >
                  {item}
                </FormHelperText>
              );
            })}
            {!formValidation.ein && (
              <FormHelperText
                sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
                id='ein-helper-text'
              >
                Please enter your company&apos;s EIN
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              sx={{ paddingLeft: '20px' }}
              control={
                <Checkbox
                  checked={newDetailsData?.nonprofit}
                  onChange={handleNonProfitCheckboxChange}
                />
              }
              disabled={!isEditable}
              label='This is a non profit'
            />
          </Grid>
          <Grid item xs={12}>
            <PangeaTimezoneSelector
              value={newDetailsData?.timezone ?? 'US/Eastern'}
              onChange={handleTimeZoneSelect}
              disabled={!isEditable}
            />
          </Grid>
        </Grid>
        {isEditable && (
          <PangeaButton
            loading={loadingState.isLoading}
            onClick={handleSaveChanges}
            sx={{ width: 'fit-content', marginTop: '24px' }}
            variant='contained'
            disabled={!validForm || !unsavedChanges}
          >
            Save Changes
          </PangeaButton>
        )}
      </Box>
    </>
  );
};
export default AccountCompanyDetails;
