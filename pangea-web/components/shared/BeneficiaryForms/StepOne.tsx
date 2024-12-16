import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  beneficiaryCreatePayloadState,
  beneficiaryValidationSchemaRequestDataState,
  brokerUniverseCurrenciesState,
} from 'atoms';
import {
  PangeaBeneficiaryAccountTypeEnum,
  PangeaDefaultPurposeEnum_LABEL_MAP,
  PangeaPaymentDeliveryMethodEnum,
  PangeaValidationSchemaRequest,
  countries,
} from 'lib';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { ToggleButtonGroupCustomStyle } from './constants';

type StepOneProps = {
  setValidity: Dispatch<SetStateAction<boolean>>;
  onValueUpdate: () => void;
  isWithdrawalAccount?: boolean;
  applicableAccounts?: (string | undefined)[];
};

export function StepOne({
  setValidity,
  onValueUpdate,
}: StepOneProps): JSX.Element {
  const prevValidationSchemaRequestRef =
    useRef<PangeaValidationSchemaRequest>();

  const [validationSchemaRequest, setValidationSchemaRequest] = useRecoilState(
    beneficiaryValidationSchemaRequestDataState,
  );

  const [createBeneficiaryPayload, setCreateBeneficiaryPayload] =
    useRecoilState(beneficiaryCreatePayloadState);

  const brokerUniverseCurrenciesLoadable = useRecoilValueLoadable(
    brokerUniverseCurrenciesState('buy'),
  );
  const isLoadingCurrency =
    brokerUniverseCurrenciesLoadable.state === 'loading';
  const allCurrencies =
    !isLoadingCurrency && brokerUniverseCurrenciesLoadable.state === 'hasValue'
      ? brokerUniverseCurrenciesLoadable.getValue()?.buy_currency ?? []
      : [];
  const [bankCountrySameAsBeneficiary, setBankCountrySameAsBeneficiary] =
    useState(true);

  useEffect(() => {
    if (bankCountrySameAsBeneficiary) {
      setValidationSchemaRequest((payload) => ({
        ...payload,
        bank_country: payload.destination_country,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankCountrySameAsBeneficiary]);

  useEffect(() => {
    setValidity(
      Boolean(
        validationSchemaRequest.bank_country &&
          validationSchemaRequest.beneficiary_account_type &&
          validationSchemaRequest.payment_method &&
          validationSchemaRequest.destination_country &&
          validationSchemaRequest.bank_currency,
      ),
    );
    if (
      prevValidationSchemaRequestRef.current &&
      prevValidationSchemaRequestRef.current !== validationSchemaRequest
    ) {
      onValueUpdate();
    }
    prevValidationSchemaRequestRef.current = validationSchemaRequest;
  }, [onValueUpdate, setValidity, validationSchemaRequest]);

  useEffect(() => {
    // This condition satifies an edit state only
    if (
      createBeneficiaryPayload?.beneficiary_country &&
      !validationSchemaRequest?.bank_country &&
      !validationSchemaRequest?.destination_country
    ) {
      setValidationSchemaRequest((prev) => ({
        ...prev,
        bank_country: createBeneficiaryPayload.beneficiary_country,
        destination_country: createBeneficiaryPayload.beneficiary_country,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography>Beneficiary Account Type</Typography>
        <ToggleButtonGroup
          fullWidth
          color='primary'
          value={validationSchemaRequest.beneficiary_account_type}
          exclusive
          onChange={(_event, value) => {
            setValidationSchemaRequest((payload) => ({
              ...payload,
              beneficiary_account_type:
                value as unknown as PangeaBeneficiaryAccountTypeEnum,
            }));
          }}
          sx={ToggleButtonGroupCustomStyle}
          aria-label='Beneficiary Classification'
        >
          <ToggleButton value={PangeaBeneficiaryAccountTypeEnum.Individual}>
            Individual
          </ToggleButton>
          <ToggleButton value={PangeaBeneficiaryAccountTypeEnum.Corporate}>
            Corporate
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Stack spacing={1}>
        <Typography>Method of Payment</Typography>
        <ToggleButtonGroup
          fullWidth
          color='primary'
          value={validationSchemaRequest.payment_method}
          exclusive
          onChange={(_event, value) => {
            setValidationSchemaRequest((payload) => ({
              ...payload,
              payment_method: value,
            }));
          }}
          sx={ToggleButtonGroupCustomStyle}
          aria-label='Method of Payment'
        >
          <ToggleButton value={PangeaPaymentDeliveryMethodEnum.Local}>
            ACH/ETF
          </ToggleButton>
          <ToggleButton value={PangeaPaymentDeliveryMethodEnum.Swift}>
            Swift/Wire
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <FormControl>
        <TextField
          name='Beneficiary Alias'
          label='Beneficiary Nickname'
          type='beneficiary-alias'
          autoComplete='beneficiary-alias'
          value={createBeneficiaryPayload.beneficiary_alias}
          onChange={(event) => {
            setCreateBeneficiaryPayload((beneficiaryPayload) => ({
              ...beneficiaryPayload,
              beneficiary_alias: event.target.value,
            }));
          }}
          helperText='This is how the beneficiary will appear throughout the Pangea platform.'
          FormHelperTextProps={{
            style: { paddingLeft: '14px' },
          }}
          fullWidth
          required
        />
      </FormControl>

      <FormControl>
        <InputLabel htmlFor='default-purpose'>Default Purpose</InputLabel>
        <Select
          labelId='default-purpose-label'
          id='default-purpose'
          value={createBeneficiaryPayload.default_purpose ?? ''}
          label='Default Purpose'
          required
          onChange={(event) => {
            setCreateBeneficiaryPayload((payload) => ({
              ...payload,
              default_purpose: event.target.value,
            }));
          }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
        >
          {Object.entries(PangeaDefaultPurposeEnum_LABEL_MAP).map(
            ([key, value], index) => (
              <MenuItem value={index + 1} key={key}>
                {value}
              </MenuItem>
            ),
          )}
        </Select>
        <FormHelperText style={{ paddingLeft: '14px' }}>
          Used as the default payment purpose, but can be updated in
          transactions.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <InputLabel htmlFor='bank-currency'>Bank Currency</InputLabel>
        <Select
          labelId='bank-currency-label'
          id='bank-currency'
          value={validationSchemaRequest.bank_currency ?? ''}
          label='Bank Currency'
          required
          onChange={(event) => {
            setValidationSchemaRequest((payload) => ({
              ...payload,
              bank_currency: event.target.value,
            }));
            setCreateBeneficiaryPayload((beneficiaryPayload) => ({
              ...beneficiaryPayload,
              destination_currency: event.target.value,
            }));
          }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
        >
          {allCurrencies.map(({ id, name, currency }) => (
            <MenuItem value={currency} key={id}>
              {`${currency} - ${name}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel htmlFor='destination-country'>
          Beneficiary Country
        </InputLabel>
        <Select
          labelId='destination-country-label'
          id='destination-country'
          value={createBeneficiaryPayload.beneficiary_country ?? ''}
          label='Beneficiary Country'
          required
          onChange={(event) => {
            setValidationSchemaRequest((payload) => ({
              ...payload,
              destination_country: event.target.value,
              ...(bankCountrySameAsBeneficiary
                ? { bank_country: event.target.value }
                : {}),
            }));
            setCreateBeneficiaryPayload((payload) => ({
              ...payload,
              beneficiary_country: event.target.value,
              ...(bankCountrySameAsBeneficiary
                ? { bank_country: event.target.value }
                : {}),
            }));
          }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
        >
          {countries.map(({ value, display_name }) => (
            <MenuItem value={value} key={value}>
              {`${value} - ${display_name}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={bankCountrySameAsBeneficiary}
              onChange={() =>
                setBankCountrySameAsBeneficiary((prevState) => !prevState)
              }
            />
          }
          label='Bank country is same as beneficiary country'
        />
      </FormControl>

      {!bankCountrySameAsBeneficiary && (
        <FormControl>
          <InputLabel htmlFor='bank-country'>Bank Country</InputLabel>
          <Select
            labelId='bank-country-label'
            id='bank-country'
            value={validationSchemaRequest.bank_country}
            label='Bank Country'
            required
            onChange={(event) => {
              setValidationSchemaRequest((payload) => ({
                ...payload,
                bank_country: event.target.value,
              }));
            }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
          >
            {countries.map(({ value, display_name }) => (
              <MenuItem value={value} key={value}>
                {`${value} - ${display_name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Stack>
  );
}

export default StepOne;
