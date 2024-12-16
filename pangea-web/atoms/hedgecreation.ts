import { GridRowsProp } from '@mui/x-data-grid-pro';
import axios, { CancelTokenSource } from 'axios';
import { addDays, startOfDay } from 'date-fns';
import {
  AccountType,
  AnyHedgeItem,
  bound,
  Cashflow,
  CashflowDirectionType,
  CashflowGridRow,
  CashflowStatusType,
  CashflowStrategyEnum,
  ClientAuthHelper,
  convertToDomesticAmount,
  CreateSerializableParam,
  CurrencyType,
  FrequencyType,
  HedgeType,
  IChartYourHedgeData,
  IChartYourRiskData,
  IGraphHoverData,
  IMarginDepositAPISendDataState,
  Installment,
  IRecurrenceData,
  MarginAndCreditHealthData,
  MarginRisk,
  PangeaAccount,
  PangeaAutopilotData,
  PangeaAutopilotMarginHealthResponse,
  PangeaCashflow,
  PangeaCashflowStatusEnum,
  PangeaCurrency,
  PangeaCurrencyDefinition,
  PangeaGetCashflowRiskCone,
  PangeaGetCashflowRiskConeResponse,
  PangeaMarginAndFeeRequest,
  PangeaMarginAndFeesResponse,
  PangeaMarginHealthResponse,
  PangeaMarginRequirement,
  PangeaPaginatedDraftFxForwardList,
  PangeaPatchedDraftFxForward,
  PangeaWhatIf,
  PangeaWireInstruction,
  serializeDateTime,
  standardizeDate,
  VolatilityChartData,
} from 'lib';
import { clone, isEqual, isError, isNull, isUndefined, uniq } from 'lodash';
import { atom, DefaultValue, selector, selectorFamily } from 'recoil';
import { PangeaColors } from 'styles';
import {
  allAccountsState,
  clientApiState,
  currencyListState,
  fxPairsState,
  isLoggedInState,
  latestEodRatesForFxPairsState,
  userCompanyState,
} from './';
import { localStorageEffect } from './effects';

export const calculateMarginCallRisk = (
  result: PangeaAutopilotMarginHealthResponse,
): Pick<
  MarginAndCreditHealthData,
  'marginCallRiskColor' | 'marginCallRisk' | 'creditHealthColor' | 'utilization'
> & { pnlValue?: number } => {
  const {
    credit_usage: { pnl, credit_used, credit_limit },
    margin_call_at,
  } = result;

  let marginCallRisk: MarginRisk;
  let plotColor, pnlRatio, creditHealthColor;
  const utilization =
    (parseFloat(credit_used) /
      (parseFloat(credit_limit) === 0 ? 1 : parseFloat(credit_limit))) *
    100;

  if (parseFloat(pnl) >= 0) {
    marginCallRisk = 'Low';
    plotColor = PangeaColors.SecurityGreenMedium;
  } else {
    pnlRatio = Math.abs(parseFloat(pnl) / parseFloat(margin_call_at));

    if (pnlRatio <= 0.25) {
      marginCallRisk = 'Low';
      plotColor = PangeaColors.CautionYellowMedium;
    } else if (pnlRatio <= 0.75 && pnlRatio > 0.25) {
      marginCallRisk = 'Med';
      plotColor = PangeaColors.WarmOrangeMedium;
    } else {
      marginCallRisk = 'High';
      plotColor = PangeaColors.RiskBerryMedium;
    }
  }

  if (utilization < 25) {
    creditHealthColor = PangeaColors.SecurityGreenMedium;
  } else if (utilization > 25 && utilization < 76) {
    creditHealthColor = PangeaColors.CautionYellowMedium;
  } else {
    creditHealthColor = PangeaColors.RiskBerryMedium;
  }

  return {
    marginCallRisk,
    marginCallRiskColor: plotColor,
    creditHealthColor,
    utilization,
    pnlValue: pnlRatio,
  };
};

export const resetHedgeState = selector<any>({
  key: 'resetHedge',
  get: () => {
    throw 'Invalid operation. resetHedgeState can only be set.';
  },
  set: ({ reset }) => {
    reset(internalCashflowOriginalState);
    reset(internalInstallmentOriginalState);
    reset(internalInstallmentState);
    reset(internalCashflowState);
    reset(hedgeTypeState);
    reset(activeHedgeFrequencyTypeState);
    reset(activeCurrencyState);
    reset(dialogYourHedgeRiskControlsStatusState);
    reset(dialogQuickTipsMarginState);
    reset(hedgeRiskToleranceState);
    reset(hedgeRiskReductionAmountState);
    reset(hedgeHardLimitLowerState);
    reset(graphHoverDataState);
    reset(accountViewSelectState);
    reset(internalBulkUploadItemsState);
    reset(bulkUploadItemsState);
  },
});
/**
 * Cash flow direction state.
 */
export const cashflowDirectionState = selector<CashflowDirectionType>({
  key: 'cashflowDirection',
  get: ({ get }) => {
    const hedge = get(activeHedgeState);
    return hedge.direction;
  },
  set: ({ get, set }, newValue) => {
    const dir: CashflowDirectionType =
      newValue instanceof DefaultValue ? 'paying' : newValue;
    const hedge = get(activeHedgeState).clone();
    hedge.direction = dir;
    set(activeHedgeState, hedge);
    //Set direction on both types because we don't know if
    //what the type will end up being.
    //TODO: better way to handle?
    const i = get(installmentState).clone();
    i.direction = dir;
    set(installmentState, i);
    const c = get(cashflowState).clone();
    c.direction = dir;
    set(cashflowState, c);
  },
});

/**
 * The hedge type state.
 */
export const hedgeTypeState = atom<HedgeType>({
  key: 'hedgeType',
  default: null,
});

export const internalCashflowState = atom<object>({
  key: 'internalCashflow',
  default: new Cashflow().toObject(),
});

export const cashflowState = selector<Cashflow>({
  key: 'cashflow',
  get: ({ get }) => {
    const instance = Cashflow.fromObject(get(internalCashflowState));
    return instance;
  },
  set: ({ get, set }, newValue) => {
    const c = newValue instanceof DefaultValue ? new Cashflow() : newValue;
    const currentCashflow = get(cashflowState);
    if (!isEqual(currentCashflow, c)) {
      const strCashflow = c.toObject();
      set(internalCashflowState, strCashflow);
    }
  },
});

export const internalCashflowOriginalState = atom<Nullable<object>>({
  key: 'internalCashflowOriginal',
  default: null,
});

export const cashflowOriginalState = selector<Nullable<Cashflow>>({
  key: 'cashflowOriginal',
  get: ({ get }) => {
    const cashflowobj = get(internalCashflowOriginalState);
    return cashflowobj ? Cashflow.fromObject(cashflowobj) : null;
  },
  set: ({ get, set }, newValue) => {
    const c = newValue instanceof DefaultValue ? null : newValue;
    const currentCashflow = get(cashflowOriginalState);
    if (c && !isEqual(currentCashflow, c)) {
      const cashflowobj = c.toObject();
      set(internalCashflowOriginalState, cashflowobj);
    }
  },
});

export const internalInstallmentOriginalState = atom<Nullable<object>>({
  key: 'internalInstallmentOriginal',
  default: new Installment().toObject(),
});

export const installmentOriginalState = selector<Nullable<Installment>>({
  key: 'installmentOriginal',
  get: ({ get }) => {
    const installmentobj = get(internalInstallmentOriginalState);
    return installmentobj ? Installment.fromObject(installmentobj) : null;
  },
  set: ({ get, set }, newValue) => {
    const i = newValue instanceof DefaultValue ? null : newValue;
    const currentInstallment = get(installmentOriginalState);
    if (i && !isEqual(currentInstallment, i)) {
      set(internalInstallmentOriginalState, i.toObject());
    }
  },
});

export const internalInstallmentState = atom<object>({
  key: 'internalInstallment',
  default: new Installment().toObject(),
});

export const installmentState = selector<Installment>({
  key: 'installment',
  get: ({ get }) => Installment.fromObject(get(internalInstallmentState)),
  set: ({ get, set }, newValue) => {
    const i = newValue instanceof DefaultValue ? new Installment() : newValue;
    const currentInstallment = get(installmentState);
    if (!isEqual(currentInstallment, i)) {
      set(internalInstallmentState, i.toObject());
    }
  },
});

export const activeHedgeState = selector<AnyHedgeItem>({
  key: 'activeHedge',
  get: ({ get }) =>
    get(activeHedgeFrequencyTypeState) === 'installments'
      ? get(installmentState)
      : get(cashflowState),
  set: ({ get, set }, newValue) => {
    get(activeHedgeFrequencyTypeState) === 'installments'
      ? set(installmentState, newValue as Installment)
      : set(cashflowState, newValue as Cashflow);
    if (get(bulkUploadItemsState).length <= 1) {
      set(
        bulkUploadItemsState,
        newValue instanceof DefaultValue ? [] : [newValue],
      );
    }
  },
});

export const activeOriginalHedgeState = selector<Nullable<AnyHedgeItem>>({
  key: 'activeOriginalHedge',
  get: ({ get }) =>
    get(activeHedgeFrequencyTypeState) === 'installments'
      ? get(installmentOriginalState)
      : get(cashflowOriginalState),
  set: ({ get, set }, newValue) =>
    get(activeHedgeFrequencyTypeState) === 'installments'
      ? set(installmentOriginalState, newValue as Installment)
      : set(cashflowOriginalState, newValue as Cashflow),
});

export const installmentNameState = selector<NullableString>({
  key: 'installmentName',
  get: ({ get }) => get(installmentState).name,
  set: ({ get, set }, newValue) => {
    const i = get(installmentState).clone();
    i.name = newValue instanceof DefaultValue ? null : newValue;
    set(installmentState, i);
  },
});

/**
 * The cashflow compound status
 */
export const cashflowCompoundStatusState = selector<CashflowStatusType[]>({
  key: 'cashflowCompoundStatus',
  get: ({ get }) => {
    return get(activeHedgeFrequencyTypeState) == 'installments'
      ? get(installmentState).cashflows.length > 0
        ? get(installmentState).cashflows[0]?.ui_status
        : ['draft']
      : get(cashflowState).ui_status;
  },
});

export const activeHedgeFrequencyTypeState = atom<FrequencyType>({
  key: 'activeHedgeFrequencyType',
  default: null,
});

/**
 * The hedge frequency.
 */
export const hedgeFrequencyState = selector<FrequencyType>({
  key: 'hedgeFrequency',
  get: ({ get }) => get(activeHedgeState).type,
  set: ({ get, set }, newValue) => {
    const ft: FrequencyType =
      newValue instanceof DefaultValue ? 'onetime' : newValue;
    if (newValue !== 'installments') {
      const c = get(cashflowState).clone();
      c.type = ft;
      set(cashflowState, c);
    }
    set(activeHedgeFrequencyTypeState, ft);
  },
});

/**
 * The hedge frequency display state.
 */
export const hedgeFrequencyDisplayState = selector<string>({
  key: 'hedgeFrequencyDisplay',
  get: ({ get }) => {
    const freq = get(activeHedgeFrequencyTypeState);
    switch (freq) {
      case 'installments':
        return 'Installments';
      case 'onetime':
        return 'One-Time';
      case 'recurring':
        return 'Recurring';
      default:
        return '';
    }
  },
});

/**
 * The hedge date display
 */
export const hedgeDateDisplayState = selector<string>({
  key: 'hedgeDateDisplay',
  get: ({ get }) => {
    const freq = get(activeHedgeFrequencyTypeState);
    if (freq == 'onetime') {
      const d: Nullable<Date> = get(cashflowDetailsDateState);
      return d ? new Date(d).toLocaleDateString() : 'Unknown date';
    } else if (freq == 'recurring') {
      const recurData = get(paymentRecurrenceDataState);
      if (
        recurData &&
        recurData.displayText &&
        (recurData.displayText?.length ?? 0) > 2
      ) {
        const dT = recurData.displayText;
        return dT[0].toUpperCase() + dT.substring(1);
      }
      return 'Invalid pattern';
    } else if (freq == 'installments') {
      return 'Various';
    } else {
      return 'Unknown';
    }
  },
});

/**
 * The hedge end date.
 */
export const hedgeEndDateState = selector<Date>({
  key: 'hedgeEndDate',
  get: ({ get }) => {
    return get(activeHedgeState).endDate;
    // const freq = get(activeHedgeFrequencyTypeState);
    // if (freq == 'onetime') {
    //   return get(cashflowDetailsDateState) ?? new Date();
    // } else if (freq == 'recurring') {
    //   const recurData = get(paymentRecurrenceDataState);
    //   const recurArray = getOccurrencesFromPattern(recurData?.pattern ?? null);
    //   if (recurArray.length) {
    //     return recurArray[recurArray.length - 1] ?? new Date();
    //   } else {
    //     return new Date();
    //   }
    // } else if (freq == 'installments') {
    // const instData = get(cashflowInstallmentTransactionsState(true));
    // const maxDate = standardizeDate(
    //   new Date(
    //     `${instData.reduce((prev, current) => {
    //       return Date.Max(
    //         new Date(prev ?? new Date(0)),
    //         new Date(current.deliveryDate),
    //       );
    //     })}`,
    //   ) ?? new Date(),
    // );
    // return maxDate;
    // } else {
    //   return standardizeDate(new Date());
    // }
  },
});

/**
 * Name of the cashflow.
 */
export const cashflowDetailsNameState = selector<NullableString>({
  key: 'cashflowDetailsName',
  get: ({ get }) => {
    return get(cashflowState).name ?? '';
  },
  set: ({ get, set }, newValue) => {
    const c = get(cashflowState).clone();
    c.name = newValue instanceof DefaultValue ? '' : newValue;
    set(cashflowState, c);
  },
});

export const activeCashflowDisplayNameState = selector<NullableString>({
  key: 'activeCashflowDisplayName',
  get: ({ get }) => {
    return get(activeHedgeFrequencyTypeState) == 'installments'
      ? get(installmentNameState)
      : get(cashflowDetailsNameState);
  },
});

/**
 * Date of the cashflow.
 */
export const cashflowDetailsDateState = selector<Nullable<Date>>({
  key: 'cashflowDetailsDate',
  get: ({ get }) => {
    const d = get(cashflowState).date;
    return Number(new Date(d)) > 0 ? new Date(d) : null;
  },
  set: ({ get, set }, newValue) => {
    const c = get(cashflowState).clone();
    c.date =
      newValue instanceof DefaultValue || newValue == null
        ? new Date(0)
        : newValue;
    set(cashflowState, c);
  },
});

/**
 * The cashflow date display text.
 */
export const cashflowDetailsDateDisplayState = selector<string>({
  key: 'cashflowDetailsDateDisplay',
  get: ({ get }) => {
    const cashflowDate = get(cashflowDetailsDateState);
    if (!cashflowDate) return '';
    return cashflowDate.toLocaleDateString();
  },
});

/**
 * The recurrence data for the cashflow
 */
export const paymentRecurrenceDataState = selector<IRecurrenceData>({
  key: 'paymentRecurrenceData',
  get: ({ get }) => {
    return (
      get(cashflowState).recurrenceData ?? {
        startDate: new Date(),
        pattern: '',
      }
    );
  },
  set: ({ get, set }, newValue) => {
    const c = get(cashflowState).clone();
    c.recurrenceData =
      newValue instanceof DefaultValue
        ? { startDate: new Date(), pattern: '' }
        : newValue;
    set(cashflowState, c);
  },
});

/**
 * The list of all currencies
 */
export const currenciesState = selector<CurrencyType>({
  key: 'currencies',
  get: ({ get }) => {
    const fxPairs = get(fxPairsState);
    const currencyList = get(currencyListState);
    const domesticCurrency = get(domesticCurrencyState);

    const now = startOfDay(new Date());
    const returnVal: CurrencyType = {};
    const fxPairRates = get(latestEodRatesForFxPairsState(now));
    if (!fxPairs) {
      return returnVal;
    }
    fxPairs.forEach((p) => {
      if (!p) {
        return;
      }
      const fxPairRate = fxPairRates.find(
        (px) => px && px.pair.id == p.id,
      )?.rate;
      let rate_date = '';
      if (fxPairRate) {
        rate_date = fxPairRate.toString();
      }
      const c =
        currencyList.find(
          (cur) => cur.mnemonic === p.quote_currency.mnemonic,
        ) ?? p.quote_currency;
      if (!c || p.base_currency.mnemonic !== domesticCurrency) {
        return;
      }
      returnVal[c.mnemonic] = {
        ...c,
        rate: rate_date,
      };
    });
    return returnVal;
  },
});

/**
 * List of currencies to use in currency selectors/dropdowns
 */
export const selectableCurrenciesState = selector<PangeaCurrency[]>({
  key: 'selectableCurrencies',
  get: async ({ get }) => {
    const apiHelper = get(clientApiState).getAuthenticatedApiHelper();
    const isLoggedIn = get(isLoggedInState);
    const companyId = get(userCompanyState)?.id;
    const companyCurrency = get(userCompanyState)?.currency;
    if (isLoggedIn && !isUndefined(companyId)) {
      const companyCurrencies = await apiHelper.getCompanyCurrenciesAsync(
        companyId,
      );
      const allCurrencies = await apiHelper.getCurrenciesAsync();

      if (isError(companyCurrencies) || isError(allCurrencies)) {
        return [];
      } else {
        return (allCurrencies as unknown as PangeaCurrency[]).filter(
          (c) =>
            companyCurrencies.some((cc) => cc.mnemonic === c.mnemonic) &&
            c.mnemonic !== companyCurrency,
        );
      }
    }
    return [];
  },
});

/**
 * The domestic currency. Taken from user's company domestic currency.
 */
export const domesticCurrencyState = selector<string>({
  key: 'domesticCurrency',
  get: ({ get }) => {
    const company = get(userCompanyState);
    return company?.currency ?? 'USD';
  },
});

/**
 * The foreign currency for the cashflow.
 */
export const foreignCurrencyState = selector<NullableString>({
  key: 'foreignCurrency',
  get: ({ get }) => {
    return get(activeHedgeState).currency;
  },
  set: ({ get, set }, newValue) => {
    const hI = get(activeHedgeState).clone();
    hI.currency = newValue instanceof DefaultValue ? null : newValue;
    set(activeHedgeState, hI);
  },
});

/**
 * The exchange rate for the given currency
 * @example
 * receives 'MXN' foreignCurrency
 */
export const exchangeRateState = selector<string>({
  key: 'exchangeRate',
  get: ({ get }) => {
    const foreignCurrency = get(foreignCurrencyState);
    return get(exchangeRatesState(foreignCurrency));
  },
});

export const exchangeRatesState = selectorFamily<string, NullableString>({
  key: 'exchangeRates',
  get:
    (currency) =>
    ({ get }) => {
      const currencies = get(currenciesState);
      const exchangeRate = currencies[currency ?? '']?.rate || '0';
      return exchangeRate;
    },
});

/**
 * The amount in foreign currency.
 */
export const foreignAmountState = selector<number>({
  key: 'foreignAmount',
  get: ({ get }) => {
    const freq = get(activeHedgeFrequencyTypeState);
    return freq === 'installments'
      ? get(installmentState).amount
      : get(cashflowState).amount;
  },
  set: ({ get, set }, newValue) => {
    const freq = get(activeHedgeFrequencyTypeState);
    if (freq === 'installments') {
      // ignoring since you can't set amount on installment types
      return;
    }

    const c = get(cashflowState).clone();
    c.amount = newValue instanceof DefaultValue ? 0 : newValue;
    set(cashflowState, c);
  },
});

/**
 * The domestic amount selector.
 * @example
 * receives '1' cashflowId, 'MXN' exchangeRate
 */
export const domesticAmountState = selectorFamily<string, string>({
  key: 'domesticAmount',
  get:
    (exchangeRate) =>
    ({ get }) => {
      return convertToDomesticAmount(
        get(foreignAmountState) || 0,
        exchangeRate,
      );
    },
  set:
    (exchangeRate) =>
    ({ set }, newRecipientValue) => {
      const newValue = (
        parseFloat(newRecipientValue as string) * parseFloat(exchangeRate)
      ).toFixed(0);

      set(foreignAmountState, parseFloat(newValue));
    },
});

/**
 * The active currency.
 */
export const activeCurrencyState = atom<'domestic' | 'foreign' | ''>({
  key: 'activeCurrency',
  default: '',
});

/**
 * The installment cash flow transactions.
 * @example
 * [
    {
        "id": "3356ff14-24c5-459a-bbb8-7f7ed5fceed4",
        "isNew": true,
        "amount": "5435345",
        "deliveryDate": "2022-08-05"
    },
    {
        "id": "bad0e98e-1a35-4e75-a1ef-eb1dacd3da1a",
        "isNew": true,
        "amount": "543532",
        "deliveryDate": "2022-10-22"
    }
]
 */
export const cashflowInstallmentTransactionsState = selectorFamily<
  GridRowsProp,
  boolean
>({
  key: 'cashflowInstallmentTransactions',
  get:
    (showDrafts) =>
    ({ get }) => {
      const i = get(installmentState);
      if (!i.cashflows || i.cashflows.length == 0) {
        return [];
      }
      const gridRows: GridRowsProp = i.cashflows.map((c) => {
        const displayCashflow = showDrafts
          ? c.isFromDraftObject()
            ? c
            : c.childDraft
            ? Cashflow.fromDraftObject(c.childDraft)
            : c
          : c;
        return {
          id: displayCashflow.internal_uuid,
          isNew: displayCashflow.id === Cashflow.DEFAULT_ID, //this indicates if this is a new row and has never been saved even as a draft.
          isActive:
            displayCashflow.id > Cashflow.DEFAULT_ID &&
            (!!c.status ||
              ((displayCashflow.cashflow_id ?? 0) > 0 &&
                displayCashflow.id !== displayCashflow.cashflow_id)), //we actually want to know if the parent/active cashflow is active (why we're using c and not displayCashflow here).
          amount: displayCashflow.amount,
          deliveryDate: serializeDateTime(c.date),
        };
      });
      return gridRows;
    },
  set:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_showDrafts) => {
      return ({ get, set }, newValue) => {
        const updatedGridRows =
          newValue instanceof DefaultValue ? [] : newValue;
        const i = get(installmentState).clone();
        i.cashflows
          .filter(
            (c) =>
              updatedGridRows.findIndex((c2) => c2.id == c.internal_uuid) == -1,
          )
          .forEach((c) => {
            i.removeCashflow(c);
          });

        updatedGridRows.forEach((gr) => {
          const existingCashflow = i.cashflows.find(
            (c) => c.internal_uuid === gr.id,
          );
          if (!existingCashflow) {
            i.addCashflow(new Date(gr.deliveryDate), gr.amount, gr.id);
            return;
          }
          existingCashflow.amount = Number(gr.amount);
          existingCashflow.date = new Date(gr.deliveryDate);
          existingCashflow.internal_uuid = gr.id;
        });
        set(installmentState, i);
      };
    },
});

export const dialogUnsavedChangesControlState = atom<boolean>({
  key: 'dialogUnsavedChangesControl',
  default: false,
});
/**
 * Your hedge risk controls status.
 */
export const dialogYourHedgeRiskControlsStatusState = atom<boolean>({
  key: 'dialogYourHedgeRiskControlsStatus',
  default: true,
});

/**
 * The margin quick tips dialog open/closed status.
 */
export const dialogQuickTipsMarginState = atom<{
  open: boolean;
  step?: number;
}>({
  key: 'dialogQuickTipsMargin',
  default: {
    open: false,
    step: 0,
  },
});

/**
 * The hedge risk tolerance value.
 */
export const hedgeRiskToleranceState = atom<AccountType>({
  key: 'hedgeRiskTolerance',
  default: 'low',
});

export const riskToleranceFromAccountIdState = selectorFamily<string, number>({
  key: 'riskToleranceFromAccountId',
  get:
    (accountId) =>
    ({ get }) => {
      const accounts = get(allAccountsState);
      return accounts.find((a) => a.id === accountId)?.name ?? '';
    },
});
export const riskReductionFromAccountIdState = selectorFamily<
  Optional<number>,
  number
>({
  key: 'riskReductionFromAccountId',
  get:
    (accountId) =>
    ({ get }) => {
      const accounts = get(allAccountsState);
      return accounts.find((a) => a.id === accountId)?.hedge_settings.custom
        .vol_target_reduction;
    },
});
/**
 * The hedge risk reduction amount.
 */
export const hedgeRiskReductionAmountState = atom<Optional<number>>({
  key: 'hedgeRiskReductionAmount',
  default: undefined,
});
/**
 * The hedge max loss amount.
 */
export const hedgeMaxLossThresholdState = atom<Optional<number>>({
  key: 'hedgeMaxLossThreshold',
  default: -0.005,
});
/**
 * The hedge safeguard.
 */
export const hedgeSafeGuardState = atom<Optional<boolean>>({
  key: 'hedgeSafeGuard',
  default: false,
});
/**
 * The hedge prevention limit.
 */
export const hedgeLosspreventionLimitState = atom<Optional<boolean>>({
  key: 'hedgeLosspreventionLimit',
  default: false,
});
/**
 * The hedge prevention limit.
 */
export const hedgeLosspreventionTargetState = atom<Optional<number>>({
  key: 'hedgeLosspreventionTarget',
  default: -0.005,
});
/**
 * The hedge safeguard target.
 */
export const hedgeSafeGuardTargetState = atom<Optional<number>>({
  key: 'hedgeSafeGuardTarget',
  default: 0.005,
});
/**
 * The hedge hard limit upper limit cap value.
 * @note: Commenting out per https://github.com/servant-io/Pangea/issues/648
 */
// export const hedgeHardLimitUpperState = atom<number>({
//   key: 'hedgeHardLimitUpper',
//   default: 1,
// });

/**
 * The hedge hard limit lower limit cap value.
 */
export const hedgeHardLimitLowerState = atom<number>({
  key: 'hedgeHardLimitLower',
  default: 1,
});

/**
 * The hedge hard limit checkbox state.
 */
// export const hedgeHardLimitCheckboxState = atom<boolean>({
//   key: 'hedgeHardLimitCheckbox',
//   default: true,
// });

/**
 * The graph hover data state.
 */
export const graphHoverDataState = atom<Nullable<IGraphHoverData>>({
  key: 'graphHoverData',
  default: null,
});

/**
 * Data for Your Risk chart.
 */
export const chartYourRiskDataState = selectorFamily<
  Nullable<IChartYourRiskData[]>,
  {
    account_id?: number | undefined;
    requestBody: CreateSerializableParam<PangeaGetCashflowRiskCone>;
  }
>({
  key: 'chartYourRiskData',
  get:
    ({ requestBody, account_id }) =>
    async ({ get }) => {
      if (!requestBody || isEqual(requestBody.cashflows, {})) {
        return null;
      }
      const api = get(clientApiState);
      const apiData: PangeaGetCashflowRiskConeResponse = await api
        .getAuthenticatedApiHelper()
        .getStandardDeviationDataAsync(requestBody, { account_id });
      const standardDeviationLevels = requestBody.std_dev_levels || [];
      return apiData.dates.map((date, dateIndex) => {
        return {
          date: new Date(date),
          mean: apiData.means[dateIndex],
          uppers: Object.fromEntries(
            standardDeviationLevels.map((stdDev, stdDevIndex) => {
              return [
                stdDev,
                apiData.uppers[stdDevIndex][dateIndex] /
                  Math.abs(apiData.initial_value),
              ];
            }),
          ),
          lowers: Object.fromEntries(
            standardDeviationLevels.map((stdDev, stdDevIndex) => {
              return [
                stdDev,
                apiData.lowers[stdDevIndex][dateIndex] /
                  Math.abs(apiData.initial_value),
              ];
            }),
          ),
          initial_value: Math.abs(apiData.initial_value), // chart shows PnL, not value of underlying
          std_probs: Object.fromEntries(
            standardDeviationLevels.map((stdDev, stdDevIndex) => {
              return [stdDev, apiData.std_probs[stdDevIndex]];
            }),
          ),
        };
      });
    },
});

/**
 * Data for Volatility chart.
 */
export const chartVolatilityDataState = selectorFamily<
  Nullable<VolatilityChartData>,
  {
    account_id?: number | undefined;
    requestBody: CreateSerializableParam<PangeaGetCashflowRiskCone>;
  }
>({
  key: 'chartVolatilityData',
  get:
    ({ requestBody, account_id }) =>
    async ({ get }) => {
      if (!requestBody || isEqual(requestBody.cashflows, {})) {
        return null;
      }
      const api = get(clientApiState);
      const apiData: PangeaGetCashflowRiskConeResponse = await api
        .getAuthenticatedApiHelper()
        .getStandardDeviationDataAsync(requestBody, { account_id });
      const standardDeviationLevels = requestBody.std_dev_levels || [];
      return {
        original: apiData,
        riskData: apiData.dates.map((date, dateIndex) => {
          return {
            date: new Date(date),
            mean: apiData.means[dateIndex],
            uppers: Object.fromEntries(
              standardDeviationLevels.map((stdDev, stdDevIndex) => {
                return [
                  stdDev,
                  apiData.uppers[stdDevIndex][dateIndex] *
                    Math.abs(apiData.initial_value),
                ];
              }),
            ),
            lowers: Object.fromEntries(
              standardDeviationLevels.map((stdDev, stdDevIndex) => {
                return [
                  stdDev,
                  apiData.lowers[stdDevIndex][dateIndex] *
                    Math.abs(apiData.initial_value),
                ];
              }),
            ),
            initial_value: Math.abs(apiData.initial_value), // chart shows PnL, not value of underlying
            std_probs: Object.fromEntries(
              standardDeviationLevels.map((stdDev, stdDevIndex) => {
                return [stdDev, apiData.std_probs[stdDevIndex]];
              }),
            ),
          };
        }),
      };
    },
});

/**
 * Data for Your Hedge chart.
 */
export const chartYourHedgeDataState = selectorFamily<
  Nullable<IChartYourHedgeData[]>,
  {
    account_id: number | undefined;
    data: CreateSerializableParam<PangeaGetCashflowRiskCone>;
  }
>({
  key: 'chartYourHedgeData',
  get:
    (requestBody) =>
    async ({ get }) => {
      if (!requestBody || isEqual(requestBody.data.cashflows, {})) {
        return null;
      }
      const api = get(clientApiState);
      const apiData: PangeaGetCashflowRiskConeResponse = await api
        .getAuthenticatedApiHelper()
        .getRiskReductionDataAsync(requestBody.data, {
          account_id: requestBody.account_id,
        });

      const riskReductions = requestBody.data.risk_reductions || [];
      return apiData.dates.map((date, dateIndex) => {
        return {
          date: new Date(date),
          mean: apiData.means[dateIndex],
          uppers: Object.fromEntries(
            riskReductions.map((riskReduction, riskReductionIndex) => {
              return [
                riskReduction,
                apiData.uppers[riskReductionIndex][dateIndex] /
                  Math.abs(apiData.initial_value),
              ];
            }),
          ),
          lowers: Object.fromEntries(
            riskReductions.map((riskReduction, riskReductionIndex) => {
              return [
                riskReduction,
                apiData.lowers[riskReductionIndex][dateIndex] /
                  Math.abs(apiData.initial_value),
              ];
            }),
          ),
          original_lowers: apiData.lowers,
          date_index: dateIndex,
          initial_value: apiData.initial_value, // chart shows PnL, not value of underlying
          previous_value: apiData.previous_value,
          update_value: apiData.update_value,
        };
      });
    },
});

/**
 * Temporary object for accountViewSelect component. Refactor this when API data contract is ready.
 */
export const accountViewSelectState = atom<number>({
  key: 'accountViewSelect',
  default: -1,
});

export const selectedAccountIdState = selector<Optional<Nullable<number>>>({
  key: 'selectedAccountId',
  get: ({ get }) => {
    return get(activeHedgeState).accountId;
  },
  set: ({ get, set }, newValue) => {
    const h = get(activeHedgeState).clone();
    h.accountId = newValue instanceof DefaultValue ? 0 : newValue ?? 0;
    set(activeHedgeState, h);
  },
});

// export const  = atom<Nullable<PangeaAccount>>({
//   key: 'selectedAccount',
//   default: null,
// });

export const selectedAccountState = atom<Nullable<PangeaAccount>>({
  key: 'selectedAccount',
  default: null,
});
/**
 * The create hedge link based on type
 */
export const createHedgeTypeUrlState = selector<string>({
  key: 'createHedgeTypeUrl',
  get: ({ get }) => {
    const hedgeFrequency = get(activeHedgeFrequencyTypeState) ?? 'onetime';
    return `/cashflow/details/${hedgeFrequency}`;
  },
});

/**
 * The URL for the manage hedge link.
 */
export const manageHedgeTypeUrlState = selector<string>({
  key: 'manageHedge',
  get: ({ get }) => {
    const hedgeFrequency = get(activeHedgeFrequencyTypeState) ?? 'onetime';
    return `/manage/details/${hedgeFrequency}`;
  },
});

export const marginHealthDetailsState = selectorFamily<
  Nullable<PangeaMarginHealthResponse>,
  number
>({
  key: 'marginHealthDetails',
  get:
    (custom_amount) =>
    async ({ get }) => {
      const api = get(clientApiState);
      const apiHelper = await api.getAuthenticatedApiHelper();
      const marginHealthResponse = await apiHelper.loadMarginHealthAsync({
        custom_amount,
      });
      if (isError(marginHealthResponse)) {
        return null;
      }

      const newMarginData: PangeaMarginRequirement[] = [];
      let iMargin: Nullable<PangeaMarginRequirement> = null;
      let lastMarginIndex = -1;
      for (let i = 0; i < 30; i++) {
        const d = addDays(standardizeDate(), i);
        if (
          marginHealthResponse.margins[lastMarginIndex + 1] &&
          standardizeDate(
            marginHealthResponse.margins[lastMarginIndex + 1].date,
          ).getTime() <= d.getTime()
        ) {
          iMargin = clone(marginHealthResponse.margins[lastMarginIndex + 1]);
          lastMarginIndex++;
        }
        const roundTo2FractionalDigits = (n: number) => Number(n.toFixed(2));
        newMarginData.push(
          !isNull(iMargin)
            ? clone({
                ...iMargin,
                date: d.toISOString(),
                health_score: roundTo2FractionalDigits(
                  bound(iMargin.health_score, 0, 1.2),
                ),
                health_score_hypothetical: roundTo2FractionalDigits(
                  bound(iMargin.health_score_hypothetical, 0, 1.2),
                ),
                health_score_after_deposit: roundTo2FractionalDigits(
                  bound(iMargin.health_score_after_deposit, 0, 1.2),
                ),
              })
            : {
                amount: '0',
                date: d.toISOString(),
                health_score: 0,
                health_score_after_deposit: 0,
                health_score_hypothetical: 0,
                total_hedging: '0',
              },
        );
      }
      marginHealthResponse.margins = [...newMarginData];

      return marginHealthResponse;
    },
});
export const marginAndFeesDetailsCacheState = selectorFamily<
  { account_id: number; data: Nullable<PangeaMarginAndFeesResponse> }[],
  CreateSerializableParam<PangeaMarginAndFeeRequest>
>({
  key: 'marginAndFeesDetailsCache',
  get:
    (requestBody) =>
    async ({ get }) => {
      return await Promise.all(
        get(allAccountsState)
          .filter((a) =>
            ['low', 'moderate', 'high'].includes(a.name.toLowerCase()),
          )
          .map(async (a) => {
            const feeResponse = await ClientAuthHelper.getInstance()
              .getAuthenticatedApiHelper()
              .loadMarginsAndFeesAsync({
                account_id: a.id,
                draft_ids: requestBody.draft_ids,
                deleted_cashflow_ids: requestBody.deleted_cashflow_ids,
              });
            return {
              account_id: a.id,
              data: isError(feeResponse) ? null : feeResponse,
            };
          }),
      );
    },
});
export const singleMarginAndFeesDetailsCacheState = selectorFamily<
  Nullable<PangeaMarginAndFeesResponse>,
  CreateSerializableParam<PangeaMarginAndFeeRequest>
>({
  key: 'singleMarginAndFeesDetailsCache',
  get: (requestBody) => async () => {
    const response = await ClientAuthHelper.getInstance()
      .getAuthenticatedApiHelper()
      .loadMarginsAndFeesAsync({
        account_id: requestBody.account_id,
        draft_ids: requestBody.draft_ids,
        deleted_cashflow_ids: requestBody.deleted_cashflow_ids,
      });
    if (isError(response)) {
      return null;
    }
    return response;
  },
});
const marginFeeCancelTokens: CancelTokenSource[] = [];
export const marginAndFeesDetailsState = selectorFamily<
  Nullable<PangeaMarginAndFeesResponse>,
  CreateSerializableParam<PangeaMarginAndFeeRequest>
>({
  key: 'marginAndFeesDetails',
  get:
    (requestBody) =>
    async ({ get }) => {
      if (
        !requestBody.draft_ids ||
        requestBody.draft_ids.length == 0 ||
        requestBody.draft_ids.includes(-1) ||
        requestBody.draft_ids.includes(0)
      ) {
        return null;
      }
      const cachedData = get(marginAndFeesDetailsCacheState(requestBody)).find(
        (d) => d.account_id == requestBody.account_id,
      )?.data;
      if (cachedData) {
        return cachedData;
      }
      const api = get(clientApiState);
      const apiHelper = api.getAuthenticatedApiHelper();
      if (marginFeeCancelTokens.length > 0) {
        marginFeeCancelTokens.forEach((t) => t.cancel('New Request started'));
      }
      marginFeeCancelTokens.push(axios.CancelToken.source());
      const marginFeeResponse = await apiHelper.loadMarginsAndFeesAsync(
        requestBody,
        marginFeeCancelTokens[marginFeeCancelTokens.length - 1].token,
      );
      if (isError(marginFeeResponse)) {
        return null;
      }

      return marginFeeResponse;
    },
});

export const autoPilotFeesDetailsState = atom<Nullable<PangeaWhatIf>>({
  key: 'autoPilotFeesDetails',
  default: null,
});

export const marginAndCreditHealthState = selector<
  Nullable<MarginAndCreditHealthData>
>({
  key: 'marginAndCreditHealth',
  get: async ({ get }) => {
    const api = get(clientApiState);
    const apiHelper = api.getAuthenticatedApiHelper();
    const result = await apiHelper.getMarginAndCreditHealthAsync();
    if (isError(result)) {
      return null;
    }
    const {
      marginCallRisk,
      marginCallRiskColor,
      creditHealthColor,
      utilization,
      pnlValue,
    } = calculateMarginCallRisk(result);
    return {
      creditLimitStart: 0,
      creditLimit: parseFloat(result.credit_usage.credit_limit),
      inMarketValue: parseFloat(result.credit_usage.credit_used),
      utilization,
      marginCallRisk,
      marginCallRiskColor,
      markToMarketPnl: parseFloat(result.credit_usage.pnl),
      marginCallAt: parseFloat(result.margin_call_at),
      marginHealthEnd: 10,
      creditHealthColor,
      pnlPercentage: pnlValue,
    };
  },
});

export const shouldShowFeesState = atom({
  key: 'shouldShowFees',
  default: false,
});
export const allCashflowsGridViewState = selector<{
  rows: CashflowGridRow[];
  updated: Date;
}>({
  key: 'allCashflowsGridView',
  get: async ({ get }) => {
    let allCashflows: Cashflow[] = [];
    const updated = new Date();
    try {
      const api = get(clientApiState);
      const apiHelper = api.getAuthenticatedApiHelper();
      const promises = await Promise.all([
        apiHelper.loadAllCashflowsAsync(),
        apiHelper.loadAllDraftsAsync(),
      ]);
      const cashflows: PangeaCashflow[] = promises[0];
      const drafts = promises[1].filter((d) => !d.cashflow_id);
      allCashflows = [
        ...cashflows.map((c) => Cashflow.fromCashflowObject(c)),
        ...drafts.map((d) => Cashflow.fromDraftObject(d)),
      ];
    } catch (e) {
      console.error('getting cashflows error', e);
      return { rows: [], updated };
    }
    const accounts = get(allAccountsState);
    const returnObj = allCashflows
      .filter((c) => !c.installment_id || c.installment_id < 1)
      .map((c) => {
        const accountName =
          c.accountId < 1
            ? ''
            : accounts.find((account) => account.id === c.accountId)?.name;
        return {
          name: c.name,
          status: c.ui_status,
          currency: c.currency,
          account: accountName,
          deliveryDate: new Date(c.endDate),
          frequency: c.type,
          amount: c.directionalAmount,
          accountId: c.accountId,
          cashflowId: c.id,
          internal_uuid: c.internal_uuid,
          modified: c.modified,
          obj: c,
          bookedBaseAmount: c.booked_base_amount,
          bookedCntrAmount: c.booked_cntr_amount,
          bookedRate: c.booked_rate,
          indicativeBaseAmount: c.indicative_base_amount,
          indicativeCntrAmount: c.indicative_cntr_amount,
          indicativeRate: c.indicative_rate,
        } as CashflowGridRow;
      });
    const installmentIds = uniq(
      allCashflows
        .filter((c) => c.installment_id && c.installment_id >= 1)
        .map((c) => c.installment_id),
    );
    installmentIds.forEach((installId) => {
      const cashflows = allCashflows.filter(
        (c) =>
          c.installment_id === installId &&
          (!c.status ||
            [
              PangeaCashflowStatusEnum.Active,
              PangeaCashflowStatusEnum.PendingActivation,
            ].includes(c.status)) &&
          (!c.action || c.action == 'CREATE'),
      );
      if (!cashflows || cashflows.length < 1) {
        return;
      }
      const i = Installment.fromCashflows(cashflows) || new Installment();
      const accountName =
        i.accountId < 1
          ? ''
          : accounts.find((account) => account.id === i.accountId)?.name;
      returnObj.push({
        name: i.name,
        status: i.ui_status,
        currency: i.currency,
        account: accountName,
        deliveryDate: i.endDate,
        frequency: i.type,
        amount: i.directionalAmount,
        accountId: i.accountId,
        cashflowId: i.installment_id,
        internal_uuid: i.internal_uuid,
        modified: i.modified,
        obj: i,
        bookedBaseAmount: i.booked_base_amount,
        bookedCntrAmount: i.booked_cntr_amount,
        bookedRate: i.booked_rate,
        indicativeBaseAmount: i.indicative_base_amount,
        indicativeCntrAmount: i.indicative_cntr_amount,
        indicativeRate: i.indicative_rate,
      } as CashflowGridRow);
    });

    return { rows: returnObj, updated };
  },
});

// Data for AddMarginSteppedModal
export const wireTransferAPIReceivedDataState = selector<PangeaWireInstruction>(
  {
    key: 'wireTransferAPIReceivedData',
    get: async ({ get }) => {
      const api = get(clientApiState);
      const domesticCurrency = get(domesticCurrencyState);
      const result = await api
        .getAuthenticatedApiHelper()
        .getAllWireInstructionsAsync(domesticCurrency);
      if (!result || result.length <= 0) {
        return {
          currency: { mnemonic: 'USD' },
          id: 0,
          title: 'Error retrieving wire details',
        } as PangeaWireInstruction;
      }
      return result[0];
    },
  },
);
export const marginDepositAPISendDataState =
  atom<IMarginDepositAPISendDataState>({
    key: 'marginDepositAPISendData',
    default: {
      depositDetails: {
        deposit_amount: 0.0,
        depositSelection: 'recommended', // recommended, minimum, custom
        depositMethod: 'wire', // wire or ach
      },
    },
  });

export const internalBulkUploadItemsState = atom<object[]>({
  key: 'internalBulkUploadItems',
  default: [],
  effects: [localStorageEffect('internal-bulk-upload-items')],
});

export const bulkUploadItemsState = selector<AnyHedgeItem[]>({
  key: 'bulkUploadItems',
  get: ({ get }) => {
    const serializedItems = get(internalBulkUploadItemsState);
    return serializedItems.map((hedgeItemObject) =>
      hedgeItemObject &&
      Object.hasOwn(hedgeItemObject, 'type') &&
      (hedgeItemObject as { type?: FrequencyType }).type === 'installments'
        ? Installment.fromObject(hedgeItemObject)
        : Cashflow.fromObject(hedgeItemObject),
    );
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(internalBulkUploadItemsState, []);
      return;
    }

    set(
      internalBulkUploadItemsState,
      newValue.map((item) => item.toObject()),
    );
  },
});

export const hedgeDirectionUIState = atom<Optional<CashflowDirectionType>>({
  key: 'hedgeDirectionUI',
  default: undefined,
});

export const marginFeeDataLoadingState = atom<boolean>({
  key: 'marginFeeDataLoading',
  default: false,
});
export const cashflowFwdsDataState = selectorFamily({
  key: 'cashflowFwdsData',
  get:
    (accountId: number) =>
    async ({ get }) => {
      if (accountId <= 0) {
        return new Error('No account provided');
      }
      const api = get(clientApiState).getAuthenticatedApiHelper();
      return await api.getCashflowFwdsAsync(accountId);
    },
});

export const selectedHedgeStrategy = atom<Optional<CashflowStrategyEnum>>({
  key: 'currentHedgeStrategy',
  default: undefined,
});
export const savedPortfolioDetailsState = atom<
  Optional<{
    amount: number;
    date: Date;
    type: FrequencyType;
    direction: CashflowDirectionType;
  }>
>({
  key: 'savedPortfolioDetails',
  default: undefined,
});
const currentForwardHedgeItemDefaultSelector =
  selector<PangeaPatchedDraftFxForward>({
    key: 'currentForwardHedgeItemDefault',
    get: () => {
      return {
        is_cash_settle: false,
        purpose_of_payment: 'PURCHASE OF GOOD(S)',
      };
    },
  });
export const currentForwardHedgeItem = atom<
  Optional<PangeaPatchedDraftFxForward>
>({
  key: 'currentForwardHedgeItem',
  default: currentForwardHedgeItemDefaultSelector,
});
export const currentParachuteHedgeItem = atom<
  Optional<PangeaPatchedDraftFxForward>
>({
  key: 'currentParachuteHedgeItem',
  default: currentForwardHedgeItemDefaultSelector,
});
export const currentAutopilotHedgeItem = atom<Optional<PangeaAutopilotData>>({
  key: 'currentAutopilotHedgeItem',
  default: undefined,
});
export const allForwardsHedgeItemsDataState = selector<
  Nullable<PangeaPaginatedDraftFxForwardList>
>({
  key: 'allForwardsHedgeItemsData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const allHedgeForwardItemsResponse = await api.getAllHedgeListDataAsync({});
    if (isError(allHedgeForwardItemsResponse)) {
      return null;
    }
    return allHedgeForwardItemsResponse;
  },
});

export const corpayCurrencyDefinitionState = selector<
  PangeaCurrencyDefinition[]
>({
  key: 'corpayCurrencyDefinition',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const purposeOfPaymentsData =
      await api.brokerCorpayCurrencyDefinitionListAsync({ wallet: true });
    if (isError(purposeOfPaymentsData)) {
      return [] as PangeaCurrencyDefinition[];
    }
    return purposeOfPaymentsData.results ?? [];
  },
});

export const allCurrencyDefinitionState = selector<PangeaCurrencyDefinition[]>({
  key: 'allcorpayCurrencyDefinition',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const purposeOfPaymentsData =
      await api.brokerCorpayCurrencyDefinitionListAsync({});
    if (isError(purposeOfPaymentsData)) {
      return [] as PangeaCurrencyDefinition[];
    }
    return purposeOfPaymentsData.results ?? [];
  },
});
