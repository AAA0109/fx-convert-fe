import Close from '@mui/icons-material/Close';
import {
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  DialogTitle,
} from '@mui/material';
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';

import { styled } from '@mui/material/styles';
import { clientApiState } from 'atoms';
import { PangeaLoading } from 'components/shared';
import { useCacheableAsyncData } from 'hooks';
import {
  PangeaBeneficiary,
  PangeaWallet,
  PangeaWalletTypeEnum,
  setAlpha,
} from 'lib';
import { isError } from 'lodash';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Dialog from '@mui/material/Dialog';
import FundingAccountManagementActions from './FundingAccountManagementActions';

const FundingAccountList = (): JSX.Element => {
  const api = useRecoilValue(clientApiState);
  const apiHelper = api.getAuthenticatedApiHelper();

  const { data, isLoading, refetchData } = useCacheableAsyncData(
    'allFundingAccounts',
    async () => {
      return await apiHelper.getAllSettlementWalletsAsync({
        type: PangeaWalletTypeEnum.Settlement,
      });
    },
  );

  const gridApiRef = useGridApiRef();
  const columns: GridColDef<PangeaWallet>[] = [
    {
      field: 'name',
      renderHeader: () => {
        return (
          <Typography variant='tableHeader' sx={{ fontWeight: 500 }}>
            Funding Account
          </Typography>
        );
      },
      flex: 3,
      renderCell: ({
        row: { name, nickname, bank_name, currency, account_number },
      }) => (
        <Stack spacing={1}>
          <Typography variant='body1'>
            {name} {nickname ? `(${nickname})` : null}
          </Typography>
          <Typography variant='body2' color='gray'>
            {bank_name} - {currency} (...{account_number?.slice(-4)})
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'broker',
      flex: 1.5,
      renderHeader: () => {
        return (
          <Typography variant='tableHeader' sx={{ fontWeight: 500 }}>
            Broker
          </Typography>
        );
      },
      renderCell: ({ row: { broker } }) => (
        <Chip
          label={broker.name}
          size='small'
          sx={{
            borderRadius: '1rem',
            textTransform: 'capitalize',
            fontWeight: 400,
            fontSize: '0.8125rem',
            lineHeight: '1.125rem',
            backgroundColor: PangeaColors.EarthBlueMedium,
            color: PangeaColors.White,
          }}
        />
      ),
    },
    {
      field: 'default',
      flex: 1.5,
      renderHeader: () => {
        return null;
      },
      renderCell: ({ row: { default: isDefault } }) => (
        <Typography variant='dataLabel'>
          {isDefault ? 'Default' : null}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      filterable: false,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams<PangeaBeneficiary>) => (
        <FundingAccountManagementActions
          status={params.row.status}
          account={params.row}
          refetchData={refetchData}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <PangeaLoading
        centerPhrase
        loadingPhrase='Loading Funding Accounts ...'
      />
    );
  }

  if (isError(data) || !data) {
    return <Typography>There was an error loading funding accounts</Typography>;
  }

  const fundingAccounts = data.results;

  return (
    <>
      <DataGridPro
        apiRef={gridApiRef}
        columns={columns}
        rows={fundingAccounts}
        rowHeight={80}
        disableSelectionOnClick
        disableColumnSelector
        disableColumnPinning
        getRowId={(row) => row.wallet_id}
      />
    </>
  );
};

export const FundingAccountManagement = (): JSX.Element => {
  const [fundingAccountsModalOpen, setFundingAccountsModalOpen] =
    useState(false);

  const CustomDialog = styled(Dialog)(() => ({
    '.MuiPaper-root': {
      backgroundColor: PangeaColors.StoryWhiteMedium,
      padding: '1.5rem',
    },
    '& .MuiDialog-paper': {
      width: '440px',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
  }));

  return (
    <Stack spacing={3}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='h5'>Funding Accounts</Typography>
      </Stack>
      <Stack sx={{ minHeight: '45rem' }}>
        <FundingAccountList />
      </Stack>

      <Stack direction='row'>
        <Button
          onClick={() => setFundingAccountsModalOpen(true)}
          startIcon={<InfoOutlinedIcon />}
          sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            color: PangeaColors.SolidSlateMedium,
            ':hover': {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}
        >
          About Funding Accounts
        </Button>
      </Stack>

      <CustomDialog
        onClose={() => setFundingAccountsModalOpen(false)}
        open={fundingAccountsModalOpen}
      >
        <DialogTitle
          style={{
            padding: '0px',
          }}
        >
          <Stack
            direction={'row'}
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <Typography variant='h5' component={'h2'}>
              About Funding Accounts
            </Typography>
            <IconButton
              aria-label='close'
              onClick={() => setFundingAccountsModalOpen(false)}
            >
              <Close
                style={{
                  width: '24px',
                  height: '24px',
                  color: setAlpha(PangeaColors.Black, 0.54),
                }}
              />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Stack gap={1}>
          <Typography variant='body1'>Default Funding Account</Typography>
          <Typography variant='body2'>
            The primary account used for transactions. You can select different
            funding accounts in each transaction.
          </Typography>
        </Stack>

        <Stack mt={2} gap={1}>
          <Typography variant='body1'>External Bank Accounts</Typography>
          <Typography variant='body2'>
            Accounts outside Pangea used for funding transfers or receiving
            withdrawals.
          </Typography>
        </Stack>

        <Stack mt={2} gap={1}>
          <Typography variant='body1'>Virtual Currency Wallets</Typography>
          <Typography variant='body2'>
            Digital wallets in Pangea that can securely hold multiple currencies
            for sending and receiving funds.
          </Typography>
        </Stack>

        <Stack mt={2} gap={1}>
          <Typography variant='body1'>Fund via Deposit</Typography>
          <Typography variant='body2'>
            A funding option via wire or ETF, sometimes required based on your
            jurisdiction or the payment type.
          </Typography>
        </Stack>

        <Stack mt={2} mb={3} gap={1}>
          <Typography variant='body1'>Changing Funding Accounts</Typography>
          <Typography variant='body2'>
            Need to add or remove a funding account? Contact your Client Advisor
            or email Sales@Pangea.io.
          </Typography>
        </Stack>

        <Button
          variant='outlined'
          fullWidth
          size='large'
          onClick={() => setFundingAccountsModalOpen(false)}
        >
          Close
        </Button>
      </CustomDialog>
    </Stack>
  );
};

export default FundingAccountManagement;
