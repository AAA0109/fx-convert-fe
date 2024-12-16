import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  cashflowOverviewChartState,
  CashFlowWeightChartData,
  mockCashFlowRequest,
  userState,
} from 'atoms';
import { differenceInDays, subDays } from 'date-fns';
import {
  BaseHedgeItem,
  Cashflow,
  formatCurrency,
  Installment,
  PangeaCashFlowWeightRequest,
  setAlpha,
} from 'lib';
import { isUndefined } from 'lodash';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { PangeaColors } from 'styles';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory';
import { CustomLineBarTooltip } from '../shared';

const MAX_DAYS = 30;
const CHART_BAR_WIDTH = 10;
const CHART_BAR_OFFSET = 4;

const getStartDate = (date: Date): string => {
  if (differenceInDays(date, new Date(Date.now())) < MAX_DAYS) {
    return date?.toISOString().slice(0, 10);
  }
  return subDays(Date.now(), -30)?.toISOString().slice(0, 10);
};

export const CashflowWeightChart = ({
  activeHedge,
}: {
  activeHedge: BaseHedgeItem | undefined;
}): JSX.Element => {
  // TODO: NOTE: `cashflow_id` is `-1` for non-executed cash flows. Once sample data is made available, we can check/wire-up this thing.
  const cashFlowDataRequest = {
    // TODO: change once api supports installments.
    cashflow_ids:
      activeHedge?.type === 'installments'
        ? (activeHedge as Installment).cashflows.map((c) => c.id)
        : [(activeHedge as Cashflow).id],
    // cashflow_id:
    // activeHedge?.type === 'installments'
    //   ? (activeHedge as Installment).cashflows[0].id
    //   : (activeHedge as Cashflow).id,
    start_date: getStartDate((activeHedge as Cashflow).created as Date), //  ?.toISOString().slice(0, 10),
    end_date: new Date(Date.now()).toISOString().slice(0, 10),
  } as PangeaCashFlowWeightRequest;

  const cashFlowWeightChartData = useRecoilValueLoadable(
    cashflowOverviewChartState(
      cashFlowDataRequest.cashflow_ids.length > 0
        ? cashFlowDataRequest
        : mockCashFlowRequest,
    ),
  );

  const weightData = useMemo(() => {
    const data =
      cashFlowWeightChartData.getValue() as CashFlowWeightChartData[];
    return data !== null && data?.length > 0
      ? data
      : ([] as CashFlowWeightChartData[]); // getWeightChartFromResponse(mockCashFlowResponse);
  }, [cashFlowWeightChartData]);

  const domesticCurrency = useRecoilValue(userState)?.company.currency;

  // Selected datum state
  const initialDatum = useMemo(() => {
    return weightData ? [weightData[weightData.length - 1]] : [];
  }, [weightData]);
  const [selectedDatum, setSelectedDatum] = useState(initialDatum);

  const ErrorFallback = ({ error }: FallbackProps) => {
    return (
      <div role='alert'>
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
      </div>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: PangeaColors.White,
        borderRadius: '8px',
        border: '1px solid ' + PangeaColors.Gray,
        mb: '8px',
      }}
      padding={2}
      minHeight={300}
    >
      {weightData && weightData.length > 0 ? (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Stack direction='row' justifyContent='space-between' spacing={2}>
            {/* TODO: the layout of the chart's header data needs to be confirmed by design */}

            {/*Left Block (Cash Flow Value)*/}
            <Stack spacing={0.5}>
              <Stack direction='row' spacing={2}>
                <Typography variant='small' mr={1}>
                  Cash Flow
                </Typography>
                <Image
                  src='/images/icon-circle-primary-main.svg'
                  width={16}
                  height={16}
                  alt='icon'
                />
              </Stack>
              <Stack direction='row' justifyContent='left' alignItems='center'>
                <Typography variant='h5'>
                  {selectedDatum &&
                    formatCurrency(
                      selectedDatum[0]?.amount,
                      domesticCurrency,
                      true,
                      0,
                      0,
                    )}
                </Typography>
              </Stack>
            </Stack>

            {/*Center Block (Account Weight)*/}
            <Stack spacing={0.5}>
              <Stack direction='row' spacing={2}>
                <Typography variant='small' mr={1}>
                  Portfolio
                </Typography>
                <Image
                  src='/images/icon-circle-earthblue-dark.svg'
                  width={16}
                  height={16}
                  alt='icon'
                />
              </Stack>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                spacing={2}
              >
                <Typography variant='h4' width='80px'>
                  {selectedDatum &&
                    (selectedDatum[0]?.percentageAccount ?? '').toLocaleString(
                      'en-US',
                      {
                        style: 'percent',
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 2,
                      },
                    )}
                </Typography>
                <Divider
                  orientation='vertical'
                  flexItem={true}
                  style={{
                    borderColor: setAlpha(PangeaColors.Black, 0.25),
                    borderRightWidth: 0,
                  }}
                ></Divider>

                <Typography variant='h5' width='80px'>
                  {selectedDatum &&
                    formatCurrency(
                      selectedDatum[0]?.account,
                      domesticCurrency,
                      true,
                      0,
                      0,
                      true,
                    )}
                </Typography>
              </Stack>
            </Stack>

            {/*Right Block (Portfolio Weight)*/}
            <Stack spacing={0.5}>
              <Stack direction='row' spacing={2}>
                <Typography variant='small' mr={1}>
                  Company
                </Typography>
                <Image
                  src='/images/icon-circle-earthblue-lighter.svg'
                  width={16}
                  height={16}
                  alt='icon'
                />
              </Stack>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                spacing={2}
                width='150px'
              >
                <Typography variant='h4' width='80px'>
                  {selectedDatum &&
                    (selectedDatum[0]?.percentageCompany ?? '').toLocaleString(
                      'en-US',
                      {
                        style: 'percent',
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      },
                    )}
                </Typography>
                <Divider
                  orientation='vertical'
                  flexItem={true}
                  style={{
                    borderColor: setAlpha(PangeaColors.Black, 0.25),
                    borderRightWidth: 0,
                  }}
                ></Divider>
                <Typography variant='h5' width='80px'>
                  {selectedDatum &&
                    formatCurrency(
                      selectedDatum[0]?.total,
                      domesticCurrency,
                      true,
                      0,
                      0,
                      true,
                    )}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <div className='chart-container'>
            <VictoryChart
              domainPadding={{ x: [10, 0], y: [0, 25] }}
              theme={VictoryTheme.material}
              scale={{ x: 'time', y: 'linear' }}
              width={450}
              height={180}
              padding={{ top: 0, bottom: 15, left: 50, right: 10 }}
              containerComponent={
                <VictoryVoronoiContainer
                  labels={() => ' '} // this is the recommended syntax from Victory to enable custom labels
                  labelComponent={<CustomLineBarTooltip />}
                  voronoiDimension='x'
                  onActivated={(points) => {
                    setSelectedDatum([points[0], points[2]]);
                  }}
                />
              }
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onMouseOut: (e) => {
                      if (
                        !isUndefined(
                          (e as any)?.relatedTarget?.farthestViewportElement,
                        )
                      ) {
                        return;
                      }
                      setSelectedDatum(initialDatum);
                    },
                  },
                },
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
              <VictoryGroup
                name='cf-overview-chart-bars'
                offset={CHART_BAR_OFFSET}
              >
                <VictoryBar
                  name='total-weight'
                  data={weightData}
                  x='date'
                  y='total'
                  style={{
                    data: { fill: PangeaColors.EarthBlueLighter },
                  }}
                  barWidth={CHART_BAR_WIDTH}
                ></VictoryBar>
                <VictoryBar
                  name='account-weight'
                  data={weightData}
                  x='date'
                  y='account'
                  style={{
                    data: { fill: PangeaColors.EarthBlueDark },
                  }}
                  barWidth={CHART_BAR_WIDTH}
                ></VictoryBar>
                <VictoryBar
                  name='cashflow-weight'
                  data={weightData}
                  x='date'
                  y='amount'
                  style={{
                    data: { fill: PangeaColors.PrimaryMain },
                  }}
                  barWidth={CHART_BAR_WIDTH}
                ></VictoryBar>
              </VictoryGroup>
              <VictoryScatter
                name='company-weight-points'
                data={weightData}
                x='date'
                y='total'
                size={({ active }) => (active ? 6 : 0)}
                style={{
                  data: {
                    stroke: PangeaColors.StoryWhiteLight,
                    strokeWidth: 2,
                    fill: PangeaColors.EarthBlueLighter,
                  },
                }}
              ></VictoryScatter>
              <VictoryScatter
                name='account-weight-points'
                data={weightData}
                x='date'
                y='account'
                size={({ active }) => (active ? 6 : 0)}
                style={{
                  data: {
                    stroke: PangeaColors.StoryWhiteLight,
                    strokeWidth: 2,
                    fill: PangeaColors.EarthBlueDark,
                  },
                }}
              ></VictoryScatter>
              <VictoryScatter
                name='cashflow-weight-points'
                data={weightData}
                x='date'
                y='amount'
                size={({ active }) => (active ? 6 : 0)}
                style={{
                  data: {
                    stroke: PangeaColors.StoryWhiteLight,
                    strokeWidth: 2,
                    fill: PangeaColors.PrimaryMain,
                  },
                }}
              ></VictoryScatter>
              <VictoryAxis // x-axis
                tickCount={4}
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
                tickFormat={(t) =>
                  `${new Date(t).toLocaleDateString('default', {
                    month: 'short',
                  })} ${new Date(t).getUTCDate()}`
                }
                offsetY={12}
              />
              <VictoryAxis // y-axis
                dependentAxis
                tickCount={5}
                tickFormat={(t) =>
                  `${formatCurrency(t, domesticCurrency, true, 1, 2, true)}`
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
      ) : (
        <Typography variant='body1'>
          There is currently insufficient data to render this chart. Check back
          in a few days.
        </Typography>
      )}
    </Box>
  );
};
export default CashflowWeightChart;
