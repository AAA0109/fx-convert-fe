import { Stack } from '@mui/material';
import {
  graphHoverDataState,
  hedgeLosspreventionLimitState,
  hedgeLosspreventionTargetState,
  hedgeSafeGuardState,
  hedgeSafeGuardTargetState,
  selectedAccountIdState,
  selectedHedgeStrategy,
} from 'atoms';
import MultiChartAnnotation from 'components/shared/MultiChartAnnotation';
import { differenceInCalendarDays } from 'date-fns';
import { useChartData } from 'hooks';
import { CashflowStrategyEnum, setAlpha } from 'lib';
import { isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory';
import type { InterpolationPropType } from 'victory-core/lib/types/prop-types';
import { ChartAnnotation, DataLabel, PangeaLoading } from '../shared';
import { CustomAreaTooltip } from './CustomAreaTooltip';

export const CurrencyChartYourHedge = ({
  accountId,
  riskReduction,
  maxLoss,
}: {
  accountId?: number;
  riskReduction?: number;
  maxLoss?: number;
}) => {
  // Config parameters
  const interpolationMethod: InterpolationPropType = 'catmullRom';
  const accountIdState = useRecoilValue(selectedAccountIdState) ?? undefined;
  const selectedHedge = useRecoilValue(selectedHedgeStrategy);
  const safeGuard = useRecoilValue(hedgeSafeGuardState);
  const lossPreventionTaget = useRecoilValue(hedgeLosspreventionTargetState);
  const safeGuardTaget = useRecoilValue(hedgeSafeGuardTargetState);
  const lossprevention = useRecoilValue(hedgeLosspreventionLimitState);
  const selectedAccountId = accountId ?? accountIdState;
  const {
    hedgeChartData: chartData,
    hedgeEndDate,
    initialHedgeGraphHoverData: initialGraphHoverData,
    hedgeRiskReductionAmount,
    cashflowDates,
    isHedgeChartLoading,
  } = useChartData({ riskReduction, selectedAccountId, maxLoss });
  const volatilityRange = differenceInCalendarDays(hedgeEndDate, new Date());

  const setGraphHoverData = useSetRecoilState(graphHoverDataState);
  useEffect(() => {
    if (initialGraphHoverData) setGraphHoverData(initialGraphHoverData);
  }, [initialGraphHoverData, setGraphHoverData]);

  // Probability element state
  const initialProbabilityElements = [
    `vol-upside-reduced`,
    `vol-downside-reduced`,
  ];
  const [probabilityElements, setProbabilityElements] = useState<string[]>(
    initialProbabilityElements,
  );

  // exit if no data
  if (!chartData?.length || isHedgeChartLoading)
    return (
      <Stack sx={{ height: '345px' }}>
        <PangeaLoading loadingPhrase='Charting risk cone ...' centerPhrase />
      </Stack>
    );

  const areaEventHandler = () => {
    return {
      childName: [`vol-upside-reduced`, `vol-downside-reduced`],
      target: 'data',
      eventHandlers: {
        onMouseOver: () => {
          // When in this array, an object will be included in VoronoiBlacklist
          const filtered = initialProbabilityElements.filter(
            (item) =>
              item !== `vol-upside-reduced` && item !== `vol-downside-reduced`,
          );
          filtered.push('vol-upside-max');
          filtered.push('vol-downside-max');
          setProbabilityElements(filtered);
          return null;
        },
        onMouseOut: (e: any) => {
          if (
            !isUndefined((e as any)?.relatedTarget?.farthestViewportElement)
          ) {
            return;
          }
          setProbabilityElements(initialProbabilityElements);
          return null;
        },
      },
    };
  };

  const ErrorFallback = ({ error }: FallbackProps) => {
    return (
      <div role='alert'>
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
      </div>
    );
  };
  return (
    <>
      <svg width={0} height={0}>
        <defs>
          <pattern
            id='VTOP'
            patternUnits='userSpaceOnUse'
            width='16'
            height='16'
          >
            <image xlinkHref='/images/VTOP.png' width='16' height='16'></image>
          </pattern>
          <pattern
            id='VBOT'
            patternUnits='userSpaceOnUse'
            width='16'
            height='16'
          >
            <image xlinkHref='/images/VBOT.png' width='16' height='16'></image>
          </pattern>
        </defs>
      </svg>

      <svg width={0} height={0}>
        <defs>
          <linearGradient id='myGradient' x1='0%' x2='0%' y1='0%' y2='100%'>
            <stop offset='40%' stopColor='rgba(255, 255, 255, 1)' />
            <stop offset='50%' stopColor='rgba(255, 255, 255, 0.6)' />
            <stop offset='70%' stopColor='rgba(164, 219, 75, 0.6)' />
            <stop offset='100%' stopColor='rgba(164, 219, 75, 1)' />
          </linearGradient>
        </defs>
      </svg>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className='chart-container' suppressHydrationWarning>
          <VictoryChart
            domainPadding={{
              x:
                selectedHedge !== CashflowStrategyEnum.ZEROGRAVITY
                  ? [65, 45]
                  : [0, 65],
              y: [5, 5],
            }}
            theme={VictoryTheme.material}
            scale={{ x: 'time', y: 'linear' }}
            width={450}
            height={300}
            padding={{ top: 0, bottom: 15, left: 40, right: 75 }}
            containerComponent={
              <VictoryVoronoiContainer
                voronoiBlacklist={probabilityElements} // blacklisting elements not being interacted with works around the Victory y0 bug
                labels={() => ' '} // this is the recommended syntax from Victory to enable custom labels
                labelComponent={<CustomAreaTooltip />}
              />
            }
            events={[areaEventHandler()]}
          >
            <VictoryArea // vol upside max
              name='vol-upside-max'
              data={chartData}
              x={'date'}
              y={
                selectedHedge !== CashflowStrategyEnum.ZEROGRAVITY
                  ? 'uppersUnlimited["0"]'
                  : 'uppers["0"]'
              }
              y0={'mean'}
              interpolation={interpolationMethod}
              style={{
                data: {
                  fill: 'url(#VTOP)',
                  stroke:
                    selectedHedge !== CashflowStrategyEnum.ZEROGRAVITY
                      ? 'rgba(164, 219, 75, 0)'
                      : 'rgba(164, 219, 75, 0.6)',
                },
              }}
            ></VictoryArea>
            <VictoryArea // vol downside max
              name='vol-downside-max'
              data={chartData}
              x={'date'}
              y={
                selectedHedge !== CashflowStrategyEnum.ZEROGRAVITY
                  ? 'lowersUnlimited["0"]'
                  : 'lowers["0"]'
              }
              y0={'mean'}
              interpolation={interpolationMethod}
              style={{
                data: { fill: 'url(#VBOT)', stroke: 'rgba(220, 75, 99, 0.6)' },
              }}
            ></VictoryArea>
            <VictoryArea // vol upside reduced
              name='vol-upside-reduced'
              data={chartData}
              x={'date'}
              y={`uppers[${
                selectedHedge === CashflowStrategyEnum.PARACHUTE
                  ? '0'
                  : `${hedgeRiskReductionAmount}`
              }]`}
              y0={'mean'}
              interpolation={interpolationMethod}
              style={{
                data: {
                  fill:
                    selectedHedge === CashflowStrategyEnum.PARACHUTE
                      ? 'url(#myGradient)'
                      : 'rgba(164, 219, 75, 0.6)',
                },
              }}
            ></VictoryArea>
            <VictoryArea // vol downside reduced
              name='vol-downside-reduced'
              data={chartData}
              x={'date'}
              y={`lowers[${
                selectedHedge === CashflowStrategyEnum.PARACHUTE
                  ? '0'
                  : `${hedgeRiskReductionAmount}`
              }]`}
              y0={'mean'}
              interpolation={interpolationMethod}
              style={{
                data: { fill: 'rgba(220, 75, 99, 0.6)' },
              }}
            ></VictoryArea>
            {cashflowDates && (
              <VictoryScatter // tx dates
                symbol='circle'
                size={
                  selectedHedge !== CashflowStrategyEnum.ZEROGRAVITY ? 6 : 2
                }
                style={{ data: { fill: '#000' } }}
                data={
                  selectedHedge !== CashflowStrategyEnum.ZEROGRAVITY
                    ? [chartData[0].date]
                    : cashflowDates
                }
                x={(d) => Number(d)}
                y={() => 0}
              />
            )}

            {selectedHedge !== CashflowStrategyEnum.ZEROGRAVITY &&
              ((selectedHedge === CashflowStrategyEnum.PARACHUTE && maxLoss) ||
                (selectedHedge === CashflowStrategyEnum.AUTOPILOT &&
                  lossprevention)) && (
                <VictoryLine
                  style={{
                    data: { stroke: '#c43a31', strokeWidth: 2 },
                  }}
                  data={[
                    ...chartData.map((data) => {
                      return {
                        x: data.date,
                        y:
                          selectedHedge === CashflowStrategyEnum.AUTOPILOT
                            ? lossPreventionTaget
                            : maxLoss,
                      };
                    }),
                  ]}
                  y0={'mean'}
                  interpolation={interpolationMethod}
                />
              )}
            {selectedHedge === CashflowStrategyEnum.AUTOPILOT && safeGuard && (
              <VictoryLine
                style={{
                  data: { stroke: '#A4DB4B', strokeWidth: 2 },
                }}
                data={[
                  ...chartData.map((data) => {
                    return {
                      x: data.date,
                      y: safeGuardTaget,
                    };
                  }),
                ]}
                y0={'mean'}
                interpolation={interpolationMethod}
              />
            )}
            {selectedHedge !== CashflowStrategyEnum.ZEROGRAVITY && (
              <MultiChartAnnotation
                blurTopLine={selectedHedge === CashflowStrategyEnum.PARACHUTE}
                lineX={new Date(chartData[chartData.length - 1].date)}
                topLineY={chartData[chartData.length - 1]?.uppers['0']}
                bottomLineY={chartData[chartData.length - 1].lowers['0']}
                lineWidth={Math.max(volatilityRange / 36, 0)}
                offset={Math.max(volatilityRange / 36, 0)}
                labelData={[
                  ...(selectedHedge === CashflowStrategyEnum.PARACHUTE
                    ? [
                        { text: 'Max Loss', labelPosition: 'bottom' as any },
                        {
                          text: safeGuard ? 'Safeguarded' : 'Uncapped',
                          labelPosition: 'top' as any,
                        },
                      ]
                    : [
                        {
                          text: lossprevention
                            ? 'Loss Prevention Limit'
                            : 'Unhedged Risk',
                          labelPosition: 'bottom' as any,
                        },
                        {
                          text: safeGuard ? 'Safeguard Target' : '',
                          labelPosition: 'top' as any,
                        },
                      ]),
                  ...(selectedHedge === CashflowStrategyEnum.PARACHUTE ||
                  safeGuard ||
                  lossprevention
                    ? [{ text: 'With Hedge', labelPosition: 'middle' }]
                    : []),
                ]}
                adjustLabelPosition={hedgeRiskReductionAmount < 0.15}
              />
            )}
            {selectedHedge === CashflowStrategyEnum.AUTOPILOT && safeGuard && (
              <DataLabel // text label
                x={new Date(chartData[0].date)}
                y={safeGuardTaget}
                dx={-50}
                dy={-10}
                text={`${((safeGuardTaget ?? 0.01) * 100).toFixed(2)}%`}
                style={[
                  {
                    fontFamily: 'SuisseNeue', // does not work without embedding the font in the SVG, base64-encoded
                    fontWeight: '400',
                    fontSize: '12px',
                    lineHeight: '17px',
                    textTransform: 'uppercase',
                  },
                ]}
              />
            )}
            {selectedHedge !== CashflowStrategyEnum.ZEROGRAVITY &&
              ((selectedHedge === CashflowStrategyEnum.PARACHUTE && maxLoss) ||
                (selectedHedge === CashflowStrategyEnum.AUTOPILOT &&
                  lossprevention)) && (
                <DataLabel // text label
                  x={new Date(chartData[0].date)}
                  y={
                    selectedHedge === CashflowStrategyEnum.AUTOPILOT
                      ? lossPreventionTaget
                      : maxLoss
                  }
                  dy={10}
                  dx={-50}
                  text={`${(
                    ((selectedHedge === CashflowStrategyEnum.AUTOPILOT
                      ? lossPreventionTaget
                      : maxLoss) ?? 0.01) * 100
                  ).toFixed(2)}%`}
                  style={[
                    {
                      fontFamily: 'SuisseNeue', // does not work without embedding the font in the SVG, base64-encoded
                      fontWeight: '400',
                      fontSize: '12px',
                      lineHeight: '17px',
                      textTransform: 'uppercase',
                    },
                  ]}
                />
              )}
            {selectedHedge === CashflowStrategyEnum.AUTOPILOT &&
              !safeGuard &&
              !lossprevention && (
                <ChartAnnotation
                  lineX={new Date(chartData[chartData.length - 1].date)}
                  topLineY={
                    chartData[chartData.length - 1]?.uppers[
                      hedgeRiskReductionAmount
                    ]
                  }
                  bottomLineY={
                    chartData[chartData.length - 1]?.lowers[
                      hedgeRiskReductionAmount
                    ]
                  }
                  lineWidth={Math.max(volatilityRange / 36, 0.03)} // 10 day width for 365 days
                  offset={Math.max(volatilityRange / 12, 0)} // 30 day offset for 365 days
                  text={'With Hedge'}
                />
              )}
            {selectedHedge === CashflowStrategyEnum.ZEROGRAVITY && (
              <ChartAnnotation
                lineX={new Date(chartData[chartData.length - 1].date)}
                topLineY={chartData[chartData.length - 1]?.uppers['0']}
                bottomLineY={chartData[chartData.length - 1].lowers['0']}
                lineWidth={Math.max(volatilityRange / 36, 0)}
                offset={Math.max(volatilityRange / 36, 0)}
                text={'Unhedged'}
                labelPosition='bottom'
                adjustLabelPosition={hedgeRiskReductionAmount < 0.15}
              />
            )}
            <VictoryAxis // x-axis
              tickCount={4}
              tickFormat={(t) => new Date(t).toLocaleDateString()}
              fixLabelOverlap={true}
              style={{
                axis: {
                  strokeWidth: 0,
                },
                axisLabel: {
                  fontSize: 10,
                  padding: 10,
                },
                grid: { display: 'none' },
                ticks: { display: 'none' },
                tickLabels: {
                  padding: 0,
                  fontFamily: 'SuisseNeue',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: '8px',
                  lineHeight: '16px',
                  textTransform: 'uppercase',
                  color: '#000000',
                },
              }}
              offsetY={12}
            />
            <VictoryAxis //y-axis
              dependentAxis
              tickCount={8}
              tickFormat={(t) => `${t * 100}%`}
              style={{
                axis: {
                  stroke: setAlpha(PangeaColors.Black, 0.5),
                  strokeWidth: 1,
                },
                axisLabel: { fontSize: 10, padding: 30 },
                grid: { display: 'none' },
                ticks: { display: 'none' },
                tickLabels: {
                  padding: 5,
                  fontFamily: 'SuisseNeue',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  fontSize: '8px',
                  lineHeight: '16px',
                  textTransform: 'uppercase',
                  color: '#000000',
                },
              }}
            />
          </VictoryChart>
        </div>
      </ErrorBoundary>
    </>
  );
};
export default CurrencyChartYourHedge;
