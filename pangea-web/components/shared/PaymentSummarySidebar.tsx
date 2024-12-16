import { Stack, Typography, Divider } from '@mui/material';
import { transactionPaymentState } from 'atoms';
import { format } from 'date-fns';
import { useFeatureFlags, useWalletAndPaymentHelpers } from 'hooks';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

export const PaymentSummarySidebar: React.FC = () => {
  const { isFeatureEnabled } = useFeatureFlags();
  const isCurrencyInsightsEnabled = isFeatureEnabled('currency-insights');

  const payment = useRecoilValue(transactionPaymentState);
  const {
    allWallets,
    beneficiaryAccounts,
    settlementAccounts,
    isBeneficiaryAccount,
  } = useWalletAndPaymentHelpers();

  if (!payment) {
    return null;
  }

  const originId = payment.origin_account_id;
  const destinationId = payment.destination_account_id;

  const originAccount =
    allWallets.find((wallet) => wallet.wallet_id === originId) ??
    beneficiaryAccounts.find(
      (account) => account.beneficiary_id === originId,
    ) ??
    settlementAccounts.find((account) => account.wallet_id === originId);
  const destinationAccount =
    allWallets.find((wallet) => wallet.wallet_id === destinationId) ??
    beneficiaryAccounts.find(
      (account) => account.beneficiary_id === destinationId,
    ) ??
    settlementAccounts.find((account) => account.wallet_id === destinationId);

  return (
    <Stack
      direction='column'
      rowGap={0.7}
      mt={isCurrencyInsightsEnabled ? 4 : 9}
    >
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='dataLabel'>Created</Typography>
        <Typography variant='dataBody'>
          {format(new Date(payment.created), 'MM/dd/yyyy')}
        </Typography>
      </Stack>
      {payment.origin_account_id && (
        <>
          <Divider sx={{ borderColor: PangeaColors.Gray }} />
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography variant='dataLabel'>Origin</Typography>
            <Typography
              variant='dataBody'
              sx={{
                maxWidth: '50%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {isBeneficiaryAccount(originAccount)
                ? originAccount.beneficiary_alias
                : originAccount?.name}
            </Typography>
          </Stack>
        </>
      )}
      {payment.destination_account_id && (
        <>
          <Divider sx={{ borderColor: PangeaColors.Gray }} />
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography variant='dataLabel'>Destination</Typography>
            <Typography
              variant='dataBody'
              sx={{
                maxWidth: '50%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {isBeneficiaryAccount(destinationAccount)
                ? destinationAccount.beneficiary_alias
                : destinationAccount?.name}
            </Typography>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default PaymentSummarySidebar;
