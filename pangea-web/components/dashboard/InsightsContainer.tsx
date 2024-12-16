import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid-pro';
import { PangeaButton } from 'components/shared';
import { useInsightsGridColumns } from 'hooks/useInsightsGridColumns';
import {
  PangeaFXBalanceAccountsResponseItem,
  formatCurrency,
  randomRgbColor,
} from 'lib';
import { useMemo } from 'react';
import { PangeaColors } from 'styles';
import { VictoryPie } from 'victory';
import InsightsGrid from './InsightsGrid';

interface InsightsContainerProps {
  displayBalances: PangeaFXBalanceAccountsResponseItem[];
  balances: PangeaFXBalanceAccountsResponseItem[];
  setDisplayBalances: React.Dispatch<React.SetStateAction<any[]>>;
}
const mapCurrencyToColor = (curr: string) => {
  switch (curr) {
    case 'USD':
      return PangeaColors.SecurityGreenDarker;
    case 'YEN':
      return PangeaColors.WarmOrangeMedium;
    case 'GBP':
      return PangeaColors.ConnectedVioletMedium;
    case 'AUD':
      return PangeaColors.VisionCyanMedium;
    case 'EUR':
      return PangeaColors.CautionYellowMedium;
    case 'ZAR':
      return PangeaColors.EarthBlueMedium;
    case 'CAD':
      return PangeaColors.NoteGreenMedium;
    case 'GHS':
      return PangeaColors.ConnectedVioletLight;
    case 'BRL':
      return PangeaColors.RiskBerryMedium;
    default:
      return randomRgbColor();
  }
};
const InsightsContainer = (props: InsightsContainerProps) => {
  const { displayBalances, balances, setDisplayBalances } = props;
  const gridApiRef = useGridApiRef();

  const totalBalance = useMemo(() => {
    return balances.reduce(
      (prev, acc) => prev + (acc.available_balance ?? 0),
      0,
    );
  }, [balances]);
  const columns = useInsightsGridColumns(
    ['curr', 'available_balance', 'percentage'],
    totalBalance,
    gridApiRef,
  );

  const handleShowMore = () => {
    if (displayBalances.length === balances.length) {
      setDisplayBalances([
        ...balances.slice(0, 6),
        balances.slice(7).reduce((prev, acc) => {
          return {
            ...prev,
            available_balance: prev.available_balance + acc.available_balance,
            curr: '',
            id: '99',
          };
        }),
      ]);
    } else {
      setDisplayBalances(balances);
    }
  };
  const newBalances = useMemo(() => {
    return displayBalances.map((balance) => {
      return { ...balance, color: mapCurrencyToColor(balance.curr) };
    });
  }, [displayBalances]);
  const chartData = useMemo(() => {
    return newBalances.map((balance) => {
      return {
        y: ((balance.available_balance ?? 0) / totalBalance) * 100,
        fill: balance.color,
      };
    });
  }, [newBalances, totalBalance]);
  return (
    <Stack
      direction='row'
      style={{
        border: `2px solid ${PangeaColors.Gray}`,
        borderRadius: `4px`,
        paddingBottom: 48,
        padding: 24,
      }}
    >
      <Stack sx={{ width: '60%' }}>
        <Stack>
          <Typography variant='body2' component='p'>
            Total Balance All Wallets (USD)
          </Typography>
          <Typography variant='h4' component='h1' style={{ paddingTop: '5px' }}>
            {formatCurrency(totalBalance, 'usd') ?? 0}
          </Typography>
        </Stack>
        <Stack>
          <InsightsGrid
            walletRows={newBalances}
            columns={columns}
            gridApiRef={gridApiRef}
          />
        </Stack>
        <Stack
          justifyContent='space-between'
          alignItems='flex-end'
          direction={'row'}
          spacing={1}
        >
          {balances.length > 6 && (
            <PangeaButton
              size='small'
              sx={{ width: '6px', height: '30px', border: 'none' }}
              endIcon={
                displayBalances.length == balances.length ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              }
              onClick={handleShowMore}
            >
              {displayBalances.length == balances.length
                ? 'Show less'
                : `Show more`}
            </PangeaButton>
          )}

          <Typography
            sx={{ fontSize: '12px', color: PangeaColors.StoryWhiteDark }}
          >
            Balance (USD) calculated at benchmark price EOD yesterday.
          </Typography>
          <Box />
        </Stack>
      </Stack>
      <Stack justifyItems={'flex-start'}>
        <VictoryPie
          animate={{
            duration: 2000,
          }}
          labels={() => ''}
          padAngle={1}
          innerRadius={100}
          data={chartData}
          style={{
            data: {
              fill: ({ datum }) => datum.fill || 'green',
            },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default InsightsContainer;
