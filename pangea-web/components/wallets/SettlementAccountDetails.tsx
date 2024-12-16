import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { SummaryDataPoint } from 'components/shared';
import { PangeaWallet } from 'lib';

type SettlementAccountDetailsProps = {
  account: PangeaWallet;
  onCloseModal(): void;
};

export function SettlementAccountDetails({
  account,
  onCloseModal,
}: SettlementAccountDetailsProps): JSX.Element {
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
          value={account.wallet_id}
        />
        <SummaryDataPoint
          label='Account holder name'
          value={account.description ?? 'N/A'}
        />
        <SummaryDataPoint
          label='Account number'
          value={account.account_number ?? 'N/A'}
        />
        <SummaryDataPoint
          label='Payment method'
          value={account.method ?? 'N/A'}
        />
        <SummaryDataPoint label='Currency' value={account.currency} />
        <SummaryDataPoint label='Account address' value='N/A' />
        <SummaryDataPoint
          label='Bank name'
          value={account.bank_name ?? 'N/A'}
        />
        <SummaryDataPoint label='Bank address' value='N/A' />
      </Stack>
    </>
  );
}
