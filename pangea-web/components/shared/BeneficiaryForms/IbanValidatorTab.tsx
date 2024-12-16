import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, FormControl, Stack, TextField, Typography } from '@mui/material';
import {
  clientApiState,
  corPayAddBeneficiaryRequestDataState,
  iBanValidationData,
} from 'atoms';
import { useLoading } from 'hooks';
import { PangeaIbanValidationResponse } from 'lib';
import { isError } from 'lodash';
import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import PangeaButton from '../PangeaButton';
import PangeaLoading from '../PangeaLoading';
import SummaryDataPoint from '../SummaryDataPoint';
type IBanResponseViewProps = {
  data: PangeaIbanValidationResponse;
};
export function IbanValidatorTab() {
  const authHelper = useRecoilValue(clientApiState);
  const { loadingPromise, loadingState } = useLoading();
  const [beneficiaryDetails, setBeneficiaryDetails] = useRecoilState(
    corPayAddBeneficiaryRequestDataState,
  );
  const [ibanValidationResponse, setIbanValidationResponse] =
    useRecoilState(iBanValidationData);

  const handleIbanValidation = useCallback(async () => {
    const validateIban = async () => {
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const validationResponse = await api.validateIbanAsync({
          iban: beneficiaryDetails.iban ?? '',
        });
        if (validationResponse && !isError(validationResponse)) {
          setIbanValidationResponse(validationResponse);
          setBeneficiaryDetails((payload: any) => ({
            ...payload,
            bank_name: validationResponse.bank_name,
            bank_city: validationResponse.bank_city,
            swift_bic_code: validationResponse.swift_bic,
            bank_country: validationResponse.country,
            bank_address_line1: validationResponse.bank_address,
            bank_postal: validationResponse.postal_code,
            iban_digits: beneficiaryDetails.iban,
            iban_enabled: true,
            routing_code: validationResponse.routing_number,
            local_routing_code: validationResponse.routing_number,
          }));
        } else {
          setIbanValidationResponse(null);
        }
      } catch (error) {
        setIbanValidationResponse(null);
      }
    };
    await loadingPromise(validateIban());
  }, [
    authHelper,
    beneficiaryDetails.iban,
    loadingPromise,
    setBeneficiaryDetails,
    setIbanValidationResponse,
  ]);
  return (
    <Stack spacing={6}>
      <Stack direction='row' spacing={2} alignItems='center'>
        <FormControl sx={{ width: '80%' }}>
          <TextField
            id='iban'
            fullWidth
            label='IBAN'
            value={beneficiaryDetails.iban}
            variant='filled'
            onChange={(event) =>
              setBeneficiaryDetails((payload: any) => ({
                // TODO: Remove any
                ...payload,
                iban: event.target.value,
              }))
            }
          />
        </FormControl>
        <PangeaButton
          sx={{ width: '20%', minWidth: 'auto' }}
          loading={loadingState.isLoading}
          onClick={handleIbanValidation}
        >
          Validate
        </PangeaButton>
      </Stack>
      <Box
        mt={4}
        sx={{
          borderRadius: '.5rem',
          border: `1px solid ${PangeaColors.Gray}`,
          padding: '1rem .75rem',
          minHeight: '270px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={0}>
          {loadingState.isLoading && (
            <PangeaLoading loadingPhrase='Searching IBAN ...' />
          )}
          {ibanValidationResponse && !loadingState.isLoading && (
            <IbanResponseView data={ibanValidationResponse} />
          )}
          {!loadingState.isLoading && !ibanValidationResponse && (
            <Typography>Enter an IBAN number to search bank</Typography>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
function IbanResponseView({ data }: IBanResponseViewProps): JSX.Element {
  return (
    <Stack>
      <Stack sx={{ fontSize: '1rem', lineHeight: '24px' }} mb={2}>
        {data.is_valid ? (
          !data.is_warning ? (
            <Typography sx={{ display: 'flex' }}>
              <CheckCircleIcon color='success' sx={{ marginRight: 2 }} /> Valid
              IBAN Number
            </Typography>
          ) : (
            <Stack spacing={2}>
              <Typography sx={{ display: 'flex' }}>
                <ErrorIcon color='warning' /> Invalid IBAN Number
              </Typography>
              {data.validation_messages.map(({ message }) => (
                <Typography key={message} variant='body2'>
                  {message}
                </Typography>
              ))}
            </Stack>
          )
        ) : (
          <>
            <ErrorIcon color='error' />
          </>
        )}
      </Stack>
      {data.is_valid ? (
        <>
          <SummaryDataPoint
            label='Bank Associated with IBAN'
            value={data.iban}
          />
          <SummaryDataPoint label='ISO Country Code' value={data.country} />
          <SummaryDataPoint label='Bank Branch Code' value={data.branch_code} />
          <SummaryDataPoint
            label='Beneficiary Account Number'
            value={data.account_number}
          />
          <SummaryDataPoint label='Bank Swift Code' value={data.swift_bic} />
          <SummaryDataPoint
            label='Beneficiary Bank Name'
            value={data.bank_name}
          />
          <SummaryDataPoint label='Bank Address' value={data.bank_address} />
          <SummaryDataPoint label='Bank City' value={data.bank_city} />
          <SummaryDataPoint
            label='Bank Postal Code/Zip'
            value={data.postal_code}
          />
          <SummaryDataPoint label='Bank Country' value={data.country_name} />
        </>
      ) : (
        <>
          Please recheck the account number or enter the bank details manually
          by selecting “Enter Manually” below.
        </>
      )}
    </Stack>
  );
}

export default IbanValidatorTab;
