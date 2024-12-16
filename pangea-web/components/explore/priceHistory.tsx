import { Grid, Stack, Typography } from '@mui/material';
import { PangeaLoading } from 'components/shared';
import { addDays, format } from 'date-fns';
import { useCacheableAsyncData } from 'hooks';
import { PangeaRateMovingAverage } from 'lib/api/v2/data-contracts';
import { Suspense, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory';
import { clientApiState, transactionRequestDataState } from '../../atoms';
import { PangeaColors } from '../../styles/colors';
import CustomLineBarTooltipForExplore from './customLineBarTooltipForExplore';
let marketData: PangeaFxSpotExtended[] = [];
let rateFlu: string[] = [];
let startDate = '';
/************************************************************************************
 * Interface for the props of the PangeaPageTitle
 * @see {@link PangeaPageTitle}
 *
 * @interface PriceHistoryProps
 *************************************************************************************/
interface PriceHistoryProps {
  interval: string;
  mnemonic: string;
  amountRounding?: number;
}

interface PangeaFxSpotExtended extends PangeaRateMovingAverage {
  rateFlu?: string;
  xDate?: string;
}

function marketDataOrganizer(
  arr: PangeaFxSpotExtended[],
  forOneDay: boolean,
): PangeaFxSpotExtended[] {
  marketData = arr;
  marketData.forEach((item) => {
    const dateObj = new Date(item.date);
    item.date = format(dateObj, 'MMM dd, p O');
    item.xDate = format(dateObj, 'MMM dd');
  });
  if (forOneDay) {
    rateFlu = [];
    rateFlu.push('0.00');
    for (let i = 0; i < marketData.length - 1; i++) {
      const nextRate = marketData[i + 1]['rate'];
      const currentRate = marketData[i]['rate'];

      if (typeof nextRate === 'number' && typeof currentRate === 'number') {
        const diff = ((nextRate - currentRate) / currentRate) * 100;
        rateFlu.push(diff.toFixed(2));
      } else {
        rateFlu.push('null');
      }
    }
    for (const i in marketData) {
      marketData[i]['rateFlu'] = rateFlu[i];
    }
    return marketData;
  } else {
    rateFlu = [];
    rateFlu.push('0.00');
    for (let i = 0; i < marketData.length - 1; i++) {
      const currentRate = marketData[i]['rate'];
      const nextRate = marketData[i + 1]['rate'];

      if (typeof currentRate === 'number' && typeof nextRate === 'number') {
        const diff = ((nextRate - currentRate) / currentRate) * 100;
        rateFlu.push(diff.toFixed(2));
      } else {
        rateFlu.push('null');
      }
    }
    for (const i in marketData) {
      marketData[i]['rateFlu'] = rateFlu[i];
    }
    return marketData;
  }
}

const PriceHistory = ({
  interval,
  mnemonic,
  amountRounding = 0,
}: PriceHistoryProps) => {
  const today = new Date();
  const [flag, setFlag] = useState(false);
  const authHelper = useRecoilValue(clientApiState);
  const transactionData = useRecoilValue(transactionRequestDataState);
  const api = authHelper.getAuthenticatedApiHelper();

  if (interval == '1 day') {
    startDate = addDays(today, -5).toISOString();
  } else if (interval == '1 week') {
    startDate = addDays(today, -8).toISOString();
  } else if (interval == '1 month') {
    startDate = addDays(today, -31).toISOString();
  } else if (interval == '3 months') {
    startDate = addDays(today, -91).toISOString();
  } else if (interval == '1 year') {
    startDate = addDays(today, -366).toISOString();
  } else if (interval == '5 years') {
    startDate = addDays(today, -1826).toISOString();
  } else {
    startDate = addDays(today, -31).toISOString();
  }
  const { data: fxData, isLoading } = useCacheableAsyncData(
    `price_history_${mnemonic}`,
    async () => {
      return marketDataOrganizer(
        await api.loadMarketDataForExploreAsync(
          transactionData.payment_currency,
          transactionData.settlement_currency,
          interval == '1 day' ? addDays(today, -1) : new Date(startDate),
          new Date(),
        ),
        interval === '1 day',
      );
    },
  );
  return (
    <Suspense fallback={<PangeaLoading />}>
      {fxData?.length === 0 ? (
        <Stack
          width={400}
          height={200}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography>No price history available for this market</Typography>
        </Stack>
      ) : isLoading ? (
        <Stack width={400} height={200}>
          <PangeaLoading centerPhrase />
        </Stack>
      ) : (
        <Grid
          container
          sx={{
            width: '100%',
            height: '480px',
            justifyContent: 'center',
            alignItems: 'center',
            mt: '-48px',
          }}
        >
          <>{flag}</>
          <Grid
            item
            sx={{
              width: '564px',
              height: '396px',
              mt: '64px',
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
              padding={{ top: 0, bottom: 0, left: 35, right: 20 }}
              containerComponent={
                <VictoryVoronoiContainer
                  labels={() => ' '} // this is the recommended syntax from Victory to enable custom labels
                  labelComponent={<CustomLineBarTooltipForExplore />}
                  voronoiDimension='x'
                />
              }
              events={[
                {
                  target: 'labels',
                  eventHandlers: {
                    onMouseLeave: () => {
                      setFlag(true);
                    },
                  },
                },
              ]}
            >
              <VictoryLine
                name='unhedged-performance'
                data={fxData}
                x={'xDate'}
                y='rate'
                interpolation='natural'
                style={{
                  data: {
                    stroke: '#A4DB4B',
                    strokeWidth: '3px',
                  },
                }}
              ></VictoryLine>
              <VictoryScatter
                name='unhedged-performance-scatter'
                data={fxData}
                x={'xDate'}
                y='rate'
                style={{
                  data: {
                    stroke: PangeaColors.StoryWhiteMedium,
                    strokeWidth: 2,
                    fill: '#A4DB4B',
                  },
                }}
                size={({ active }) => (active ? 4 : 0)}
              ></VictoryScatter>
              <VictoryAxis // x-axis
                tickCount={4}
                fixLabelOverlap={true}
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
                    fontFamily: 'SuisseNeue',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '8px',
                    lineHeight: '16px',
                    textTransform: 'uppercase',
                    color: '#000000',
                  },
                }}
                offsetY={0}
              />
              <VictoryAxis // y-axis
                dependentAxis
                tickCount={4}
                tickFormat={(t) => `${t.toFixed(amountRounding)}`}
                fixLabelOverlap
                style={{
                  axis: {
                    strokeWidth: 1,
                    strokeDasharray: '3,3',
                  },
                  axisLabel: {
                    fontSize: 15,
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
                    angle: -45,
                  },
                }}
              />
            </VictoryChart>
          </Grid>
        </Grid>
      )}
    </Suspense>
  );
};
export default PriceHistory;
