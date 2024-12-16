import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Chip, Stack, Typography } from '@mui/material';
import {
  clientApiState,
  paymentspotRateDataState,
  transactionRequestDataState,
} from 'atoms';
import { CustomAreaTooltip } from 'components/cashflow';
import { addDays, formatISO } from 'date-fns';
import { useCacheableAsyncData } from 'hooks';
import {
  formatExchangeRateMaxFiveDigits,
  PangeaGetCashflowRiskConeResponse,
  PangeaSingleCashflow,
  setAlpha,
  VolatilityScenario,
} from 'lib';
import { isEqual } from 'lodash';
import { memo, Suspense, useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import {
  InterpolationPropType,
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory';
import PangeaLoading from '../PangeaLoading';
import PangeaTooltip from '../PangeaTooltip';

type RiskParamsCashflow =
  | Array<
      Partial<PangeaSingleCashflow> & {
        currency: string;
        calendar: string;
        roll_convention: string;
      }
    >
  | null
  | undefined;
type RiskParamsMemo = {
  endDate: string;
  cashflows: {
    [x: string]: RiskParamsCashflow;
  };
};

const MAJOR_CCY = ['EUR', 'GBP', 'AUD', 'NZD', 'CHF'];

export const VolatilityChart = memo(function VolatilityChart() {
  const transactionRequestData = useRecoilValue(transactionRequestDataState);
  const paymentSpotRateData = useRecoilValue(paymentspotRateDataState);
  const authHelper = useRecoilValue(clientApiState);
  const api = authHelper.getAuthenticatedApiHelper();
  const interpolationMethod: InterpolationPropType = 'catmullRom';
  const [volatilityScenario, setVolatilityScenario] =
    useState<VolatilityScenario>(VolatilityScenario.High);

  const startDate = formatISO(new Date(), { representation: 'date' });
  const { endDate, cashflows }: RiskParamsMemo = useMemo((): RiskParamsMemo => {
    switch (transactionRequestData.frequency) {
      case 'onetime':
        return {
          endDate: formatISO(
            transactionRequestData.delivery_date ?? addDays(new Date(), 6),
            {
              representation: 'date',
            },
          ),
          cashflows: {
            [transactionRequestData.payment_currency]: [
              {
                amount: -transactionRequestData.amount,
                currency: transactionRequestData.payment_currency,
                pay_date: formatISO(
                  transactionRequestData.delivery_date ??
                    addDays(new Date(), 6),
                  {
                    representation: 'date',
                  },
                ),
                calendar: 'NULL_CALENDAR',
                description: 'test',
                name: 'test',
                roll_convention: 'NEAREST',
              },
            ],
          },
        };
      case 'recurring':
        return {
          endDate: formatISO(
            transactionRequestData.periodicity_end_date ??
              addDays(new Date(), 6),
            {
              representation: 'date',
            },
          ),
          cashflows: {
            [transactionRequestData.payment_currency]:
              transactionRequestData.cashflows as RiskParamsCashflow,
          },
        };
      case 'installments':
        return {
          endDate:
            transactionRequestData?.cashflows?.[
              transactionRequestData?.cashflows?.length - 1
            ]?.pay_date ??
            formatISO(addDays(new Date(), 6), {
              representation: 'date',
            }),
          cashflows: {
            [transactionRequestData.payment_currency]:
              transactionRequestData.cashflows as RiskParamsCashflow,
          },
        };
      default:
        return {
          endDate: formatISO(addDays(new Date(), 6), {
            representation: 'date',
          }),
          cashflows: {
            [transactionRequestData.payment_currency]: [
              {
                amount: -transactionRequestData.amount,
                currency: transactionRequestData.payment_currency,
                pay_date: formatISO(
                  transactionRequestData.delivery_date ??
                    addDays(new Date(), 6),
                  {
                    representation: 'date',
                  },
                ),
                calendar: 'NULL_CALENDAR',
                description: 'test',
                name: 'test',
                roll_convention: 'NEAREST',
              },
            ],
          },
        };
    }
  }, [transactionRequestData]);
  const queryKey = `volatility_chart_${transactionRequestData.payment_currency}_${transactionRequestData.settlement_currency}`;
  const requestBody = useMemo(
    () => ({
      domestic: transactionRequestData.settlement_currency,
      cashflows: cashflows,
      start_date: startDate,
      end_date: endDate,
      max_horizon: 730,
      std_dev_levels: [1, 2, 3],
      do_std_dev_cones: true,
    }),
    [cashflows, endDate, startDate, transactionRequestData.settlement_currency],
  );

  const {
    data: chartData,
    isLoading,
    isRefetching,
    isFetching,
    isPending,
  } = useCacheableAsyncData(queryKey, async () => {
    if (!requestBody || isEqual(requestBody.cashflows, {})) {
      return null;
    }
    const apiData: PangeaGetCashflowRiskConeResponse =
      await api.getStandardDeviationDataAsync(requestBody, {
        account_id: undefined,
      });
    const standardDeviationLevels = requestBody.std_dev_levels || [];
    return {
      original: apiData,
      riskData: apiData.dates.map((date, dateIndex) => {
        return {
          date: new Date(date),
          mean: apiData.means[dateIndex],
          uppers: Object.fromEntries(
            standardDeviationLevels.map((stdDev, stdDevIndex) => {
              return [
                stdDev,
                apiData.uppers[stdDevIndex][dateIndex] *
                  Math.abs(apiData.initial_value),
              ];
            }),
          ),
          lowers: Object.fromEntries(
            standardDeviationLevels.map((stdDev, stdDevIndex) => {
              return [
                stdDev,
                apiData.lowers[stdDevIndex][dateIndex] *
                  Math.abs(apiData.initial_value),
              ];
            }),
          ),
          initial_value: Math.abs(apiData.initial_value), // chart shows PnL, not value of underlying
          std_probs: Object.fromEntries(
            standardDeviationLevels.map((stdDev, stdDevIndex) => {
              return [stdDev, apiData.std_probs[stdDevIndex]];
            }),
          ),
        };
      }),
    };
  });

  const handleHighScenarioClicked = useCallback(() => {
    setVolatilityScenario(VolatilityScenario.High);
  }, []);

  const handleMediumScenarioClicked = useCallback(() => {
    setVolatilityScenario(VolatilityScenario.Medium);
  }, []);

  const handleLowScenarioClicked = useCallback(() => {
    setVolatilityScenario(VolatilityScenario.Low);
  }, []);

  const expectedVolatility = useMemo(() => {
    if (chartData) {
      const { original } = chartData;
      if (original) {
        const { upper_max_percents } = original;
        const [low, medium, high] = upper_max_percents;
        if (volatilityScenario === VolatilityScenario.High && high) {
          return `${(high * 2).toFixed(2)}%`;
        } else if (volatilityScenario === VolatilityScenario.Medium && medium) {
          return `${(medium * 2).toFixed(2)}%`;
        } else if (low) {
          return `${(low * 2).toFixed(2)}%`;
        }
      }
    }
    return '-';
  }, [chartData, volatilityScenario]);

  const shouldInvert = useMemo(() => {
    if (
      transactionRequestData.settlement_currency === 'USD' &&
      MAJOR_CCY.includes(transactionRequestData.payment_currency)
    ) {
      return false;
    } else if (
      MAJOR_CCY.includes(transactionRequestData.settlement_currency) &&
      transactionRequestData.payment_currency === 'USD'
    ) {
      return true;
    } else {
      return true;
    }
  }, [transactionRequestData]);

  // exit if no data
  if (
    !chartData?.riskData ||
    isLoading ||
    isRefetching ||
    isFetching ||
    isPending
  )
    return (
      <Stack alignItems={'center'} flex={1}>
        <PangeaLoading centerPhrase />
      </Stack>
    );

  if (chartData.riskData.length === 0) {
    return (
      <Stack justifyContent={'center'} alignItems={'center'} flex={1}>
        <Typography>No risk data available for this market</Typography>
      </Stack>
    );
  }
  const leftPadding =
    paymentSpotRateData?.spot_rate &&
    paymentSpotRateData.spot_rate.toString().split('.')[0].length >= 5
      ? 40
      : 30;
  return (
    <Suspense
      fallback={
        <Stack alignItems={'center'} flex={1}>
          <PangeaLoading centerPhrase />
        </Stack>
      }
    >
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='flex-start'
        width='100%'
      >
        <Stack direction='row' columnGap={3} flex={1}>
          <Stack direction='column' rowGap={1.5}>
            <Stack direction='row' columnGap={1} alignItems='center'>
              <Typography
                variant='dataLabel'
                color={setAlpha(PangeaColors.Black, 0.87)}
              >
                Volatility Scenario
              </Typography>
              <PangeaTooltip
                title={<VolatilityTooltip />}
                placement='right'
                arrow
              >
                <InfoOutlined
                  sx={{ color: setAlpha(PangeaColors.Black, 0.3) }}
                />
              </PangeaTooltip>
            </Stack>
            <Stack direction='row' columnGap={1}>
              <Chip
                label={VolatilityScenario.High}
                color={
                  volatilityScenario == VolatilityScenario.High
                    ? 'primary'
                    : 'default'
                }
                onClick={handleHighScenarioClicked}
                sx={{
                  height: '1.5rem',
                  '&.Mui-disabled': {
                    opacity: 1,
                  },
                }}
                disabled={volatilityScenario == VolatilityScenario.High}
                clickable
              />
              <Chip
                label={VolatilityScenario.Medium}
                color={
                  volatilityScenario == VolatilityScenario.Medium
                    ? 'primary'
                    : 'default'
                }
                onClick={handleMediumScenarioClicked}
                sx={{
                  height: '1.5rem',
                  '&.Mui-disabled': {
                    opacity: 1,
                  },
                }}
                disabled={volatilityScenario == VolatilityScenario.Medium}
                clickable
              />
              <Chip
                label={VolatilityScenario.Low}
                color={
                  volatilityScenario == VolatilityScenario.Low
                    ? 'primary'
                    : 'default'
                }
                onClick={handleLowScenarioClicked}
                sx={{
                  height: '1.5rem',
                  '&.Mui-disabled': {
                    opacity: 1,
                  },
                }}
                disabled={volatilityScenario == VolatilityScenario.Low}
                clickable
              />
            </Stack>
          </Stack>
          <Stack direction='column' rowGap={1}>
            <Stack direction='row' columnGap={1} alignItems='center'>
              <Typography
                variant='dataLabel'
                color={setAlpha(PangeaColors.Black, 0.87)}
              >
                Expected Volatility
              </Typography>
              <PangeaTooltip
                title={
                  <Typography variant='toolTip'>
                    Expected Volatility measures the percentage of potential
                    exchange rate variation under the selected volatility
                    scenario between today and the value date of the trade.
                  </Typography>
                }
                placement='right'
                arrow
              >
                <InfoOutlined
                  sx={{ color: setAlpha(PangeaColors.Black, 0.3) }}
                />
              </PangeaTooltip>
            </Stack>
            <Typography variant='h4'>{expectedVolatility}</Typography>
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
          <svg width={0} height={0}>
            <defs>
              <pattern
                id='VTOP'
                patternUnits='userSpaceOnUse'
                width='12'
                height='12'
              >
                <image
                  xlinkHref='/images/VTOP.png'
                  width='12'
                  height='12'
                ></image>
              </pattern>

              <pattern
                id='VBOT'
                patternUnits='userSpaceOnUse'
                width='12'
                height='12'
              >
                <image
                  xlinkHref='/images/VBOT.png'
                  width='12'
                  height='12'
                ></image>
              </pattern>
            </defs>
          </svg>
          <VictoryChart
            domainPadding={{ x: [0, 50], y: [25, 15] }}
            theme={VictoryTheme.material}
            scale={{ x: 'time', y: 'linear' }}
            width={450}
            height={250}
            padding={{
              top: 5,
              bottom: 0,
              left: leftPadding,
              right: 20,
            }}
            containerComponent={
              <VictoryVoronoiContainer
                labels={() => ' '}
                labelComponent={
                  <CustomAreaTooltip
                    volatilityScenario={volatilityScenario}
                    shouldInvert={shouldInvert}
                    leftPadding={leftPadding}
                  />
                }
                style={{ padding: '1rem 0' }}
              />
            }
          >
            <VictoryArea // vol upside max
              name='vol-upside-max'
              data={chartData.riskData}
              x={'date'}
              y={'uppers["3"]'}
              y0={'mean'}
              interpolation={interpolationMethod}
              style={{
                data: {
                  fill: 'url(#VTOP)',
                  stroke: 'rgba(0,0,0,0)',
                },
              }}
            />
            <VictoryArea // vol downside max
              name='vol-downside-max'
              data={chartData.riskData}
              x={'date'}
              y={'lowers["3"]'}
              y0={'mean'}
              interpolation={interpolationMethod}
              style={{
                data: {
                  fill: 'url(#VBOT)',
                  stroke: 'rgba(0,0,0,0)',
                },
              }}
            />
            {volatilityScenario === VolatilityScenario.High && (
              <VictoryArea
                name='vol-upside-reduced-3'
                data={chartData.riskData}
                x={'date'}
                y={'uppers["3"]'}
                y0={'mean'}
                interpolation={interpolationMethod}
                style={{
                  data: {
                    fill: 'rgba(220, 109, 75, 0.7)',
                    stroke: '#DC6D4B',
                    strokeWidth: '2px',
                    opacity: 1,
                  },
                }}
              />
            )}
            {volatilityScenario === VolatilityScenario.High && (
              <VictoryArea
                name='vol-downside-reduced-3'
                data={chartData.riskData}
                x={'date'}
                y={'lowers["3"]'}
                y0={'mean'}
                interpolation={interpolationMethod}
                style={{
                  data: {
                    fill: 'rgba(220, 109, 75, 0.7)',
                    stroke: '#DC6D4B',
                    strokeWidth: '2px',
                    opacity: 1,
                  },
                }}
              />
            )}
            {volatilityScenario === VolatilityScenario.Medium && (
              <VictoryArea
                name='vol-upside-reduced-2'
                data={chartData.riskData}
                x={'date'}
                y={'uppers["2"]'}
                y0={'mean'}
                interpolation={interpolationMethod}
                style={{
                  data: {
                    fill: 'rgba(220, 109, 75, 0.7)',
                    stroke: '#DC6D4B',
                    strokeWidth: '2px',
                    opacity: 1,
                  },
                }}
              />
            )}
            {volatilityScenario === VolatilityScenario.Medium && (
              <VictoryArea
                name='vol-downside-reduced-2'
                data={chartData.riskData}
                x={'date'}
                y={'lowers["2"]'}
                y0={'mean'}
                interpolation={interpolationMethod}
                style={{
                  data: {
                    fill: 'rgba(220, 109, 75, 0.7)',
                    stroke: '#DC6D4B',
                    strokeWidth: '2px',
                    opacity: 1,
                  },
                }}
              />
            )}
            {volatilityScenario === VolatilityScenario.Low && (
              <VictoryArea
                name='vol-upside-reduced-1'
                data={chartData.riskData}
                x={'date'}
                y={'uppers["1"]'}
                y0={'mean'}
                interpolation={interpolationMethod}
                style={{
                  data: {
                    fill: 'rgba(220, 109, 75, 0.7)',
                    stroke: '#DC6D4B',
                    strokeWidth: '2px',
                    opacity: 1,
                  },
                }}
              />
            )}
            {volatilityScenario === VolatilityScenario.Low && (
              <VictoryArea
                name='vol-downside-reduced-1'
                data={chartData.riskData}
                x={'date'}
                y={'lowers["1"]'}
                y0={'mean'}
                interpolation={interpolationMethod}
                style={{
                  data: {
                    fill: 'rgba(220, 109, 75, 0.7)',
                    stroke: '#DC6D4B',
                    strokeWidth: '2px',
                    opacity: 1,
                  },
                }}
              />
            )}
            <VictoryAxis // x-axis
              tickCount={5}
              fixLabelOverlap={true}
              style={{
                axis: {
                  strokeWidth: 1,
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
            <VictoryAxis //y-axis
              dependentAxis
              tickCount={10}
              tickFormat={(t) =>
                `${
                  !shouldInvert
                    ? formatExchangeRateMaxFiveDigits(
                        t + chartData.original?.initial_value,
                        true,
                      )
                    : formatExchangeRateMaxFiveDigits(
                        1 /
                          (-t +
                            (chartData.original?.initial_value
                              ? chartData.original.initial_value
                              : 0)),
                        true,
                      )
                }`
              }
              style={{
                axis: {
                  stroke: setAlpha(PangeaColors.Black, 0.5),
                  strokeWidth: 1,
                },
                axisLabel: { fontSize: 10, padding: 30 },
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
      </Stack>
    </Suspense>
  );
});

function VolatilityTooltip() {
  return (
    <Stack direction='column' rowGap={2}>
      <Typography variant='toolTip'>
        Risk scenarios include: High volatility with low likelihood (~1%),
        moderate volatility with moderate likelihood (~5%), and low volatility
        with high likelihood (~33%).
      </Typography>
    </Stack>
  );
}

export default VolatilityChart;
