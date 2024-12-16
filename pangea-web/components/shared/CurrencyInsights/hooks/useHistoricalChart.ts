import { ChartInterval } from './../../../../lib/types';
import { format } from 'date-fns';
import { PangeaFxSpotExtended } from 'lib';

const DEFAULT_ROUNDING = 4;

export const useHistoricalChart = (interval: ChartInterval) => {
  const marketDataOrganizer = (
    arr: PangeaFxSpotExtended[],
  ): PangeaFxSpotExtended[] => {
    let marketData: PangeaFxSpotExtended[] = [];
    let rateFlu: string[] = [];
    const xDateFormat =
      interval === ChartInterval.Month3 ? 'MMM dd' : 'MMM dd, yy';
    marketData = arr.filter((ohlc) => Boolean(ohlc.rate));
    marketData.forEach((item) => {
      const dateObj = new Date(item.date);
      item.date = format(dateObj, 'MMM dd, yyyy');
      item.xDate = format(dateObj, xDateFormat);
    });

    rateFlu = [];
    rateFlu.push('0.00');
    for (let i = 0; i < marketData.length - 1; i++) {
      const firstPeriodRate = marketData[0]['rate'];
      const nextRate = marketData[i + 1]['rate'];

      if (typeof nextRate === 'number' && typeof firstPeriodRate === 'number') {
        const diff = ((nextRate - firstPeriodRate) / nextRate) * 100;
        rateFlu.push(diff.toFixed(DEFAULT_ROUNDING));
      } else {
        rateFlu.push('null');
      }
    }
    for (const i in marketData) {
      marketData[i]['rateFlu'] = rateFlu[i];
    }
    return marketData;
  };

  return { marketDataOrganizer };
};

export default useHistoricalChart;
