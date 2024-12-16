import { Chip, Stack, Typography } from '@mui/material';
import { DataGridPro, GridColDef, useGridApiRef } from '@mui/x-data-grid-pro';
import { clientApiState } from 'atoms';
import { PangeaLoading } from 'components/shared';
import { useCacheableAsyncData } from 'hooks';
import { PangeaWallet, PangeaWalletTypeEnum } from 'lib';
import { isError } from 'lodash';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { currencyListState } from 'atoms';

const WalletsList = (): JSX.Element => {
  const api = useRecoilValue(clientApiState);
  const apiHelper = api.getAuthenticatedApiHelper();
  const currencies = useRecoilValue(currencyListState);

  const { data, isLoading } = useCacheableAsyncData(
    'allWalletsAsync',
    async () => {
      return await apiHelper.getAllSettlementWalletsAsync({
        type: PangeaWalletTypeEnum.Wallet,
      });
    },
  );

  const getCurrencyName = (mnemonic: string) =>
    currencies.find((currency) => currency.mnemonic === mnemonic)?.name;

  const gridApiRef = useGridApiRef();
  const columns: GridColDef<PangeaWallet>[] = [
    {
      field: 'name',
      renderHeader: () => {
        return (
          <Typography variant='tableHeader' sx={{ fontWeight: 500 }}>
            Wallet
          </Typography>
        );
      },
      flex: 3,
      renderCell: ({ row: { currency } }) => (
        <Stack spacing={1}>
          <Typography variant='body1'>{currency} Virtual Wallet</Typography>
          <Typography variant='body2' color='gray'>
            {getCurrencyName(currency)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'balance',
      flex: 1.5,
      renderHeader: () => {
        return (
          <Typography variant='tableHeader' sx={{ fontWeight: 500 }}>
            Available Balance
          </Typography>
        );
      },
      renderCell: ({ row: { latest_balance } }) => (
        <Typography variant='body2' color='gray'>
          ${latest_balance}
        </Typography>
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
  ];

  if (isLoading) {
    return <PangeaLoading centerPhrase loadingPhrase='Loading Wallets ...' />;
  }

  if (isError(data) || !data) {
    return <Typography>There was an error loading wallets</Typography>;
  }

  const walletsResults = data.results;

  return (
    <>
      <DataGridPro
        apiRef={gridApiRef}
        columns={columns}
        rows={walletsResults}
        rowHeight={80}
        disableSelectionOnClick
        disableColumnSelector
        disableColumnPinning
        getRowId={(row) => row.wallet_id}
      />
    </>
  );
};

export const WalletsManagement = (): JSX.Element => {
  return (
    <Stack spacing={3}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='h5'>Wallets</Typography>
      </Stack>
      <Stack sx={{ minHeight: '45rem' }}>
        <WalletsList />
      </Stack>
    </Stack>
  );
};

export default WalletsManagement;
