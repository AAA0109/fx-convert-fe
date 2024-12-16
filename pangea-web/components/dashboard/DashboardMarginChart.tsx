import { Alert, Box, Stack, Typography } from '@mui/material';
import {
  depositRequestDataState,
  domesticCurrencyState,
  marginHealthDetailsState,
} from 'atoms';
import { add, addDays, format } from 'date-fns';
import {
  formatCurrency,
  PangeaMarginHealthResponse,
  PangeaMarginRequirement,
} from 'lib';
import { isError } from 'lodash';
import { useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryVoronoiContainer,
} from 'victory';
import type { InterpolationPropType } from 'victory-core/lib/types/prop-types';
import { CustomLineBarTooltip, DataLabel } from '../shared';
import { MarginStepperDialogOpener } from './MarginStepperDialog';
import { ScoreContainer } from './ScoreContainer';

// TODO: Will these thresholds ever be programmatic? Will they change?
const Thresholds = {
  excess: 100,
  buffer: 50,
  liquidation: 20,
};

const labelOffsetAmount = 33;

const labelStyleDef = {
  fontFamily: 'SuisseNeue',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '20px',
};

const areaLabelOffset = (days: number) =>
  Array.from({ length: days + 1 }, (_x, i) => i);

export const DashboardMarginChart = () => {
  const interpolationMethod: InterpolationPropType = 'linear';
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const depositRequest = useRecoilValue(depositRequestDataState);
  const marginHealthChartData: Nullable<PangeaMarginHealthResponse> =
    useRecoilValue(marginHealthDetailsState(depositRequest.amount)) ?? null;

  const initialDatum =
    marginHealthChartData?.margins && marginHealthChartData?.margins.length > 0
      ? marginHealthChartData?.margins[0]
      : null;
  const [selectedDatum, setSelectedDatum] = useState(initialDatum);

  if (!marginHealthChartData || isError(marginHealthChartData)) {
    return null;
  }

  const chartMaxY = Math.max(
    ...marginHealthChartData.margins.map(
      (margin) => Math.max(1.2, margin.health_score_hypothetical) * 100,
    ),
  );

  const formatHealthScore = (n: number | undefined) => {
    const score = Math.round((n ?? 0) * 100);
    return `${score}${score >= 120 ? '+' : ''}/100`;
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
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Stack spacing={2}>
          {Number(marginHealthChartData.minimum_deposit) > 0 && (
            <Alert severity={'warning'} variant={'filled'}>
              <Typography variant={'body1'}>
                Deposit margin before{' '}
                {format(
                  new Date(marginHealthChartData.wire_deposit_date),
                  'MMMM do',
                )}{' '}
                to avoid a Margin Call.
              </Typography>
            </Alert>
          )}
          <Stack
            direction={'row'}
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant={'h4'}>Margin Health Forecast</Typography>
            <MarginStepperDialogOpener type={'icon'} step={0} />
          </Stack>
          <Typography variant={'body2'}>
            Forecast your margin health score based on upcoming cash flow
            adjustments.
          </Typography>

          <Box
            style={{
              marginTop: '48px',
              backgroundColor: PangeaColors.StoryWhiteMedium,
              position: 'relative',
              padding: '1rem',
              border: `2px solid ${PangeaColors.Gray}`,
              borderRadius: `4px`,
            }}
          >
            <Box
              sx={{
                bgcolor: PangeaColors.StoryWhiteMedium,
                position: 'absolute',
                left: '18px',
                top: '-9px',
                padding: '0 5px',
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  textTransform: 'capitalize',
                }}
              >
                Projected
              </Typography>
            </Box>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <ScoreContainer
                label={'Health Score'}
                score={formatHealthScore(selectedDatum?.health_score)}
                chipColor={
                  (selectedDatum?.health_score ?? 0) < 0.2
                    ? PangeaColors.RiskBerryMedium
                    : (selectedDatum?.health_score ?? 0) < 0.5
                    ? PangeaColors.CautionYellowMedium
                    : (selectedDatum?.health_score ?? 0) <= 1
                    ? PangeaColors.SecurityGreenMedium
                    : PangeaColors.EarthBlueLight
                }
                svgUrl={'/images/icon-circle-primary-main-with-stroke.svg'}
                chipVariant={'h5'}
              />
              <ScoreContainer
                label={'Health After Pending Deposits'}
                score={formatHealthScore(
                  selectedDatum?.health_score_after_deposit,
                )}
                chipColor={PangeaColors.VisionCyanLight}
                svgUrl={'/images/icon-circle-earthblue-dark-with-stroke.svg'}
                chipVariant={'h5'}
              />
              <ScoreContainer
                label={'Health After Preview Deposit'}
                score={formatHealthScore(
                  selectedDatum?.health_score_hypothetical,
                )}
                chipColor={PangeaColors.SecurityGreenLight}
                svgUrl={
                  '/images/icon-circle-securitygreen-dark-with-stroke.svg'
                }
                chipVariant={'h5'}
              />
              <Box>
                <Stack direction={'row'}>
                  <Typography
                    sx={{
                      marginBottom: '7px',
                    }}
                    variant={'body2'}
                  >
                    Total Hedging
                  </Typography>
                </Stack>
                <Typography variant={'h5'}>
                  {formatCurrency(
                    selectedDatum?.total_hedging ?? 0,
                    domesticCurrency,
                    true,
                    0,
                    0,
                  )}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box
            className='chart-container'
            sx={{ transform: 'translateX(-10px)' }}
            width={'102.5%'}
            my={0}
          >
            {marginHealthChartData.margins &&
            marginHealthChartData.margins.length > 0 ? (
              <VictoryChart
                domainPadding={{ x: [0, 0], y: [25, 25] }}
                scale={{ x: 'time', y: 'linear' }}
                width={760}
                height={426}
                padding={{ top: 0, bottom: 30, left: 40, right: 10 }}
                containerComponent={
                  <VictoryVoronoiContainer
                    labels={() => ' '} // this is the recommended syntax from Victory to enable custom labels
                    labelComponent={<CustomLineBarTooltip />}
                    voronoiDimension='x'
                    onActivated={(points: PangeaMarginRequirement[]) => {
                      setSelectedDatum({
                        date: points[0].date,
                        amount: points[0].amount,
                        health_score: points[0].health_score / 100,
                        health_score_after_deposit:
                          points[0].health_score_after_deposit / 100,
                        health_score_hypothetical:
                          points[0].health_score_hypothetical / 100,
                        total_hedging: points[0].total_hedging,
                      });
                    }}
                    voronoiBlacklist={[
                      'area-margin-excess',
                      'area-margin-buffer',
                      'line-deposit',
                      'area-margin-deposit',
                      'line-liquidation',
                      'area-margin-liquidation',
                      'health-original',
                      'health-modified',
                    ]}
                  />
                }
                events={[
                  {
                    target: 'labels',
                    eventHandlers: {
                      onMouseLeave: () => {
                        setSelectedDatum(initialDatum);
                      },
                    },
                  },
                ]}
              >
                <VictoryAxis
                  style={{
                    axis: {
                      strokeWidth: 0,
                    },
                    axisLabel: {
                      padding: 10,
                    },
                    grid: { display: 'none' },
                    ticks: { display: 'none' },
                    tickLabels: {
                      padding: 0,
                      fontFamily: 'SuisseNeue',
                      fontStyle: 'normal',
                      fontWeight: '400',
                      fontSize: '12px',
                      lineHeight: '16px',
                      textTransform: 'uppercase',
                      color: '#000000',
                    },
                  }}
                  offsetY={12}
                  name={'chart-axis-x'}
                  tickValues={marginHealthChartData?.margins.map(
                    (d) => new Date(d.date),
                  )}
                  tickFormat={(t) =>
                    `${t.toLocaleDateString('default', {
                      month: 'short',
                    })} ${t.getUTCDate()}`
                  }
                  tickCount={5}
                  fixLabelOverlap={true}
                />
                <VictoryAxis
                  style={{
                    axis: {
                      strokeWidth: 0,
                    },
                    axisLabel: {
                      padding: 10,
                    },
                    grid: { display: 'none' },
                    ticks: { display: 'none' },
                    tickLabels: {
                      padding: 0,
                      fontFamily: 'SuisseNeue',
                      fontStyle: 'normal',
                      fontWeight: '400',
                      fontSize: '12px',
                      lineHeight: '16px',
                      textTransform: 'uppercase',
                      color: '#000000',
                    },
                  }}
                  offsetX={30}
                  name={'chart-axis-y'}
                  dependentAxis
                  tickValues={[
                    0,
                    Thresholds.liquidation,
                    Thresholds.buffer,
                    Thresholds.excess,
                  ]}
                />
                <VictoryGroup name={'chart-group-area'}>
                  <VictoryArea
                    name={'area-margin-excess'}
                    style={{
                      data: {
                        fill: PangeaColors.VisionCyanMedium,
                        opacity: '0.3',
                      },
                    }}
                    data={areaLabelOffset(labelOffsetAmount)}
                    x={(d) =>
                      Number(
                        addDays(
                          new Date(
                            marginHealthChartData.margins[0].date ??
                              Date.now().valueOf(),
                          ),
                          Number(d),
                        ),
                      )
                    }
                    y={() => chartMaxY}
                    y0={() => Thresholds.excess}
                    interpolation={interpolationMethod}
                  />
                  <VictoryArea
                    name={'area-margin-buffer'}
                    style={{
                      data: {
                        fill: PangeaColors.SecurityGreenMedium,
                        opacity: '0.4',
                      },
                    }}
                    data={areaLabelOffset(labelOffsetAmount)}
                    x={(d) =>
                      Number(
                        addDays(
                          new Date(
                            marginHealthChartData.margins[0].date ??
                              Date.now().valueOf(),
                          ),
                          Number(d),
                        ),
                      )
                    }
                    y={() => Thresholds.excess}
                    y0={() => Thresholds.buffer}
                    interpolation={interpolationMethod}
                  />
                  <VictoryLine
                    name={'line-deposit'}
                    scale={'time'}
                    data={areaLabelOffset(labelOffsetAmount)}
                    x={(d) =>
                      Number(
                        addDays(
                          new Date(
                            marginHealthChartData.margins[0].date ??
                              Date.now().valueOf(),
                          ),
                          Number(d),
                        ),
                      )
                    }
                    y={() => Thresholds.buffer}
                    style={{
                      data: {
                        stroke: PangeaColors.CautionYellowDark,
                        strokeWidth: '2',
                      },
                    }}
                    interpolation={interpolationMethod}
                  />
                  <VictoryArea
                    name={'area-margin-deposit'}
                    style={{
                      data: {
                        fill: PangeaColors.CautionYellowMedium,
                        opacity: '0.4',
                      },
                    }}
                    data={areaLabelOffset(labelOffsetAmount)}
                    x={(d) =>
                      Number(
                        addDays(
                          new Date(
                            marginHealthChartData.margins[0].date ??
                              Date.now().valueOf(),
                          ),
                          Number(d),
                        ),
                      )
                    }
                    y={() => Thresholds.buffer}
                    y0={() => Thresholds.liquidation}
                    interpolation={interpolationMethod}
                  />
                  <VictoryLine
                    name={'line-liquidation'}
                    scale={'time'}
                    data={areaLabelOffset(labelOffsetAmount)}
                    x={(d) =>
                      Number(
                        addDays(
                          new Date(
                            marginHealthChartData.margins[0].date ??
                              Date.now().valueOf(),
                          ),
                          Number(d),
                        ),
                      )
                    }
                    y={() => Thresholds.liquidation}
                    style={{
                      data: {
                        stroke: PangeaColors.RiskBerryDark,
                        strokeWidth: '2',
                      },
                    }}
                    interpolation={interpolationMethod}
                  />
                  <VictoryArea
                    name={'area-margin-liquidation'}
                    style={{
                      data: {
                        fill: PangeaColors.RiskBerryMedium,
                        opacity: '0.4',
                      },
                    }}
                    data={areaLabelOffset(labelOffsetAmount)}
                    x={(d) =>
                      Number(
                        addDays(
                          new Date(
                            marginHealthChartData.margins[0].date ??
                              Date.now().valueOf(),
                          ),
                          Number(d),
                        ),
                      )
                    }
                    y={() => Thresholds.liquidation}
                    y0={() => 0}
                    interpolation={interpolationMethod}
                  />
                </VictoryGroup>
                <VictoryGroup name={'chart-group-line'}>
                  <VictoryLine
                    name='health-original'
                    scale={'time'}
                    data={marginHealthChartData.margins.map((item) => {
                      return {
                        amount: item.amount,
                        date: new Date(item.date),
                        health_score: item.health_score * 100,
                        health_score_after_deposit:
                          item.health_score_after_deposit * 100,
                        health_score_hypothetical:
                          item.health_score_hypothetical * 100,
                        total_hedging: item.total_hedging,
                      };
                    })}
                    x='date'
                    y='health_score'
                    style={{
                      data: {
                        stroke: PangeaColors.Black,
                        strokeWidth: '1px',
                      },
                    }}
                    interpolation={interpolationMethod}
                  />
                  <VictoryScatter
                    name='health-original-scatter'
                    scale={'time'}
                    size={({ active }) => (active ? 6 : 0)}
                    data={marginHealthChartData.margins.map((item) => {
                      return {
                        amount: item.amount,
                        date: new Date(item.date),
                        health_score: item.health_score * 100,
                        health_score_after_deposit:
                          item.health_score_after_deposit * 100,
                        health_score_hypothetical:
                          item.health_score_hypothetical * 100,
                        total_hedging: item.total_hedging,
                      };
                    })}
                    x='date'
                    y='health_score'
                    style={{
                      data: {
                        fill: PangeaColors.LightPrimaryMain,
                        stroke: PangeaColors.LightPrimaryContrast,
                        strokeWidth: '2',
                      },
                    }}
                  />
                  <VictoryLine
                    name='health-modified'
                    scale={'time'}
                    data={marginHealthChartData.margins.map((item) => {
                      return {
                        amount: item.amount,
                        date: new Date(item.date),
                        health_score: item.health_score * 100,
                        health_score_after_deposit:
                          item.health_score_after_deposit * 100,
                        health_score_hypothetical:
                          item.health_score_hypothetical * 100,
                        total_hedging: item.total_hedging,
                      };
                    })}
                    x='date'
                    y='health_score_after_deposit'
                    interpolation={interpolationMethod}
                    style={{
                      data: {
                        stroke: PangeaColors.Black,
                        strokeDasharray: '3',
                        strokeWidth: '2',
                      },
                    }}
                  />
                  <VictoryScatter
                    name='health-modified-with-pending-scatter'
                    scale={'time'}
                    size={({ active }) => (active ? 6 : 0)}
                    data={marginHealthChartData.margins.map((item) => {
                      return {
                        amount: item.amount,
                        date: new Date(item.date),
                        health_score: item.health_score * 100,
                        health_score_after_deposit:
                          item.health_score_after_deposit * 100,
                        health_score_hypothetical:
                          item.health_score_hypothetical * 100,
                        total_hedging: item.total_hedging,
                      };
                    })}
                    x='date'
                    y='health_score_after_deposit'
                    style={{
                      data: {
                        fill: PangeaColors.EarthBlueMedium,
                        stroke: PangeaColors.LightPrimaryContrast,
                        strokeWidth: '2',
                      },
                    }}
                  />
                  <VictoryLine
                    name='health-modified-hypothetical'
                    scale={'time'}
                    data={marginHealthChartData.margins.map((item) => {
                      return {
                        amount: item.amount,
                        date: new Date(item.date),
                        health_score: item.health_score * 100,
                        health_score_after_deposit:
                          item.health_score_after_deposit * 100,
                        health_score_hypothetical:
                          item.health_score_hypothetical * 100,
                        total_hedging: item.total_hedging,
                      };
                    })}
                    x='date'
                    y='health_score_hypothetical'
                    interpolation={interpolationMethod}
                    style={{
                      data: {
                        stroke: PangeaColors.SolidSlateDark,
                        strokeDasharray: '2',
                        strokeWidth: '2',
                      },
                    }}
                  />
                  <VictoryScatter
                    name='health-modified-hypothetical-scatter'
                    scale={'time'}
                    size={({ active }) => (active ? 6 : 0)}
                    data={marginHealthChartData.margins.map((item) => {
                      return {
                        amount: item.amount,
                        date: new Date(item.date),
                        health_score: item.health_score * 100,
                        health_score_after_deposit:
                          item.health_score_after_deposit * 100,
                        health_score_hypothetical:
                          item.health_score_hypothetical * 100,
                        total_hedging: item.total_hedging,
                      };
                    })}
                    x='date'
                    y='health_score_hypothetical'
                    style={{
                      data: {
                        fill: PangeaColors.SecurityGreenDark,
                        stroke: PangeaColors.LightPrimaryContrast,
                        strokeWidth: '2',
                      },
                    }}
                  />
                </VictoryGroup>
                <VictoryGroup name={'dataLabels'}>
                  <DataLabel // text label
                    x={add(
                      new Date(
                        marginHealthChartData.margins[
                          marginHealthChartData.margins.length - 1
                        ].date,
                      ),
                      {
                        days: 3,
                      },
                    )}
                    textAnchor='end'
                    y={Thresholds.excess + (chartMaxY - Thresholds.excess) / 2}
                    text={'Excess Margin'}
                    style={[{ ...labelStyleDef }]}
                  />
                  <DataLabel // text label
                    x={add(
                      new Date(
                        marginHealthChartData.margins[
                          marginHealthChartData.margins.length - 1
                        ].date,
                      ),
                      {
                        days: 3,
                      },
                    )}
                    textAnchor='end'
                    y={
                      Thresholds.buffer +
                      (Thresholds.excess - Thresholds.buffer) / 2
                    }
                    text={'Within Buffer'}
                    style={[{ ...labelStyleDef }]}
                  />
                  <DataLabel // text label
                    x={add(
                      new Date(
                        marginHealthChartData.margins[
                          marginHealthChartData.margins.length - 1
                        ].date,
                      ),
                      {
                        days: 3,
                      },
                    )}
                    y={
                      Thresholds.liquidation +
                      (Thresholds.buffer - Thresholds.liquidation) / 2
                    }
                    textAnchor='end'
                    text={'Deposit Required'}
                    style={[{ ...labelStyleDef }]}
                  />
                  <DataLabel // text label
                    x={add(
                      new Date(
                        marginHealthChartData.margins[
                          marginHealthChartData.margins.length - 1
                        ].date,
                      ),
                      {
                        days: 3,
                      },
                    )}
                    textAnchor='end'
                    y={Thresholds.liquidation / 2}
                    text={'Liquidation'}
                    style={[{ ...labelStyleDef }]}
                  />
                </VictoryGroup>
              </VictoryChart>
            ) : (
              <>No data to display.</>
            )}
          </Box>
        </Stack>
      </ErrorBoundary>
    </>
  );
};
export default DashboardMarginChart;
