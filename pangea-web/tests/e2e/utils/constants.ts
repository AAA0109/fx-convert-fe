export const pollConfig = {
  // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe
  // ... Defaults to [100, 250, 500, 1000].
  intervals: [1_000, 2_000, 10_000],
  timeout: 60_000,
};

export const CCY_RANKS = [
  'XAG',
  'XAU',
  'BTC',
  'ETH',
  'EUR',
  'GBP',
  'AUD',
  'NZD',
  'USD',
  'CAD',
  'CHF',
  'NOK',
  'SEK',
  'BRL',
  'MXN',
  'HKD',
  'TRY',
  'ZAR',
  'PLN',
  'HUF',
  'CZK',
  'SGD',
  'CNY',
  'CNH',
  'KRW',
  'INR',
  'RUB',
  'TWD',
  'THB',
  'MYR',
  'ILS',
  'IDR',
  'CLP',
  'COP',
  'PEN',
  'PHP',
  'ARS',
  'JPY',
  'NGN',
  'KES',
  'UGX',
];

export const NO_WALLET_CURRENCY = [
  'KRW',
  'COP',
  'TRY',
  'ZAR',
  'PEN',
  'CNY',
  'JPY',
];
