import { FormControlProps, TypographyProps } from '@mui/material';
import { Dispatch, ReactNode, SetStateAction } from 'react';

import {
  PangeaBeneficiaryRule,
  PangeaCurrency,
  PangeaExecutionTimingEnum,
  PangeaGetCashflowRiskConeResponse,
  PangeaGroup,
  PangeaGroupEnum,
  PangeaPayment,
  PangeaPaymentDeliveryMethodEnum,
  PangeaPaymentInstallment,
  PangeaRateMovingAverage,
  PangeaSingleCashflow,
  PangeaWaitCondition,
} from './api/v2/data-contracts';
import { apiHelper } from './apiHelpers';
import { ContactPriority, UserState } from './enums';
import { BaseHedgeItemTyped } from './models/baseHedgeItem';
import { Cashflow } from './models/cashflow';
import { Installment } from './models/installment';
import { AjvError } from 'react-jsonschema-form';

declare global {
  type Nullable<T> = T | null;
  type Optional<T> = T | undefined;
  type ValidationType<T> = {
    [prop in keyof T]: boolean | (() => boolean);
  };
  /**
   * Nullable strings
   *
   * @export
   * @typedef {NullableString}
   */
  type NullableString = Optional<Nullable<string>>;
}

/**
 * Hedge Type
 * @date 7/19/2022 - 6:31:33 PM
 *
 * @export
 * @typedef {HedgeType}
 */
export type HedgeType = Nullable<'single' | 'currency' | 'cashflow'>;

/**
 * The frequency type
 *
 * @export
 * @typedef {FrequencyType}
 */
export type FrequencyType = Nullable<'onetime' | 'installments' | 'recurring'>;

/**
 * Currency type
 *
 * @export
 * @interface currencies
 * @typedef {CurrencyType}
 */
export interface CurrencyType {
  [index: string]: PangeaCurrency & { rate: string };
}

/**
 * Cashflow direction
 *
 * @export
 * @typedef {CashflowDirectionType}
 */
export type CashflowDirectionType = Nullable<'paying' | 'receiving'>;

export type CashflowEditMode = 'create' | 'manage';

/**
 * The cashflow statuses array.
 *
 * @type {readonly ["default", "active", "pending", "pending_margin", "pending_payment", "pending_approval" "inflight", "unhealthy", "terminated", "archived", "draft", "settling_soon"]}
 */
export const CashflowStatuses = [
  'default',
  'active',
  'pending',
  'pending_margin',
  'pending_payment',
  'pending_approval',
  'inflight',
  'unhealthy',
  'terminated',
  'archived',
  'draft',
  'settling_soon',
] as const;

/**
 * The cashflow status types
 *
 * @export
 * @typedef {CashflowStatusType}
 */
export type CashflowStatusType = (typeof CashflowStatuses)[number];
/**
 * Recurrence data interface
 * @date 7/12/2022 - 2:25:27 PM
 *
 * @export
 * @interface IRecurrenceData
 * @typedef {IRecurrenceData}
 */
export interface IRecurrenceData {
  pattern?: Nullable<string>;
  startDate?: Nullable<Date>;
  endDate?: Nullable<Date>;
  numOccurrences?: Nullable<number>;
  displayText?: Nullable<string>;
}

//TODO: This will eventually go away when there's an API endpoint to return this kind of data
/**
 * The margin projection data interface.
 * @date 7/13/2022 - 7:57:42 AM
 *
 * @export
 * @interface IMarginProjectionData
 * @typedef {IMarginProjectionData}
 */
export interface IMarginProjectionData {
  date: string;
  margin_amt: number;
  liquid_level: number;
  maintenance_level: number;
  buffer_level: number;
}

/**
 * The health score data x/y values
 * @date 7/13/2022 - 7:57:17 AM
 *
 * @export
 * @interface IMarginHealthData
 * @typedef {IMarginHealthData}
 */
export interface IMarginHealthData {
  date: Date;
  score: number;
}

export interface IChartYourHedgeData {
  date: Date;
  mean: number;
  uppers: {
    [k: string]: number;
  };
  uppersUnlimited?: {
    [k: string]: number;
  };
  lowers: {
    [k: string]: number;
  };
  date_index: number;
  original_lowers: number[][];
  lowersUnlimited?: {
    [k: string]: number;
  };
  initial_value: number;
  previous_value: number;
  update_value: number;
}
export interface IChartYourRiskData {
  date: Date;
  mean: number;
  uppers: {
    [k: string]: number;
  };
  lowers: {
    [k: string]: number;
  };
  initial_value: number;
  std_probs: {
    [k: string]: number;
  };
}

export interface VolatilityChartData {
  original: Nullable<PangeaGetCashflowRiskConeResponse>;
  riskData: IChartYourRiskData[];
}
export interface IGraphHoverData {
  upside: number;
  upsideUnlimited?: number;
  downside: number;
  downsideUnlimited?: number;
  initialValue: number;
}

export interface CashflowGridRow {
  name: string;
  status: string[];
  currency: string;
  account: string;
  deliveryDate: Date;
  frequency: FrequencyType;
  amount: number;
  cashflowId: number;
  accountId: number;
  obj: AnyHedgeItem;
  bookedBaseAmount: Optional<number>;
  bookedCntrAmount: Optional<number>;
  bookedRate: Optional<number>;
  indicativeBaseAmount: Optional<number>;
  indicativeCntrAmount: Optional<number>;
  indicativeRate: Optional<number>;
}

export interface IMarginDepositAPISendDataState {
  depositDetails: {
    deposit_amount: number;
    depositSelection: 'recommended' | 'minimum' | 'custom';
    depositMethod: 'wire' | 'ach';
  };
}

// TODO: refactor id to appropriate type, might not be a string
export interface AccountContact {
  id: number;
  name: string;
  priorityOrder: ContactPriority;
  phone: string;
  email: string;
  details: string;
  groups: PangeaGroup[];
}

export interface ICashflowUpdateObject {
  installmentOriginal?: Installment;
  installment?: Installment;
  cashflowOriginal?: Cashflow;
  cashflow?: Cashflow;
  hedges?: AnyHedgeItem[];
  type?: FrequencyType;
}

export interface PangeaAlert {
  text: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  timeout?: number;
  color?: 'success' | 'info' | 'warning' | 'error';
  icon?: ReactNode;
}

export interface DocumentCardProps {
  title: string;
  description: string;
  onCheck: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  checked: boolean;
  tooltipText: ReactNode[];
}

export type CreateSerializableParam<Type> = {
  // We construct a new mapped type in which the keys are the keys of the original type and the values are
  // converted from interface types into normal types (which appears to happen implicitly when using mapped types).
  //
  // When the type of a property is already a `SerializableParam` we return it as-is.
  // But if it is not, we should check to see if it it is a record/object or undefined and then recursively map it.
  // Finally, if it matches neither of these conditions we should return it as-is.
  [Property in keyof Type]: Type[Property] extends import('recoil').SerializableParam
    ? Type[Property]
    : Type[Property] extends Optional<Nullable<Record<string, any>>>
    ? CreateSerializableParam<Type[Property]>
    : Type[Property];
};

export interface IAccountPageListItem {
  text: string;
  icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  urlPathPart: string;
}

type SubscriptionHandler<T> = { (data?: T): void | Promise<void> };
interface IEvent<T> {
  subscribe(subscriber: SubscriptionHandler<T>): () => void;
  unsubscribe(subscriber: SubscriptionHandler<T>): void;
}

export class SubscribeEvent<T> implements IEvent<T> {
  private subscriber: SubscriptionHandler<T>[] = [];

  public subscribe(subscriber: SubscriptionHandler<T>): () => void {
    this.subscriber.push(subscriber);
    return () => this.unsubscribe(subscriber);
  }

  public unsubscribe(subscriber: SubscriptionHandler<T>): void {
    this.subscriber = this.subscriber.filter((h) => h !== subscriber);
  }

  public fire(data?: T) {
    this.subscriber.slice(0).forEach((h) => {
      try {
        h(data);
      } catch {
        //swallow exceptions firing event handlers
      }
    });
  }
}
export interface CashflowCsvRecord {
  Name: string;
  Description: string;
  Currency: string;
  Frequency: FrequencyType;
  Recurrence: string;
  EndDate: Date;
  Amount: number;
}
export interface DropzoneResult {
  errors?: Nullable<Error[]>;
  cashflows?: Nullable<Cashflow[]>;
  installments?: Nullable<Installment[]>;
}

export type AnyHedgeItem = BaseHedgeItemTyped<Cashflow | Installment>;

export type TransactionRecord = Partial<PangeaPayment>;
export interface TransactionCsvRecord {
  Description: string;
  SellCurrency: string;
  BuyCurrency: string;
  LockSide: string;
  Amount: number;
  ValueDate: Date;
  Origin: string;
  Destination: string;
  PurposeOfPayment: string;
}

export interface TransactionDropzoneResult {
  errors?: Nullable<Error[]>;
  transactions?: Nullable<TransactionRecord[]>;
}

export interface HedgeItemComponentProps {
  value?: AnyHedgeItem;
  onChange?: (newValue: AnyHedgeItem) => void;
  isValidForm?: boolean;
  ControlProps?: FormControlProps;
  mode?: CashflowEditMode;
  setValidStatus?: Dispatch<SetStateAction<boolean>>;
}

export type AccountType = 'low' | 'moderate' | 'high' | 'custom';

export type Predicate<T> = (
  item: T,
  index: number,
  items: T[],
) => Promise<boolean>;

interface IAccountDisplayProps {
  name: string;
  description: string;
  cost: 0 | 1 | 2 | 3;
  protection: 0 | 1 | 2 | 3;
}
export interface IAccountComponents {
  [style: string]: IAccountDisplayProps;
}

export interface PerformanceDataRow {
  date: Date;
  amount: number;
  percentage: number;
}
export interface IAccountPerfChartData {
  hedgedData: PerformanceDataRow[];
  unhedgedData: PerformanceDataRow[];
  unrealizedPNLData: PerformanceDataRow[];
  cashflows: PerformanceDataRow[];
  forwardData: PerformanceDataRow[];
  volatility: PerformanceDataRow[];
}
export interface IAccountPerfData {
  [accountId: number]: IAccountPerfChartData;
}
export interface INewAccountPerfChartData {
  hedgedData: PerformanceDataRow[];
  unhedgedData: PerformanceDataRow[];
  totalPNLData: PerformanceDataRow[];
}
export interface AccordionContentBlockProps {
  label?: string;
  children?: ReactNode | ReactNode[];
  isChanged?: boolean;
  labelProps?: TypographyProps;
  labelRightProps?: TypographyProps;
  labelRight?: string;
  autoWidthRight?: boolean;
  expanded?: boolean;
}
export interface SummaryItemProps {
  value?: AnyHedgeItem | AnyHedgeItem[];
  original_value?: AnyHedgeItem | AnyHedgeItem[];
  mode?: CashflowEditMode;
  isChanged?: boolean;
  accordionContentBlockProps?: AccordionContentBlockProps;
  label?: string;
}

export type ApiHelper = ReturnType<typeof apiHelper>;

export type UserStateType = {
  state: UserState;
  isAccountOwner?: boolean;
  data?: { cta: string };
};

export const CustomerGroupOptions = [
  PangeaGroupEnum.CustomerCreator,
  PangeaGroupEnum.CustomerViewer,
  PangeaGroupEnum.CustomerManager,
  PangeaGroupEnum.CustomerAdmin,
  PangeaGroupEnum.AccountOwnerGroup,
] as const;

export type CustomerGroup = Exclude<
  PangeaGroupEnum,
  PangeaGroupEnum.AdminCustomerSuccess | PangeaGroupEnum.AdminReadOnly
>;

export type FlagName = string;
export type FlagSetting = {
  enabled: boolean;
  createdAt: Date | string;
  description: string;
};
export type Flags = Record<FlagName, FlagSetting>;
export type DispatchArg = Record<FlagName, FlagSetting['enabled']>;
export type DispatchFlag = React.Dispatch<DispatchArg>;

export enum CashflowStrategyEnum {
  ZEROGRAVITY = 'zero-gravity',
  AUTOPILOT = 'auto-pilot',
  PARACHUTE = 'parachute',
}
export type StrategyData = {
  label: string;
  description: string;
  icon: ReactNode;
};

type ValidationProp = {
  isError: boolean;
  message: string;
  hasSufficientFunds: boolean;
};
export type CorpayAmountError = Record<
  'errors',
  Record<'paymentAmount', ValidationProp>
>;

export type MappedBeneficiaryRule = {
  type: 'input' | 'dropdown' | '';
  label: string;
  disable?: boolean;
  dependsOn?: string;
} & PangeaBeneficiaryRule;

export type DataDrivenControls<T> = {
  onValueChanged?: (valOrUpdater: T | ((currVal: T) => T)) => void;
  payload?: T;
};

export type DataDrivenComponentProps<T> = MappedBeneficiaryRule &
  DataDrivenControls<T>;

export type MarginRisk = 'Low' | 'Med' | 'High';
export type MarginAndCreditHealthData = {
  creditLimitStart: 0;
  creditLimit: number;
  inMarketValue: number;
  utilization: number;
  marginCallRisk: MarginRisk;
  marginCallRiskColor: string;
  markToMarketPnl: number;
  marginCallAt: number;
  marginHealthEnd: number;
  creditHealthColor: string;
  pnlPercentage?: number;
};

export type ExecutionTiming = {
  id: string;
  estimated_saving_bps: number | null;
  delivery_date: string;
  wait_condition: PangeaWaitCondition | null;
  timing?: PangeaExecutionTimingEnum;
};

export type CustomQuoteError = {
  errors: {
    key: string;
    type: string;
    message: string;
  }[];
};

export type PaymentType =
  | 'FXWallet'
  | 'Deposits'
  | 'BeneficiaryPayments'
  | 'Withdrawals';

export type CreateOrUpdatePaymentArguments = {
  shouldUpdateBestEx?: boolean;
  newValueDate?: Date;
  newStartDate?: Date;
  newEndDate?: Date;
  newPeriodicity?: string;
};

export type TransactionRequestData = {
  frequency: FrequencyType;
  payment_currency: string;
  settlement_currency: string;
  amount: number;
  lock_side: string;
  delivery_date?: Date | null;
  fees: number;
  payment_reference: string;
  cntr_amount: number;
  settlement_amount: number;
  payment_amount: number;
  purpose_of_payment?: string;
  paymentDetails?: {
    beneficiary_id: string;
    delivery_method: string | null;
  };
  settlementDetails?: {
    account_id: string;
    delivery_method: string | null;
  };
  origin_account_method?: PangeaPaymentDeliveryMethodEnum;
  destination_account_method?: PangeaPaymentDeliveryMethodEnum;
  periodicity_end_date?: Date | null;
  periodicity_start_date?: Date | null;
  periodicity?: string | null;
  installments?: Array<PangeaPaymentInstallment> | null;
  installment?: boolean | null;
  recurring?: boolean | null;
  cashflows?: PangeaSingleCashflow[] | null;
};

export interface MonthlyFreqObj {
  value: number;
  label: string;
}

export type OccurenceFieldValue =
  | 'occurrences'
  | 'endChoiceTabPanel'
  | 'freq'
  | 'freqMeasure'
  | 'days'
  | 'monthlyFreq'
  | 'secondMonthlyFreq';

export interface EditedCashflow {
  id: string;
  date: Date;
  amount: number;
  cntr_amount: number;
  sell_currency: string;
  buy_currency: string;
  lock_side: string;
}

export type SubSchemaFormat = {
  $id: string;
  errorMessage: string;
  title: string;
  type: string;
  maxLength?: number;
  pattern?: string;
};

export type JSONFormChangeProps = { errors: AjvError[]; formData: object };

export interface PangeaFxSpotExtended extends PangeaRateMovingAverage {
  rateFlu?: string;
  xDate?: string;
}

export enum ChartInterval {
  Month1 = '1 Month',
  Month3 = '3 Months',
  Year1 = '1 Year',
  Year5 = '5 Years',
}

export enum VolatilityScenario {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}
