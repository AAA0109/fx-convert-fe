import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { corPayBeneficiaryAccountDetailsState } from 'atoms';
import { PangeaLoading, SummaryDataPoint } from 'components/shared';
import { PangeaBeneficiary } from 'lib';
import { useRecoilValueLoadable } from 'recoil';

type BeneficiaryAccountDetailsProps = {
  account: PangeaBeneficiary;
  onCloseModal(): void;
};
export function BeneficiaryAccountDetails({
  account,
  onCloseModal,
}: BeneficiaryAccountDetailsProps): JSX.Element {
  const accountDetailsLoadable = useRecoilValueLoadable(
    corPayBeneficiaryAccountDetailsState(account.beneficiary_id),
  );
  const isLoading = accountDetailsLoadable.state === 'loading';
  const hasAccount = accountDetailsLoadable.state === 'hasValue';
  const accountDetails =
    !isLoading && hasAccount ? accountDetailsLoadable.getValue() : null;
  return (
    <>
      {isLoading && (
        <PangeaLoading
          centerPhrase
          loadingPhrase='Loading account details...'
        />
      )}
      {accountDetails && (
        <>
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <Typography variant='h4' component='span'>
              Account Details
            </Typography>
            <IconButton
              aria-label='close'
              onClick={() => onCloseModal()}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Stack>
            <SummaryDataPoint
              label='Account identifier'
              value={
                accountDetails.beneficiary_alias
                  ? accountDetails.beneficiary_alias
                  : accountDetails.beneficiary_id
              }
            />
            <SummaryDataPoint
              label='Account holder name'
              value={accountDetails.beneficiary_name}
            />
            <SummaryDataPoint
              label='Account number'
              value={accountDetails.bank_account_number}
            />
            <SummaryDataPoint
              label='Payment method'
              value={accountDetails.payment_methods
                ?.map((method) => method)
                .join(', ')}
            />
            <SummaryDataPoint
              label='Currency'
              value={accountDetails.destination_currency}
            />
            <SummaryDataPoint
              label='Bank name'
              value={accountDetails.bank_name}
            />
            <SummaryDataPoint
              label='Bank address'
              value={`${accountDetails.bank_address_1}${
                accountDetails.bank_address_2
                  ? `, ${accountDetails.bank_address_2}`
                  : ''
              }`}
            />
          </Stack>
        </>
      )}
    </>
  );
}

export default BeneficiaryAccountDetails;
