export type bookTransactionTestFormValuesType = {
  description: string;
  sellCurrency: string;
  buyCurrency: string;
  sellAmount: string;
  purposeOfPayment: string;
};

export enum DeliveryMethods {
  SpotImmediate = 'Spot FX (Immediate)',
  SpotStrategic = 'Spot FX (Strategic Execution)',
  ForwardImmediate = 'FX Forward (Immediate)',
  ForwardStrategic = 'FX Forward (Strategic Execution)',
  ScheduledStrategic = 'Scheduled Spot FX (Strategic Execution)',
}

export type Liquidity = 'good' | 'limited' | 'poor' | 'acceptable' | 'closed';
export type FwdRfqType = 'api' | 'manual';
export type CurrencyPairsType = {
  buy: string;
  sell: string;
  liquidity: Liquidity;
  market: string;
  is_ndf: boolean;
  fwd_rfq_type: FwdRfqType;
  market_status: string;
  time: string;
  spread_in_bps: number;
};

export const LiquidityHeading: Record<Liquidity, string> = {
  good: 'good Liquidity',
  limited: 'limited Liquidity',
  poor: 'poor Liquidity',
  acceptable: 'acceptable Liquidity',
  closed: 'closed Liquidity',
};

export const TransactionConfirmationText = {
  default: {
    heading: 'Transactions Created',
    subHeading: "You'll see these transactions in your dashboard.",
  },
  scheduled: {
    heading: 'Request for Quote initiated',
    subHeading:
      "This is not a trade execution confirmation. A member of Pangea's Trade Desk will contact you shortly to finalize the transaction.",
  },
};
export type TransactionConfirmationKeyType =
  keyof typeof TransactionConfirmationText;
