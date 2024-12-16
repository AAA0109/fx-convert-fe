import { DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { SummaryDataPoint } from 'components/shared';
import { PangeaWallet, formatCurrency } from 'lib';
import CloseIcon from '@mui/icons-material/Close';

type WalletAccountDetailsProps = {
  account: PangeaWallet;
  onCloseModal(): void;
};

export function WalletAccountDetails({
  account,
  onCloseModal,
}: WalletAccountDetailsProps): JSX.Element {
  const { name, currency, account_number, latest_balance } = account;
  return (
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
          {`${name}`}
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
          label='Account number'
          value={account_number ?? 'N/A'}
        />
        <SummaryDataPoint
          label='Ledger balance'
          value={formatCurrency(0, currency, true, 2, 2, false)}
        />
        <SummaryDataPoint
          label='Held balance'
          value={formatCurrency(0, currency, true, 2, 2, false)}
        />
        <SummaryDataPoint
          label='Available balance'
          value={formatCurrency(latest_balance, currency, true, 2, 2, false)}
        />
      </Stack>
    </>
  );
}
