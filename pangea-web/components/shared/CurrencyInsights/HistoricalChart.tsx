import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import {
  Chip,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import {
  clientApiState,
  paymentspotRateDataState,
  transactionRequestDataState,
} from 'atoms';
import CustomLineBarTooltipForExplore from 'components/explore/customLineBarTooltipForExplore';
import { addDays, parseISO } from 'date-fns';
import { useCacheableAsyncData } from 'hooks';
import { ChartInterval, formatExchangeRateMaxFiveDigits, setAlpha } from 'lib';
import { memo, Suspense, useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory';
import PangeaLoading from '../PangeaLoading';
import PangeaTooltip from '../PangeaTooltip';
import { useHistoricalChart } from './hooks';

interface Datum {
  date?: string;
  rate?: number;
  rateFlu?: number;
  _voronoiY: number;
  _voronoiX: number;
}

type ComponentState = {
  chartInterval: ChartInterval;
  startDate: string;
};

export const HistoricalChart = memo(function HistoricalChart() {
  const [chartState, setChartState] = useState<ComponentState>({
    chartInterval: ChartInterval.Month3,
    startDate: addDays(parseISO(new Date().toISOString()), -91).toISOString(),
  });
  const [hoveredData, setHoveredData] = useState<Datum | undefined>(undefined);

  const { chartInterval, startDate } = chartState;
  const today = parseISO(new Date().toISOString());
  const queryClient = useQueryClient();
  const { marketDataOrganizer } = useHistoricalChart(chartInterval);
  const paymentSpotRateData = useRecoilValue(paymentspotRateDataState);
  const authHelper = useRecoilValue(clientApiState);
  const transactionData = useRecoilValue(transactionRequestDataState);
  const api = authHelper.getAuthenticatedApiHelper();
  const marketAvailable = paymentSpotRateData?.status;
  const mnemonic = paymentSpotRateData ? paymentSpotRateData.market : '';
  const queryKey = `price_history_${mnemonic}_${startDate}_${transactionData.payment_currency}_${transactionData.settlement_currency}`;

  const {
    data: fxData,
    isLoading,
    isRefetching,
    isFetching,
    isPending,
    refetchData,
  } = useCacheableAsyncData(queryKey, async () => {
    return marketDataOrganizer(
      await api.loadMarketDataForExploreAsync(
        transactionData.payment_currency,
        transactionData.settlement_currency,
        parseISO(startDate),
        parseISO(new Date().toISOString()),
      ),
    );
  });

  const lastRateFlu = useMemo(
    () =>
      hoveredData && hoveredData?.rateFlu
        ? hoveredData.rateFlu
        : fxData && fxData[fxData.length - 1]?.rateFlu !== undefined
        ? parseFloat(fxData[fxData.length - 1].rateFlu ?? '') ?? 0
        : 0,
    [fxData, hoveredData],
  );
  const denominator = marketAvailable?.market
    ? marketAvailable.market.substring(3)
    : '-';
  const isRateFluPositive = lastRateFlu > 0;
  const showLoader = isLoading || isRefetching || isFetching || isPending;

  const useChartIntervalHandler = (interval: ChartInterval, days: number) =>
    useCallback(async () => {
      setChartState({
        chartInterval: interval,
        startDate: addDays(today, -days).toISOString(),
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKey],
        refetchType: 'none',
      });
      refetchData();
    }, [days, interval]);

  const handleThreeMonthsClick = useChartIntervalHandler(
    ChartInterval.Month3,
    91,
  );

  const handleOneYearClick = useChartIntervalHandler(ChartInterval.Year1, 366);

  const handleFiveYearsClick = useChartIntervalHandler(
    ChartInterval.Year5,
    1826,
  );

  return (
    <Suspense fallback={<PangeaLoading />}>
      {fxData?.length === 0 ? (
        <Stack justifyContent={'center'} alignItems={'center'} flex={1}>
          <Typography>No price history available for this market</Typography>
        </Stack>
      ) : showLoader ? (
        <Stack alignItems={'center'} flex={1}>
          <PangeaLoading centerPhrase />
        </Stack>
      ) : (
        <Stack
          direction='column'
          justifyContent='center'
          alignItems='flex-start'
          width='100%'
        >
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            mb={2}
            width='100%'
          >
            <Stack>
              <Typography
                variant='dataLabel'
                color={setAlpha(PangeaColors.Black, 0.87)}
              >
                {marketAvailable?.market}
              </Typography>
              <Typography variant='h4' mb={0.5}>
                {hoveredData && hoveredData.rate
                  ? formatExchangeRateMaxFiveDigits(hoveredData.rate)
                  : paymentSpotRateData?.rate
                  ? formatExchangeRateMaxFiveDigits(paymentSpotRateData.rate)
                  : '-'}{' '}
                {denominator}
              </Typography>
              <Stack direction='row' columnGap={0.5} alignItems='center'>
                <Typography
                  variant='componentsChip'
                  color={
                    isRateFluPositive
                      ? PangeaColors.SecurityGreenMedium
                      : PangeaColors.RiskBerryMedium
                  }
                  display='flex'
                  flexDirection='row'
                  alignItems='center'
                >
                  {isRateFluPositive ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )}{' '}
                  {`${lastRateFlu}%`}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction='row' columnGap={1}>
              <Chip
                label={ChartInterval.Month3}
                color={
                  chartInterval == ChartInterval.Month3 ? 'primary' : 'default'
                }
                onClick={handleThreeMonthsClick}
                sx={{
                  height: '1.5rem',
                  '&.Mui-disabled': {
                    opacity: 1,
                  },
                }}
                disabled={chartInterval == ChartInterval.Month3}
                clickable
              />
              <Chip
                label={ChartInterval.Year1}
                color={
                  chartInterval == ChartInterval.Year1 ? 'primary' : 'default'
                }
                onClick={handleOneYearClick}
                sx={{
                  height: '1.5rem',
                  '&.Mui-disabled': {
                    opacity: 1,
                  },
                }}
                disabled={chartInterval == ChartInterval.Year1}
                clickable
              />
              <Chip
                label={ChartInterval.Year5}
                color={
                  chartInterval == ChartInterval.Year5 ? 'primary' : 'default'
                }
                onClick={handleFiveYearsClick}
                sx={{
                  height: '1.5rem',
                  '&.Mui-disabled': {
                    opacity: 1,
                  },
                }}
                disabled={chartInterval == ChartInterval.Year5}
                clickable
              />
            </Stack>
          </Stack>
          <Stack
            width='100%'
            sx={{
              flex: 1,
              '& svg': {
                overflow: 'visible',
              },
            }}
          >
            <VictoryChart
              width={400}
              height={200}
              domainPadding={{ x: [0, 0], y: [40, 30] }}
              theme={VictoryTheme.material}
              scale={{ x: 'time', y: 'linear' }}
              padding={{ top: 0, bottom: 0, left: 30, right: 20 }}
              containerComponent={
                <VictoryVoronoiContainer
                  labels={() => ' '}
                  labelComponent={<CustomLineBarTooltipForExplore />}
                  voronoiDimension='x'
                  onActivated={(points: any[]) => {
                    if (points && points.length > 0) {
                      setHoveredData(
                        points.find(
                          ({ childName }) => childName === 'fx-performance',
                        ),
                      );
                    }
                  }}
                  events={{
                    onMouseOut: () => {
                      setHoveredData(undefined);
                    },
                  }}
                />
              }
            >
              <VictoryLine
                name='50-moving-average'
                data={fxData}
                x={'xDate'}
                y='rate_ma'
                interpolation='natural'
                style={{
                  data: {
                    stroke: PangeaColors.Gray,
                    strokeWidth: '1.5px',
                  },
                }}
              />
              <VictoryLine
                name='fx-performance'
                data={fxData}
                x={'xDate'}
                y='rate'
                interpolation='natural'
                style={{
                  data: {
                    stroke: PangeaColors.EarthBlueMedium,
                    strokeWidth: '1.5px',
                  },
                }}
              />
              <VictoryScatter
                name='unhedged-performance-scatter'
                data={fxData}
                x={'xDate'}
                y='rate'
                style={{
                  data: {
                    stroke: PangeaColors.Gray,
                    strokeWidth: 0.5,
                    fill: PangeaColors.EarthBlueMedium,
                  },
                }}
                size={({ active }) => (active ? 3 : 0)}
              />
              <VictoryAxis // x-axis
                tickCount={6}
                fixLabelOverlap
                style={{
                  axis: {
                    strokeWidth: 1,
                    strokeDasharray: '3,3',
                  },
                  axisLabel: {
                    fontSize: 10,
                    padding: 10,
                  },
                  grid: { display: 'none' },
                  ticks: { display: 'none' },
                  tickLabels: {
                    padding: 0,
                    fontFamily: 'SuisseIntl',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '8px',
                    lineHeight: '18px',
                    textTransform: 'capitalize',
                    letterSpacing: '0.16px',
                    fill: setAlpha(PangeaColors.Black, 0.38),
                  },
                }}
                offsetY={0}
              />
              <VictoryAxis // y-axis
                dependentAxis
                tickCount={12}
                tickFormat={(t: number) =>
                  `${formatExchangeRateMaxFiveDigits(t)}`
                }
                fixLabelOverlap
                style={{
                  axis: {
                    strokeWidth: 1,
                    strokeDasharray: '3,3',
                  },
                  axisLabel: {
                    fontSize: 15,
                    padding: 0,
                  },
                  grid: { display: 'none' },
                  ticks: { display: 'none' },
                  tickLabels: {
                    padding: 0,
                    fontFamily: 'SuisseIntl',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '8px',
                    lineHeight: '18px',
                    textTransform: 'capitalize',
                    letterSpacing: '0.16px',
                    fill: setAlpha(PangeaColors.Black, 0.38),
                  },
                }}
              />
            </VictoryChart>
          </Stack>
          <Stack
            direction='row'
            mt={5}
            mb='6px'
            ml={7}
            columnGap={4}
            alignItems='center'
          >
            <Stack direction='row' alignItems='center' columnGap={1}>
              <Divider
                sx={{
                  borderColor: PangeaColors.EarthBlueMedium,
                  width: '1.5rem',
                  borderWidth: '0.15rem',
                }}
              />
              <Typography variant='componentsChip'>Exchange Rate</Typography>
              <PangeaTooltip
                title={
                  <Stack pt={1.5}>
                    <Typography variant='toolTip'>
                      Exchange rates track currency value fluctuations:
                    </Typography>
                    <List>
                      <ListItem>
                        <Typography variant='toolTip'>
                          &bull; 3M chart: Daily rates
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <Typography variant='toolTip'>
                          &bull; 1Y chart: Weekly rates
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <Typography variant='toolTip'>
                          &bull; 5Y chart: Monthly rates
                        </Typography>
                      </ListItem>
                    </List>
                  </Stack>
                }
                placement='right'
                arrow
              >
                <InfoOutlined
                  sx={{ color: setAlpha(PangeaColors.Black, 0.3) }}
                />
              </PangeaTooltip>
            </Stack>

            <Stack direction='row' alignItems='center' columnGap={1}>
              <Divider
                sx={{
                  borderColor: PangeaColors.Gray,
                  width: '1.5rem',
                  borderWidth: '0.15rem',
                }}
              />
              <Typography variant='componentsChip'>
                Trend (Moving Average)
              </Typography>
              <PangeaTooltip
                title={
                  <Stack pt={1.5}>
                    <Typography variant='toolTip'>
                      Trend lines reveal underlying patterns by smoothing price
                      data:
                    </Typography>
                    <List>
                      <ListItem>
                        <Typography variant='toolTip'>
                          &bull; 3M chart: 20-Day EWMA
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <Typography variant='toolTip'>
                          &bull; 1Y chart: 50-Day MA
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <Typography variant='toolTip'>
                          &bull; 5Y chart: 200-Day MA
                        </Typography>
                      </ListItem>
                    </List>
                  </Stack>
                }
                placement='right'
                arrow
              >
                <InfoOutlined
                  sx={{ color: setAlpha(PangeaColors.Black, 0.3) }}
                />
              </PangeaTooltip>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Suspense>
  );
});

export default HistoricalChart;
