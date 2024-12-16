import { ArrowBack, HelpOutline } from '@mui/icons-material';
import { Divider, Stack, Typography } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid-pro';
import {
  hideDashboardState,
  selectedWalletDetailedActivity,
  walletActivityDataState,
} from 'atoms';
import { PangeaButton, PangeaLoading, PangeaTooltip } from 'components/shared';
import { useWalletGridColumns } from 'hooks/useWalletGridColumns';
import { formatAccountName, formatCurrency } from 'lib';
import router from 'next/router';
import { useEffect } from 'react';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import WalletMenuButton from './WalletMenuButton';
import WalletsGrid from './WalletsGrid';

const WalletOverview = () => {
  const selectedWallet = useRecoilValue(selectedWalletDetailedActivity);
  const setShowDashboardState = useSetRecoilState(hideDashboardState);
  const setSelectedWalletDetailedActivity = useSetRecoilState(
    selectedWalletDetailedActivity,
  );
  const walletActivityState = useRecoilValueLoadable(
    walletActivityDataState({
      fx_balance_id: selectedWallet?.id,
      include_details: true,
    }),
  );

  const gridApiRef = useGridApiRef();
  const columns = useWalletGridColumns(
    ['date', 'order_number', 'amount', 'balance'],
    gridApiRef,
    selectedWallet?.curr,
  );

  useEffect(() => {
    const beforeRouteHandler = (url: string) => {
      console.log(url, router.pathname);
      if (router.pathname !== url) {
        setShowDashboardState(false);
        setSelectedWalletDetailedActivity(null);
        router.events.emit('routeChangeError');
      }
    };
    router.events.on('routeChangeStart', beforeRouteHandler);

    return () => {
      router.events.off('routeChangeStart', beforeRouteHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      direction='column'
      justifyContent='center'
      spacing={2}
      paddingTop={2}
    >
      <PangeaButton
        variant='outlined'
        startIcon={<ArrowBack />}
        sx={{
          minWidth: '74px',
          width: '74px',
          marginTop: '24px',
          marginBottom: '16px',
        }}
        onClick={() => {
          setSelectedWalletDetailedActivity(null);
          setShowDashboardState(false);
        }}
      >
        Back
      </PangeaButton>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-end'
        spacing={1}
        sx={{ marginBottom: '16px !important' }}
      >
        <Stack
          direction='row'
          justifyContent='flex-start'
          alignItems='flex-end'
          spacing={1}
        >
          <Typography variant='h4' component='h1'>
            {selectedWallet?.curr_text}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: PangeaColors.BlackSemiTransparent60,
              fontSize: '14px',
            }}
          >
            {formatAccountName(selectedWallet?.text || '')}
          </Typography>
        </Stack>
        <WalletMenuButton />
      </Stack>
      <Stack
        direction='row'
        justifyContent='flex-start'
        alignItems='center'
        spacing={12}
        sx={{ marginBottom: '16px !important' }}
      >
        <Stack
          direction='row'
          justifyContent='flex-start'
          alignItems='flex-end'
          spacing={8}
        >
          <Stack spacing={1}>
            <Stack
              direction='row'
              justifyContent='flex-start'
              alignItems='center'
              spacing={1}
            >
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  color: PangeaColors.BlackSemiTransparent87,
                  fontSize: '14px',
                }}
              >
                Available Balance
              </Typography>
              <PangeaTooltip
                placement='right'
                title={
                  <Typography variant='body2'>
                    The amount that is available to use. Ledger Balance value
                    minus Balance Held value.
                  </Typography>
                }
                arrow
              >
                <HelpOutline
                  sx={{
                    height: '13.33px',
                    width: '13.33px',
                    color: PangeaColors.BlackSemiTransparent60,
                  }}
                />
              </PangeaTooltip>
            </Stack>
            {selectedWallet && (
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  color: PangeaColors.BlackSemiTransparent87,
                  fontSize: '24px',
                }}
              >
                {formatCurrency(
                  selectedWallet.available_balance,
                  selectedWallet.curr,
                  true,
                  2,
                  2,
                  false,
                )}
              </Typography>
            )}
          </Stack>
        </Stack>

        <Stack
          direction='row'
          justifyContent='flex-start'
          alignItems='flex-end'
          spacing={8}
        >
          <Stack spacing={1}>
            <Stack
              direction='row'
              justifyContent='flex-start'
              alignItems='center'
              spacing={1}
            >
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  color: PangeaColors.BlackSemiTransparent87,
                  fontSize: '14px',
                }}
              >
                Held Balance
              </Typography>
              <PangeaTooltip
                placement='right'
                title={
                  <Typography variant='body2'>
                    The amount in the FXBalance that is allocated to cover
                    payments that have been scheduled but are still incomplete
                    or outstanding.
                  </Typography>
                }
                arrow
              >
                <HelpOutline
                  sx={{
                    height: '13.33px',
                    width: '13.33px',
                    color: PangeaColors.BlackSemiTransparent60,
                  }}
                />
              </PangeaTooltip>
            </Stack>
            {selectedWallet && (
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  color: PangeaColors.BlackSemiTransparent87,
                  fontSize: '24px',
                }}
              >
                {formatCurrency(
                  selectedWallet.balance_held,
                  selectedWallet.curr,
                  true,
                  2,
                  2,
                  false,
                )}
              </Typography>
            )}
          </Stack>
        </Stack>

        <Stack
          direction='row'
          justifyContent='flex-start'
          alignItems='flex-end'
          spacing={8}
        >
          <Stack spacing={1}>
            <Stack
              direction='row'
              justifyContent='flex-start'
              alignItems='center'
              spacing={1}
            >
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  color: PangeaColors.BlackSemiTransparent87,
                  fontSize: '14px',
                }}
              >
                Ledger Balance
              </Typography>
              <PangeaTooltip
                placement='right'
                title={
                  <Typography variant='body2'>
                    The amount that was in the FXBalance at the end of the
                    previous business day.
                  </Typography>
                }
                arrow
              >
                <HelpOutline
                  sx={{
                    height: '13.33px',
                    width: '13.33px',
                    color: PangeaColors.BlackSemiTransparent60,
                  }}
                />
              </PangeaTooltip>
            </Stack>
            {selectedWallet && (
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  color: PangeaColors.BlackSemiTransparent87,
                  fontSize: '24px',
                }}
              >
                {formatCurrency(
                  selectedWallet.ledger_balance,
                  selectedWallet.curr,
                  true,
                  2,
                  2,
                  false,
                )}
              </Typography>
            )}
          </Stack>
        </Stack>
        {selectedWallet?.available_balance && (
          <Stack
            direction='row'
            justifyContent='flex-start'
            alignItems='flex-end'
            spacing={8}
          >
            <Stack spacing={1}>
              <Stack
                direction='row'
                justifyContent='flex-start'
                alignItems='center'
                spacing={1}
              >
                <Typography
                  variant='h4'
                  component='h1'
                  sx={{
                    color: PangeaColors.BlackSemiTransparent87,
                    fontSize: '14px',
                  }}
                >
                  Ledger Balance (USD)
                </Typography>
                <PangeaTooltip
                  placement='right'
                  title={
                    <Typography variant='body2'>
                      The amount in USD that was in the FXBalance at the end of
                      the previous business day.
                    </Typography>
                  }
                  arrow
                >
                  <HelpOutline
                    sx={{
                      height: '13.33px',
                      width: '13.33px',
                      color: PangeaColors.BlackSemiTransparent60,
                    }}
                  />
                </PangeaTooltip>
              </Stack>
              {selectedWallet && (
                <Typography
                  variant='h4'
                  component='h1'
                  sx={{
                    color: PangeaColors.BlackSemiTransparent87,
                    fontSize: '24px',
                  }}
                >
                  {formatCurrency(
                    selectedWallet.available_balance,
                    'usd',
                    true,
                    2,
                    2,
                    false,
                  )}
                </Typography>
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
      <Divider
        sx={{
          borderColor: `${PangeaColors.SolidSlateMediumSemiTransparent08}`,
          marginBottom: '16px !important',
        }}
      />
      <Typography variant='h4'>Activity</Typography>
      <Typography
        variant='body2'
        component='p'
        sx={{ marginTop: '8px !important' }}
      >
        View this account transfer and payment activity.
      </Typography>
      {walletActivityState.state === 'hasValue' ? (
        <WalletsGrid
          walletRows={walletActivityState.getValue()?.results ?? []}
          columns={columns}
          gridApiRef={gridApiRef}
        />
      ) : (
        <PangeaLoading loadingPhrase='Refreshing wallet data...' useBackdrop />
      )}
    </Stack>
  );
};

export default WalletOverview;
