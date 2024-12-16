import { format } from 'date-fns';
import {
  ExecutionTiming,
  PangeaBeneficiary,
  PangeaBeneficiaryAccountTypeEnum,
  PangeaBeneficiaryRequest,
  PangeaBeneficiaryRulesResponse,
  PangeaBestExecutionData,
  PangeaBestExecutionStatus,
  PangeaBookInstructDealRequest,
  PangeaBrokerCorpayBeneficiaryBanksRetrieveParams,
  PangeaBrokerCorpayBeneficiaryRulesRetrieveParams,
  PangeaCorpayLockSideEnum,
  PangeaCurrencyResponse,
  PangeaDateTypeEnum,
  PangeaDetailedPaymentRfqResponse,
  PangeaFXBalanceAccountsResponseItem,
  PangeaIbanValidationResponse,
  PangeaInitialMarketStateRequest,
  PangeaInitialMarketStateResponse,
  PangeaInstructDealRequestDeliveryMethodEnum,
  PangeaInstructDealRequestOrder,
  PangeaInstructDealRequestPayment,
  PangeaInstructDealRequestSettlement,
  PangeaListBankResponse,
  PangeaListBeneficiaryResponse,
  PangeaListBeneficiaryRow,
  PangeaPaginatedBeneficiaryList,
  PangeaPaginatedWalletList,
  PangeaPayment,
  PangeaPaymentDeliveryMethodEnum,
  PangeaProxy,
  PangeaProxyRequest,
  PangeaPurposeEnum,
  PangeaPurposeOfPaymentItem,
  PangeaQuotePaymentResponse,
  PangeaResponse,
  PangeaSettlementAccountChildren,
  PangeaSettlementAccountsResponse,
  PangeaSpotRateRequest,
  PangeaSpotRateResponse,
  PangeaValidationSchemaRequest,
  PangeaValueDate,
  PangeaWaitCondition,
  TransactionRequestData,
} from 'lib';
import { isError } from 'lodash';
import { atom, selector, selectorFamily } from 'recoil';
import { clientApiState } from './globalstate';

export const paymentReferenceRequestData = atom({
  key: 'paymentReferenceRequest',
  default: '',
});
export const paymentPurposeRequestData = atom({
  key: 'paymentPurposeRequest',
  default: '',
});
export const executionTimingtData = atom<ExecutionTiming | null>({
  key: 'executionTiming',
  default: null,
});
export const paymentExecutionTimingtData =
  atom<PangeaBestExecutionStatus | null>({
    key: 'paymentExecutionTiming',
    default: null,
  });

export const paymentLiquidityData = atom<PangeaBestExecutionData | null>({
  key: 'paymentLiquidity',
  default: null,
});

export const bookInstructDealRequestDataState =
  atom<PangeaBookInstructDealRequest>({
    key: 'fxTransferRequestData',
    default: {
      book_request: {
        quote_id: '',
      },
      instruct_request: {
        orders: [
          {
            amount: 0,
          },
        ],
        payments: [
          {
            beneficiary_id: '',
            delivery_method: PangeaInstructDealRequestDeliveryMethodEnum.C,
            amount: 0,
            currency: '',
            purpose_of_payment: '',
            payment_reference: '',
          },
        ],
        settlements: [
          {
            account_id: '',
            delivery_method: PangeaInstructDealRequestDeliveryMethodEnum.C,
            currency: '',
            purpose: PangeaPurposeEnum.Spot,
          },
          {
            account_id: '',
            delivery_method: PangeaInstructDealRequestDeliveryMethodEnum.C,
            currency: '',
            purpose: PangeaPurposeEnum.Fee,
          },
        ],
      },
    },
  });

export const bookInstructDealOrderNumberState = atom<string>({
  key: 'bookInstructDealOrderNumber',
  default: '',
});

export const spotRateRequestDataState = atom<PangeaSpotRateRequest>({
  key: 'spotRateRequestData',
  default: {
    payment_currency: 'USD',
    settlement_currency: 'USD',
    amount: 1,
    lock_side: PangeaCorpayLockSideEnum.Payment,
  },
});
export const paymentSpotRateRequestDataState =
  atom<PangeaInitialMarketStateRequest>({
    key: 'paymentSpotRateRequestData',
    default: {
      sell_currency: 'USD',
      buy_currency: 'USD',
      value_date: format(new Date(), 'yyyy-MM-dd'),
      subscription: true,
    },
  });
export const paymentBuyCurrencyState = atom<Nullable<string>>({
  key: 'paymentBuyCurrency',
  default: 'USD',
});

export const paymentSellCurrencyState = atom<Nullable<string>>({
  key: 'paymentSellCurrency',
  default: null,
});

export const transactionRequestDataState = atom<TransactionRequestData>({
  key: 'transactionRequestData',
  default: {
    purpose_of_payment: '',
    settlement_amount: 0,
    payment_amount: 0,
    payment_reference: '',
    frequency: 'onetime',
    payment_currency: '',
    settlement_currency: 'USD',
    amount: 1,
    lock_side: PangeaCorpayLockSideEnum.Payment,
    delivery_date: null,
    fees: 0,
    cntr_amount: 0,
    periodicity_end_date: null,
    periodicity_start_date: null,
    periodicity: null,
    installments: null,
    installment: null,
    recurring: null,
  },
});
export const bookInstructDealOrderPayload =
  selector<PangeaInstructDealRequestOrder>({
    key: 'bookInstructDealOrderPayload',
    get: ({ get }) => {
      const request = get(bookInstructDealRequestDataState);
      const [orderPayload] = request.instruct_request.orders;
      return orderPayload;
    },
  });

export const selectedWaitConditionState = atom<Nullable<PangeaWaitCondition>>({
  key: 'selectedWaitCondition',
  default: null,
});
export const transactionPaymentState = atom<Nullable<PangeaPayment>>({
  key: 'transactionPayment',
  default: null,
});
export const paymentRfqState = atom<Nullable<PangeaDetailedPaymentRfqResponse>>(
  {
    key: 'paymentRfq',
    default: null,
  },
);

export const bookInstructDealPaymentPayload =
  selector<PangeaInstructDealRequestPayment>({
    key: 'bookInstructDealPaymentPayload',
    get: ({ get }) => {
      const request = get(bookInstructDealRequestDataState);
      const [paymentPayload] = request.instruct_request.payments;
      return paymentPayload;
    },
  });

export const bookInstructDealSettlementPayload =
  selector<PangeaInstructDealRequestSettlement>({
    key: 'bookInstructDealSettlementPayload',
    get: ({ get }) => {
      const request = get(bookInstructDealRequestDataState);
      const [settlementPayload] = request.instruct_request.settlements;
      return settlementPayload;
    },
  });

export const walletsDataState = selector<PangeaFXBalanceAccountsResponseItem[]>(
  {
    key: 'fxWalletsData',
    get: async ({ get }) => {
      const api = get(clientApiState).getAuthenticatedApiHelper();
      const walletsData = await api.getWalletsAsync();
      if (isError(walletsData)) {
        return [] as PangeaFXBalanceAccountsResponseItem[];
      }
      return walletsData.items;
    },
  },
);

export const settlementAccountsDataState = selector<
  Nullable<PangeaSettlementAccountsResponse>
>({
  key: 'settlementAccountsData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const settlementAccounts = await api.getAllSettlementAccountsAsync();
    if (isError(settlementAccounts)) {
      return null;
    }
    return settlementAccounts;
  },
});

export const withdrawalAccountsDataState = selector<
  Nullable<PangeaListBeneficiaryResponse>
>({
  key: 'withdrawalAccountsData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const withdrawalAccounts = await api.getAllCorPayWithdrawalAccountsAsync({
      status: 'A',
      is_withdraw: true,
    });
    if (isError(withdrawalAccounts)) {
      return null;
    }
    return withdrawalAccounts;
  },
});
export const userWithdrawalAccountsDataState = selector<
  PangeaListBeneficiaryRow[]
>({
  key: 'userWithdrawalAccountsData',
  get: ({ get }) => {
    const completUserWithdrawalAccountsData = get(withdrawalAccountsDataState);
    return completUserWithdrawalAccountsData
      ? completUserWithdrawalAccountsData.data.rows
      : [];
  },
});
export const bankAccountsDataState = selector<
  PangeaSettlementAccountChildren[]
>({
  key: 'settlementBankAccountsData',
  get: ({ get }) => {
    const settlementAccounts = get(settlementAccountsDataState)?.items.filter(
      (item) => item.ordnum === 1,
    )[0].children;
    return settlementAccounts ?? [];
  },
});

export const corpayBeneficiaryAccountsDataState = selector<
  Nullable<PangeaListBeneficiaryResponse>
>({
  key: 'corpayBeneficiaryAccountsData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const corPayBeneficiaryAccountsResponse =
      await api.getAllCorPayBeneficiaryAccountsAsync();
    if (isError(corPayBeneficiaryAccountsResponse)) {
      return null;
    }
    return corPayBeneficiaryAccountsResponse;
  },
});

export const corPayBankAccountsDataState = selector<PangeaListBeneficiaryRow[]>(
  {
    key: 'corPayBankAccountsData',
    get: ({ get }) => {
      const completCorPayBeneficiaryAccountsData = get(
        corpayBeneficiaryAccountsDataState,
      );
      return completCorPayBeneficiaryAccountsData
        ? completCorPayBeneficiaryAccountsData.data.rows
        : [];
    },
  },
);

export const universalBeneficiaryAccountsDataState = selector<
  Nullable<PangeaPaginatedBeneficiaryList>
>({
  key: 'universalBeneficiaryAccountsData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const universalBeneficiaryAccountsResponse =
      await api.getAllUniversalBeneficiaries({});
    if (isError(universalBeneficiaryAccountsResponse)) {
      return null;
    }
    return universalBeneficiaryAccountsResponse;
  },
});

export const allSettlementWalletListDataState = selector<
  Nullable<PangeaPaginatedWalletList>
>({
  key: 'allSettlementWalletList',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const allSettlementWalletListResponse =
      await api.getAllSettlementWalletsAsync({});
    if (isError(allSettlementWalletListResponse)) {
      return null;
    }
    return allSettlementWalletListResponse;
  },
});

export const spotRateExpiredState = atom<boolean>({
  key: 'fxSpotRateExpired',
  default: true,
});

export const fxTransferDetailsValidState = selector<boolean>({
  key: 'fxTransferDetailsValid',
  get: ({ get }) => {
    const {
      book_request: { quote_id },
      instruct_request: {
        payments: [payment],
        settlements: [settlement],
      },
    } = get(bookInstructDealRequestDataState);
    return Boolean(
      quote_id &&
        payment.beneficiary_id &&
        payment.currency !== '' &&
        settlement.account_id &&
        settlement.currency !== '' &&
        payment.beneficiary_id !== settlement.account_id,
    );
  },
});

export const fxTransferReviewValidState = selector<boolean>({
  key: 'fxTransferReviewValid',
  get: ({ get }) => {
    const {
      instruct_request: {
        orders: [order],
      },
    } = get(bookInstructDealRequestDataState);
    return Boolean(order.amount > 0 && order.order_id !== '');
  },
});

export const purposeOfPaymentsDataState = selector<
  PangeaPurposeOfPaymentItem[]
>({
  key: 'purposeOfPaymentData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const purposeOfPaymentsData = await api.getAllPaymentPurposesAsync({
      country: 'US',
      currency: 'USD',
      method: 'W',
    });
    if (isError(purposeOfPaymentsData)) {
      return [] as PangeaPurposeOfPaymentItem[];
    }
    return purposeOfPaymentsData.items;
  },
});

export const beneficiaryDetailsValidState = selector<boolean>({
  key: 'beneficiaryDetailsValid',
  get: ({ get }) => {
    const {
      instruct_request: {
        payments: [payment],
        settlements: [settlement],
      },
    } = get(bookInstructDealRequestDataState);

    return Boolean(
      payment.beneficiary_id &&
        payment.currency !== '' &&
        settlement.account_id &&
        settlement.currency !== '',
    );
  },
});

export const beneficiaryReviewValidState = selector<boolean>({
  key: 'beneficiaryReviewValid',
  get: ({ get }) => {
    const {
      instruct_request: {
        orders: [order],
      },
    } = get(bookInstructDealRequestDataState);
    return Boolean(order.amount > 0 && order.order_id !== '');
  },
});
export const paymentDetailsValidState = selector<boolean>({
  key: 'paymentDetailsValid',
  get: ({ get }) => {
    const {
      instruct_request: {
        payments: [payment],
        settlements: [settlement],
      },
    } = get(bookInstructDealRequestDataState);

    return Boolean(
      payment.beneficiary_id &&
        payment.currency !== '' &&
        settlement.account_id &&
        settlement.currency !== '',
    );
  },
});
export const paymentReviewValidState = selector<boolean>({
  key: 'paymentReviewValid',
  get: ({ get }) => {
    const {
      instruct_request: {
        orders: [order],
      },
    } = get(bookInstructDealRequestDataState);
    return Boolean(order.amount > 0 && order.order_id !== '');
  },
});
export const withdrawalReviewValidState = selector<boolean>({
  key: 'withdrawalReviewValid',
  get: ({ get }) => {
    const {
      instruct_request: {
        orders: [order],
      },
    } = get(bookInstructDealRequestDataState);
    return Boolean(order.amount > 0 && order.order_id !== '');
  },
});

export const withdrawalDetailsValidState = selector<boolean>({
  key: 'withdrawalDetailsValid',
  get: ({ get }) => {
    const {
      instruct_request: {
        payments: [payment],
        settlements: [settlement],
      },
    } = get(bookInstructDealRequestDataState);

    return Boolean(
      payment.beneficiary_id &&
        payment.payment_reference &&
        payment.currency !== '' &&
        settlement.account_id &&
        settlement.currency !== '',
    );
  },
});
export const depositDetailsValidState = selector<boolean>({
  key: 'depositDetailsValid',
  get: ({ get }) => {
    const {
      instruct_request: {
        payments: [payment],
        settlements: [settlement],
      },
    } = get(bookInstructDealRequestDataState);

    return Boolean(
      payment.beneficiary_id &&
        payment.currency !== '' &&
        settlement.account_id &&
        settlement.currency !== '',
    );
  },
});

export const depositReviewValidState = selector<boolean>({
  key: 'depositReviewValid',
  get: ({ get }) => {
    const {
      instruct_request: {
        orders: [order],
      },
    } = get(bookInstructDealRequestDataState);
    return Boolean(order.amount > 0 && order.order_id !== '');
  },
});

export const iBanValidationData = atom<Nullable<PangeaIbanValidationResponse>>({
  key: 'iBanValidationDataState',
  default: null,
});

export const bankSearchPayloadState =
  atom<PangeaBrokerCorpayBeneficiaryBanksRetrieveParams>({
    key: 'bankSearchPayload',
    default: {
      country: '',
    },
  });

export const bankSearchListDataState = selector<
  Nullable<PangeaListBankResponse>
>({
  key: 'bankSearchListData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const payload = get(bankSearchPayloadState);
    if (!payload.country) {
      return null;
    } else {
      const bankListResponse = await api.beneficiaryBankSearchAsync(payload);
      if (isError(bankListResponse)) {
        return null;
      } else {
        return bankListResponse;
      }
    }
  },
});

export const corPayBeneficiaryAccountDetailsState = selectorFamily<
  Nullable<PangeaBeneficiary>,
  string
>({
  key: 'corpayBeneficiaryAccountDetails',
  get:
    (id) =>
    async ({ get }) => {
      const api = get(clientApiState).getAuthenticatedApiHelper();
      if (id) {
        const beneficiaryDetails =
          await api.getSettlementBeneficiaryDetailsAsync(id);
        if (!isError(beneficiaryDetails)) {
          return beneficiaryDetails;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
});

export const beneficiaryValidationSchemaRequestDataState =
  atom<PangeaValidationSchemaRequest>({
    key: 'beneficiaryValidationSchemaRequestData',
    default: {
      destination_country: '',
      bank_country: '',
      bank_currency: '',
      payment_method: PangeaPaymentDeliveryMethodEnum.Local,
      beneficiary_account_type: PangeaBeneficiaryAccountTypeEnum.Individual,
    },
  });
export const corPayRulesRequestDataState =
  atom<PangeaBrokerCorpayBeneficiaryRulesRetrieveParams>({
    key: 'corPayRulesRequestData',
    default: {},
  });

export const corPayAddBeneficiaryRequestDataState = atom<
  PangeaBrokerCorpayBeneficiaryRulesRetrieveParams & PangeaBeneficiaryRequest
>({
  key: 'corPayBeneficiaryRequestData',
  default: {
    account_holder_name: '',
    template_identifier: '',
    destination_country: '',
    bank_currency: '',
    classification: 'Individual',
    payment_methods: [],
    preferred_method: '',
    account_number: '',
    routing_code: '',
    account_holder_country: '',
    account_holder_region: '',
    account_holder_address1: '',
    account_holder_city: '',
    account_holder_postal: '',
    swift_bic_code: '',
    bank_name: '',
    bank_country: '',
    bank_city: '',
    bank_address_line1: '',
    regulatory: [],
    is_withdraw: false,
  },
});

export const corPayStepOneBeneficiaryRulesDataState = selector<
  Nullable<PangeaBeneficiaryRulesResponse>
>({
  key: 'corPayStepOneBeneficiaryRulesData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const rules = await api.getAllCorPayBeneficiaryRulesAsync();
    if (isError(rules)) {
      return null;
    }
    return rules;
  },
  cachePolicy_UNSTABLE: {
    eviction: 'keep-all',
  },
});

export const corPayAllBeneficiaryRulesDataState = selector<
  Nullable<PangeaBeneficiaryRulesResponse>
>({
  key: 'corPayAllBeneficiaryRulesData',
  get: async ({ get }) => {
    const api = get(clientApiState).getAuthenticatedApiHelper();
    const rulesPayload = get(corPayRulesRequestDataState);
    const rules = await api.getAllCorPayBeneficiaryRulesAsync(rulesPayload);
    if (isError(rules)) {
      return null;
    }
    return rules;
  },
  cachePolicy_UNSTABLE: {
    eviction: 'keep-all',
  },
});

export const proxyRequestDataState = selectorFamily<
  Nullable<PangeaProxy>,
  string
>({
  key: 'proxyRequestData',
  get:
    (queryPayload) =>
    async ({ get }) => {
      const api = get(clientApiState).getAuthenticatedApiHelper();
      const payload = JSON.parse(queryPayload) as PangeaProxyRequest;
      if (!payload.method || !payload.uri) {
        return null;
      }
      const response = await api.getProxyDataAsync(payload);
      if (isError(response)) {
        return null;
      }
      return response;
    },
  cachePolicy_UNSTABLE: {
    eviction: 'keep-all',
  },
});

export const corPayQuotePaymentResponseState = atom<
  Nullable<PangeaQuotePaymentResponse>
>({
  key: 'corPayQuotePaymentResponse',
  default: null,
});

export const paymentLockSideState = atom<PangeaCorpayLockSideEnum>({
  key: 'paymentLockSide',
  default: PangeaCorpayLockSideEnum.Payment,
});
export const fxFetchingSpotRateState = atom<boolean>({
  key: 'fxFetchingSpotRate',
  default: false,
});
export const spotRateDataState = atom<Nullable<PangeaSpotRateResponse>>({
  key: 'fxRateData',
  default: null,
});
export const paymentspotRateDataState = atom<
  Nullable<PangeaInitialMarketStateResponse>
>({
  key: 'paymentFxRateData',
  default: null,
});

export const paymentDetailsValidationState = selector<{
  frequency: boolean;
  payment_reference: boolean;
  settlement_currency: boolean;
  payment_currency: boolean;
  delivery_date: boolean;
  payment_amount: boolean;
  settlement_amount: boolean;
}>({
  key: 'paymentDetailsValidation',
  get: ({ get }) => {
    const {
      frequency,
      settlement_currency,
      payment_currency,
      payment_reference,
      delivery_date,
      periodicity,
      periodicity_start_date,
      installments,
      payment_amount,
      settlement_amount,
    } = get(transactionRequestDataState);
    let deliveryDateIsValid = false;
    if (frequency == 'onetime' && Boolean(delivery_date)) {
      deliveryDateIsValid = true;
    } else if (
      frequency == 'recurring' &&
      periodicity &&
      periodicity_start_date
    ) {
      deliveryDateIsValid = true;
    } else if (
      frequency == 'installments' &&
      installments &&
      installments?.length > 0
    ) {
      deliveryDateIsValid = true;
    }

    return {
      frequency: Boolean(frequency),
      settlement_currency: Boolean(settlement_currency),
      payment_currency: Boolean(payment_currency),
      payment_reference: Boolean(payment_reference),
      delivery_date: deliveryDateIsValid,
      payment_amount: payment_amount > 0,
      settlement_amount: settlement_amount > 0,
    };
  },
});

export enum ValueDateType {
  SPOT = 'spot',
  FORWARD = 'forward',
}

export const valueDateTypeState = atom<PangeaDateTypeEnum>({
  key: 'valueDateType',
  default: PangeaDateTypeEnum.SPOT,
});

// The unit of this value is minutes
export const valueDateRefreshIntervalState = atom<number>({
  key: 'valueDateRefreshInterval',
  default: 10,
});

export const allValueDatesState = atom<Array<PangeaValueDate>>({
  key: 'allValueDates',
  default: [],
});

export const sellCurrenciesState = atom<Array<PangeaCurrencyResponse>>({
  key: 'sellCurrencies',
  default: [],
});

export const buyCurrenciesState = atom<Array<PangeaCurrencyResponse>>({
  key: 'buyCurrencies',
  default: [],
});

export const brokerUniverseCurrenciesState = selectorFamily<
  Nullable<PangeaResponse>,
  string
>({
  key: 'brokerUniverseCurrencies',
  get:
    (currencyType) =>
    async ({ get }) => {
      const apiHelper = get(clientApiState).getAuthenticatedApiHelper();
      const buyCurrency: Nullable<string> =
        currencyType === 'buy' ? get(paymentBuyCurrencyState) : null;
      const sellCurrency: Nullable<string> =
        currencyType === 'sell' ? get(paymentSellCurrencyState) : null;
      const response = await apiHelper.getBrokerUniverseCurrenciesAsync({
        buy_currency: buyCurrency,
        sell_currency: sellCurrency,
      });
      if (!isError(response)) {
        return response;
      }
      return null;
    },
});
