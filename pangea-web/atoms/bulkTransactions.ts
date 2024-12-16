import { PangeaMarketSpotDates } from 'lib';
import { atom } from 'recoil';

export const allBulkInitialMarketValueDateState = atom<
  Nullable<PangeaMarketSpotDates>
>({
  key: 'allBulkInitialMarketValueDate',
  default: null,
});
