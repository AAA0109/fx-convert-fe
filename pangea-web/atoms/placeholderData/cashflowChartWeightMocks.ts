import { PangeaCashFlowWeightRequest, PangeaCashFlowWeightResponse } from 'lib';

export const mockCashFlowResponse: PangeaCashFlowWeightResponse = {
  times: [
    '2022-09-12',
    '2022-09-13',
    '2022-09-14',
    '2022-09-15',
    '2022-09-16',
    '2022-09-17',
    '2022-09-18',
    '2022-09-19',
    '2022-09-20',
    '2022-09-21',
    '2022-09-22',
    '2022-09-23',
    '2022-09-24',
    '2022-09-25',
    '2022-09-26',
  ],
  cashflow_npv: [
    4100, 4200, 4000, 3900, 4500, 4100, 4200, 4000, 3900, 4500, 4100, 4200,
    4000, 3900, 4500,
  ],
  account_npv: [
    25000, 26700, 26800, 18000, 28000, 25000, 26700, 26800, 18000, 28000, 25000,
    26700, 26800, 18000, 28000,
  ],
  company_npv: [
    100000, 123000, 99999, 100001, 111000, 100000, 123000, 99999, 100001,
    111000, 100000, 123000, 99999, 100001, 111000,
  ],
};

export const mockCashFlowRequest: PangeaCashFlowWeightRequest = {
  start_date: '2022-009-16',
  end_date: '2022-09-20',
  cashflow_ids: [1],
};
