import {
  CreateSerializableParam,
  PangeaCashFlowWeightRequest,
  PangeaCashFlowWeightResponse,
} from 'lib';
import { isError } from 'lodash';
import { selectorFamily } from 'recoil';
import { clientApiState, mockCashFlowRequest, mockCashFlowResponse } from './';

export interface CashFlowWeightChart {
  cashflowData: CashFlowWeightChartData[];
  accountTotal: CashFlowWeightChartData[];
  companyTotal: CashFlowWeightChartData[];
  currency: string;
}
export interface CashFlowWeightChartData {
  date: string;
  amount: number;
  account: number;
  percentageAccount: number;
  percentageCompany: number;
  total: number;
}

export const getWeightChartFromResponse = (
  apiData: PangeaCashFlowWeightResponse,
): CashFlowWeightChartData[] => {
  const { times, cashflow_npv, account_npv, company_npv } = apiData;
  if (
    isError(apiData) ||
    // arrays are out of sync or empty
    times.length !== cashflow_npv.length ||
    times.length !== account_npv.length ||
    times.length !== company_npv.length ||
    times.length === 0
  ) {
    return [] as CashFlowWeightChartData[];
  }
  return times
    .map((time, idx) => {
      return {
        date: time,
        total: company_npv[idx],
        amount: cashflow_npv[idx],
        account: account_npv[idx],
        percentageAccount: cashflow_npv[idx] / account_npv[idx],
        percentageCompany: cashflow_npv[idx] / company_npv[idx],
      } as CashFlowWeightChartData;
    })
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    ) as CashFlowWeightChartData[];
};

export const cashflowOverviewChartState = selectorFamily<
  CashFlowWeightChartData[] | null,
  CreateSerializableParam<PangeaCashFlowWeightRequest> | undefined
>({
  key: 'cashFlowWeightChartData',
  get:
    (cfRequestParams) =>
    async ({ get }) => {
      try {
        const api = get(clientApiState);
        const apiHelper = api.getAuthenticatedApiHelper();
        const weightData = await apiHelper.loadCashFlowWeightData(
          cfRequestParams !== undefined ? cfRequestParams : mockCashFlowRequest,
        );
        if (
          weightData &&
          Object.hasOwn(weightData, 'times') &&
          !isError(weightData)
        ) {
          return getWeightChartFromResponse(weightData);
        } else {
          // TODO: make error handling more robust and remove the mock data after sample date is made available in the dev db.
          return getWeightChartFromResponse(mockCashFlowResponse);
        }
      } catch (e) {
        console.error(e);
        return [];
      }
    },
});
