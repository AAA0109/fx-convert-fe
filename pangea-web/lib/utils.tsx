import axios from 'axios';
import parse from 'color-parse';
import cronstrue from 'cronstrue';
import {
  addBusinessDays,
  addDays,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  format,
  formatISO,
  isSameWeek,
} from 'date-fns';
import {
  AnyHedgeItem,
  FrequencyType,
  IMarginHealthData,
  IMarginProjectionData,
  IRecurrenceData,
  OccurenceFieldValue,
  Predicate,
  TransactionRequestData,
} from 'lib/types';
import { isArray, isFinite, isNull, isUndefined } from 'lodash';
import { ByWeekday, Frequency, RRule, Weekday } from 'rrule';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isTaxID from 'validator/lib/isTaxID';
import {
  PangeaAccount,
  PangeaCalendarEnum,
  PangeaCashFlowCore,
  PangeaDraftCashflow,
  PangeaPaymentRfq,
  PangeaPaymentStatusEnum,
  PangeaSpotRateRequest,
} from '../lib/api/v2/data-contracts';
import { Cashflow } from '../lib/models/cashflow';
import { PangeaPayment } from './api/v1/data-contracts';

const byteToHex: string[] = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

export const setAlpha = (colorValue: string, alpha: number) => {
  const c = parse(colorValue);
  const h = [...c.values.slice(0, 3), Math.floor(alpha * 255)];
  return '#' + h.map((v) => v.toString(16).padStart(2, '0')).join('');
};
export const randomRgbColor = () => {
  const r = Math.floor(Math.random() * 256); // Random between 0-255
  const g = Math.floor(Math.random() * 256); // Random between 0-255
  const b = Math.floor(Math.random() * 256); // Random between 0-255
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};
export const convertToDomesticAmount = (
  foreignAmount: number,
  exchangeRate: string | number,
): string => {
  if (!exchangeRate) {
    return '';
  }
  const exchangeRateVal = parseFloat(exchangeRate.toString());
  if (isNaN(exchangeRateVal) || exchangeRateVal <= 0) {
    return '';
  }

  const foreign = foreignAmount || 0;
  const returnValue = (foreign / exchangeRateVal).toFixed(0).toString();
  return returnValue;
};

export const ensureArray = <T,>(val: T | T[]): T[] => {
  if (isUndefined(val) || isNull(val)) {
    return val as T[];
  }
  return isArray(val) ? val : [val];
};

export const convertToForeignAmount = (
  domesticAmount: number,
  exchangeRate: string | number,
): string => {
  if (!exchangeRate) {
    return '';
  }
  const exchangeRateVal = parseFloat(exchangeRate.toString());
  if (isNaN(exchangeRateVal) || exchangeRateVal <= 0) {
    return '';
  }

  const domestic = domesticAmount || 0;
  let returnValue = (domestic * exchangeRateVal * 1000).toFixed(0);
  returnValue = returnValue.substring(0, returnValue.length - 3);
  return returnValue;
};

export function formatString(str: string, ...val: any[]): string {
  for (let index = 0; index < val.length; index++) {
    str = str.replace(`{${index}}`, val[index]);
  }
  return str;
}

// Transforms the day to MMM, DD, YYYY
export function formatDateToMonthDayYear(value: Date) {
  return value.toLocaleDateString('default', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function capitalizeFirstLetter(str: string) {
  if (str == null || str.length == 0) {
    return str;
  }
  if (str.length === 1) {
    return str.toUpperCase();
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatCurrency(
  amt: number | string,
  currencyType: Optional<string> = 'USD',
  narrow = true,
  minimumFractionDigits = 2,
  maximumFractionDigits = 4,
  autoAbbreviate = false,
  style: Optional<'currency' | 'decimal' | 'percent' | 'unit'> = 'currency',
  currencyFormatting:
    | 'code'
    | 'symbol'
    | 'narrowSymbol'
    | 'name'
    | undefined = undefined,
): string {
  if (!currencyType) return amt.toString();
  let options: Intl.NumberFormatOptions = {
    style,
    currencyDisplay: currencyFormatting
      ? currencyFormatting
      : narrow
      ? 'narrowSymbol'
      : 'symbol',
    currency: currencyType,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  };

  const nAmt = Number(amt) == 0 ? +0 : Number(amt); //This seems stupid, but toLocaleString returns -0 sometimes. What even is that?!
  if (autoAbbreviate) {
    options = {
      ...options,
      ...getAutoAbbreviateOptions(nAmt),
    };
  }
  return nAmt.toLocaleString('en-US', options);
}

export const getAutoAbbreviateOptions = (
  nAmt: number,
): Intl.NumberFormatOptions => {
  let options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: false,
  };
  if (Math.abs(nAmt) >= 1000 && Math.abs(nAmt) < 10000) {
    options = {
      ...options,
      minimumSignificantDigits: 4,
      maximumSignificantDigits: 4,
    };
  } else if (Math.abs(nAmt) >= 10000) {
    options = {
      ...options,
      compactDisplay: 'short',
      notation: 'compact',
      minimumSignificantDigits: 3,
      maximumSignificantDigits: 3,
    };
  }
  return options;
};

export function isLastWeekdayOfMonth(date: Date): boolean {
  const nextWeek = addDays(date, 7);
  return nextWeek.getMonth() != date.getMonth();
}

export function getWeekdayName(date: Date) {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][date.getDay()];
}

export function getOrdinalOfWeekdayFromDate(date: Date): number {
  let iDate: Date = date;
  let i = 1;
  while (iDate.getMonth() == date.getMonth()) {
    iDate = addDays(iDate, -7);
    i++;
  }
  i--;
  return i;
}

export function getDisplayOrdinalWeekdayFromDate(date: Date): string {
  const ordinal = getOrdinalOfWeekdayFromDate(date);
  const suffix = ['', 'st', 'nd', 'rd', 'th', 'th'][ordinal];
  return `${ordinal}${suffix} ${getWeekdayName(date)}`;
}

export function getDisplayTextFromCron(cron: string) {
  if (!cron) return null;
  let cronStr = cronstrue.toString(cron);
  cronStr =
    cronStr.indexOf(',') > 0
      ? cronStr.split(',').slice(1).join(',').trimStart()
      : cronStr;

  return cronStr.replace('At 12:00 AM', 'Every Day');
}

export function htmlEncode(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * getOccurrencesFromPattern returns an array of Dates representing the occurrences of an iCal pattern
 * @date 6/8/2022 - 11:05:32 AM
 *
 * @export
 * @param {(NullableString)} pattern @description The iCAL RRULE pattern to parse.
 * @param {number} [defaultOccurrencesLimit=730] @description The number of occurrences to limit the result to if no end date or count given in the pattern.
 * @returns {Date[]}
 */
export function getOccurrencesFromPattern(
  pattern: NullableString,
  defaultOccurrencesLimit = 730,
): Date[] {
  let rrule: Nullable<RRule> = null;
  if (!pattern) {
    return [];
  }
  try {
    rrule = new RRule(RRule.parseString(pattern));
    if (rrule.options.until == null && rrule.options.count == null) {
      rrule.options.count = defaultOccurrencesLimit;
    }
  } catch (e) {
    // console.debug('Error parsing rule pattern: ', pattern, e);
  }
  if (!rrule) {
    return [];
  }

  return rrule.all();
}

export const compare = (v1: string, v2: string): number => {
  if (v1 > v2) {
    return 1;
  }
  if (v1 < v2) {
    return -1;
  }
  return 0;
};

export function getCashflowTxDates(
  hedgeFrequency: FrequencyType,
  recurData?: Nullable<IRecurrenceData>,
  instData?: Nullable<Cashflow[]>,
): Date[] {
  let cashflowTxDates: Date[];
  if (hedgeFrequency === 'recurring' && recurData) {
    cashflowTxDates = getOccurrencesFromPattern(recurData.pattern ?? null);
  } else if (hedgeFrequency == 'installments' && instData) {
    cashflowTxDates = instData.map((d) =>
      standardizeDate(new Date(`${d.date}`)),
    );
  } else {
    cashflowTxDates = [];
  }
  return cashflowTxDates.filter((d) => Number(d) >= Date.now());
}

export function getCashflowTotalAmount(
  hedgeFrequency: FrequencyType,
  cashflowTxDates?: Date[],
  instData?: Cashflow[],
  exchangeRate?: number,
  domesticAmount?: number,
): number {
  let cashflowTotalAmount: number;
  if (hedgeFrequency === 'recurring' && cashflowTxDates && domesticAmount) {
    cashflowTotalAmount = cashflowTxDates.length * domesticAmount;
  } else if (hedgeFrequency === 'installments' && instData && exchangeRate) {
    cashflowTotalAmount =
      instData.reduce((acc: number, d) => acc + Number(d.amount), 0) /
      exchangeRate;
  } else if (domesticAmount) {
    cashflowTotalAmount = domesticAmount;
  } else {
    cashflowTotalAmount = 0;
  }
  return cashflowTotalAmount;
}

export function getCashflowsArray(
  hedgeFrequency: FrequencyType,
  amount?: string | number, // may be a string or a number, depending on source
  currency?: string, // currency mnemonic
  payDate?: Date,
  name = 'cashflow', // some sane default name string
  recurData?: Nullable<IRecurrenceData>,
  instData?: Nullable<Cashflow[]>,
): Nullable<Record<string, PangeaCashFlowCore[]>> {
  if (!currency) return null;
  let cashflows: Record<string, PangeaCashFlowCore[]>;
  if (hedgeFrequency === 'recurring' && recurData) {
    cashflows = {
      [currency]: getOccurrencesFromPattern(recurData.pattern ?? null)
        .filter((date) => Number(date) >= Date.now())
        .map((instance) => {
          return {
            amount: Number(amount),
            currency: currency,
            pay_date: instance.toISOString().split('T')[0],
            name: `${name}_${instance.toISOString()}`,
          };
        }),
    };
  } else if (hedgeFrequency == 'installments' && instData) {
    cashflows = {
      [currency]: instData.map((installment) =>
        installment.toCashflowCore(true),
      ),
    };
  } else {
    // must be a one-time cashflow
    if (!payDate) return null;
    cashflows = {
      [currency]: [
        {
          amount: Number(amount),
          currency: currency,
          pay_date: payDate?.toISOString().split('T')[0],
          name: name,
        },
      ],
    };
  }
  return cashflows;
}

export function isSafeUrlForRedirect(url: NullableString): boolean {
  if (!url) {
    return true;
  }
  if (url.indexOf(':') >= 0) {
    return false;
  }
  return (
    url.startsWith('/login') ||
    url.startsWith('/cashflow') ||
    url.startsWith('/create/') ||
    url.startsWith('/activation/') ||
    url.startsWith('/account') ||
    url.startsWith('/dashboard') ||
    url.startsWith('/manage')
  );
}

export function getStartOfToday() {
  return standardizeDate(new Date());
}
export function getEarliestAllowableStartDate() {
  return getFirstBusinessDayOfFollowingWeek(getStartOfToday());
}

export function getTwoYearsFromToday() {
  return addDays(getStartOfToday(), 729);
}
export function getOneYearFromToday() {
  return addDays(getStartOfToday(), 364);
}
export function getFirstBusinessDayOfFollowingWeek(date: Date) {
  let d = 1;
  while (isSameWeek(date, addBusinessDays(date, d))) {
    d++;
  }
  return addBusinessDays(date, d);
}
export const parseBoolean = (
  val: Optional<Nullable<boolean | number | string>>,
): boolean => {
  if (val === undefined || val == null) {
    return false;
  }
  if (val === true || val === false) {
    return val;
  }
  if (!isNaN(Number(val)) && Number(val) != 0) {
    return true;
  }
  if (isFinite(Number(val))) {
    return new Boolean(Number(val)).valueOf();
  }
  if ((val?.toString().toLowerCase() ?? 'false') === 'false') {
    return false;
  } else if (val?.toString().length > 0) {
    return true;
  }
  return false;
};

export const intFromBytes = (byteArr: number[]): number => {
  return byteArr.reduce((a, c, i) => a + c * 2 ** (24 - i * 8), 0);
};

export const getInt32Bytes = (x: number) => {
  return [x, x << 8, x << 16, x << 24].map((z) => z >>> 24);
};

export const guidFromIntArray = (
  arr: ArrayLike<number>,
  offset = 0,
): string => {
  return (
    byteToHex[arr[offset + 0]] +
    byteToHex[arr[offset + 1]] +
    byteToHex[arr[offset + 2]] +
    byteToHex[arr[offset + 3]] +
    '-' +
    byteToHex[arr[offset + 4]] +
    byteToHex[arr[offset + 5]] +
    '-' +
    byteToHex[arr[offset + 6]] +
    byteToHex[arr[offset + 7]] +
    '-' +
    byteToHex[arr[offset + 8]] +
    byteToHex[arr[offset + 9]] +
    '-' +
    byteToHex[arr[offset + 10]] +
    byteToHex[arr[offset + 11]] +
    byteToHex[arr[offset + 12]] +
    byteToHex[arr[offset + 13]] +
    byteToHex[arr[offset + 14]] +
    byteToHex[arr[offset + 15]]
  ).toLowerCase();
};

export const uuidToIntArray = (uuid: string): number[] => {
  const arr = new Uint8Array(16);
  const guidStr = uuid.replace(/-/g, '');
  if (guidStr.length != 32) {
    throw 'invalid guid';
  }
  for (let i = 0; i < 32; i += 2) {
    arr[i / 2] = byteToHex.indexOf(guidStr.substring(i, i + 2));
  }
  const n: number[] = new Array<number>(arr.length);
  arr.forEach((v, i) => (n[i] = v));
  return n;
};

const FrequencyTypeMap = { onetime: 1, recurring: 2, installments: 3 };
export const uuidFromCashflowIds = (
  accountId: number,
  cashflowId: number,
  cashflowType: FrequencyType,
): string => {
  const MAX_SAFE_32_BIT_INTEGER = 2 ** 32;
  if (
    accountId > MAX_SAFE_32_BIT_INTEGER ||
    cashflowId > MAX_SAFE_32_BIT_INTEGER ||
    accountId < 0 ||
    cashflowId < 0
  ) {
    throw 'invalid id';
  }
  const freqInt: number = cashflowType
    ? Object.entries(FrequencyTypeMap).find(
        (value) => value[0] === cashflowType.toString(),
      )?.[1] ?? 0
    : 0;
  const uuidBuffer = getInt32Bytes(accountId) //4 bytes
    .concat(getInt32Bytes(cashflowId)) //4 bytes
    .concat(getInt32Bytes(freqInt)) //4 bytes
    .concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) //pad
    .slice(0, 16);
  return guidFromIntArray(uuidBuffer);
};

export const cashflowIdsFromUuid = (
  cashflowUuid: string,
): { accountId: number; cashflowId: number; cashflowType: FrequencyType } => {
  const intArray = uuidToIntArray(cashflowUuid);

  return {
    cashflowId: intFromBytes(intArray.slice(4, 8)),
    accountId: intFromBytes(intArray.slice(0, 4)),
    cashflowType: Object.entries(FrequencyTypeMap).find(
      (value) => value[1] === intFromBytes(intArray.slice(8, 12)),
    )?.[0] as FrequencyType,
  };
};

export const recurrenceDataFromPattern = (
  pattern: string,
): Nullable<IRecurrenceData> => {
  if (!pattern) {
    return null;
  }
  const rule = RRule.fromString(pattern);
  if (!rule) {
    return null;
  }
  return {
    pattern,
    displayText: capitalizeFirstLetter(rule.toText()),
    startDate: rule.options.dtstart,
    endDate: rule.options.until,
    numOccurrences: rule.options.until ? undefined : rule.options.count,
  };
};

export const getIPAddressAsync = async () => {
  try {
    const resp = await axios('https://api.ipify.org?format=json');
    if (resp.status < 400) {
      return resp.data.ip;
    }
  } catch (e) {
    //swallow
  }
  return '0.0.0.0';
};

/***************Error Helpers  **********************/
// from: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

export const createNewDraft = (
  name: string,
  description: string,
  amount: number,
  currency: string,
  end_date: Nullable<Date> = null,
  rrule: NullableString = null,
): PangeaDraftCashflow => {
  return {
    id: 0,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    amount,
    cashflow_id: null,
    name,
    description,
    currency,
    calendar: PangeaCalendarEnum.NULL_CALENDAR,
    date: new Date().toISOString(),
    end_date: end_date?.toISOString(),
    periodicity: rrule,
  } as PangeaDraftCashflow;
};

export function isOfType<T>(obj: any, ...members: string[]): obj is T {
  if (!obj) {
    return false;
  }
  let hasAllProps = true;
  members.forEach((m) => {
    hasAllProps &&= !!obj[m];
  });
  return hasAllProps;
}

export function isString(data: any): data is string {
  return typeof data === 'string';
}

export function hashString(str: string) {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}

export const abbreviateNumber = (
  x: number,
  fixed?: number,
  precision?: number,
): string => {
  if (isNaN(x) || !isFinite(x)) {
    return '';
  }
  const xs: string = x.toExponential();
  const e: number = +xs.substring(xs.indexOf('e') + 2);
  let n: number = +xs.substring(0, xs.indexOf('e'));
  let ei: number = e;
  while (!(ei % 3 === 0)) {
    n *= 10;
    ei--;
  }
  const a = ['', 'K', 'M', 'B'][ei / 3];
  if (precision) {
    return `${n.toPrecision(precision)}${a}`;
  } else if (fixed) {
    return `${n.toFixed(fixed)}${a}`;
  } else {
    return `${n}${a}`;
  }
};

export function calculateHealthScores(
  marginData: IMarginProjectionData[],
  offset = 0,
): IMarginHealthData[] {
  const LIQUID_HEALTH_LEVEL = 20; //0-20
  const MAINTENANCE_HEALTH_LEVEL = 30; // 20-50
  const BUFFER_HEALTH_LEVEL = 50; //50-100
  const EXCESS_HEALTH_LEVEL = 20; //100-120
  const MAX_HEALTH_LEVEL =
    LIQUID_HEALTH_LEVEL +
    MAINTENANCE_HEALTH_LEVEL +
    BUFFER_HEALTH_LEVEL +
    EXCESS_HEALTH_LEVEL;
  const healthLevelBaselines: number[] = [
    0,
    LIQUID_HEALTH_LEVEL,
    LIQUID_HEALTH_LEVEL + MAINTENANCE_HEALTH_LEVEL,
    LIQUID_HEALTH_LEVEL + MAINTENANCE_HEALTH_LEVEL + BUFFER_HEALTH_LEVEL,
  ];
  if (!marginData || marginData.length == 0) {
    return [];
  }

  return marginData.map((m) => {
    // Determine multipliers and store in array in order of liquid, maint, buffer, excess.
    const multipliers: number[] = new Array<number>(4);
    multipliers[0] = LIQUID_HEALTH_LEVEL / m.liquid_level;
    multipliers[1] =
      MAINTENANCE_HEALTH_LEVEL / (m.maintenance_level - m.liquid_level);
    multipliers[2] =
      BUFFER_HEALTH_LEVEL / (m.buffer_level - m.maintenance_level);
    multipliers[3] = multipliers[2];

    // Determine baseline amounts for each band
    const baselines: number[] = [
      0,
      m.liquid_level,
      m.maintenance_level,
      m.buffer_level,
    ];

    // Determine which band the margin for today sits in.
    const amount = m.margin_amt + offset;
    const band =
      amount >= m.buffer_level
        ? 3
        : amount >= m.maintenance_level
        ? 2
        : amount >= m.liquid_level
        ? 1
        : 0;

    const healthScore = Math.floor(
      Math.min(
        MAX_HEALTH_LEVEL,
        healthLevelBaselines[band] +
          (amount - baselines[band]) * multipliers[band],
      ),
    );
    return {
      date: new Date(m.date),
      score: healthScore,
    };
  });
}

export const createGuid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const serializeDateTime = (
  d?: Optional<Nullable<Date>>,
  defaultReturnValue?: NullableString,
): NullableString => {
  if (!d || isNaN(Number(new Date(d)))) {
    return defaultReturnValue;
  }
  return new Date(d).toISOString();
};

export const standardizeDate = (
  date?: Nullable<Date | string | number>,
): Date => {
  if (date === undefined || isNull(date)) {
    return standardizeDate(new Date());
  }

  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }

  if (typeof date === 'object' && date.constructor == Date) {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0, 0),
    );
  }

  throw 'Something happened wrong in standardizeDate';
};

export const valueIfUndefined = <T,>(v: T | undefined, defaultValue: T): T => {
  return isUndefined(v) ? defaultValue : v;
};

export const valIfNaN = (v: number, valIfNaN: number): number => {
  return isNaN(v) ? valIfNaN : v;
};

/**
 * Returns the value portion of a Record without having to know the key.
 * @date 8/8/2022 - 4:38:01 PM
 *
 * @param {Record<any, any>} record
 * @returns {*}
 */
export function getRecordValue<T>(record: Record<any, T[]>): T[] {
  return Object.entries(record).flatMap((entry) => entry[1]);
}

export const NumberOrUndefined = (x: Optional<any>) =>
  !isUndefined(x) ? Number(x) : undefined;
const _internalspew = (
  verbosity: 'info' | 'debug' | 'warn' | 'trace' | 'error',
  ...obj: any[]
): void => {
  const message = `${new Date().toISOString()} - `;
  const delegateLogger: (message: string, ...args: any[]) => void = {
    // eslint-disable-next-line no-unused-labels
    info: console.log,
    // eslint-disable-next-line no-unused-labels
    debug: console.debug,
    // eslint-disable-next-line no-unused-labels
    warn: console.warn,
    // eslint-disable-next-line no-unused-labels
    trace: console.trace,
    // eslint-disable-next-line no-unused-labels
    error: console.error,
  }[verbosity];
  delegateLogger(message, ...obj, new Error().stack?.split('\n')[3]);
};

export const safeWindow = () => (typeof window !== 'undefined' ? window : null);

export const bound = (input: number, min: number, max: number): number =>
  Math.min(Math.max(input, min), max);

export const accountSorter = (a: PangeaAccount, b: PangeaAccount): number => {
  const order = ['low', 'moderate', 'high'];
  const indA = order.findIndex((o) => o == a.name);
  const indB = order.findIndex((o) => o == b.name);
  if (indA > -1 && indB > -1) {
    return indA - indB;
  }
  if (indA > -1 && indB == -1) return -1;
  if (indB > -1 && indA == -1) return 1;
  return a.name < b.name ? -1 : 1; // default to alpha order for custom accounts.
};
export const titleCase = (input: string) => {
  const str = input.toLowerCase().split(' ');
  for (let i = 0; i < str.length; i++) {
    if (str[i].indexOf('.') > 0 && str[i].indexOf('.') < str[i].length - 1) {
      str[i] = str[i].toUpperCase();
    }
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
};

export const shortenPayDate = (core: PangeaCashFlowCore) => {
  return {
    ...core,
    pay_date: core.pay_date
      ? formatISO(standardizeDate(core.pay_date), {
          representation: 'date',
        })
      : undefined,
    end_date: core.end_date
      ? formatISO(standardizeDate(core.end_date), {
          representation: 'date',
        })
      : undefined,
  } as PangeaCashFlowCore;
};

/***************Extensions  **********************/
declare global {
  interface Date {
    max(this: Date, date: Date): Date;
    min(this: Date, date: Date): Date;
  }
  interface DateConstructor {
    Max(...dates: Date[]): Date;
    Min(...dates: Date[]): Date;
  }
  function spewd(...obj: any[]): void;
  function spewl(...obj: any[]): void;
  function spewt(...obj: any[]): void;
  function speww(...obj: any[]): void;
  function spewe(...obj: any[]): void;

  interface Array<T> {
    findAsync(this: Array<T>, fn: Predicate<T>): Promise<Optional<T>>;
  }
}
function Max(...dates: Date[]): Date {
  return dates.reduce((d1, d2) => (d1 > d2 ? d1 : d2));
}
function Min(...dates: Date[]): Date {
  return dates.reduce((d1, d2) => (d1 < d2 ? d1 : d2));
}
function max(this: Date, date: Date): Date {
  return this > date ? this : date;
}
function min(this: Date, date: Date): Date {
  return this < date ? this : date;
}

const addressRegex =
  // eslint-disable-next-line no-useless-escape
  /^(?:p(?:ost(?:al)?)?[\.\-\s]*(?:(?:o(?:ffice)?[\.\s]*)?b(?:ox|in|\b|\d)|o(?:ffice|\b)(?:[-\s]*\d)|code)|box[-\s]*\d)/;
export const rules: { [key: string]: (value: string) => boolean } = {
  first_name: (value: string) => value.length > 1,
  first: (value: string) => value.length > 1 && value.length <= 18,
  name: (value: string) => value.length > 1,
  last_name: (value: string) => value.length > 1,
  last: (value: string) => value.length > 1 && value.length <= 50,
  email: (value: string) => isEmail(value),
  message_help: (value: string) => value.length > 1,
  password: (value: string) => value.length > 7,
  phone: (value: string) => isMobilePhone(value, 'en-US'), // TODO: Change form validation from en-US to every country.
  ein: (value: string) => {
    return isTaxID(value);
  },
  job_title: (value: string) => value.length > 1,
  ssn: (value: string) =>
    /^(?!\b(\d)\1+(\d)\1+(\d)\1+\b)(?!123456789|219099999|078051120)(?!666|000)\d{3}(?!00)\d{2}(?!0{4})\d{4}$/.test(
      value,
    ),
  street_1: (value: string) =>
    !!value &&
    value.length > 1 &&
    !addressRegex.test(value.toLocaleLowerCase()),
  city: (value: string) => value.length > 1,
  postal_code: (value: string) => /^\d{5}(?:[-\s]\d{4})?$/.test(value),
  dob: (value: string) =>
    value.length > 0 &&
    !isNaN(new Date(value).getTime()) &&
    new Date(value).getTime() < addYears(Date.now(), -18).getTime(),
};

Date.prototype.min = min;
Date.prototype.max = max;
Date.Max = Max;
Date.Min = Min;

global.spewd = (...obj: any[]): void => {
  _internalspew('debug', ...obj);
};
global.speww = (...obj: any[]): void => {
  _internalspew('warn', ...obj);
};
global.spewl = (...obj: any[]): void => {
  _internalspew('info', ...obj);
};
global.spewt = (...obj: any[]): void => {
  _internalspew('trace', ...obj);
};
global.spewe = (...obj: any[]): void => {
  _internalspew('error', ...obj);
};

Array.prototype.findAsync = async function <T>(
  fn: Predicate<T>,
): Promise<Optional<T>> {
  try {
    return await Promise.any(
      this.map(async (item, index, items) => {
        if (await fn(item, index, items)) {
          return item;
        }

        throw 'not found';
      }),
    );
  } catch (AggregateError) {
    return undefined;
  }
};
export {};

export const redirect = (url: string) => {
  window.open('/leaving-pangea?redirectUrl=' + url, '_blank');
};

export const getHedgeItemsProperty = (
  hedgeItem: (AnyHedgeItem | undefined)[],
  property: keyof AnyHedgeItem,
) =>
  !hedgeItem || !hedgeItem[0]
    ? 'None'
    : hedgeItem.every((h) => h?.[property] == hedgeItem[0]?.[property])
    ? hedgeItem[0]?.[property]
    : '(Various)';

export const MINIMUM_DEPOSIT_AMOUNT = 1000;

export const formatAccountName = (accountName: string) => {
  if (accountName.length > 4) {
    return '(...' + accountName.substring(accountName.length - 4) + ')';
  }
  return accountName;
};

export const formatAuthKey = (authKey: string) => {
  if (authKey == '') {
    return '';
  }
  const result = authKey.split('=');
  const formattedAuthKey = result[1].match(/.{1,4}/g)?.slice(0, 8);
  if (formattedAuthKey) {
    return formattedAuthKey.join(' ');
  }
  return '';
};

export const camelCaseToWords = (camelCaseText: string) => {
  // Add a space before any uppercase letter that is followed by a lowercase letter
  const result = camelCaseText.replace(/([A-Z])([a-z])/g, ' $1$2');

  // Capitalize the first letter of the resulting text
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

  return finalResult;
};

export const snakeCaseToWords = (snakeCaseText: string) => {
  // Replace all underscores with spaces
  const result = snakeCaseText.replace(/_/g, ' ');

  // Capitalize the first letter of the resulting text
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

  return finalResult;
};

export const camelCaseToSnakeCase = (camelCaseText: string) => {
  let snakeCaseText = camelCaseText.charAt(0).toLowerCase();
  for (let i = 1; i < camelCaseText.length; i++) {
    const currentChar = camelCaseText.charAt(i);
    if (
      currentChar === currentChar.toUpperCase() &&
      isNaN(parseInt(currentChar))
    ) {
      snakeCaseText += '_';
      snakeCaseText += currentChar.toLowerCase();
    } else {
      snakeCaseText += currentChar;
    }
  }

  return snakeCaseText;
};

export const createObjectFromArray = (
  array: Array<string>,
): Record<string, string | string[] | boolean | null> => {
  const obj: Record<string, string | string[] | boolean | null> = {};

  for (let i = 0; i < array.length; i++) {
    const property = array[i];
    obj[property] = null;
  }

  return obj;
};

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export function prepareSpotRateRequest(
  spotRateRequestPayload: PangeaSpotRateRequest,
  currency: string,
  amountOverride: Optional<number>,
): PangeaSpotRateRequest {
  return {
    ...spotRateRequestPayload,
    payment_currency: currency,
    settlement_currency: spotRateRequestPayload.settlement_currency ?? 'USD',
    amount: amountOverride && amountOverride > 0 ? amountOverride : 1,
  };
}

export function getClockTime(now: Date, use24HourFormat = false): string {
  if (!(now instanceof Date)) {
    throw new Error('Invalid date object');
  }

  const formatString = use24HourFormat ? 'HH:mm' : 'hh:mm a';
  return format(now, formatString);
}
export const round = (value: number, step: number) => {
  step || (step = 1.0);
  const inv = 1.0 / step;
  return Math.round(value * inv) / inv;
};

export const rruleFreqTypeMapping: Map<string, Frequency> = new Map<
  string,
  Frequency
>([
  ['day', RRule.DAILY],
  ['week', RRule.WEEKLY],
  ['month', RRule.MONTHLY],
  ['bi-monthly', RRule.MONTHLY],
  ['quarter', RRule.MONTHLY],
]);

const getRruleWeekDay = (
  byweekday: Nullable<number[] | ByWeekday | ByWeekday[]>,
  ensureWeekdayArray: (
    d: Optional<Nullable<ByWeekday | ByWeekday[]>>,
  ) => Optional<number>[],
): number[] => {
  const items = ensureWeekdayArray(byweekday);
  if (!items) return [];
  if (!Array.isArray(items)) {
    return [items];
  }
  return items as number[];
};

type FreqType =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'bi-monthly'
  | 'quarter'
  | 'year';

/*
type MonthlyFrequencyType =
  | 'specific-date'
  | 'specific-relative'
  | 'specific-ordinal'
  | 'relative-lastofmonth';
*/

export const generateRrule = (
  endChoiceTabPanel: number,
  freqMeasure: FreqType,
  startDate: Date,
  endBy: Nullable<Date>,
  monthlyFreq: number,
  secondMonthlyFreq: number,
  occurrences: number,
  freq: number,
  days: Nullable<number[] | ByWeekday | ByWeekday[]>,
  ensureWeekdayArray: (
    d: Optional<Nullable<ByWeekday | ByWeekday[]>>,
  ) => Optional<number>[],
): RRule | null => {
  let rule: RRule | null = null;

  const rrFreq = rruleFreqTypeMapping.get(freqMeasure);
  const rrInterval: number = freqMeasure === 'quarter' ? 3 : freq;
  const rrUntil: Nullable<Date> = endBy;
  const hasMonthOption: boolean =
    Boolean(rrFreq) && Boolean(rrFreq == Frequency.MONTHLY);

  let rrByWeekDay: number[] | Weekday[] | null =
    hasMonthOption || rrFreq === Frequency.DAILY
      ? null
      : getRruleWeekDay(days, ensureWeekdayArray);
  let rrBySetPos: number | number[] | null = null;

  if (hasMonthOption) {
    rrByWeekDay = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
    rrBySetPos =
      freqMeasure === 'bi-monthly'
        ? [monthlyFreq, secondMonthlyFreq]
        : [monthlyFreq];
  }

  rule = new RRule({
    freq: rrFreq,
    interval: rrInterval,
    dtstart: startDate,
    byweekday: rrByWeekDay,
    bysetpos: rrBySetPos,
    until: rrUntil && endChoiceTabPanel !== 1 ? rrUntil : null,
    count: endChoiceTabPanel === 1 ? occurrences : null,
    tzid: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  return rule;
};

export const getNumberWithOrdinal = (n: number) => {
  return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
};

export const getFieldValueFromRrule = (
  field: OccurenceFieldValue,
  rruleString: string | null | undefined,
): Nullable<FreqType | number | number[]> => {
  if (!rruleString) {
    return null;
  }
  const rrule = RRule.fromString(rruleString);

  if (field === 'days') {
    return rrule.options.byweekday ?? [];
  } else if (field === 'endChoiceTabPanel') {
    return rrule.options.count ? 1 : 0;
  } else if (field === 'freqMeasure') {
    const found = [...rruleFreqTypeMapping].find(
      ([, value]) => rrule.options.freq === value,
    );
    if (!found) {
      return 'day';
    } else if (found[0] === 'month' && rrule.options.interval === 3) {
      return 'quarter';
    } else if (
      found[0] === 'month' &&
      rrule.options.byweekday.length === 5 &&
      rrule.options.bysetpos.length == 2
    ) {
      return 'bi-monthly';
    }
    return found[0] as FreqType;
  } else if (field === 'freq') {
    return rrule.options.interval;
  } else if (field === 'monthlyFreq') {
    return rrule.options.bysetpos && rrule.options.bysetpos.length > 0
      ? rrule.options.bysetpos[0]
      : 1;
  } else if (field === 'occurrences') {
    return rrule.options.count ?? 1;
  } else if (field === 'secondMonthlyFreq') {
    return rrule.options.bysetpos && rrule.options.bysetpos.length > 0
      ? rrule.options.bysetpos[1]
      : 15;
  }
  return null;
};

export const getExecutionTimingNote = (executionTiming: string): string => {
  if (executionTiming === 'scheduled') {
    return `Note: Some of these transactions require spot.
    By selecting Scheduled Transactions,
    you will be booking # spot transaction(s)
    now as well as scheduling # more spot
    transactions to be executed for their respective value dates.`;
  }
  return `Note: Some of these transactions require spot.
  By selecting Price Lock,
  you will be booking # spot transaction(s) and # forward transactions.`;
};

const getProperDateDiffValue = (difference: number): number => {
  return difference + 1;
};

export const getProperDateDiffUnit = (
  difference: number,
  unit: string,
): string => {
  return difference > 1 ? `${difference} ${unit}s` : `${difference} ${unit}`;
};

export const getDurationBasedOnFrequency = (
  frequency: string,
  dateStart?: Date,
  dateEnd?: Date,
): string => {
  if (!dateStart || !dateEnd) {
    return '1 Day';
  }
  if (frequency === 'day') {
    return getProperDateDiffUnit(
      getProperDateDiffValue(differenceInDays(dateEnd, dateStart)),
      'Day',
    );
  } else if (frequency === 'week') {
    return getProperDateDiffUnit(
      getProperDateDiffValue(differenceInWeeks(dateEnd, dateStart)),
      'Week',
    );
  }
  return getProperDateDiffUnit(
    getProperDateDiffValue(differenceInMonths(dateEnd, dateStart)),
    'Month',
  );
};

export const getRfqTotalTransactionAmount = (
  rfqSuccessData: PangeaPaymentRfq[],
): number => rfqSuccessData.reduce((n, item) => n + item.transaction_amount, 0);

export const getRfqTotalCost = (rfqSuccessData: PangeaPaymentRfq[]): number =>
  rfqSuccessData.reduce((n, item) => n + item.total_cost, 0);

export const getRfqTotalDeliveryFee = (
  rfqSuccessData: PangeaPaymentRfq[],
): number => rfqSuccessData.reduce((n, item) => n + item.delivery_fee, 0);

export const convertTransactionRequestDataToPangeaPayment = (
  transactionRequestData: TransactionRequestData,
): PangeaPayment => {
  return {
    amount:
      transactionRequestData.lock_side ===
      transactionRequestData.payment_currency
        ? transactionRequestData.payment_amount
        : transactionRequestData.settlement_amount,
    cntr_amount:
      transactionRequestData.lock_side ===
      transactionRequestData.payment_currency
        ? transactionRequestData.settlement_amount
        : transactionRequestData.payment_amount,

    lock_side: transactionRequestData.lock_side,
    buy_currency: transactionRequestData.payment_currency,
    delivery_date: format(
      new Date(transactionRequestData?.delivery_date ?? new Date()),
      'yyyy-MM-dd',
    ),
    fee_in_bps: transactionRequestData.fees,
    fee: 0,
    name: transactionRequestData.payment_reference,
    destination_account_id:
      transactionRequestData?.paymentDetails?.beneficiary_id ?? null,
    destination_account_method: null,
    origin_account_id:
      transactionRequestData?.settlementDetails?.account_id ?? null,
    origin_account_method: null,
    purpose_of_payment: transactionRequestData.purpose_of_payment,
    sell_currency: transactionRequestData.settlement_currency,
    cashflows: [],
    created: '',
    installment: false,
    modified: '',
    payment_status: PangeaPaymentStatusEnum.Drafting,
    recurring: false,
  } as unknown as PangeaPayment;
};

export const convertPangeaPaymentToTransactionRequestData = (
  pangeaPayment: PangeaPayment,
): TransactionRequestData => {
  return {
    payment_amount:
      pangeaPayment.lock_side === pangeaPayment.buy_currency
        ? pangeaPayment.amount ?? 0
        : pangeaPayment.cntr_amount ?? 0,
    settlement_amount:
      pangeaPayment.lock_side === pangeaPayment.buy_currency
        ? pangeaPayment.cntr_amount ?? 0
        : pangeaPayment.amount ?? 0,
    lock_side: pangeaPayment.lock_side ?? '',
    payment_currency: pangeaPayment.buy_currency ?? '',
    settlement_currency: pangeaPayment.sell_currency ?? '',
    delivery_date: pangeaPayment.delivery_date
      ? new Date(pangeaPayment.delivery_date)
      : null,
    frequency: 'onetime',
    amount: pangeaPayment.amount ?? 0,
    fees: 0,
    cntr_amount: pangeaPayment.cntr_amount ?? 0,
    payment_reference: pangeaPayment.name,
    purpose_of_payment: pangeaPayment.purpose_of_payment as unknown as string,
    paymentDetails: {
      beneficiary_id: pangeaPayment.destination_account_id ?? '',
      delivery_method: null,
    },
    settlementDetails: {
      account_id: pangeaPayment.origin_account_id ?? '',
      delivery_method: null,
    },
  };
};

export const formatExchangeRateMaxFiveDigits = (
  rate: number,
  specialCase?: boolean,
) => {
  const rateStr = rate.toFixed(10);
  const [integerPart] = rateStr.split('.');
  if (integerPart.length >= 5) {
    if (specialCase) {
      return parseFloat(rateStr).toFixed(2);
    } else {
      return parseFloat(rateStr).toFixed(0);
    }
  }
  const decimalPlaces = 5 - integerPart.length;
  return parseFloat(rateStr).toFixed(decimalPlaces);
};
