import { addDays } from 'date-fns';
import {
  IAccountPerfData,
  INewAccountPerfChartData,
  PangeaCurrencyEnum,
  PangeaDepositRequest,
  PangeaWithdrawRequestMethodEnum,
  bound,
  serializeDateTime,
  standardizeDate,
} from 'lib';
import { PangeaAccountPnLResponse } from 'lib/api/v1/data-contracts';
import { isError } from 'lodash';
import { atom, selector } from 'recoil';
import { activeOriginalHedgeState, clientApiState } from './';
export const dashboardPerformanceDataState = selector<IAccountPerfData>({
  key: 'dashboardPerformanceData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const perfData = await api.getPerformanceDataAsync();
    if (isError(perfData)) {
      return {
        [-1]: {
          unhedgedData: [],
          hedgedData: [],
          unrealizedPNLData: [],
          cashflows: [],
          forwardData: [],
          volatility: [],
        },
      } as IAccountPerfData;
    }
    return perfData;
  },
});
export const performanceTrackingDataState = selector<INewAccountPerfChartData>({
  key: 'performanceTrackingData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const activeHedge = get(activeOriginalHedgeState);
    if (!activeHedge)
      return {
        unhedgedData: [],
        hedgedData: [],
        totalPNLData: [],
      };
    const convertToChartData = (
      val: PangeaAccountPnLResponse,
    ): INewAccountPerfChartData => {
      const h0 =
        ((val.hedged_pnl?.length ?? 0) > 0 ? val.hedged_pnl[0] : 0) + 2e-10;
      const u0 =
        ((val.unhedged_pnl?.length ?? 0) > 0 ? val.unhedged_pnl[0] : 0) + 2e-10;
      const p0 =
        ((val.hedged_pnl?.length ?? 0) > 0
          ? val.hedged_pnl[0] + val.unhedged_pnl[0]
          : 0) + 2e-10;
      const hedgedData = val.times.map((t, i) => ({
        date: new Date(t),
        amount: Math.trunc(val.hedged_pnl[i] - val.unhedged_pnl[i]),
        percentage: bound(
          Math.trunc(val.hedged_pnl[i] + val.unhedged_pnl[i] - p0) / p0,
          -1,
          1,
        ),
      }));
      const unhedgedData = val.times.map((t, i) => ({
        date: new Date(t),
        amount: Math.trunc(val.unhedged_pnl[i]),
        percentage: bound(Math.trunc(val.unhedged_pnl[i] - u0) / u0, -1, 1),
      }));
      const totalPNLData = val.times.map((t, i) => ({
        date: new Date(t),
        amount: Math.trunc(val.hedged_pnl[i]),
        percentage: bound((val.hedged_pnl[i] - h0) / h0, -1, 1),
      }));
      return {
        hedgedData,
        unhedgedData,
        totalPNLData,
      } as INewAccountPerfChartData;
    };
    const tomorrow = addDays(new Date(), 1);
    const end_date = serializeDateTime(
      standardizeDate(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        activeHedge.endDate! < tomorrow ? activeHedge.endDate! : tomorrow,
      ),
    )?.split('T')[0];
    const start_date = serializeDateTime(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      standardizeDate(activeHedge.created!),
    )?.split('T')[0];
    const compDataRequest = {
      account_id: activeHedge.accountId ?? -1,
      start_date: start_date ?? '2023-10-01',
      end_date: end_date ?? '2023-11-07',
    };

    const perfData = await api.getPerformanceTrackingAsync(compDataRequest);
    if (isError(perfData)) {
      return {
        unhedgedData: [],
        hedgedData: [],
        totalPNLData: [],
      };
    }
    return convertToChartData(perfData);
  },
});
export const depositRequestDataState = atom<PangeaDepositRequest>({
  key: 'depositRequestData',
  default: {
    amount: 0,
    broker_account_id: 0, // this will come from userAccountState
    currency: PangeaCurrencyEnum.USD, // coming from domestic currency
    method: PangeaWithdrawRequestMethodEnum.WIRE, // this isn't changing
  } as PangeaDepositRequest,
});

export const depositSelectionState = atom<string>({
  key: 'depositSelection',
  default: '',
});
