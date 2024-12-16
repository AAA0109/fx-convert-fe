import {
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { ActionContainer, SummaryDataPoint } from 'components/shared';
import { useWalletAndPaymentHelpers } from 'hooks';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  title: string;
};

export const SettlementAccounts = ({ title }: Props): JSX.Element => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const {
    settlementAccounts,
    renderHelperText,
    setOpenDialog,
    openDialog,
    CustomDialog,
    selectedAccountForDetails,
    isSettlementAccount,
  } = useWalletAndPaymentHelpers();
  const handleAccountChanged = debounce(
    useCallback(
      (event: SelectChangeEvent) => setSelectedAccount(event.target.value),
      [],
    ),
    600,
  );
  return (
    <ActionContainer title={title}>
      <FormControl>
        <InputLabel id='transfer-from-label'>Settlement accounts</InputLabel>
        <Select
          labelId='transfer-from-label'
          id='transfer-from'
          value={selectedAccount}
          label='Select to view linked settlement accounts'
          required
          onChange={handleAccountChanged}
          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
        >
          {settlementAccounts.map((account) => {
            const { name, wallet_id } = account;
            return (
              <MenuItem key={wallet_id} value={wallet_id}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
        {renderHelperText(selectedAccount)}
      </FormControl>
      <CustomDialog onClose={() => setOpenDialog(false)} open={openDialog}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          {selectedAccount && (
            <Typography variant='h4' component='span'>
              Account Details
            </Typography>
          )}
          <IconButton
            aria-label='close'
            onClick={() => setOpenDialog(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {selectedAccountForDetails &&
          isSettlementAccount(selectedAccountForDetails) && (
            <Stack>
              <SummaryDataPoint
                label='Account identifier'
                value={selectedAccountForDetails.wallet_id}
              />
              <SummaryDataPoint
                label='Account holder name'
                value={selectedAccountForDetails.name ?? 'N/A'}
              />
              <SummaryDataPoint
                label='Account number'
                value={selectedAccountForDetails.account_number ?? 'N/A'}
              />
              <SummaryDataPoint
                label='Payment method'
                value={selectedAccountForDetails.method ?? 'N/A'}
              />
              <SummaryDataPoint
                label='Currency'
                value={selectedAccountForDetails.currency}
              />
              <SummaryDataPoint label='Account address' value='N/A' />
              <SummaryDataPoint
                label='Bank name'
                value={selectedAccountForDetails.bank_name ?? 'N/A'}
              />
              <SummaryDataPoint label='Bank address' value='N/A' />
            </Stack>
          )}
      </CustomDialog>
    </ActionContainer>
  );
};

export default SettlementAccounts;
