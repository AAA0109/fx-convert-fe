import { Stack, Typography } from '@mui/material';
import { PerformanceDataRow, formatCurrency } from 'lib';
import { isUndefined } from 'lodash';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { PangeaColors } from 'styles';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory';
import type { InterpolationPropType } from 'victory-core/lib/types/prop-types';
import { CustomLineBarTooltip } from '../shared';

export const DashboardPerformanceChart = ({
  unhedgedData = [],
  hedgedData = [],
  totalPNLData = [],
  domesticCurrency = 'USD',
}: {
  unhedgedData: PerformanceDataRow[];
  hedgedData: PerformanceDataRow[];
  totalPNLData: PerformanceDataRow[];
  domesticCurrency: string;
}) => {
  // Config parameters
  const interpolationMethod: InterpolationPropType = 'linear';

  // Selected datum state
  const initialDatum = useMemo(() => {
    // TODO: get from API. data structure [{unhedged}, {hedged}]
    return [
      unhedgedData[unhedgedData.length - 1],
      hedgedData[hedgedData.length - 1],
      totalPNLData[totalPNLData.length - 1],
    ];
  }, [hedgedData, unhedgedData, totalPNLData]);
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
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Stack direction={'row'} width='100%' justifyContent='space-between'>
          <Stack spacing={1} alignItems='center'>
            <Stack direction={'row'} display='flex' alignItems={'center'}>
              <Typography variant='small' mr={1}>
                Unhedged PnL
              </Typography>
              <Image
                src={'/images/icon-circle-primary-main.svg'}
                width={16}
                height={16}
                alt='icon'
              />
            </Stack>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems='center'
              spacing={1}
              component={'div'}
            >
              <Typography variant='h5'>
                {selectedDatum &&
                  formatCurrency(
                    selectedDatum[0]?.amount,
                    domesticCurrency,
                    true,
                    0,
                    0,
                    true,
                  )}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={1} alignItems='center'>
            <Stack
              direction={'row'}
              display='flex'
              alignItems={'center'}
              spacing={1}
            >
              <Typography variant='small' mr={1}>
                Hedge PnL
              </Typography>
              <Image
                src={'/images/icon-circle-earthblue-medium.svg'}
                width={16}
                height={16}
                alt='icon'
              />
            </Stack>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems='center'
              spacing={1}
              component={'div'}
            >
              <Typography variant='h5'>
                {selectedDatum &&
                  formatCurrency(
                    selectedDatum[1]?.amount,
                    domesticCurrency,
                    true,
                    0,
                    0,
                    true,
                  )}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={1} alignItems='center'>
            <Stack
              direction={'row'}
              display='flex'
              alignItems={'center'}
              spacing={1}
            >
              <Typography variant='small' mr={1}>
                Total PnL
              </Typography>
              <Image
                src={'/images/icon-circle-warmorange-medium.svg'}
                width={16}
                height={16}
                alt='icon'
              />
            </Stack>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems='center'
              spacing={1}
              component={'div'}
            >
              <Typography variant='h5'>
                {selectedDatum &&
                  formatCurrency(
                    selectedDatum[2]?.amount,
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
            domainPadding={{ x: [0, 0], y: [30, 30] }}
            theme={VictoryTheme.material}
            scale={{ x: 'time', y: 'linear' }}
            width={450}
            height={300}
            padding={{ top: 0, bottom: 15, left: 40, right: 10 }}
            containerComponent={
              <VictoryVoronoiContainer
                labels={() => ' '} // this is the recommended syntax from Victory to enable custom labels
                labelComponent={<CustomLineBarTooltip />}
                voronoiDimension='x'
                onActivated={(points) => {
                  const ptHedged = points.find(
                    (p) => p.childName == 'hedged-performance',
                  );
                  const ptUnhedged = points.find(
                    (p) => p.childName == 'unhedged-performance',
                  );
                  const ptPNL = points.find((p) => p.childName == 'total-pnl');
                  setSelectedDatum([ptUnhedged, ptHedged, ptPNL]);
                }}
              />
            }
            events={[
              {
                target: 'parent',
                eventHandlers: {
                  onMouseOut: (e) => {
                    //little hack to make sure we only fire this when you leave the SVG
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
            <VictoryLine
              name='mean-line'
              data={unhedgedData}
              x={'date'}
              y={() => 0}
              style={{
                data: {
                  stroke: PangeaColors.Black,
                  strokeWidth: '1px',
                },
              }}
            ></VictoryLine>
            <VictoryLine
              name='unhedged-performance'
              data={unhedgedData}
              x='date'
              y='amount'
              interpolation={interpolationMethod}
              style={{
                data: {
                  stroke: PangeaColors.PrimaryMain,
                  strokeWidth: '1.5px',
                },
              }}
            ></VictoryLine>
            <VictoryScatter
              name='unhedged-performance-scatter'
              data={unhedgedData}
              x={'date'}
              y='amount'
              style={{
                data: {
                  stroke: PangeaColors.StoryWhiteLight,
                  strokeWidth: 2,
                  fill: PangeaColors.PrimaryMain,
                },
              }}
              size={({ active }) => (active ? 6 : 0)}
            ></VictoryScatter>
            <VictoryLine
              name='hedged-performance'
              data={hedgedData}
              x={'date'}
              y='amount'
              interpolation={interpolationMethod}
              style={{
                data: { stroke: PangeaColors.EarthBlueMedium },
              }}
            ></VictoryLine>
            <VictoryScatter
              name='hedged-performance-scatter'
              data={hedgedData}
              x={'date'}
              y='amount'
              style={{
                data: {
                  stroke: PangeaColors.StoryWhiteLight,
                  strokeWidth: 2,
                  fill: PangeaColors.EarthBlueMedium,
                },
              }}
              size={({ active }) => (active ? 6 : 0)}
            ></VictoryScatter>
            <VictoryLine
              name='total-pnl'
              data={totalPNLData}
              x={'date'}
              y='amount'
              interpolation={interpolationMethod}
              style={{
                data: { stroke: PangeaColors.WarmOrangeMedium },
              }}
            ></VictoryLine>
            <VictoryScatter
              name='total-pnl-scatter'
              data={totalPNLData}
              x={'date'}
              y='amount'
              style={{
                data: {
                  stroke: PangeaColors.StoryWhiteLight,
                  strokeWidth: 2,
                  fill: PangeaColors.WarmOrangeMedium,
                },
              }}
              size={({ active }) => (active ? 6 : 0)}
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
              offsetY={12}
              tickFormat={(x) => {
                const t = new Date(x);
                return `${t.toLocaleDateString('default', {
                  month: 'short',
                })} ${t.getUTCDate()}`;
              }}
            />
            <VictoryAxis //y-axis
              dependentAxis
              //tickCount={5}
              tickFormat={(t) => formatCurrency(t, 'USD', true, 0, 0, true)}
              style={{
                axis: {
                  stroke: PangeaColors.BlackSemiTransparent50,
                  strokeWidth: 1,
                },
                //axisLabel: { fontSize: 10 },
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
            />
          </VictoryChart>
        </div>
      </ErrorBoundary>
    </>
  );
};
export default DashboardPerformanceChart;
