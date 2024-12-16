import axios, { AxiosError, AxiosResponse, CancelToken } from 'axios';
import { addDays } from 'date-fns';
import { isError, isNumber, isUndefined, merge } from 'lodash';
import { parse, stringify } from 'qs';
import { v4 } from 'uuid';
import { ApiConfig, ContentType, RequestParams } from './api/http-client';
import {
  PangeaActivateBeneficiaryRequest,
  PangeaAutopilotData,
  PangeaAutopilotDataRequest,
  PangeaBrokerCorpayCurrencyDefinitionListParams,
  PangeaCreateQuoteRequest,
  PangeaInstallmentCashflow,
  PangeaMessageResponse,
  PangeaMFAFirstStepJWTRequest,
  PangeaPaginatedCurrencyDefinitionList,
  PangeaParachuteData,
  PangeaParachuteDataRequest,
  PangeaQuoteResponse,
  PangeaQuoteToTicketRequest,
  PangeaSaveInstructRequest,
  PangeaSaveInstructRequestResponse,
  PangeaTicket,
  PangeaWaitCondition,
} from './api/v1/data-contracts';
import { Api } from './api/v2/Api';
import {
  PangeaAccount,
  PangeaAccountPnLRequest,
  PangeaAccountPnLResponse,
  PangeaActionStatus,
  PangeaActivateUserResponse,
  PangeaActivity,
  PangeaApproveCompanyJoinRequest,
  PangeaAutopilotMarginHealthResponse,
  PangeaBankStatement,
  PangeaBeneficiary,
  PangeaBeneficiaryRequest,
  PangeaBeneficiaryResponse,
  PangeaBeneficiaryRulesResponse,
  PangeaBestExecutionTiming,
  PangeaBookInstructDealRequest,
  PangeaBookPaymentsRequest,
  PangeaBookPaymentsResponse,
  PangeaBrokerCorpayBeneficiariesRetrieveParams,
  PangeaBrokerCorpayBeneficiaryBanksRetrieveParams,
  PangeaBrokerCorpayBeneficiaryDestroyParams,
  PangeaBrokerCorpayBeneficiaryRetrieveParams,
  PangeaBrokerCorpayBeneficiaryRulesRetrieveParams,
  PangeaBrokerCorpayFxBalanceCompanyListParams,
  PangeaBrokerCorpayFxBalanceHistoryListParams,
  PangeaBrokerCorpaySpotPurposeOfPaymentRetrieveParams,
  PangeaBrokerIbEcaRegistrationTasksRetrieveParams,
  PangeaBulkExecutionStatus,
  PangeaBulkPaymentExecution,
  PangeaBulkPaymentRequest,
  PangeaBulkPaymentResponse,
  PangeaBulkPaymentRfq,
  PangeaBulkPaymentUpdate,
  PangeaBulkRfqStatus,
  PangeaBuySell,
  PangeaCashFlowCore,
  PangeaCashFlowWeightRequest,
  PangeaCashFlowWeightResponse,
  PangeaCashflow,
  PangeaCashflowAbsForwardRequest,
  PangeaCashflowAbsForwardResponse,
  PangeaCashflowStatusEnum,
  PangeaCashflowsListParams,
  PangeaChangePassword,
  PangeaCompany,
  PangeaCompanyContactOrder,
  PangeaCompanyContactOrderListParams,
  PangeaCompanyContactOrderRequest,
  PangeaCompanyJoinRequest,
  PangeaCompanyJoinRequestListParams,
  PangeaCreateAccountForCompanyView,
  PangeaCreateCompany,
  PangeaCreateECASSO,
  PangeaCreateECASSOActionEnum,
  PangeaCreateECASSOResponse,
  PangeaCurrency,
  PangeaDeleteBeneficiaryResponse,
  PangeaDepositRequest,
  PangeaDetailedPaymentRfqResponse,
  PangeaDraftCashflow,
  PangeaDraftFxForward,
  PangeaDraftsListParams,
  PangeaEmail,
  PangeaFXBalanceAccountsResponse,
  PangeaFeesPayments,
  PangeaFundingRequest,
  PangeaFxPair,
  PangeaFxSpot,
  PangeaGetCashflowRiskCone,
  PangeaGetCashflowRiskConeResponse,
  PangeaGetCompanyByEINRequest,
  PangeaGroupEnum,
  PangeaHedgeForwardListParams,
  PangeaHedgeForwardWhatIfRetrieveParams,
  PangeaHedgePolicyForAccountView,
  PangeaHedgePolicyForAccountViewMethodEnum,
  PangeaHedgeSettings,
  PangeaHistoricalRateRequest,
  PangeaIBApplications,
  PangeaIBFBResponse,
  PangeaIbanValidationRequest,
  PangeaIbanValidationResponse,
  PangeaInitialMarketStateRequest,
  PangeaInitialMarketStateResponse,
  PangeaInstallment,
  PangeaInstructDealResponse,
  PangeaInviteResponse,
  PangeaListBankResponse,
  PangeaListBeneficiaryResponse,
  PangeaMFAActiveUserMethod,
  PangeaMFAFirstStepJWTSuccess,
  PangeaMFAJWTAccessRefreshResponse,
  PangeaMFAMethodActivationErrorResponse,
  PangeaMFAMethodBackupCodeSuccessResponse,
  PangeaMFAMethodCodeRequest,
  PangeaMFAMethodDetailsResponse,
  PangeaMFASecondStepJWTRequest,
  PangeaMarginAndFeeRequest,
  PangeaMarginAndFeesResponse,
  PangeaMarginHealthRequest,
  PangeaMarginHealthResponse,
  PangeaMarketSpotDateRequest,
  PangeaMarketSpotDates,
  PangeaMultiDay,
  PangeaNotificationEvent,
  PangeaRateMovingAverage,
  PangeaPaginatedBeneficiaryList,
  PangeaPaginatedCompanyFXBalanceAccountHistoryList,
  PangeaPaginatedDraftFxForwardList,
  PangeaPaginatedFXBalanceAccountHistoryRowList,
  PangeaPaginatedWalletList,
  PangeaPasswordToken,
  PangeaPatchedBeneficiary,
  PangeaPatchedCompany,
  PangeaPatchedDraftFxForward,
  PangeaPatchedUserUpdate,
  PangeaPayment,
  PangeaPaymentExecutionResponse,
  PangeaPaymentsListParams,
  PangeaPendingTasksResponse,
  PangeaPerformanceResponse,
  PangeaPredefinedDestinationInstructionRequest,
  PangeaProxy,
  PangeaProxyRequest,
  PangeaPurposeOfPaymentResponse,
  PangeaQuotePayment,
  PangeaQuotePaymentResponse,
  PangeaRealizedVolatilityResponse,
  PangeaRegistrationTasksResponse,
  PangeaResendNotificationRequest,
  PangeaResponse,
  PangeaRetrieveBeneficiaryResponse,
  PangeaRiskGetCashflowRiskConesCreateParams,
  PangeaSendAuthenticatedSupportMessage,
  PangeaSendGeneralSupportMessage,
  PangeaSettlementAccountsResponse,
  PangeaSettlementBeneficiaryListParams,
  PangeaSettlementWalletListParams,
  PangeaSpotRateRequest,
  PangeaSpotRateResponse,
  PangeaStatusResponse,
  PangeaStripePaymentMethodResponse,
  PangeaStripeSetupIntent,
  PangeaTemplateEnum,
  PangeaTokenObtainPairResponse,
  PangeaTrade,
  PangeaUpdateRequestTypeEnum,
  PangeaUpdateUserPermissionGroup,
  PangeaUser,
  PangeaUserActivateRetrieveParams,
  PangeaUserConfirmPhone,
  PangeaUserCreation,
  PangeaUserEmailExistsResponse,
  PangeaUserExistsRetrieveParams,
  PangeaUserNotification,
  PangeaUserNotificationBulkCreateUpdate,
  PangeaUserUpdate,
  PangeaUserVerifyPhoneOTP,
  PangeaValidationSchemaRequest,
  PangeaValueDateCalendarRequest,
  PangeaValueDateCalendarResponse,
  PangeaWhatIf,
  PangeaInviteVerifyTokenRetrieveParams,
  PangeaInviteTokenResponse,
  PangeaSetUserPassword,
  PangeaRequestApproval,
  PangeaApprovalApproveRequestRetrieveParams,
  PangeaWalletUpdate,
  PangeaWallet,
} from './api/v2/data-contracts';
import { Cashflow } from './models/cashflow';
import { Installment } from './models/installment';
import { IAccountPerfChartData, IAccountPerfData } from './types';
import {
  bound,
  getErrorMessage,
  serializeDateTime,
  standardizeDate,
} from './utils';

const axiosRequestParams: { noencode_commaarray: RequestParams } = {
  noencode_commaarray: {
    paramsSerializer: {
      serialize: (params: any) => {
        return stringify(params, {
          arrayFormat: 'comma',
          encode: false,
        });
      },
    },
  },
};
export const PangeaSessionCV = v4();
const PangeaBaseUrl =
  process.env.NEXT_PUBLIC_PANGEA_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://api.internal.pangea.io'
    : 'https://api.internal.dev.pangea.io');
export const PangeaDefaultAxiosConfig = {
  baseURL: PangeaBaseUrl,
  responseType: 'json',
  secure: true,
  securityWorker: async () => {
    return {
      headers: {
        'x-pangea-cv': PangeaSessionCV,
      },
    };
  },
  headers: {
    'Content-Type': ContentType.Json,
  },
} as ApiConfig<PangeaTokenObtainPairResponse>;

export const apiHelper = (
  api: Api<PangeaTokenObtainPairResponse> = new Api<PangeaTokenObtainPairResponse>(
    PangeaDefaultAxiosConfig,
  ),
) => {
  if (!api) {
    api = new Api(PangeaDefaultAxiosConfig);
  }

  /**
   * This one can't use the helpers until the schema is fixed to specify return types.
   * @returns PangeaCurrency[]
   */
  const getCurrenciesAsync = async (): Promise<PangeaCurrency[] | Error> =>
    await basicApiCallEx(api.currencyCurrenciesList);

  const loadFxPairsAsync = async (): Promise<PangeaFxPair[]> => {
    try {
      const results = await loadAllPages(api.currencyFxpairsList);
      return results ?? [];
    } catch (e: any) {
      console.error('fxpairs error', e);
      return [];
    }
  };
  const loadMarketDataAsync = async (
    fxPairs: PangeaFxPair[],
    asOfDate: Date,
  ): Promise<PangeaFxSpot[]> => {
    try {
      if (!fxPairs) return [];
      const spotData = await loadAllPages(
        api.marketdataSpotList,
        {
          data_cut_type: 'eod',
          end_date: asOfDate.toISOString(),
          start_date: addDays(asOfDate, -5).toISOString(),
          limit: fxPairs.length,
          ordering: '-date',
          pair_ids: fxPairs.map((p) => (!!p && !!p.id ? p.id : 0)),
        },
        axiosRequestParams.noencode_commaarray,
      );
      return spotData || [];
    } catch {
      console.debug('error in rate_by_fxpairs');
      return [];
    }
  };
  const loadMarketDataForExploreAsync = async (
    buy_currency: string,
    sell_currency: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PangeaRateMovingAverage[]> => {
    try {
      const data: PangeaHistoricalRateRequest = {
        end_date: endDate.toISOString(),
        start_date: startDate.toISOString(),
        buy_currency,
        sell_currency,
      };
      const spotData = await basicApiCallEx(
        api.marketdataHistoricalRatesCreate,
        data,
      );
      if (isError(spotData)) {
        return [];
      }
      return spotData;
    } catch (error: any) {
      console.debug('error in loadMarketDataForExploreAsync');
      return error;
    }
  };
  const loadUserAsync = async (
    cancelToken?: CancelToken,
  ): Promise<Error | PangeaUser> => {
    try {
      const userResponse = await basicApiCallEx(api.userList, { cancelToken });
      if (isError(userResponse)) {
        return userResponse;
      }
      const user = Array.isArray(userResponse)
        ? userResponse[0]
        : (userResponse as PangeaUser);
      return user;
    } catch (e: any) {
      if (!axios.isCancel(e)) {
        console.error('error getting user', e);
      }
      return new Error(e);
    }
  };

  const getCompanyAsync = async (): Promise<Error | PangeaCompany> => {
    const companyList = await basicApiCallEx(api.companyList);
    if (isError(companyList)) {
      return companyList;
    }

    return Array.isArray(companyList)
      ? companyList[0]
      : (companyList as PangeaCompany);
  };

  const loadAllAccountsAsync = async (
    cancelToken?: CancelToken,
  ): Promise<Error | PangeaAccount[]> => {
    return await basicApiCallEx(api.accountsList, { cancelToken });
  };

  const loadAllCashflowsAsync = async (
    maxResults = Infinity,
    status?: PangeaCashflowStatusEnum,
    modifiedSince?: Date,
  ): Promise<PangeaCashflow[]> => {
    try {
      const cashflowsResponse = await loadAllPages(api.cashflowsList, {
        maxResults,
        status__iexact: status ? status.toString() : undefined,
        modified__gt: modifiedSince?.toISOString(),
      } as PangeaCashflowsListParams);
      return cashflowsResponse || [];
    } catch (e) {
      console.debug('error getting all cashflows', e);
      return [];
    }
  };

  const loadAllNotificationEventsAsync = async (): Promise<
    PangeaNotificationEvent[]
  > => {
    try {
      const notificationResponse = await loadAllPages(
        api.notificationEventsList,
      );
      return notificationResponse || [];
    } catch (e) {
      console.debug('error getting all notifications', e);
      return [];
    }
  };
  const loadAllUserNotificationsAsync = async (): Promise<
    PangeaUserNotification[]
  > => {
    try {
      const notificationResponse = await loadAllPages(api.notificationUserList);
      return notificationResponse || [];
    } catch (e) {
      console.debug('error getting all user notifications', e);
      return [];
    }
  };

  /** Can't use helper method because no schema is defined in Swagger */
  const getRiskReductionDataAsync = async (
    requestBody: PangeaGetCashflowRiskCone,
    query: PangeaRiskGetCashflowRiskConesCreateParams,
  ): Promise<PangeaGetCashflowRiskConeResponse> => {
    try {
      if (!requestBody) throw new Error("requestBody can't be null");
      const data = await basicApiCallEx(
        api.riskGetCashflowRiskConesCreate,
        query,
        requestBody,
      );
      if (isError(data)) {
        throw data;
      }

      return data;
    } catch (error) {
      console.debug(
        'error in chartYourHedgeData selector.',
        getErrorMessage(error),
      );
      return {
        dates: [],
        means: [],
        uppers: [],
        lowers: [],
        upper_maxs: [],
        upper_max_percents: [],
        lower_maxs: [],
        lower_max_percents: [],
        initial_value: 0,
        std_probs: [],
        previous_value: 0,
        update_value: 0,
      } as PangeaGetCashflowRiskConeResponse;
    }
  };

  const getStandardDeviationDataAsync = async (
    requestBody: PangeaGetCashflowRiskCone,
    account_id?: PangeaRiskGetCashflowRiskConesCreateParams,
  ): Promise<PangeaGetCashflowRiskConeResponse> => {
    try {
      if (!requestBody) throw new Error("requestBody can't be null");
      const data = await basicApiCallEx(
        api.riskGetCashflowRiskConesCreate,
        { ...(account_id && { account_id }) },
        requestBody,
      );
      if (isError(data)) {
        throw data;
      }
      return data;
    } catch (error) {
      console.debug(
        'error in chartYourRiskData selector.',
        getErrorMessage(error),
      );
      return {
        dates: [],
        means: [],
        uppers: [],
        lowers: [],
        upper_maxs: [],
        upper_max_percents: [],
        lower_maxs: [],
        lower_max_percents: [],
        initial_value: 0,
        std_probs: [],
        previous_value: 0,
        update_value: 0,
      } as PangeaGetCashflowRiskConeResponse;
    }
  };

  const loadDraftByIdAsync = async (
    id: number,
  ): Promise<PangeaDraftCashflow | Error> =>
    await basicApiCallEx(api.draftsRetrieve, id);

  const createNewDraftAsync = async (
    draft: PangeaDraftCashflow,
  ): Promise<PangeaDraftCashflow | Error> =>
    await basicApiCallEx(api.draftsCreate, draft);

  const saveDraftAsync = async (
    draft: PangeaDraftCashflow,
  ): Promise<PangeaDraftCashflow | Error> =>
    await basicApiCallEx(api.draftsUpdate, draft.id, draft);

  const createNewDraftOnCashflow = async (
    draft: PangeaDraftCashflow,
    accountId: number,
  ): Promise<PangeaDraftCashflow | Error> =>
    await basicApiCallEx(
      api.accountsCashflowDraftCreate,
      accountId,
      draft.cashflow_id?.toString() ?? '0',
      draft,
    );

  const loadBrokerIbEcaPendingTasksAsync = async (
    id: number,
  ): Promise<PangeaPendingTasksResponse | Error> =>
    await basicApiCallEx(api.brokerIbEcaPendingTasksRetrieve, id);

  const executeCashflow = async (
    accountId: number,
    core?: Optional<Nullable<PangeaCashFlowCore>>,
    cashflowId?: Optional<Nullable<number | string>>,
    draft?: Optional<Nullable<PangeaDraftCashflow>>,
  ): Promise<PangeaCashflow | Error> => {
    if (
      accountId < 1 ||
      !(core || (draft && draft.id > 0 && cashflowId && Number(cashflowId) > 0))
    ) {
      throw 'invalid parameters calling executeCashflow. Aborting';
    }
    let resp: Optional<Error | PangeaCashflow>;

    if (cashflowId && draft) {
      const active_resp = await basicApiCallEx(
        api.accountsCashflowDraftActivateUpdate,
        accountId,
        cashflowId.toString(),
        draft.id,
        draft,
      );
      if (isError(active_resp)) {
        return active_resp;
      } else if (!isError(active_resp) && active_resp.id) {
        resp = await basicApiCallEx(api.cashflowsRetrieve, active_resp.id);
      }
    } else if (core) {
      resp = await basicApiCallEx(
        api.accountsCashflowCreate,
        {
          accountPk: accountId,
          query: { include_pending_margin_in_margin_check: true },
        },
        core,
      );
    }
    return resp ?? new Error('unknown response');
  };

  const approveCashflow = async (
    accountId: number,
    cashflowId: Optional<Nullable<number | string>>,
  ): Promise<PangeaCashflow | Error> =>
    await basicApiCallEx(
      api.accountsCashflowApproveCreate,
      accountId,
      cashflowId,
    );

  const deactivateCashflowAsync = async (
    account_id: number,
    cashflow_id: number,
  ): Promise<void | Error> =>
    await basicApiCallEx(api.accountsCashflowDestroy, account_id, cashflow_id);

  const deactivateInstallmentAsync = async (
    installment_id: number,
  ): Promise<void | Error> =>
    await basicApiCallEx(api.installmentsDestroy, installment_id);

  const deleteDraft = async (draftId: number): Promise<void | Error> =>
    await basicApiCallEx(api.draftsDestroy, draftId);

  const deleteDraftOnCashflow = async (
    draftId: number,
    cashflowId: number,
    accountId: number,
  ): Promise<void | Error> =>
    await basicApiCallEx(
      api.accountsCashflowDraftDestroy,
      accountId,
      cashflowId.toString(),
      draftId,
    );

  const deleteInstallmentAsync = async (
    installment_id: number,
  ): Promise<void | Error> =>
    await basicApiCallEx(api.installmentsDestroy, installment_id);

  const getCashflowAsync = async (
    cashflowId: number,
  ): Promise<PangeaCashflow | Error> =>
    await basicApiCallEx(api.cashflowsRetrieve, cashflowId);

  const getInstallmentDataAsync = async (
    installmentId: number,
    useDrafts = false,
  ): Promise<Nullable<Installment>> => {
    try {
      const cashflows = await loadAllPages(
        api.cashflowsList,
        {
          installment: installmentId,
          status__in: ['active', 'pending_activation'],
        },
        axiosRequestParams.noencode_commaarray,
      );
      const allCashflows: Cashflow[] = [];
      const cashflow_draft_ids: number[] = [];

      if (cashflows && cashflows.length > 0) {
        cashflows
          .map((c) => Cashflow.fromCashflowObject(c))
          .forEach((c) => {
            if (useDrafts) {
              // If the cash flow already has a child draft on it, use it.
              if (c.childDraft) {
                cashflow_draft_ids.push(c.childDraft.id);
                allCashflows.push(Cashflow.fromDraftObject(c.childDraft));
                return;
              }
            }

            // we're not using drafts or the cashflow doesn't have a draft, so just push it.
            allCashflows.push(c);
          });
      }

      if (useDrafts) {
        const drafts = await loadAllPages(api.draftsList, {
          installment: installmentId,
        });

        if (
          drafts &&
          drafts.length > 0 &&
          drafts.find((d) => d.installment_id == installmentId)
        ) {
          drafts
            .filter(
              (d) =>
                d.installment_id == installmentId && // ensure the draft is in this installment
                !cashflow_draft_ids.includes(d.id), // we may already have this guy in a draft object from above.
            )
            .map((d) => Cashflow.fromDraftObject(d))
            .forEach((c) => allCashflows.push(c));
        }
      }
      return Installment.fromCashflows(allCashflows);
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const loadAllDraftsAsync = async (
    maxResults = Infinity,
    modifiedSince?: Date,
  ): Promise<PangeaDraftCashflow[]> =>
    await loadAllPages(api.draftsList, {
      maxResults,
      modified__gt: modifiedSince,
    } as PangeaDraftsListParams);

  const inviteUsersAsync = async (
    email: string,
    group: PangeaGroupEnum,
  ): Promise<PangeaInviteResponse | Error> =>
    await basicApiCallEx(api.inviteCreate, { email, group });

  const updateWalletAsync = async (
    id: string,
    query: PangeaWalletUpdate,
  ): Promise<PangeaWallet | Error> =>
    await basicApiCallEx(api.settlementWalletUpdate, id, query);

  const inviteConfirmAsync = async (
    data: PangeaSetUserPassword,
  ): Promise<PangeaInviteResponse | Error> =>
    await basicApiCallEx(api.inviteConfirmCreate, data);

  const inviteVerifyTokenAsync = async (
    token: PangeaInviteVerifyTokenRetrieveParams,
  ): Promise<PangeaInviteTokenResponse | Error> =>
    await basicApiCallEx(api.inviteVerifyTokenRetrieve, token);

  const loadMarginHealthAsync = async (
    data_obj: PangeaMarginHealthRequest,
  ): Promise<PangeaMarginHealthResponse | Error> =>
    await basicApiCallEx(api.riskMarginHealthCreate, data_obj);

  const loadMarginsAndFeesAsync = async (
    data_obj: PangeaMarginAndFeeRequest,
    cancelToken?: CancelToken,
  ): Promise<PangeaMarginAndFeesResponse | Error> =>
    await cacheableApiCallAsync(
      'riskMarginAndFeesCreate',
      api.riskMarginAndFeesCreate,
      data_obj,
      {
        cancelToken,
      },
    );
  const autopilotForwardFeesAsync = async (
    data: PangeaHedgeForwardWhatIfRetrieveParams,
  ): Promise<PangeaWhatIf | Error> =>
    await basicApiCallEx(api.hedgeForwardWhatIfRetrieve, data);
  const createUserAsync = async (
    user_data: PangeaUserCreation,
  ): Promise<PangeaUser | Error> =>
    await basicApiCallEx(api.userCreate, user_data);

  const getUserExistsStatusAsync = async (
    email: string,
  ): Promise<PangeaUserEmailExistsResponse | Error> =>
    await basicApiCallEx(api.userExistsRetrieve, {
      email,
    } as PangeaUserExistsRetrieveParams);

  const loadHistoryAccountActivityAsync = async (): Promise<
    PangeaActivity[] | Error
  > => await loadAllPages(api.historyActivitiesList);

  const loadHistoryFeesPaymentsAsync = async (): Promise<
    PangeaFeesPayments[] | Error
  > => await loadAllPages(api.historyFeesPaymentsList);

  const updateUserAsync = async (
    query: PangeaUserUpdate,
    id: number,
  ): Promise<PangeaUser | Error> =>
    await basicApiCallEx(api.userUpdate, id ?? 0, query);

  const updatePartialUserAsync = async (
    updates: PangeaPatchedUserUpdate,
    id: number,
  ): Promise<PangeaUser | Error> =>
    await basicApiCallEx(api.userPartialUpdate, id, updates);

  const updateCompanyAsync = async (
    query: PangeaCompany,
    id: number,
  ): Promise<PangeaCompany | Error> =>
    await basicApiCallEx(api.companyUpdate, id ?? 0, query);

  const loadBankingHistoryStatementsAsync = async (): Promise<
    PangeaBankStatement[] | Error
  > => await loadAllPages(api.historyBankStatementsList);

  const loadTradesHistory = async (): Promise<PangeaTrade[] | Error> =>
    await loadAllPages(api.historyTradesList);

  const updateUserNotificationsAsync = async (
    data: PangeaUserNotificationBulkCreateUpdate[],
  ): Promise<PangeaUserNotificationBulkCreateUpdate[] | Error> =>
    await basicApiCallEx(api.notificationUserBulkCreateUpdateUpdate, data);

  const createDepositFundsPostAsync = async (
    data: PangeaDepositRequest,
  ): Promise<PangeaIBFBResponse | Error> =>
    await basicApiCallEx(api.brokerIbFbDepositFundsCreate, data);

  const createNewInstallmentAsync = async (
    name: string,
  ): Promise<PangeaInstallment | Error> =>
    await basicApiCallEx(api.installmentsCreate, {
      installment_name: name,
    } as PangeaInstallment);

  const getInstallmentByIdAsync = async (
    id: number,
  ): Promise<PangeaInstallment | Error> =>
    await basicApiCallEx(api.installmentsRetrieve, id);

  const getInstallmentsAsync = async (): Promise<PangeaInstallment[]> => {
    try {
      const installments = await loadAllPages(api.installmentsList);
      return installments;
    } catch (e) {
      console.log(e);
    }
    return [];
  };

  const saveInstallmentAsync = async (
    installment: PangeaInstallment,
  ): Promise<PangeaInstallment | Error> =>
    basicApiCallEx(api.installmentsUpdate, installment.id ?? 0, installment);

  const getStripeSetupIntentAsync = async (): Promise<
    PangeaStripeSetupIntent | Error
  > => await basicApiCallEx(api.paymentsStripeSetupIntentRetrieve);

  const getNewStripeSetupIntentAsync = async (): Promise<
    PangeaStripeSetupIntent | Error
  > => await basicApiCallEx(api.paymentsStripeSetupIntentCreate);

  const getStripePaymentMethodInfoAsync = async (
    payment_method_id: string,
  ): Promise<PangeaStripePaymentMethodResponse | Error> =>
    await basicApiCallEx(api.paymentsStripePaymentMethodCreate, {
      payment_method_id,
    });

  const setTwoFactorAuthAsync = async (
    method: string,
    params: RequestParams,
  ): Promise<
    | PangeaMFAMethodDetailsResponse
    | PangeaMFAMethodActivationErrorResponse
    | Error
  > => await basicApiCallEx(api.authActivateCreate, method, params);

  const activateTwoFactorAuthAsync = async (
    method: string,
    params: PangeaMFAMethodCodeRequest,
  ): Promise<PangeaMFAMethodBackupCodeSuccessResponse | Error> =>
    await basicApiCallEx(api.authActivateConfirmCreate, method, params);

  const authLoginCodeCreateAsync = async (
    data: PangeaMFASecondStepJWTRequest,
    params: RequestParams,
  ): Promise<PangeaMFAJWTAccessRefreshResponse | Error> =>
    await basicApiCallEx(api.authLoginCodeCreate, data, params);

  const authLoginCreateAsync = async (
    data: PangeaMFAFirstStepJWTRequest,
    params: RequestParams,
  ): Promise<PangeaMFAFirstStepJWTSuccess | Error> =>
    await basicApiCallEx(api.authLoginCreate, data, params);

  const getUserAuthActiveMethodsAsync = async (): Promise<
    PangeaMFAActiveUserMethod[] | Error
  > => await basicApiCallEx(api.authMfaUserActiveMethodsList);

  const authDeactivateCreateAsync = async (
    method: string,
    data: PangeaMFAMethodCodeRequest,
  ): Promise<void | Error> =>
    await basicApiCallEx(api.authDeactivateCreate, method, data);

  const setPasswordAsync = async (
    old_password: string,
    new_password: string,
  ): Promise<PangeaActionStatus | Error> =>
    await basicApiCallEx(api.passwordChangePasswordUpdate, {
      old_password,
      new_password,
    } as PangeaChangePassword);

  const resetPasswordAsync = async (
    password: string,
    token: string,
  ): Promise<Error | PangeaPasswordToken> =>
    await basicApiCallEx(api.passwordPasswordResetConfirmCreate, {
      password,
      token,
    } as PangeaPasswordToken);

  const forgotPasswordAsync = async (
    email: string,
  ): Promise<Error | PangeaEmail> =>
    await basicApiCallEx(api.passwordPasswordResetCreate, { email });

  const getAllCashflowsByQueryAsync = async (
    query: PangeaCashflowsListParams,
  ): Promise<Cashflow[]> => {
    try {
      const cashflows = await loadAllPages<PangeaCashflow>(
        api.cashflowsList,
        query,
        axiosRequestParams.noencode_commaarray,
      );
      return cashflows.map((c) => Cashflow.fromCashflowObject(c));
    } catch (e) {
      console.log(e);
    }
    return [];
  };

  const loadAllCompanyContactOrdersAsync = async (
    query: PangeaCompanyContactOrderListParams,
  ): Promise<PangeaCompanyContactOrder[]> =>
    await loadAllPages(api.companyContactOrderList, query, {});

  const updateContactOrder = async (
    companyId: number,
    query: PangeaCompanyContactOrderRequest,
    params: any,
  ): Promise<PangeaActionStatus> => {
    const updateAction = await api.companyContactOrderCreate(
      companyId,
      query,
      params,
    );
    return updateAction.data;
  };

  const loadAllContactsAsync = async (
    companyId: number,
  ): Promise<PangeaUser[] | Error> =>
    await basicApiCallEx(api.companyUserList, companyId);

  const sendCashflowUpdateMessageAsync = async (
    type: PangeaUpdateRequestTypeEnum,
    request_details: string,
    user: number,
  ): Promise<Error | PangeaActionStatus> =>
    await basicApiCallEx(api.hedgeForwardUpdateRequestCreate, {
      type,
      request_details,
      user,
    });

  const sendSupportMessageAsync = async (
    subject: string,
    message: string,
  ): Promise<Error | PangeaActionStatus> =>
    await basicApiCallEx(api.supportMessageCreate, {
      subject,
      message,
    } as PangeaSendAuthenticatedSupportMessage);

  const sendGeneralSupportMessageAsync = async (
    firstname: string,
    lastname: string,
    subject: string,
    message: string,
    email: string,
    phone: string,
  ): Promise<Error | PangeaActionStatus> =>
    basicApiCallEx(api.supportGeneralMessageCreate, {
      firstname,
      lastname,
      subject,
      message,
      email,
      phone,
    } as PangeaSendGeneralSupportMessage);

  const loadCashFlowWeightData = async (
    query: PangeaCashFlowWeightRequest,
  ): Promise<PangeaCashFlowWeightResponse | Error> =>
    await basicApiCallEx(api.historyCashflowWeightCreate, query);

  const getAccountsAsync = async (): Promise<Error | PangeaAccount[]> => {
    return await basicApiCallEx(api.accountsList);
  };

  const getPerformanceTrackingAsync = async (
    query: PangeaAccountPnLRequest,
  ): Promise<PangeaAccountPnLResponse | Error> =>
    await basicApiCallEx(api.historyAccountPnlsCreate, query);

  const getPerformanceDataAsync = async (): Promise<
    Error | IAccountPerfData
  > => {
    const convertToChartData = (
      val: PangeaPerformanceResponse,
      fwd: PangeaCashflowAbsForwardResponse,
      vol: PangeaRealizedVolatilityResponse,
    ): IAccountPerfChartData => {
      const h0 = ((val.hedged?.length ?? 0) > 0 ? val.hedged[0] : 0) + 2e-10;
      const u0 =
        ((val.unhedged?.length ?? 0) > 0 ? val.unhedged[0] : 0) + 2e-10;
      const p0 = ((val.pnl?.length ?? 0) > 0 ? val.pnl[0] : 0) + 2e-10;
      const c0 =
        ((val.num_cashflows?.length ?? 0) > 0 ? val.num_cashflows[0] : 0) +
        2e-10;
      const f0 =
        ((fwd.cashflow_abs_fwd?.length ?? 0) > 0
          ? fwd.cashflow_abs_fwd[0]
          : 0) + 2e-10;
      const v0 =
        ((vol.hedged_realized_vol?.length ?? 0) > 0
          ? vol.hedged_realized_vol[0]
          : 0) + 2e-10;
      const hedgedData = val.times.map((t, i) => ({
        date: new Date(t),
        amount: val.hedged[i],
        percentage: bound((val.hedged[i] - h0) / h0, -1, 1),
      }));
      const unhedgedData = val.times.map((t, i) => ({
        date: new Date(t),
        amount: val.unhedged[i],
        percentage: bound(Math.trunc(val.unhedged[i] - u0) / u0, -1, 1),
      }));
      const cashflows = val.times.map((t, i) => ({
        date: new Date(t),
        amount: val.num_cashflows[i],
        percentage: bound(Math.trunc(val.num_cashflows[i] - c0) / c0, -1, 1),
      }));
      const unrealizedPNLData = val.times.map((t, i) => ({
        date: new Date(t),
        amount: val.pnl[i],
        percentage: bound(Math.trunc(val.pnl[i] - p0) / p0, -1, 1),
      }));
      const forwardData = fwd.times.map((t, i) => ({
        date: new Date(t),
        amount: fwd.cashflow_abs_fwd[i],
        percentage: bound(Math.trunc(fwd.cashflow_abs_fwd[i] - f0) / f0, -1, 1),
      }));
      const volatility = vol.times.map((t, i) => ({
        date: new Date(t),
        amount: 1 - vol.hedged_realized_vol[i] / vol.unhedged_realized_vol[i],
        percentage: bound(
          Math.trunc(vol.hedged_realized_vol[i] - v0) / v0,
          -1,
          1,
        ),
      }));
      return {
        hedgedData,
        unhedgedData,
        cashflows,
        unrealizedPNLData,
        forwardData,
        volatility,
      } as IAccountPerfChartData;
    };
    const end_date = serializeDateTime(
      standardizeDate(addDays(new Date(), 1)),
    )?.split('T')[0];
    const start_date = serializeDateTime(
      standardizeDate(addDays(new Date(), -30)),
    )?.split('T')[0];
    const compDataRequest = {
      is_live: true,
      start_date,
      end_date,
    };
    const [companyData, compFwdData, compRealVol] = await Promise.all([
      basicApiCallEx(api.historyPerformanceCreate, compDataRequest),
      basicApiCallEx(api.historyCashflowAbsForwardCreate, compDataRequest),
      basicApiCallEx(api.historyRealizedVolatilityCreate, compDataRequest),
    ]);
    if (isError(companyData)) {
      return companyData;
    }
    if (isError(compFwdData)) {
      return compFwdData;
    }
    if (isError(compRealVol)) {
      return compRealVol;
    }
    let returnObj: IAccountPerfData = {
      [-1]: convertToChartData(companyData, compFwdData, compRealVol),
    };
    const accounts = await getAccountsAsync();
    if (isError(accounts)) {
      return returnObj;
    }
    const accountData = await Promise.all(
      accounts.map(async (a) => {
        const acctPerfRequest = {
          account_id: a.id,
          end_date,
          start_date,
        };
        const [accountPerf, acctFwds, acctVol] = await Promise.all([
          basicApiCallEx(api.historyPerformanceCreate, acctPerfRequest),
          basicApiCallEx(api.historyCashflowAbsForwardCreate, acctPerfRequest),
          basicApiCallEx(api.historyRealizedVolatilityCreate, acctPerfRequest),
        ]);
        if (isError(accountPerf) || isError(acctFwds) || isError(acctVol)) {
          console.error({ acctVol, acctFwds, accountPerf });
          return null;
        }
        try {
          return {
            [a.id]: convertToChartData(accountPerf, acctFwds, acctVol),
          } as IAccountPerfData;
        } catch (e) {
          console.error(e);
        }
        return null;
      }),
    );
    accountData
      .filter((res) => !!res)
      .forEach((res) => {
        returnObj = merge(returnObj, res as IAccountPerfData);
      });
    return returnObj;
  };
  const getCashflowFwdsAsync = async (
    accountId?: number,
    start_date?: Date,
    end_date?: Date,
  ) => {
    const data: PangeaCashflowAbsForwardRequest = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      start_date: serializeDateTime(
        standardizeDate(start_date ?? addDays(new Date(), -30)),
      )!.split('T')[0],
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      end_date: serializeDateTime(
        standardizeDate(end_date ?? addDays(new Date(), 1)),
      )!.split('T')[0],
    };
    if (accountId) {
      data.account_id = accountId;
    } else {
      data.is_live = true;
    }
    return await basicApiCallEx(api.historyCashflowAbsForwardCreate, data);
  };

  const getHedgePolicyAsync = async (
    account_id: number,
  ): Promise<PangeaHedgeSettings | Error> =>
    await basicApiCallEx(api.accountsGetHedgePolicyRetrieve, account_id);

  const setHedgePolicyAsync = async (
    account_id: number,
    data: number | PangeaHedgePolicyForAccountView,
  ): Promise<PangeaHedgeSettings | Error> => {
    let policy: PangeaHedgePolicyForAccountView;
    if (isNumber(data)) {
      policy = {
        method: PangeaHedgePolicyForAccountViewMethodEnum.NO_HEDGE,
        margin_budget: 2e10,
        max_horizon: 7300,
        custom: {
          vol_target_reduction: data,
        },
      } as PangeaHedgePolicyForAccountView;
    } else {
      policy = data as PangeaHedgePolicyForAccountView;
    }
    return await basicApiCallEx(
      api.accountsSetHedgePolicyCreate,
      account_id,
      policy,
    );
  };

  const getMatchingCustomAccountForHedgeSettings = async (
    risk_reduction: number,
  ): Promise<number | Error> => {
    const accountsListResponse = await basicApiCallEx(api.accountsList);
    if (isError(accountsListResponse)) {
      return accountsListResponse;
    }
    const customAccounts = accountsListResponse.filter(
      (a) =>
        a.is_active &&
        a.type === 'Live' &&
        a.name.toLowerCase().startsWith('custom'),
    );
    const matchingAccount = await customAccounts.findAsync(async (a) => {
      const hedgeSettings = await getHedgePolicyAsync(a.id);
      if (isError(hedgeSettings)) {
        return false;
      }

      return hedgeSettings.custom.vol_target_reduction === risk_reduction;
    });

    if (!isUndefined(matchingAccount)) {
      return matchingAccount.id;
    }

    return NaN;
  };

  const ensureMatchingCustomAccountForHedgeSettings = async (
    risk_reduction: number,
  ): Promise<number | Error> => {
    const existingMatchingAccount =
      await getMatchingCustomAccountForHedgeSettings(risk_reduction);
    if (isError(existingMatchingAccount) || existingMatchingAccount >= 1) {
      return existingMatchingAccount;
    }

    const newAccount = await createAccountAsync(
      `custom ${risk_reduction}`,
      risk_reduction,
    );
    return isError(newAccount) ? newAccount : newAccount.id;
  };

  const createAccountAsync = async (
    account_name: string,
    risk_reduction: number,
  ): Promise<Error | PangeaAccount> => {
    const newAccount = await basicApiCallEx(api.accountsCreate, {
      account_name,
      account_type: 'Live',
      is_active: true,
    } as PangeaCreateAccountForCompanyView);
    if (isError(newAccount)) {
      return newAccount;
    }
    const setHedgeSettingsResponse = await setHedgePolicyAsync(
      newAccount.id,
      risk_reduction,
    );
    if (isError(setHedgeSettingsResponse)) {
      return setHedgeSettingsResponse;
    }

    return newAccount;
  };

  const getRegistrationTasksAsync = async (
    data: PangeaBrokerIbEcaRegistrationTasksRetrieveParams,
  ): Promise<PangeaRegistrationTasksResponse | Error> =>
    await basicApiCallEx(api.brokerIbEcaRegistrationTasksRetrieve, data);

  const submitIbAccountApplicationAsync = async (
    data: PangeaIBApplications,
  ): Promise<any | Error> =>
    await basicApiCallEx(api.brokerIbEcaApplicationCreate, data);

  const getSsoUrlAsync = async (
    credential: string,
    ip: string,
    action?: PangeaCreateECASSOActionEnum,
  ): Promise<PangeaCreateECASSOResponse | Error> =>
    await basicApiCallEx(api.brokerIbEcaSsoUrlCreate, {
      credential,
      ip,
      action,
    } as PangeaCreateECASSO);

  const getCompanyCurrenciesAsync = async (
    companyId: number,
  ): Promise<Error | PangeaCurrency[]> =>
    await basicApiCallEx(api.companyCurrenciesList, companyId.toString());

  const resendVerifyEmailAsync = async (email: string) =>
    basicApiCallEx(api.notificationResendCreate, {
      email,
      template: PangeaTemplateEnum.UserActivation,
    } as PangeaResendNotificationRequest);

  const activateUserAsync = async (
    token: string,
  ): Promise<Error | PangeaActivateUserResponse> =>
    basicApiCallEx(api.userActivateRetrieve, {
      token,
    } as PangeaUserActivateRetrieveParams);

  const createCompanyAsync = async (
    name: string,
  ): Promise<Error | PangeaCompany> =>
    basicApiCallEx(api.companyCreate, {
      currency: 'USD',
      name: name.trim(),
    } as PangeaCreateCompany);

  const findCompanyAsync = async (
    ein: string,
  ): Promise<Error | PangeaCompany> =>
    basicApiCallEx(api.companyEinCreate, {
      ein,
    } as PangeaGetCompanyByEINRequest);
  const joinCompanyAsync = async (
    company_id: number,
  ): Promise<Error | PangeaCompanyJoinRequest> =>
    basicApiCallEx(api.companyJoinRequestCreate, company_id, { company_id });
  const getJoinRequestsAsync = async (companyPk: number) =>
    loadAllPages(api.companyJoinRequestList, {
      companyPk,
    } as PangeaCompanyJoinRequestListParams);

  const approveJoinRequestAsync = async (
    id: number,
    companyPk: number,
  ): Promise<PangeaCompanyJoinRequest | Error> =>
    basicApiCallEx(api.companyJoinRequestApproveCreate, companyPk, id, {
      company_join_request_id: id,
    } as PangeaApproveCompanyJoinRequest);
  const declineJoinRequestAsync = async (
    id: number,
    companyPk: number,
  ): Promise<PangeaCompanyJoinRequest | Error> =>
    basicApiCallEx(api.companyJoinRequestRejectCreate, companyPk, id, {
      company_join_request_id: id,
    } as PangeaApproveCompanyJoinRequest);
  const sendOtcToPhoneAsync = async (
    phone: string,
  ): Promise<Error | PangeaStatusResponse> =>
    await basicApiCallEx(api.userPhoneConfirmCreate, {
      phone,
    } as PangeaUserConfirmPhone);
  const confirmOtcAsync = async (
    otp_code: string,
  ): Promise<Error | PangeaStatusResponse> =>
    basicApiCallEx(api.userPhoneVerifyOtpCreate, {
      otp_code,
    } as PangeaUserVerifyPhoneOTP);
  const getAllWireInstructionsAsync = async (currency: string) =>
    loadAllPages(api.brokerIbFbWireInstructionsList, currency);
  const updatePartialCompanyAsync = async (compObj: PangeaPatchedCompany) =>
    await basicApiCallEx(api.companyPartialUpdate, compObj.id, compObj);

  const linkWithdrawalAccountAsync = async (
    query: PangeaPredefinedDestinationInstructionRequest,
  ): Promise<PangeaFundingRequest | Error> =>
    await basicApiCallEx(
      api.brokerIbFbPredefinedDestinationInstructionCreate,
      query,
    );

  const updateUserPermissionsAsync = async (
    id: number,
    group: PangeaUpdateUserPermissionGroup,
  ): Promise<PangeaUser | Error> =>
    await basicApiCallEx(api.userPermissionUpdate, id, group);

  const removeUserCompanyAsync = async (
    id: number,
  ): Promise<PangeaUser | Error> =>
    await basicApiCallEx(api.userRemoveUpdate, id);

  const getWalletsAsync = async (): Promise<
    PangeaFXBalanceAccountsResponse | Error
  > => await basicApiCallEx(api.brokerCorpayFxBalanceAccountsRetrieve);

  const getWalletDetailsAsync = async (
    query: PangeaBrokerCorpayFxBalanceHistoryListParams,
  ): Promise<PangeaPaginatedFXBalanceAccountHistoryRowList | Error> =>
    await basicApiCallEx(api.brokerCorpayFxBalanceHistoryList, query);

  const getAllWalletsActivityData = async (
    query: PangeaBrokerCorpayFxBalanceCompanyListParams,
  ): Promise<PangeaPaginatedCompanyFXBalanceAccountHistoryList | Error> =>
    await basicApiCallEx(api.brokerCorpayFxBalanceCompanyList, query);

  const getCorpaySpotRate = async (
    query: PangeaSpotRateRequest,
  ): Promise<PangeaSpotRateResponse | Error> =>
    await basicApiCallEx(api.brokerCorpaySpotRateCreate, query);
  const getMarketSpotRate = async (
    query: PangeaInitialMarketStateRequest,
  ): Promise<PangeaInitialMarketStateResponse | Error> =>
    await basicApiCallEx(api.marketdataInitialStateCreate, query);

  const instructFxTransferAsync = async (
    query: PangeaBookInstructDealRequest,
  ): Promise<PangeaInstructDealResponse | Error> =>
    await basicApiCallEx(api.brokerCorpaySpotBookInstructDealCreate, query);

  const saveInstructDealAsync = async (
    query: PangeaSaveInstructRequest,
  ): Promise<PangeaSaveInstructRequestResponse | Error> =>
    await basicApiCallEx(
      api.brokerCorpaySpotSaveInstructDealRequestCreate,
      query,
    );

  const oemsOrderAsync = async (
    query: PangeaQuoteToTicketRequest,
  ): Promise<PangeaTicket | Error> =>
    await basicApiCallEx(api.oemsQuoteToTicketCreate, query);

  const oemsOrderQuoteAsync = async (
    query: PangeaCreateQuoteRequest,
  ): Promise<PangeaQuoteResponse | Error> =>
    await basicApiCallEx(api.oemsOrderQuoteCreate, query);

  const oemsWaitConditionCreateAsync = async (
    query: PangeaWaitCondition,
  ): Promise<PangeaWaitCondition | Error> =>
    await basicApiCallEx(api.oemsWaitConditionCreate, query);

  const getAllSettlementAccountsAsync = async (): Promise<
    PangeaSettlementAccountsResponse | Error
  > => await basicApiCallEx(api.brokerCorpaySettlementAccountsRetrieve);

  const getAllPaymentPurposesAsync = async (
    query: PangeaBrokerCorpaySpotPurposeOfPaymentRetrieveParams,
  ): Promise<PangeaPurposeOfPaymentResponse | Error> =>
    await basicApiCallEx(api.brokerCorpaySpotPurposeOfPaymentRetrieve, query);

  const getAllCorPayWithdrawalAccountsAsync = async (
    query: PangeaBrokerCorpayBeneficiariesRetrieveParams,
  ): Promise<PangeaListBeneficiaryResponse | Error> =>
    await basicApiCallEx(api.brokerCorpayBeneficiariesRetrieve, query);
  const getAllCorPayBeneficiaryAccountsAsync = async (): Promise<
    PangeaListBeneficiaryResponse | Error
  > => await basicApiCallEx(api.brokerCorpayBeneficiariesRetrieve);

  const brokerCorpayBeneficiaryCreateAsync = async (
    data: PangeaBeneficiaryRequest,
  ): Promise<PangeaBeneficiaryResponse | Error> =>
    await basicApiCallEx(api.brokerCorpayBeneficiaryCreate, data);

  const validateIbanAsync = async (
    data: PangeaIbanValidationRequest,
  ): Promise<PangeaIbanValidationResponse | Error> =>
    await basicApiCallEx(api.brokerCorpayBeneficiaryIbanValidationCreate, data);

  const beneficiaryBankSearchAsync = async (
    query: PangeaBrokerCorpayBeneficiaryBanksRetrieveParams,
  ): Promise<PangeaListBankResponse | Error> =>
    await basicApiCallEx(api.brokerCorpayBeneficiaryBanksRetrieve, query);

  const getCorpayBeneficiaryDetailsAsync = async (
    query: PangeaBrokerCorpayBeneficiaryRetrieveParams,
  ): Promise<PangeaRetrieveBeneficiaryResponse | Error> =>
    await basicApiCallEx(api.brokerCorpayBeneficiaryRetrieve, query);

  const deleteCorpayBeneficiaryAsync = async (
    query: PangeaBrokerCorpayBeneficiaryDestroyParams,
  ): Promise<PangeaDeleteBeneficiaryResponse | Error> =>
    await basicApiCallEx(api.brokerCorpayBeneficiaryDestroy, query);

  const getAllCorPayBeneficiaryRulesAsync = async (
    query?: PangeaBrokerCorpayBeneficiaryRulesRetrieveParams,
  ): Promise<PangeaBeneficiaryRulesResponse | Error> =>
    await basicApiCallEx(api.brokerCorpayBeneficiaryRulesRetrieve, query);

  const getProxyDataAsync = async (
    query: PangeaProxyRequest,
  ): Promise<PangeaProxy | Error> =>
    await basicApiCallEx(api.brokerCorpayProxyCreate, query);

  const getAllHedgeListDataAsync = async (
    query: PangeaHedgeForwardListParams,
  ): Promise<PangeaPaginatedDraftFxForwardList | Error> =>
    await basicApiCallEx(api.hedgeForwardList, query);
  const brokerCorpayCurrencyDefinitionListAsync = async (
    query: PangeaBrokerCorpayCurrencyDefinitionListParams,
  ): Promise<PangeaPaginatedCurrencyDefinitionList | Error> =>
    await basicApiCallEx(api.brokerCorpayCurrencyDefinitionList, query);
  const corPayHedgeForwardCreateAsync = async (
    query: PangeaDraftFxForward,
  ): Promise<PangeaDraftFxForward | Error> =>
    await basicApiCallEx(api.hedgeForwardCreate, query);

  const corPayHedgeForwardupdateAsync = async (
    id: number,
    data: PangeaDraftFxForward,
  ): Promise<PangeaDraftFxForward | Error> =>
    await basicApiCallEx(api.hedgeForwardUpdate, id, data);

  const corPayHedgeForwardPartialupdateAsync = async (
    id: number,
    data: PangeaPatchedDraftFxForward,
  ): Promise<PangeaPatchedDraftFxForward | Error> =>
    await basicApiCallEx(api.hedgeForwardPartialUpdate, id, data);

  const corPayHedgeForwardDeleteAsync = async (id: number) =>
    await basicApiCallEx(api.hedgeForwardDestroy, id);

  const corPayHedgeForwardActivateAsync = async (
    id: number,
  ): Promise<PangeaDraftFxForward | Error> =>
    await basicApiCallEx(api.hedgeForwardActivateUpdate, id);

  const getHedgeForwardByIdAsync = async (
    id: number,
  ): Promise<PangeaDraftFxForward | Error> =>
    await basicApiCallEx(api.hedgeForwardRetrieve, id);
  const hadgeParachuteCreateAsync = async (
    accountPk: number,
    query: PangeaParachuteDataRequest,
  ): Promise<PangeaParachuteData | Error> =>
    await basicApiCallEx(api.accountsParachuteDataCreate, accountPk, query);
  const hadgeParachuteUpdateAsync = async (
    accountPk: number,
    id: number,
    data: PangeaParachuteData,
  ): Promise<PangeaParachuteData | Error> =>
    await basicApiCallEx(api.accountsParachuteDataUpdate, accountPk, id, data);
  const hedgeAutopilotCreateAsync = async (
    accountPk: number,
    query: PangeaAutopilotDataRequest,
  ): Promise<PangeaAutopilotData | Error> =>
    await basicApiCallEx(api.accountsAutopilotDataCreate, accountPk, query);
  const hedgeAutopilotUpdateAsync = async (
    accountPk: number,
    id: number,
    data: PangeaAutopilotData,
  ): Promise<PangeaAutopilotData | Error> =>
    await basicApiCallEx(api.accountsAutopilotDataUpdate, accountPk, id, data);
  const getMarginAndCreditHealthAsync = async (): Promise<
    PangeaAutopilotMarginHealthResponse | Error
  > => await basicApiCallEx(api.hedgeMarginHealthRetrieve);
  // const getAllExecutionTimingOptionsAsync = async (
  //   data: PangeaExecutionTimingTimelineOptionsRequest,
  // ): Promise<PangeaExecutionTimingTimelineOptionsResponse | Error> =>
  //   await basicApiCallEx(api.aiExecutionTimingCreate, data);
  const getPaymentsExecutionTimingOptionsAsync = async (
    paymentId: number,
  ): Promise<PangeaBestExecutionTiming | Error> =>
    await basicApiCallEx(api.oemsBestExecutionTimingRetrieve, paymentId);
  const getPaymentRfq = async (
    id: string,
  ): Promise<PangeaDetailedPaymentRfqResponse | Error> =>
    await basicApiCallEx(api.paymentsRfqRetrieve, id);

  const getCorpayPaymentQuoteAsync = async (
    data: PangeaQuotePayment,
  ): Promise<PangeaQuotePaymentResponse | Error> =>
    await basicApiCallEx(api.brokerCorpayPaymentQuoteCreate, data);

  const getAllTransactionsAsync = async (
    maxResults = Infinity,
    status?: PangeaCashflowStatusEnum,
    modifiedSince?: Date,
  ): Promise<PangeaPayment[] | Error> => {
    try {
      const transactionsResponse = await loadAllPages(api.paymentsList, {
        maxResults,
        status__iexact: status ? status.toString() : undefined,
        modified__gt: modifiedSince?.toISOString(),
      } as PangeaPaymentsListParams);
      return transactionsResponse;
    } catch (e) {
      console.debug('error getting all transactions', e);
      return [];
    }
  };

  const getTransactionByIdAsync = async (
    id: number,
  ): Promise<PangeaPayment | Error> =>
    await basicApiCallEx(api.paymentsRetrieve, id);

  const createPaymentAsync = async (
    data: PangeaPayment,
  ): Promise<PangeaPayment | Error> =>
    await basicApiCallEx(api.paymentsCreate, data);
  const updatePaymentAsync = async (
    id: string,
    data: PangeaPayment,
  ): Promise<PangeaPayment | Error> =>
    await basicApiCallEx(api.paymentsUpdate, id, data);
  const bookCorpayPaymentAsync = async (
    data: PangeaBookPaymentsRequest,
  ): Promise<PangeaBookPaymentsResponse | Error> =>
    await basicApiCallEx(api.brokerCorpayPaymentBookCreate, data);
  const getPaymentCalendarValues = async (
    data: PangeaValueDateCalendarRequest,
  ): Promise<PangeaValueDateCalendarResponse | Error> =>
    await basicApiCallEx(api.paymentsCalendarValueDateCreate, data);
  const executePayment = async (
    id: string,
  ): Promise<PangeaPaymentExecutionResponse | Error> =>
    await basicApiCallEx(api.paymentsExecuteRetrieve, id);

  const getValidCalendarValueDates = async (
    data: PangeaMultiDay,
  ): Promise<Array<string> | Error> =>
    await basicApiCallEx(api.oemsCalendarValueDatesCreate, data);

  const updatePaymentByIdAsync = async (
    id: number,
    data: PangeaPayment,
  ): Promise<PangeaPayment | Error> =>
    await basicApiCallEx(api.paymentsUpdate, id, data);

  const deletePaymentByIdAsync = async (
    id: number,
  ): Promise<PangeaPayment | Error> =>
    await basicApiCallEx(api.paymentsDestroy, id);

  const getBrokerUniverseCurrenciesAsync = async (
    data: PangeaBuySell,
  ): Promise<PangeaResponse | Error> =>
    await basicApiCallEx(api.brokerUniverseCreate, data);

  const createBulkPaymentsAsync = async (
    data: PangeaBulkPaymentRequest,
  ): Promise<PangeaBulkPaymentResponse | Error> =>
    await basicApiCallEx(api.paymentsBulkPaymentsCreate, data);

  const updateBulkPaymentsAsync = async (
    data: PangeaBulkPaymentUpdate,
  ): Promise<PangeaBulkPaymentResponse | Error> =>
    await basicApiCallEx(api.paymentsBulkPaymentsUpdate, data);

  const getBulkPaymentsRfqAsync = async (
    data: PangeaBulkPaymentRfq,
  ): Promise<PangeaBulkRfqStatus | Error> =>
    await basicApiCallEx(api.paymentsBulkPaymentsRfqCreate, data);

  const executeBulkPaymentsAsync = async (
    data: PangeaBulkPaymentExecution,
  ): Promise<PangeaBulkExecutionStatus | Error> =>
    await basicApiCallEx(api.paymentsBulkPaymentsExecutionCreate, data);

  const updatePaymentCashflowByIdAsync = async (
    cashflowId: string,
    paymentId: number,
    data: PangeaInstallmentCashflow,
  ): Promise<PangeaInstallmentCashflow | Error> =>
    await basicApiCallEx(
      api.paymentsCashflowsUpdate,
      cashflowId,
      paymentId,
      data,
    );

  const getAllUniversalBeneficiaries = async (
    query: PangeaSettlementBeneficiaryListParams,
  ): Promise<PangeaPaginatedBeneficiaryList | Error> =>
    await basicApiCallEx(api.settlementBeneficiaryList, query);

  const getAllBeneficiariesAsync = async (): Promise<
    PangeaBeneficiary[] | Error
  > => {
    try {
      const beneficiariesResponse = await loadAllPages(
        api.settlementBeneficiaryList,
        {},
      );
      return beneficiariesResponse;
    } catch (e) {
      console.debug('error getting all beneficiaries', e);
      return [];
    }
  };

  const getBeneficiaryValidationSchema = async (
    query: PangeaValidationSchemaRequest,
  ): Promise<PangeaBeneficiary | Error> =>
    await basicApiCallEx(
      api.settlementBeneficiaryValidationSchemaCreate,
      query,
    );

  const createSettlementBeneficiaryAsync = async (
    data: PangeaBeneficiary,
  ): Promise<PangeaBeneficiary | Error> =>
    await basicApiCallEx(api.settlementBeneficiaryCreate, data);

  const activateSettlementBeneficiaryAsync = async (
    data: PangeaActivateBeneficiaryRequest,
  ): Promise<PangeaMessageResponse | Error> =>
    await basicApiCallEx(api.settlementBeneficiaryActivateCreate, data);

  const deleteSettlementBeneficiaryAsync = async (
    id: string,
  ): Promise<void | Error> =>
    await basicApiCallEx(api.settlementBeneficiaryDestroy, id);

  const getSettlementBeneficiaryDetailsAsync = async (
    id: string,
  ): Promise<PangeaBeneficiary | Error> =>
    await basicApiCallEx(api.settlementBeneficiaryRetrieve, id);

  const patchSettlementBeneficiaryAsync = async (
    id: string,
    data: PangeaPatchedBeneficiary,
  ): Promise<PangeaBeneficiary | Error> =>
    await basicApiCallEx(api.settlementBeneficiaryPartialUpdate, id, data);

  const getAllSettlementWalletsAsync = async (
    params: PangeaSettlementWalletListParams,
  ): Promise<PangeaPaginatedWalletList | Error> =>
    await basicApiCallEx(api.settlementWalletList, params);

  const validateAllBulkMarketPairsAsync = async (
    data: PangeaMarketSpotDateRequest,
  ): Promise<PangeaMarketSpotDates | Error> =>
    await basicApiCallEx(api.paymentsMarketSpotDatesCreate, data);

  const submitPaymentForAuthorizationAsync = async (
    data: PangeaRequestApproval,
  ): Promise<PangeaActionStatus | Error> =>
    await basicApiCallEx(api.approvalRequestPaymentApprovalCreate, data);

  const approvePaymentAsync = async (
    data: PangeaApprovalApproveRequestRetrieveParams,
  ): Promise<PangeaActionStatus | Error> =>
    await basicApiCallEx(api.approvalApproveRequestRetrieve, data);

  return {
    getMarketSpotRate,
    getPaymentsExecutionTimingOptionsAsync,
    updatePaymentAsync,
    executePayment,
    getPaymentRfq,
    getPaymentCalendarValues,
    getValidCalendarValueDates,
    getAllUniversalBeneficiaries,
    getAllSettlementWalletsAsync,
    getAllBeneficiariesAsync,
    getBeneficiaryValidationSchema,
    getBrokerUniverseCurrenciesAsync,
    getSettlementBeneficiaryDetailsAsync,
    patchSettlementBeneficiaryAsync,
    activateSettlementBeneficiaryAsync,
    deleteSettlementBeneficiaryAsync,
    hedgeAutopilotCreateAsync,
    hedgeAutopilotUpdateAsync,
    hadgeParachuteUpdateAsync,
    hadgeParachuteCreateAsync,
    brokerCorpayCurrencyDefinitionListAsync,
    bookCorpayPaymentAsync,
    createSettlementBeneficiaryAsync,
    createBulkPaymentsAsync,
    updateBulkPaymentsAsync,
    getBulkPaymentsRfqAsync,
    executeBulkPaymentsAsync,
    sendCashflowUpdateMessageAsync,
    activateUserAsync,
    approveCashflow,
    approveJoinRequestAsync,
    beneficiaryBankSearchAsync,
    confirmOtcAsync,
    corPayHedgeForwardCreateAsync,
    corPayHedgeForwardupdateAsync,
    corPayHedgeForwardPartialupdateAsync,
    corPayHedgeForwardDeleteAsync,
    corPayHedgeForwardActivateAsync,
    createAccountAsync,
    createCompanyAsync,
    createPaymentAsync,
    createDepositFundsPostAsync,
    createNewDraftAsync,
    createNewDraftOnCashflow,
    createNewInstallmentAsync,
    createUserAsync,
    deactivateCashflowAsync,
    deleteCorpayBeneficiaryAsync,
    deactivateInstallmentAsync,
    declineJoinRequestAsync,
    deleteDraft,
    deleteDraftOnCashflow,
    deleteInstallmentAsync,
    deletePaymentByIdAsync,
    ensureMatchingCustomAccountForHedgeSettings,
    executeCashflow,
    findCompanyAsync,
    forgotPasswordAsync,
    getWalletsAsync,
    getAllCashflowsByQueryAsync,
    getAllCorPayBeneficiaryAccountsAsync,
    getAllCorPayBeneficiaryRulesAsync,
    getAllPaymentPurposesAsync,
    getAllSettlementAccountsAsync,
    getAllCorPayWithdrawalAccountsAsync,
    getAllWireInstructionsAsync,
    getCashflowAsync,
    getCashflowFwdsAsync,
    getCompanyAsync,
    getCompanyCurrenciesAsync,
    getCorpaySpotRate,
    getCorpayPaymentQuoteAsync,
    getCorpayBeneficiaryDetailsAsync,
    getCurrenciesAsync,
    getUserExistsStatusAsync,
    getHedgePolicyAsync,
    getHedgeForwardByIdAsync,
    getAllHedgeListDataAsync,
    getInstallmentByIdAsync,
    getInstallmentDataAsync,
    getInstallmentsAsync,
    getJoinRequestsAsync,
    getMarginAndCreditHealthAsync,
    getMatchingCustomAccountForHedgeSettings,
    getNewStripeSetupIntentAsync,
    getPerformanceDataAsync,
    getPerformanceTrackingAsync,
    getProxyDataAsync,
    getRegistrationTasksAsync,
    getTransactionByIdAsync,
    saveInstructDealAsync,
    oemsOrderAsync,
    oemsOrderQuoteAsync,
    oemsWaitConditionCreateAsync,
    getRiskReductionDataAsync,
    getSsoUrlAsync,
    getStandardDeviationDataAsync,
    getStripePaymentMethodInfoAsync,
    getStripeSetupIntentAsync,
    instructFxTransferAsync,
    inviteConfirmAsync,
    inviteUsersAsync,
    inviteVerifyTokenAsync,
    joinCompanyAsync,
    linkWithdrawalAccountAsync,
    loadAllAccountsAsync,
    loadAllCashflowsAsync,
    loadAllCompanyContactOrdersAsync,
    loadAllContactsAsync,
    loadAllDraftsAsync,
    loadAllNotificationEventsAsync,
    loadAllUserNotificationsAsync,
    getAllTransactionsAsync,
    loadBankingHistoryStatementsAsync,
    loadBrokerIbEcaPendingTasksAsync,
    loadCashFlowWeightData,
    loadDraftByIdAsync,
    loadFxPairsAsync,
    loadHistoryAccountActivityAsync,
    loadHistoryFeesPaymentsAsync,
    loadMarketDataAsync,
    loadMarketDataForExploreAsync,
    loadMarginHealthAsync,
    loadMarginsAndFeesAsync,
    autopilotForwardFeesAsync,
    loadTradesHistory,
    loadUserAsync,
    resendVerifyEmailAsync,
    resetPasswordAsync,
    saveDraftAsync,
    saveInstallmentAsync,
    sendOtcToPhoneAsync,
    sendSupportMessageAsync,
    sendGeneralSupportMessageAsync,
    setHedgePolicyAsync,
    setPasswordAsync,
    submitIbAccountApplicationAsync,
    submitPaymentForAuthorizationAsync,
    updateCompanyAsync,
    updateContactOrder,
    updatePartialCompanyAsync,
    updatePartialUserAsync,
    updateUserAsync,
    updateUserNotificationsAsync,
    updateUserPermissionsAsync,
    removeUserCompanyAsync,
    updatePaymentByIdAsync,
    getWalletDetailsAsync,
    getAllWalletsActivityData,
    setTwoFactorAuthAsync,
    activateTwoFactorAuthAsync,
    getUserAuthActiveMethodsAsync,
    validateIbanAsync,
    authDeactivateCreateAsync,
    authLoginCodeCreateAsync,
    authLoginCreateAsync,
    approvePaymentAsync,
    brokerCorpayBeneficiaryCreateAsync,
    updatePaymentCashflowByIdAsync,
    validateAllBulkMarketPairsAsync,
    updateWalletAsync,
  };
};
interface PaginatedResultsType<T> {
  count?: number;
  next?: Nullable<string>;
  previous?: Nullable<string>;
  results?: T[];
}

function isPaginatedResultsType<T>(
  object: unknown,
): object is PaginatedResultsType<T> {
  return (
    Object.prototype.hasOwnProperty.call(object, 'count') &&
    Object.prototype.hasOwnProperty.call(object, 'next') &&
    Object.prototype.hasOwnProperty.call(object, 'previous') &&
    Object.prototype.hasOwnProperty.call(object, 'results')
  );
}
interface PaginatedRequestParams {
  limit?: number;
  offset?: number;
  ordering?: string;
}
const _internalCallApi = async <TResponse,>(
  fn: () => Promise<AxiosResponse<TResponse>>,
): Promise<TResponse | Error> => {
  try {
    const response = await fn();
    if (response.status < 400) {
      if (process.env.NEXT_PUBLIC_TRACE_API == 'TRUE') {
        console.log(
          'API HELPER CALL ' +
            response.config.method +
            ' ' +
            response.config.url,
          {
            ...response,
            stack: new Error().stack
              ?.split('\n')
              .slice(1)
              .map((s) => s.trim()),
          },
        );
      }
      return response.data;
    }

    console.trace('API call response error:', response);
    return new Error(response.statusText);
  } catch (e) {
    console.trace('Error calling API', e);
    if (axios.isAxiosError(e)) {
      return e as AxiosError;
    }
    return new Error(`${e}`);
  }
};

const basicApiCallEx = async <TResponse,>(
  apiFn: (...args: any[]) => Promise<AxiosResponse<TResponse>>,
  ...args: any[]
): Promise<TResponse | Error> => await _internalCallApi(() => apiFn(...args));

const responseCache: Map<string, any> = new Map<string, any>();
const cacheableApiCallAsync = async <TResponse,>(
  cacheKey: string,
  apiFn: (...args: any[]) => Promise<AxiosResponse<TResponse>>,
  ...args: any[]
): Promise<TResponse | Error> => {
  const key =
    cacheKey + args
      ? JSON.stringify({ ...args }).replaceAll(/[^a-zA-Z;,\d]/g, '')
      : '';
  if (responseCache.has(key)) {
    return responseCache.get(key) as TResponse;
  }
  try {
    const resp = await basicApiCallEx(apiFn, ...args);
    if (!isError(resp)) {
      responseCache.set(key, resp);
    }
    return resp;
  } catch {
    return Error('error with LRU cache');
  }
};

async function loadAllPages<T>(
  fn: (
    query: PaginatedRequestParams & any,
    params: RequestParams,
  ) => Promise<AxiosResponse<PaginatedResultsType<T>>>,
  query: PaginatedRequestParams & any = {},
  params: RequestParams = {},
): Promise<T[]> {
  const { maxResults = Infinity, ...apiQuery } = query;
  if (!apiQuery.limit || apiQuery.limit <= 0) {
    apiQuery.limit = Math.min(100, maxResults);
  }
  let result = await basicApiCallEx(fn, apiQuery, params);
  const returnValue: T[] = new Array<T>();
  if (!isError(result) && isPaginatedResultsType<T>(result)) {
    let paginatedResult: PaginatedResultsType<T> = result;
    paginatedResult.results?.forEach((r) => returnValue.push(r));
    while (paginatedResult.next !== null && returnValue.length < maxResults) {
      const offset = parse(paginatedResult.next ?? '')['offset'];
      result = await basicApiCallEx(fn, { ...apiQuery, offset }, params);
      if (!isError(result)) {
        paginatedResult = result;
        paginatedResult.results?.forEach((r) => returnValue.push(r));
      }
    }
  }

  return returnValue;
}
