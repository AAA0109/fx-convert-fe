import { Stack, Typography } from '@mui/material';
import {
  chartYourRiskDataState,
  graphHoverDataState,
  transactionRequestDataState,
} from 'atoms';
import { CustomAreaTooltip } from 'components/cashflow';
import { differenceInCalendarDays, format, formatISO } from 'date-fns';
import { useChartData } from 'hooks';
import { IChartYourRiskData, setAlpha } from 'lib';
import { debounce, isUndefined } from 'lodash';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory';
import type { InterpolationPropType } from 'victory-core/lib/types/prop-types';
import {
  ChartAnnotation,
  ChartAnnotationProps,
  PangeaLoading,
} from '../shared';

export const PaymentChartYourRisk = () => {
  // Config parameters
  const transactionRequestData = useRecoilValue(transactionRequestDataState);
  const interpolationMethod: InterpolationPropType = 'catmullRom';
  const riskChartDataLoadable = useRecoilValueLoadable(
    chartYourRiskDataState({
      requestBody: {
        domestic: transactionRequestData.settlement_currency,
        cashflows: {
          [transactionRequestData.payment_currency]: [
            {
              amount: -transactionRequestData.amount,
              currency: transactionRequestData.payment_currency,
              pay_date: format(
                new Date(transactionRequestData.delivery_date ?? new Date()),
                'yyy-MM-dd',
              ),
              calendar: 'NULL_CALENDAR',
              description: 'test',
              name: 'test',
              roll_convention: 'NEAREST',
            },
          ],
        },
        start_date: formatISO(new Date(), { representation: 'date' }), // API won't accept full date/time value
        end_date: formatISO(
          transactionRequestData.delivery_date ?? new Date(),
          {
            representation: 'date',
          },
        ), // API won't accept full date/time value
        max_horizon: 730,
        std_dev_levels: [1, 2, 3],
        do_std_dev_cones: true,
      },
      account_id: undefined,
    }),
  );

  const chartData: Nullable<IChartYourRiskData[]> =
    riskChartDataLoadable.contents;
  const {
    initialRiskGraphHoverData: initialGraphHoverData,
    hedgeEndDate,
    cashflowDates,
  } = useChartData({
    riskReduction: undefined,
    selectedAccountId: undefined,
    maxLoss: undefined,
  });
  const volatilityRange = differenceInCalendarDays(
    new Date(hedgeEndDate),
    new Date(),
  );

  // Annotation params state
  const initialVolAnnotationParams: Nullable<ChartAnnotationProps> =
    useMemo(() => {
      if (chartData) {
        return {
          lineX: new Date(chartData[chartData.length - 1]?.date),
          topLineY: chartData[chartData.length - 1]?.uppers['3'],
          bottomLineY: chartData[chartData.length - 1]?.lowers['3'],
          lineWidth: Math.max(volatilityRange / 36, 1),
          offset: Math.max(volatilityRange / 36, 0),
          text: 'Est. Risk',
          labelPosition: 'middle',
        };
      } else {
        return null;
      }
    }, [chartData, volatilityRange]);
  const [volAnnotationParams, setVolAnnotationParams] = useState<
    Nullable<ChartAnnotationProps>
  >(initialVolAnnotationParams);

  // Probability element state
  const initialProbabilityElements = [
    'vol-upside-reduced-1',
    'vol-downside-reduced-1',
    'vol-upside-reduced-2',
    'vol-downside-reduced-2',
    'vol-upside-reduced-3',
    'vol-downside-reduced-3',
  ];
  const [probabilityElements, setProbabilityElements] = useState<string[]>(
    initialProbabilityElements,
  );

  const setGraphHoverData = useSetRecoilState(graphHoverDataState);
  useEffect(() => {
    setGraphHoverData(initialGraphHoverData);
  }, [initialGraphHoverData, setGraphHoverData]);

  // exit if no data
  if (!chartData || !volAnnotationParams) return <PangeaLoading />;

  const ErrorFallback = ({ error }: FallbackProps) => {
    return (
      <div role='alert'>
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
      </div>
    );
  };
  const debouncedSetGraphHoverData = debounce(setGraphHoverData, 700);
  const areaEventHandler = (probabilityIndex: number) => {
    return {
      childName: [
        `vol-upside-reduced-${probabilityIndex}`,
        `vol-downside-reduced-${probabilityIndex}`,
      ],
      target: 'data',
      eventHandlers: {
        onMouseOver: () => {
          setVolAnnotationParams({
            ...volAnnotationParams,
            lineX: new Date(chartData[chartData.length - 1].date),
            topLineY: chartData[chartData.length - 1]?.uppers[probabilityIndex],
            bottomLineY:
              chartData[chartData.length - 1].lowers[probabilityIndex],
            text: `EST. RISK ${probabilityIndex}`,
          });

          // Set graph hover data to drive other page elements
          debouncedSetGraphHoverData((curVal) => {
            const data = {
              ...curVal,
              upside: chartData[chartData.length - 1]?.uppers[probabilityIndex],
              downside:
                chartData[chartData.length - 1].lowers[probabilityIndex],
              initialValue: chartData[chartData.length - 1].initial_value,
            };
            return data;
          });

          // When in this array, an object will be opacity: 0 and included in VoronoiBlacklist
          const filtered = initialProbabilityElements.filter(
            (item) =>
              item !== `vol-upside-reduced-${probabilityIndex}` &&
              item !== `vol-downside-reduced-${probabilityIndex}`,
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
          setVolAnnotationParams(initialVolAnnotationParams);
          setGraphHoverData(initialGraphHoverData);
          setProbabilityElements(initialProbabilityElements);
          return null;
        },
      },
    };
  };
  return (
    <Stack
      height={chartData.length === 0 ? 'auto' : 450}
      justifyContent={'space-between'}
    >
      {riskChartDataLoadable.state === 'loading' ? (
        <PangeaLoading centerPhrase />
      ) : chartData.length === 0 ? (
        <Stack
          width={400}
          height={200}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography>No risk chart available for this market</Typography>
        </Stack>
      ) : (
        <>
          <Typography variant='h6' mt={4}>
            This cash flow could experience{' '}
            {(chartData[chartData.length - 1]?.uppers['3'] * 100).toFixed(2)}%{' '}
            volatility in this time frame.
          </Typography>
          <Suspense fallback={<PangeaLoading />}>
            <svg width={0} height={0}>
              <defs>
                <pattern
                  id='VTOP'
                  patternUnits='userSpaceOnUse'
                  width='16'
                  height='16'
                >
                  <image
                    xlinkHref='/images/VTOP.png'
                    width='16'
                    height='16'
                  ></image>
                </pattern>
                <pattern
                  id='VBOT'
                  patternUnits='userSpaceOnUse'
                  width='16'
                  height='16'
                >
                  <image
                    xlinkHref='/images/VBOT.png'
                    width='16'
                    height='16'
                  ></image>
                </pattern>
              </defs>
            </svg>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className='chart-container'>
                <VictoryChart
                  domainPadding={{ x: [0, 65], y: [5, 5] }}
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
                      style={{ padding: '1rem 0' }}
                    />
                  }
                  events={[
                    areaEventHandler(3),
                    areaEventHandler(2),
                    areaEventHandler(1),
                  ]}
                >
                  <VictoryArea // vol upside max
                    name='vol-upside-max'
                    data={chartData}
                    x={'date'}
                    y={'uppers["3"]'} // "4" as in 4 std deviations, i.e. the whole probability range
                    y0={'mean'}
                    interpolation={interpolationMethod}
                    style={{
                      data: {
                        fill: 'url(#VTOP)',
                        stroke: 'rgba(164, 219, 75, 0.6)',
                      },
                    }}
                  ></VictoryArea>
                  <VictoryArea // vol downside max
                    name='vol-downside-max'
                    data={chartData}
                    x={'date'}
                    y={'lowers["3"]'}
                    y0={'mean'}
                    interpolation={interpolationMethod}
                    style={{
                      data: {
                        fill: 'url(#VBOT)',
                        stroke: 'rgba(220, 75, 99, 0.6)',
                      },
                    }}
                  ></VictoryArea>
                  <VictoryArea
                    name='vol-upside-reduced-3'
                    data={chartData}
                    x={'date'}
                    y={'uppers["3"]'}
                    y0={'mean'}
                    interpolation={interpolationMethod}
                    style={{
                      data: {
                        fill: 'rgba(164, 219, 75, 0.6)',
                        opacity:
                          probabilityElements?.indexOf('vol-upside-reduced-3') >
                          -1
                            ? 0
                            : 1,
                      },
                    }}
                  ></VictoryArea>
                  <VictoryArea
                    name='vol-downside-reduced-3'
                    data={chartData}
                    x={'date'}
                    y={'lowers["3"]'}
                    y0={'mean'}
                    interpolation={interpolationMethod}
                    style={{
                      data: {
                        fill: 'rgba(220, 75, 99, 0.6)',
                        opacity:
                          probabilityElements?.indexOf(
                            'vol-downside-reduced-3',
                          ) > -1
                            ? 0
                            : 1,
                      },
                    }}
                  ></VictoryArea>
                  <VictoryArea
                    name='vol-upside-reduced-2'
                    data={chartData}
                    x={'date'}
                    y={'uppers["2"]'}
                    y0={'mean'}
                    interpolation={interpolationMethod}
                    style={{
                      data: {
                        fill: 'rgba(164, 219, 75, 0.6)',
                        opacity:
                          probabilityElements?.indexOf('vol-upside-reduced-2') >
                          -1
                            ? 0
                            : 1,
                      },
                    }}
                  ></VictoryArea>
                  <VictoryArea
                    name='vol-downside-reduced-2'
                    data={chartData}
                    x={'date'}
                    y={'lowers["2"]'}
                    y0={'mean'}
                    interpolation={interpolationMethod}
                    style={{
                      data: {
                        fill: 'rgba(220, 75, 99, 0.6)',
                        opacity:
                          probabilityElements?.indexOf(
                            'vol-downside-reduced-2',
                          ) > -1
                            ? 0
                            : 1,
                      },
                    }}
                  ></VictoryArea>
                  <VictoryArea
                    name='vol-upside-reduced-1'
                    data={chartData}
                    x={'date'}
                    y={'uppers["1"]'}
                    y0={'mean'}
                    interpolation={interpolationMethod}
                    style={{
                      data: {
                        fill: 'rgba(164, 219, 75, 0.6)',
                        opacity:
                          probabilityElements?.indexOf('vol-upside-reduced-1') >
                          -1
                            ? 0
                            : 1,
                      },
                    }}
                  ></VictoryArea>
                  <VictoryArea
                    name='vol-downside-reduced-1'
                    data={chartData}
                    x={'date'}
                    y={'lowers["1"]'}
                    y0={'mean'}
                    interpolation={interpolationMethod}
                    style={{
                      data: {
                        fill: 'rgba(220, 75, 99, 0.6)',
                        opacity:
                          probabilityElements?.indexOf(
                            'vol-downside-reduced-1',
                          ) > -1
                            ? 0
                            : 1,
                      },
                    }}
                  ></VictoryArea>
                  {cashflowDates && (
                    <VictoryScatter // tx dates
                      name='tx-dates'
                      symbol='circle'
                      size={2}
                      style={{ data: { fill: '#000' } }}
                      data={cashflowDates}
                      x={(d) => Number(d)}
                      y={() => 0}
                    />
                  )}
                  <ChartAnnotation
                    lineX={volAnnotationParams.lineX}
                    topLineY={volAnnotationParams.topLineY}
                    bottomLineY={volAnnotationParams.bottomLineY}
                    lineWidth={volAnnotationParams.lineWidth}
                    offset={volAnnotationParams.offset}
                    text={volAnnotationParams.text}
                    labelPosition={volAnnotationParams.labelPosition}
                  />
                  <VictoryAxis // x-axis
                    tickCount={4}
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
                    tickCount={5}
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
          </Suspense>
        </>
      )}
    </Stack>
  );
};
export default PaymentChartYourRisk;
