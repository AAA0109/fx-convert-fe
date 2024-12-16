/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  PangeaAccount,
  PangeaAccountPnLRequest,
  PangeaAccountPnLResponse,
  PangeaAccountsCashflowCreateParams,
  PangeaAccountsCashflowListParams,
  PangeaActionStatus,
  PangeaActivateBeneficiaryRequest,
  PangeaActivateDraftFxPosition,
  PangeaActivateUserResponse,
  PangeaActivities,
  PangeaApprovalApproveRequestRetrieveParams,
  PangeaApproveCompanyJoinRequest,
  PangeaApproverRequest,
  PangeaApproverResponse,
  PangeaAuthMfaUserActiveMethodsListParams,
  PangeaAutopilotData,
  PangeaAutopilotDataRequest,
  PangeaAutopilotMarginHealthResponse,
  PangeaAverageFxSpotPrice,
  PangeaBankStatements,
  PangeaBatchResponse,
  PangeaBeneficiary,
  PangeaBeneficiaryRequest,
  PangeaBeneficiaryResponse,
  PangeaBeneficiaryRulesResponse,
  PangeaBestExecution,
  PangeaBestExecutionTiming,
  PangeaBookDealRequest,
  PangeaBookDealResponse,
  PangeaBookInstructDealRequest,
  PangeaBookPaymentRequest,
  PangeaBookPaymentsRequest,
  PangeaBookPaymentsResponse,
  PangeaBrokerCorpayBeneficiariesRetrieveParams,
  PangeaBrokerCorpayBeneficiaryBanksRetrieveParams,
  PangeaBrokerCorpayBeneficiaryDestroyParams,
  PangeaBrokerCorpayBeneficiaryRetrieveParams,
  PangeaBrokerCorpayBeneficiaryRulesRetrieveParams,
  PangeaBrokerCorpayClientOnboardingPicklistRetrieveParams,
  PangeaBrokerCorpayCostsRetrieveParams,
  PangeaBrokerCorpayCurrencyDefinitionListParams,
  PangeaBrokerCorpayFxBalanceAccountsRetrieveParams,
  PangeaBrokerCorpayFxBalanceCompanyListParams,
  PangeaBrokerCorpayFxBalanceHistoryListParams,
  PangeaBrokerCorpayFxpairsListParams,
  PangeaBrokerCorpaySpotPurposeOfPaymentRetrieveParams,
  PangeaBrokerIbEcaAccountStatusRetrieveParams,
  PangeaBrokerIbEcaPendingTasksRetrieveParams,
  PangeaBrokerIbEcaRegistrationTasksRetrieveParams,
  PangeaBrokerIbFbFundingRequestsListParams,
  PangeaBrokerIbFbInstructionNameRetrieveParams,
  PangeaBrokerIbFbStatusRetrieveParams,
  PangeaBrokerIbFbWireInstructionsListParams,
  PangeaBulkExecutionStatus,
  PangeaBulkPaymentExecution,
  PangeaBulkPaymentRequest,
  PangeaBulkPaymentResponse,
  PangeaBulkPaymentRfq,
  PangeaBulkPaymentUpdate,
  PangeaBulkPaymentValidationErrorResponse,
  PangeaBulkRfqStatus,
  PangeaBuySell,
  PangeaCashflow,
  PangeaCashflowAbsForwardRequest,
  PangeaCashflowAbsForwardResponse,
  PangeaCashFlowActionStatus,
  PangeaCashFlowCore,
  PangeaCashFlowGenerator,
  PangeaCashflowListParams,
  PangeaCashflowNote,
  PangeaCashflowsListParams,
  PangeaCashFlowWeightRequest,
  PangeaCashFlowWeightResponse,
  PangeaChangePassword,
  PangeaCnyExecution,
  PangeaCompany,
  PangeaCompanyContactOrderListParams,
  PangeaCompanyContactOrderRequest,
  PangeaCompanyJoinRequest,
  PangeaCompanyJoinRequestListParams,
  PangeaCostResponse,
  PangeaCreateAccountForCompanyView,
  PangeaCreateCompany,
  PangeaCreateCompanyJoinRequest,
  PangeaCreateECASSO,
  PangeaCreateECASSOResponse,
  PangeaCreateQuoteRequest,
  PangeaCreditUtilization,
  PangeaCurrency,
  PangeaCurrencyDefinition,
  PangeaCurrencyDelivery,
  PangeaCurrencyDeliveryTimeListParams,
  PangeaCurrencyFxpairsListParams,
  PangeaDataproviderProfileParallelOptionRetrieveParams,
  PangeaDateRange,
  PangeaDeleteBeneficiaryResponse,
  PangeaDemoFormRequest,
  PangeaDemoResponse,
  PangeaDepositRequest,
  PangeaDetailedPaymentRfqResponse,
  PangeaDraftCashflow,
  PangeaDraftFxForward,
  PangeaDraftsListParams,
  PangeaEmail,
  PangeaError,
  PangeaExecute,
  PangeaExecuteRfq,
  PangeaExtendInvite,
  PangeaExternalMtm,
  PangeaFeesPayments,
  PangeaForwardBookQuoteRequest,
  PangeaForwardBookQuoteResponse,
  PangeaForwardCompleteOrderRequest,
  PangeaForwardCompleteOrderResponse,
  PangeaForwardQuoteRequest,
  PangeaForwardQuoteResponse,
  PangeaFundingRequest,
  PangeaFundTransaction,
  PangeaFutureContract,
  PangeaFutureIntra,
  PangeaFXBalanceAccountsResponse,
  PangeaFxCalculator,
  PangeaFxCalculatorResponse,
  PangeaFxPair,
  PangeaGetCashflowRiskCone,
  PangeaGetCashflowRiskConeResponse,
  PangeaGetCompanyByEINRequest,
  PangeaHedgeForwardListParams,
  PangeaHedgeForwardWhatIfRetrieveParams,
  PangeaHedgePolicyForAccountView,
  PangeaHedgeSettings,
  PangeaHistoricalRateRequest,
  PangeaHistoryActivitiesRetrieveParams,
  PangeaHistoryBankStatementsRetrieveParams,
  PangeaHistoryFeesPaymentsRetrieveParams,
  PangeaHistoryTradesRetrieveParams,
  PangeaIBAccountStatusRequest,
  PangeaIBAccountStatusResponse,
  PangeaIbanValidationRequest,
  PangeaIbanValidationResponse,
  PangeaIBApplications,
  PangeaIBFBResponse,
  PangeaInitialMarketStateRequest,
  PangeaInitialMarketStateResponse,
  PangeaInitialRateRequest,
  PangeaInstallment,
  PangeaInstallmentCashflow,
  PangeaInstallmentsListParams,
  PangeaInstructDealRequest,
  PangeaInstructDealResponse,
  PangeaInviteResponse,
  PangeaInviteTokenError,
  PangeaInviteTokenResponse,
  PangeaInviteVerifyTokenRetrieveParams,
  PangeaLiquidityInsightRequest,
  PangeaLiquidityInsightResponse,
  PangeaListBankResponse,
  PangeaListBeneficiaryResponse,
  PangeaManualRequest,
  PangeaMarginAndFeeRequest,
  PangeaMarginAndFeesResponse,
  PangeaMarginHealthRequest,
  PangeaMarginHealthResponse,
  PangeaMarketdataAssetIndexListParams,
  PangeaMarketdataForwardsCorpayListParams,
  PangeaMarketdataForwardsListParams,
  PangeaMarketdataFutureIntraListParams,
  PangeaMarketdataFutureLiquidHoursListParams,
  PangeaMarketdataFutureTradingHoursListParams,
  PangeaMarketdataFxPairP10ListParams,
  PangeaMarketdataSpotCorpayListParams,
  PangeaMarketdataSpotIntraAverageRetrieveParams,
  PangeaMarketdataSpotIntraListParams,
  PangeaMarketdataSpotListParams,
  PangeaMarketdataTradingCalendarListParams,
  PangeaMarketName,
  PangeaMarketsLiquidityResponse,
  PangeaMarketSpotDateRequest,
  PangeaMarketSpotDates,
  PangeaMarketVolatility,
  PangeaMessageResponse,
  PangeaMFAActiveUserMethod,
  PangeaMFAConfigViewSuccessResponse,
  PangeaMFAFirstStepJWTRequest,
  PangeaMFAFirstStepJWTSuccess,
  PangeaMFAJWTAccessRefreshResponse,
  PangeaMFAMethodActivationErrorResponse,
  PangeaMFAMethodBackupCodeSuccessResponse,
  PangeaMFAMethodCodeErrorResponse,
  PangeaMFAMethodCodeRequest,
  PangeaMFAMethodDetailsResponse,
  PangeaMFAMethodPrimaryMethodChangeRequest,
  PangeaMFAMethodRequestCodeRequest,
  PangeaMFASecondStepJWTRequest,
  PangeaMultiDay,
  PangeaNotificationEvent,
  PangeaNotificationEventsListParams,
  PangeaNotificationUserListParams,
  PangeaOemsCnyExecutionListParams,
  PangeaOemsTicketListParams,
  PangeaOnboardingFileUploadRequest,
  PangeaOnboardingFileUploadResponse,
  PangeaOnboardingPickListResponse,
  PangeaOnboardingRequest,
  PangeaOnboardingResponse,
  PangeaPaginatedBeneficiaryList,
  PangeaPaginatedCashFlowGeneratorList,
  PangeaPaginatedCashflowList,
  PangeaPaginatedCompanyContactOrderList,
  PangeaPaginatedCompanyFXBalanceAccountHistoryList,
  PangeaPaginatedCompanyJoinRequestList,
  PangeaPaginatedCorPayFxForwardList,
  PangeaPaginatedCorPayFxSpotList,
  PangeaPaginatedCurrencyDefinitionList,
  PangeaPaginatedCurrencyDeliveryList,
  PangeaPaginatedDraftCashflowList,
  PangeaPaginatedDraftFxForwardList,
  PangeaPaginatedEventGroupList,
  PangeaPaginatedEventList,
  PangeaPaginatedFundingRequestList,
  PangeaPaginatedFXBalanceAccountHistoryRowList,
  PangeaPaginatedFxForwardList,
  PangeaPaginatedFxPairList,
  PangeaPaginatedFxSpotIntraList,
  PangeaPaginatedFxSpotList,
  PangeaPaginatedIndexList,
  PangeaPaginatedInstallmentList,
  PangeaPaginatedLiquidHoursList,
  PangeaPaginatedNotificationEventList,
  PangeaPaginatedPaymentList,
  PangeaPaginatedSupportedFxPairsList,
  PangeaPaginatedTicketList,
  PangeaPaginatedTradingCalendarList,
  PangeaPaginatedTradingHoursList,
  PangeaPaginatedUserNotificationList,
  PangeaPaginatedWalletList,
  PangeaPaginatedWebhookList,
  PangeaPaginatedWireInstructionList,
  PangeaParachuteData,
  PangeaParachuteDataRequest,
  PangeaPasswordToken,
  PangeaPatchedAutopilotData,
  PangeaPatchedBeneficiary,
  PangeaPatchedCashFlowGenerator,
  PangeaPatchedCompany,
  PangeaPatchedDraftCashflow,
  PangeaPatchedDraftFxForward,
  PangeaPatchedManualRequest,
  PangeaPatchedParachuteData,
  PangeaPatchedUpdateUserPermissionGroup,
  PangeaPatchedUserNotification,
  PangeaPatchedUserUpdate,
  PangeaPatchedWallet,
  PangeaPatchedWebhook,
  PangeaPayment,
  PangeaPaymentError,
  PangeaPaymentExecutionResponse,
  PangeaPaymentsCashflowsListParams,
  PangeaPaymentsListParams,
  PangeaPaymentValidationError,
  PangeaPendingTasksResponse,
  PangeaPerformanceRequest,
  PangeaPerformanceResponse,
  PangeaPredefinedDestinationInstructionRequest,
  PangeaProfileParallelOptionResponse,
  PangeaProxy,
  PangeaProxyRequest,
  PangeaPurposeOfPaymentResponse,
  PangeaQuotePayment,
  PangeaQuotePaymentResponse,
  PangeaQuotePaymentsRequest,
  PangeaQuotePaymentsResponse,
  PangeaQuoteResponse,
  PangeaQuoteToTicketRequest,
  PangeaRateMovingAverage,
  PangeaRealizedVolatilityRequest,
  PangeaRealizedVolatilityResponse,
  PangeaRecentRateResponse,
  PangeaRecentVolResponseSerialier,
  PangeaRegistrationTasksResponse,
  PangeaRejectCompanyJoinRequest,
  PangeaReqBasicExecAction,
  PangeaRequestApproval,
  PangeaResendNotificationRequest,
  PangeaResendNotificationResponse,
  PangeaResetToken,
  PangeaResourceAlreadyExists,
  PangeaResponse,
  PangeaRetrieveBeneficiaryResponse,
  PangeaRfq,
  PangeaRiskGetCashflowRiskConesCreateParams,
  PangeaSaveInstructRequest,
  PangeaSaveInstructRequestResponse,
  PangeaSendAuthenticatedSupportMessage,
  PangeaSendGeneralSupportMessage,
  PangeaSettlementAccountsResponse,
  PangeaSettlementBeneficiaryListParams,
  PangeaSettlementWalletListParams,
  PangeaSetUserPassword,
  PangeaSingleDateTime,
  PangeaSingleDay,
  PangeaSingleDayTenor,
  PangeaSpotRateRequest,
  PangeaSpotRateResponse,
  PangeaStabilityIndex,
  PangeaStatusResponse,
  PangeaStripePaymentMethodRequest,
  PangeaStripePaymentMethodResponse,
  PangeaStripeSetupIntent,
  PangeaSupportedFxPairs,
  PangeaTicket,
  PangeaTokenObtainPair,
  PangeaTokenObtainPairResponse,
  PangeaTokenRefresh,
  PangeaTokenRefreshResponse,
  PangeaTokenVerify,
  PangeaTrades,
  PangeaUpdateNDF,
  PangeaUpdateRequest,
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
  PangeaWaitCondition,
  PangeaWallet,
  PangeaWalletUpdate,
  PangeaWebhook,
  PangeaWebhookEventGroupsListParams,
  PangeaWebhookEventsListParams,
  PangeaWebhookListParams,
  PangeaWhatIf,
  PangeaWithdrawRequest,
  Pangea_SGE,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from '../http-client';

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Endpoint for creating and staging a new FX exposure.
   *
   * @tags Cashflow
   * @name CashflowCreate
   * @summary Create Cashflow
   * @request POST:/api/v1/cashflow/
   * @secure
   */
  cashflowCreate = (
    data: PangeaCashFlowGenerator,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashFlowGenerator, any>({
      path: `/api/v1/cashflow/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for retrieving a list of all cashflows
   *
   * @tags Cashflow
   * @name CashflowList
   * @summary List Cashflows
   * @request GET:/api/v1/cashflow/
   * @secure
   */
  cashflowList = (
    query: PangeaCashflowListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedCashFlowGeneratorList, any>({
      path: `/api/v1/cashflow/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for replacing a specific, single cashflow. This can only be called on a cashflow that is in "Draft" status
   *
   * @tags Cashflow
   * @name CashflowUpdate
   * @summary Update Cashflow
   * @request PUT:/api/v1/cashflow/{cashflow_id}/
   * @secure
   */
  cashflowUpdate = (
    cashflowId: string,
    data: PangeaCashFlowGenerator,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashFlowGenerator, any>({
      path: `/api/v1/cashflow/${cashflowId}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for deleting a specific, single cashflow. This can only be called on a cashflow that is in "Draft" status
   *
   * @tags Cashflow
   * @name CashflowDestroy
   * @summary Delete Cashflow
   * @request DELETE:/api/v1/cashflow/{cashflow_id}/
   * @secure
   */
  cashflowDestroy = (cashflowId: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/cashflow/${cashflowId}/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Endpoint for retrieving a specific, single cashflow
   *
   * @tags Cashflow
   * @name CashflowRetrieve
   * @summary Retrieve Cashflow
   * @request GET:/api/v1/cashflow/{cashflow_id}/
   * @secure
   */
  cashflowRetrieve = (cashflowId: string, params: RequestParams = {}) =>
    this.request<PangeaCashFlowGenerator, any>({
      path: `/api/v1/cashflow/${cashflowId}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for updating a specific, single cashflow. This can only be called on a cashflow that is in "Draft" status
   *
   * @tags Cashflow
   * @name CashflowPartialUpdate
   * @summary Partial Update Cashflow
   * @request PATCH:/api/v1/cashflow/{cashflow_id}/
   * @secure
   */
  cashflowPartialUpdate = (
    cashflowId: string,
    data: PangeaPatchedCashFlowGenerator,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashFlowGenerator, any>({
      path: `/api/v1/cashflow/${cashflowId}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for creating payment instructions for a beneficiary.
   *
   * @tags Settlement
   * @name SettlementBeneficiaryCreate
   * @summary Create Beneficiary
   * @request POST:/api/v1/settlement/beneficiary/
   * @secure
   */
  settlementBeneficiaryCreate = (
    data: PangeaBeneficiary,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBeneficiary, any>({
      path: `/api/v1/settlement/beneficiary/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for listing active beneficiaries.
   *
   * @tags Settlement
   * @name SettlementBeneficiaryList
   * @summary List Beneficiaries
   * @request GET:/api/v1/settlement/beneficiary/
   * @secure
   */
  settlementBeneficiaryList = (
    query: PangeaSettlementBeneficiaryListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedBeneficiaryList, any>({
      path: `/api/v1/settlement/beneficiary/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for activating a beneficiary from draft to pending
   *
   * @tags Settlement
   * @name SettlementBeneficiaryActivateCreate
   * @summary Activate Beneficiary
   * @request POST:/api/v1/settlement/beneficiary/activate/
   * @secure
   */
  settlementBeneficiaryActivateCreate = (
    data: PangeaActivateBeneficiaryRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaMessageResponse, PangeaMessageResponse>({
      path: `/api/v1/settlement/beneficiary/activate/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags settlement
   * @name SettlementBeneficiaryBankSearchRetrieve
   * @request GET:/api/v1/settlement/beneficiary/bank_search/
   * @secure
   */
  settlementBeneficiaryBankSearchRetrieve = (params: RequestParams = {}) =>
    this.request<PangeaBeneficiary, any>({
      path: `/api/v1/settlement/beneficiary/bank_search/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for getting validation schema for creating a beneficiary
   *
   * @tags Settlement
   * @name SettlementBeneficiaryValidationSchemaCreate
   * @summary Beneficiary Validation Schema
   * @request POST:/api/v1/settlement/beneficiary/validation_schema/
   * @secure
   */
  settlementBeneficiaryValidationSchemaCreate = (
    data: PangeaValidationSchemaRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBeneficiary, any>({
      path: `/api/v1/settlement/beneficiary/validation_schema/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for replacing existing beneficiary data with a new set of data.
   *
   * @tags Settlement
   * @name SettlementBeneficiaryUpdate
   * @summary Replace Beneficiary
   * @request PUT:/api/v1/settlement/beneficiary/{id}/
   * @secure
   */
  settlementBeneficiaryUpdate = (
    id: string,
    data: PangeaBeneficiary,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBeneficiary, any>({
      path: `/api/v1/settlement/beneficiary/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for deleting a beneficiary
   *
   * @tags Settlement
   * @name SettlementBeneficiaryDestroy
   * @summary Delete Beneficiary
   * @request DELETE:/api/v1/settlement/beneficiary/{id}/
   * @secure
   */
  settlementBeneficiaryDestroy = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/settlement/beneficiary/${id}/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Endpoint for retrieving a specific beneficiary.
   *
   * @tags Settlement
   * @name SettlementBeneficiaryRetrieve
   * @summary Retrieve Beneficiary
   * @request GET:/api/v1/settlement/beneficiary/{id}/
   * @secure
   */
  settlementBeneficiaryRetrieve = (id: string, params: RequestParams = {}) =>
    this.request<PangeaBeneficiary, any>({
      path: `/api/v1/settlement/beneficiary/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for partially updating an existing beneficiary.
   *
   * @tags Settlement
   * @name SettlementBeneficiaryPartialUpdate
   * @summary Update Beneficiary
   * @request PATCH:/api/v1/settlement/beneficiary/{id}/
   * @secure
   */
  settlementBeneficiaryPartialUpdate = (
    id: string,
    data: PangeaPatchedBeneficiary,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBeneficiary, any>({
      path: `/api/v1/settlement/beneficiary/${id}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for listing all wallets for a company
   *
   * @tags Settlement
   * @name SettlementWalletList
   * @summary List Wallets
   * @request GET:/api/v1/settlement/wallet/
   * @secure
   */
  settlementWalletList = (
    query: PangeaSettlementWalletListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedWalletList, any>({
      path: `/api/v1/settlement/wallet/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Update wallet nickname or default flag
   *
   * @tags Settlement
   * @name SettlementWalletUpdate
   * @summary Update Wallets
   * @request PUT:/api/v1/settlement/wallet/{wallet_id}/
   * @secure
   */
  settlementWalletUpdate = (
    walletId: string,
    data: PangeaWalletUpdate,
    params: RequestParams = {},
  ) =>
    this.request<PangeaWallet, any>({
      path: `/api/v1/settlement/wallet/${walletId}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Send request notification for wallet removal and set its status to pending
   *
   * @tags Settlement
   * @name SettlementWalletDestroy
   * @summary Send Request for Wallet Removal
   * @request DELETE:/api/v1/settlement/wallet/{wallet_id}/
   * @secure
   */
  settlementWalletDestroy = (walletId: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/settlement/wallet/${walletId}/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Endpoint for retrieving a specific wallet
   *
   * @tags Settlement
   * @name SettlementWalletRetrieve
   * @summary Retrieve Wallets
   * @request GET:/api/v1/settlement/wallet/{wallet_id}/
   * @secure
   */
  settlementWalletRetrieve = (walletId: string, params: RequestParams = {}) =>
    this.request<PangeaWallet, any>({
      path: `/api/v1/settlement/wallet/${walletId}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags settlement
   * @name SettlementWalletPartialUpdate
   * @request PATCH:/api/v1/settlement/wallet/{wallet_id}/
   * @secure
   */
  settlementWalletPartialUpdate = (
    walletId: string,
    data: PangeaPatchedWallet,
    params: RequestParams = {},
  ) =>
    this.request<PangeaWallet, any>({
      path: `/api/v1/settlement/wallet/${walletId}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint to execute a valid RFQ or a new transaction without RFQ. Supports a list of payloads for batched requests.
   *
   * @tags Trading
   * @name OemsExecuteCreate
   * @summary Execute Transaction
   * @request POST:/api/v1/oems/execute/
   * @secure
   */
  oemsExecuteCreate = (data: PangeaExecute, params: RequestParams = {}) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/execute/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for creating or refreshing a Request for Quote. Allows you to get an executable exchange rate without entering into a transaction. Supports a list of payloads for batched requests.
   *
   * @tags Trading
   * @name OemsRfqCreate
   * @summary Request Quote
   * @request POST:/api/v1/oems/rfq/
   * @secure
   */
  oemsRfqCreate = (data: PangeaRfq, params: RequestParams = {}) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/rfq/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for RFQ Execution. Allows clients to execute an RFQ ticket. Supports a list of payloads for batched requests.
   *
   * @tags Trading
   * @name OemsExecuteRfqCreate
   * @summary Execute Quote
   * @request POST:/api/v1/oems/execute-rfq/
   * @secure
   */
  oemsExecuteRfqCreate = (data: PangeaExecuteRfq, params: RequestParams = {}) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/execute-rfq/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Fund a spot or forward payment transaction.
   *
   * @tags Trading
   * @name OemsFundCreate
   * @summary Fund Transaction
   * @request POST:/api/v1/oems/fund/
   * @secure
   */
  oemsFundCreate = (data: PangeaFundTransaction, params: RequestParams = {}) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/fund/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for retrieving ticket status by its ticket_id.
   *
   * @tags Trading
   * @name OemsStatusRetrieve
   * @summary Status
   * @request GET:/api/v1/oems/status/{ticket_id}/
   * @secure
   */
  oemsStatusRetrieve = (ticketId: string, params: RequestParams = {}) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/status/${ticketId}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint to retrieve executed transaction details.
   *
   * @tags Trading
   * @name OemsExecutionRetrieve
   * @summary List Executions
   * @request GET:/api/v1/oems/execution/
   * @secure
   */
  oemsExecutionRetrieve = (params: RequestParams = {}) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/execution/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for retrieving a specific ticket mark-to-market by its ticket id.
   *
   * @tags Trading
   * @name OemsMtmRetrieve
   * @summary Mark-to-Market
   * @request GET:/api/v1/oems/mtm/{ticket_id}/
   * @secure
   */
  oemsMtmRetrieve = (ticketId: string, params: RequestParams = {}) =>
    this.request<PangeaExternalMtm, PangeaError>({
      path: `/api/v1/oems/mtm/${ticketId}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for activating execution from draft state. Allows clients to activate a drafted execution.
   *
   * @tags Execution Management
   * @name OemsExecuteActivateCreate
   * @summary Request Activation
   * @request POST:/api/v1/oems/execute/activate/
   * @secure
   */
  oemsExecuteActivateCreate = (
    data: PangeaReqBasicExecAction,
    params: RequestParams = {},
  ) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/execute/activate/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for authorizing execution. Allows pangea to authorize an execution.
   *
   * @tags Execution Management
   * @name OemsExecuteAuthorizeCreate
   * @summary Request Authorization
   * @request POST:/api/v1/oems/execute/authorize/
   * @secure
   */
  oemsExecuteAuthorizeCreate = (
    data: PangeaReqBasicExecAction,
    params: RequestParams = {},
  ) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/execute/authorize/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for cancelling execution. Allows clients to request an execution cancel.
   *
   * @tags Execution Management
   * @name OemsExecuteCancelCreate
   * @summary Request Cancel
   * @request POST:/api/v1/oems/execute/cancel/
   * @secure
   */
  oemsExecuteCancelCreate = (
    data: PangeaReqBasicExecAction,
    params: RequestParams = {},
  ) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/execute/cancel/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for pausing execution. Allows clients to request an execution pause.
   *
   * @tags Execution Management
   * @name OemsExecutePauseCreate
   * @summary Request Pause
   * @request POST:/api/v1/oems/execute/pause/
   * @secure
   */
  oemsExecutePauseCreate = (
    data: PangeaReqBasicExecAction,
    params: RequestParams = {},
  ) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/execute/pause/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for resuming execution. Allows clients to request an execution resumption.
   *
   * @tags Execution Management
   * @name OemsExecuteResumeCreate
   * @summary Request Resume
   * @request POST:/api/v1/oems/execute/resume/
   * @secure
   */
  oemsExecuteResumeCreate = (
    data: PangeaReqBasicExecAction,
    params: RequestParams = {},
  ) =>
    this.request<Record<string, any>, PangeaError>({
      path: `/api/v1/oems/execute/resume/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint to execute a batch upload of payments.
   *
   * @tags oems
   * @name OemsBatchCreate
   * @summary Batch Upload
   * @request POST:/api/v1/oems/batch/
   * @secure
   */
  oemsBatchCreate = (data: PangeaExecute[], params: RequestParams = {}) =>
    this.request<PangeaBatchResponse, PangeaError>({
      path: `/api/v1/oems/batch/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all the cashflows for an account
   *
   * @tags oems
   * @name OemsCnyExecutionList
   * @request GET:/api/v1/oems/cny-execution/
   * @secure
   */
  oemsCnyExecutionList = (
    query: PangeaOemsCnyExecutionListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCnyExecution[], any>({
      path: `/api/v1/oems/cny-execution/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for creating a new payment ticket. Allows clients to create a new payment request.
   *
   * @tags oems
   * @name OemsTicketCreate
   * @request POST:/api/v1/oems/ticket/
   * @secure
   */
  oemsTicketCreate = (data: PangeaTicket, params: RequestParams = {}) =>
    this.request<PangeaTicket, any>({
      path: `/api/v1/oems/ticket/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for retrieving a list of all payment tickets. Allows clients to retrieve all existing payment tickets.
   *
   * @tags oems
   * @name OemsTicketList
   * @request GET:/api/v1/oems/ticket/
   * @secure
   */
  oemsTicketList = (
    query: PangeaOemsTicketListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedTicketList, any>({
      path: `/api/v1/oems/ticket/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for retrieving a specific payment ticket by its unique ID.
   *
   * @tags oems
   * @name OemsTicketRetrieve
   * @request GET:/api/v1/oems/ticket/{id}/
   * @secure
   */
  oemsTicketRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaTicket, any>({
      path: `/api/v1/oems/ticket/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for market execution recommendation.
   *
   * @tags Execution Management
   * @name OemsExecuteBestExecutionCreate
   * @summary Best Execution
   * @request POST:/api/v1/oems/execute/best-execution
   * @secure
   */
  oemsExecuteBestExecutionCreate = (
    data: PangeaMarketName,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBestExecution, PangeaError>({
      path: `/api/v1/oems/execute/best-execution`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Create order quote record
   *
   * @tags oems
   * @name OemsOrderQuoteCreate
   * @request POST:/api/v1/oems/order-quote/
   * @secure
   */
  oemsOrderQuoteCreate = (
    data: PangeaCreateQuoteRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaQuoteResponse, any>({
      path: `/api/v1/oems/order-quote/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsQuoteToTicketCreate
   * @request POST:/api/v1/oems/quote-to-ticket/
   * @secure
   */
  oemsQuoteToTicketCreate = (
    data: PangeaQuoteToTicketRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaTicket, any>({
      path: `/api/v1/oems/quote-to-ticket/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Create wait condition record
   *
   * @tags oems
   * @name OemsWaitConditionCreate
   * @request POST:/api/v1/oems/wait-condition/
   * @secure
   */
  oemsWaitConditionCreate = (
    data: PangeaWaitCondition,
    params: RequestParams = {},
  ) =>
    this.request<PangeaWaitCondition, any>({
      path: `/api/v1/oems/wait-condition/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsManualRequestSlackFormCreate
   * @request POST:/api/v1/oems/manual-request-slack-form/
   * @secure
   */
  oemsManualRequestSlackFormCreate = (
    data: PangeaManualRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaManualRequest, any>({
      path: `/api/v1/oems/manual-request-slack-form/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsManualRequestSlackFormDestroy
   * @request DELETE:/api/v1/oems/manual-request-slack-form/
   * @secure
   */
  oemsManualRequestSlackFormDestroy = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/oems/manual-request-slack-form/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsManualRequestSlackFormUpdate
   * @request PUT:/api/v1/oems/manual-request-slack-form/
   * @secure
   */
  oemsManualRequestSlackFormUpdate = (
    data: PangeaManualRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaManualRequest, any>({
      path: `/api/v1/oems/manual-request-slack-form/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsManualRequestSlackFormPartialUpdate
   * @request PATCH:/api/v1/oems/manual-request-slack-form/
   * @secure
   */
  oemsManualRequestSlackFormPartialUpdate = (
    data: PangeaPatchedManualRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaManualRequest, any>({
      path: `/api/v1/oems/manual-request-slack-form/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsCalendarNonSettlementDaysCreate
   * @request POST:/api/v1/oems/calendar/non-settlement-days
   * @secure
   */
  oemsCalendarNonSettlementDaysCreate = (
    data: PangeaDateRange,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/oems/calendar/non-settlement-days`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsCalendarSettlementDaysCreate
   * @request POST:/api/v1/oems/calendar/settlement-days
   * @secure
   */
  oemsCalendarSettlementDaysCreate = (
    data: PangeaDateRange,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/oems/calendar/settlement-days`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsCalendarValidSettlementDayCreate
   * @request POST:/api/v1/oems/calendar/valid-settlement-day
   * @secure
   */
  oemsCalendarValidSettlementDayCreate = (
    data: PangeaSingleDay,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/oems/calendar/valid-settlement-day`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsCalendarNextValidSettlementDayCreate
   * @request POST:/api/v1/oems/calendar/next-valid-settlement-day
   * @secure
   */
  oemsCalendarNextValidSettlementDayCreate = (
    data: PangeaSingleDay,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/oems/calendar/next-valid-settlement-day`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsCalendarPrevValidSettlementDayCreate
   * @request POST:/api/v1/oems/calendar/prev-valid-settlement-day
   * @secure
   */
  oemsCalendarPrevValidSettlementDayCreate = (
    data: PangeaSingleDay,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/oems/calendar/prev-valid-settlement-day`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsCalendarNextMktDayCreate
   * @request POST:/api/v1/oems/calendar/next-mkt-day
   * @secure
   */
  oemsCalendarNextMktDayCreate = (
    data: PangeaSingleDay,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/oems/calendar/next-mkt-day`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsCalendarCurrentMktDayCreate
   * @request POST:/api/v1/oems/calendar/current-mkt-day
   * @secure
   */
  oemsCalendarCurrentMktDayCreate = (
    data: PangeaSingleDay,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/oems/calendar/current-mkt-day`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsCalendarFxSettlementInfoCreate
   * @request POST:/api/v1/oems/calendar/fx-settlement-info
   * @secure
   */
  oemsCalendarFxSettlementInfoCreate = (
    data: PangeaSingleDayTenor,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/oems/calendar/fx-settlement-info`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsCalendarSpotValueDateCreate
   * @request POST:/api/v1/oems/calendar/spot-value-date
   * @secure
   */
  oemsCalendarSpotValueDateCreate = (
    data: PangeaSingleDateTime,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/oems/calendar/spot-value-date`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsCalendarValueDatesCreate
   * @request POST:/api/v1/oems/calendar/value-dates
   * @secure
   */
  oemsCalendarValueDatesCreate = (
    data: PangeaMultiDay,
    params: RequestParams = {},
  ) =>
    this.request<string[], any>({
      path: `/api/v1/oems/calendar/value-dates`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsBestExecutionTimingRetrieve
   * @request GET:/api/v1/oems/best-execution-timing/{payment_id}/
   * @secure
   */
  oemsBestExecutionTimingRetrieve = (
    paymentId: number,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBestExecutionTiming, any>({
      path: `/api/v1/oems/best-execution-timing/${paymentId}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags oems
   * @name OemsLiquidityInsightCreate
   * @request POST:/api/v1/oems/liquidity-insight/
   * @secure
   */
  oemsLiquidityInsightCreate = (
    data: PangeaLiquidityInsightRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaLiquidityInsightResponse, any>({
      path: `/api/v1/oems/liquidity-insight/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for indicative rate.
   *
   * @tags Rates
   * @name MarketdataRecentRateCreate
   * @summary Indicative Rate
   * @request POST:/api/v1/marketdata/recent-rate/
   * @secure
   */
  marketdataRecentRateCreate = (
    data: PangeaInitialRateRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaRecentRateResponse, PangeaError>({
      path: `/api/v1/marketdata/recent-rate/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for spot daily historical rates.
   *
   * @tags Rates
   * @name MarketdataHistoricalRatesCreate
   * @summary Historical Rates
   * @request POST:/api/v1/marketdata/historical-rates/
   * @secure
   */
  marketdataHistoricalRatesCreate = (
    data: PangeaHistoricalRateRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaRateMovingAverage[], PangeaError>({
      path: `/api/v1/marketdata/historical-rates/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for current market risk.
   *
   * @tags Rates
   * @name MarketdataRiskCreate
   * @summary Market Risk
   * @request POST:/api/v1/marketdata/risk/
   * @secure
   */
  marketdataRiskCreate = (
    data: PangeaMarketVolatility,
    params: RequestParams = {},
  ) =>
    this.request<PangeaRecentVolResponseSerialier, PangeaError>({
      path: `/api/v1/marketdata/risk/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataSpotList
   * @request GET:/api/v1/marketdata/spot/
   * @secure
   */
  marketdataSpotList = (
    query: PangeaMarketdataSpotListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedFxSpotList, any>({
      path: `/api/v1/marketdata/spot/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataSpotIntraList
   * @request GET:/api/v1/marketdata/spot/intra/
   * @secure
   */
  marketdataSpotIntraList = (
    query: PangeaMarketdataSpotIntraListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedFxSpotIntraList, any>({
      path: `/api/v1/marketdata/spot/intra/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataSpotCorpayList
   * @request GET:/api/v1/marketdata/spot/corpay/
   * @secure
   */
  marketdataSpotCorpayList = (
    query: PangeaMarketdataSpotCorpayListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedCorPayFxSpotList, any>({
      path: `/api/v1/marketdata/spot/corpay/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataForwardsList
   * @request GET:/api/v1/marketdata/forwards/
   * @secure
   */
  marketdataForwardsList = (
    query: PangeaMarketdataForwardsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedFxForwardList, any>({
      path: `/api/v1/marketdata/forwards/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataForwardsCorpayList
   * @request GET:/api/v1/marketdata/forwards/corpay/
   * @secure
   */
  marketdataForwardsCorpayList = (
    query: PangeaMarketdataForwardsCorpayListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedCorPayFxForwardList, any>({
      path: `/api/v1/marketdata/forwards/corpay/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataTradingCalendarList
   * @request GET:/api/v1/marketdata/trading_calendar/
   * @secure
   */
  marketdataTradingCalendarList = (
    query: PangeaMarketdataTradingCalendarListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedTradingCalendarList, any>({
      path: `/api/v1/marketdata/trading_calendar/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retreive the fx spot intra average over the last hour (response)
   *
   * @tags marketdata
   * @name MarketdataSpotIntraAverageRetrieve
   * @request GET:/api/v1/marketdata/spot/intra/average/
   * @secure
   */
  marketdataSpotIntraAverageRetrieve = (
    query: PangeaMarketdataSpotIntraAverageRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaAverageFxSpotPrice, any>({
      path: `/api/v1/marketdata/spot/intra/average/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataFxPairP10List
   * @request GET:/api/v1/marketdata/fxPair/p10/
   * @secure
   */
  marketdataFxPairP10List = (
    query: PangeaMarketdataFxPairP10ListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedFxPairList, any>({
      path: `/api/v1/marketdata/fxPair/p10/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retreive all contracts by base_currency (response)
   *
   * @tags marketdata
   * @name MarketdataFutureIntraList
   * @request GET:/api/v1/marketdata/future/intra/
   * @secure
   */
  marketdataFutureIntraList = (
    query: PangeaMarketdataFutureIntraListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaFutureIntra[], any>({
      path: `/api/v1/marketdata/future/intra/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataFutureLiquidHoursList
   * @request GET:/api/v1/marketdata/future/liquid_hours/
   * @secure
   */
  marketdataFutureLiquidHoursList = (
    query: PangeaMarketdataFutureLiquidHoursListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedLiquidHoursList, any>({
      path: `/api/v1/marketdata/future/liquid_hours/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataFutureTradingHoursList
   * @request GET:/api/v1/marketdata/future/trading_hours/
   * @secure
   */
  marketdataFutureTradingHoursList = (
    query: PangeaMarketdataFutureTradingHoursListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedTradingHoursList, any>({
      path: `/api/v1/marketdata/future/trading_hours/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataAssetIndexList
   * @request GET:/api/v1/marketdata/asset/index/
   * @secure
   */
  marketdataAssetIndexList = (
    query: PangeaMarketdataAssetIndexListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedIndexList, any>({
      path: `/api/v1/marketdata/asset/index/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketdata
   * @name MarketdataInitialStateCreate
   * @request POST:/api/v1/marketdata/initial-state/
   * @secure
   */
  marketdataInitialStateCreate = (
    data: PangeaInitialMarketStateRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInitialMarketStateResponse, PangeaError>({
      path: `/api/v1/marketdata/initial-state/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get company's configured pairs liquidity
   *
   * @tags marketdata
   * @name MarketdataMarketsLiquidityRetrieve
   * @request GET:/api/v1/marketdata/markets-liquidity/
   * @secure
   */
  marketdataMarketsLiquidityRetrieve = (params: RequestParams = {}) =>
    this.request<PangeaMarketsLiquidityResponse, any>({
      path: `/api/v1/marketdata/markets-liquidity/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retrieve a list of all available webhook events.
   *
   * @tags Webhook
   * @name WebhookEventsList
   * @summary List all webhook events
   * @request GET:/api/v1/webhook/events/
   * @secure
   */
  webhookEventsList = (
    query: PangeaWebhookEventsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedEventList, any>({
      path: `/api/v1/webhook/events/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retrieve a list of all available webhook event groups.
   *
   * @tags Webhook
   * @name WebhookEventGroupsList
   * @summary List all webhook event groups
   * @request GET:/api/v1/webhook/event-groups/
   * @secure
   */
  webhookEventGroupsList = (
    query: PangeaWebhookEventGroupsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedEventGroupList, any>({
      path: `/api/v1/webhook/event-groups/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for creating a new webhook associated with the current user's company.
   *
   * @tags Webhook
   * @name WebhookCreate
   * @summary Create a new webhook
   * @request POST:/api/v1/webhook/
   * @secure
   */
  webhookCreate = (data: PangeaWebhook, params: RequestParams = {}) =>
    this.request<PangeaWebhook, any>({
      path: `/api/v1/webhook/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for retrieving a list of all webhooks for the current user's company.
   *
   * @tags Webhook
   * @name WebhookList
   * @summary List webhooks
   * @request GET:/api/v1/webhook/
   * @secure
   */
  webhookList = (query: PangeaWebhookListParams, params: RequestParams = {}) =>
    this.request<PangeaPaginatedWebhookList, any>({
      path: `/api/v1/webhook/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for replacing an existing webhook.
   *
   * @tags Webhook
   * @name WebhookUpdate
   * @summary Replace a webhook
   * @request PUT:/api/v1/webhook/{webhook_id}/
   * @secure
   */
  webhookUpdate = (
    webhookId: string,
    data: PangeaWebhook,
    params: RequestParams = {},
  ) =>
    this.request<PangeaWebhook, any>({
      path: `/api/v1/webhook/${webhookId}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for deleting an existing webhook.
   *
   * @tags Webhook
   * @name WebhookDestroy
   * @summary Delete a webhook
   * @request DELETE:/api/v1/webhook/{webhook_id}/
   * @secure
   */
  webhookDestroy = (webhookId: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/webhook/${webhookId}/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Endpoint for retrieving details of a specific webhook.
   *
   * @tags Webhook
   * @name WebhookRetrieve
   * @summary Retrieve a webhook
   * @request GET:/api/v1/webhook/{webhook_id}/
   * @secure
   */
  webhookRetrieve = (webhookId: string, params: RequestParams = {}) =>
    this.request<PangeaWebhook, any>({
      path: `/api/v1/webhook/${webhookId}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Endpoint for partially updating an existing webhook.
   *
   * @tags Webhook
   * @name WebhookPartialUpdate
   * @summary Partially update a webhook
   * @request PATCH:/api/v1/webhook/{webhook_id}/
   * @secure
   */
  webhookPartialUpdate = (
    webhookId: string,
    data: PangeaPatchedWebhook,
    params: RequestParams = {},
  ) =>
    this.request<PangeaWebhook, any>({
      path: `/api/v1/webhook/${webhookId}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Create an account for a company Optionally, the account can be created with some raw and / or recurring cashflows. If these are not provided, a list of currencies that the account is allowed to trade in must be provided. It is permissible to provide both the currencies list *and* cashflows.
   *
   * @tags accounts
   * @name AccountsCreate
   * @request POST:/api/v1/accounts/
   * @secure
   */
  accountsCreate = (
    data: PangeaCreateAccountForCompanyView,
    params: RequestParams = {},
  ) =>
    this.request<PangeaAccount, PangeaActionStatus>({
      path: `/api/v1/accounts/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all the accounts of a company
   *
   * @tags accounts
   * @name AccountsList
   * @request GET:/api/v1/accounts/
   * @secure
   */
  accountsList = (params: RequestParams = {}) =>
    this.request<PangeaAccount[], any>({
      path: `/api/v1/accounts/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Activate an account
   *
   * @tags accounts
   * @name AccountsActivateUpdate
   * @request PUT:/api/v1/accounts/{id}/activate/
   * @secure
   */
  accountsActivateUpdate = (id: number, params: RequestParams = {}) =>
    this.request<PangeaAccount, PangeaActionStatus>({
      path: `/api/v1/accounts/${id}/activate/`,
      method: 'PUT',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Deactivate an account
   *
   * @tags accounts
   * @name AccountsDeactivateUpdate
   * @request PUT:/api/v1/accounts/{id}/deactivate/
   * @secure
   */
  accountsDeactivateUpdate = (id: number, params: RequestParams = {}) =>
    this.request<PangeaAccount, any>({
      path: `/api/v1/accounts/${id}/deactivate/`,
      method: 'PUT',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get an account's hedge policy.
   *
   * @tags accounts
   * @name AccountsGetHedgePolicyRetrieve
   * @request GET:/api/v1/accounts/{id}/get_hedge_policy/
   * @secure
   */
  accountsGetHedgePolicyRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaHedgeSettings, PangeaActionStatus>({
      path: `/api/v1/accounts/${id}/get_hedge_policy/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Set an account's hedge policy <br /> <br /> <b>method</b> - the hedge method to use for this account <br /> <b>margin_budget</b> - float, the maximum daily margin exposure allowed (in units of account's domestic currency) <br /> <b>max_horizon</b> - the maximum number of days into the future to hedge for this account (ie, cashflows beyond this are not taking into account, until they enter this horizon) <br /> <b>custom:</b> <br /> <b>vol_target_reduction</b> - number between [0,1], where 0 means they have no risk reduction, 1.0 means 100% risk reduction. <br /> <b>var_95_exposure_ratio</b> - this is what percentage of the account value that they don't want their 95% VaR to exceed. <br /> <b>var_95_exposure_window</b> - the number of days we lookback when computing PnL to determine how much the account has lost/gained ... the VaR bound won't kick in until the PnL starts to near it, at which point we will put on a position to lock in their losses
   *
   * @tags accounts
   * @name AccountsSetHedgePolicyCreate
   * @request POST:/api/v1/accounts/{id}/set_hedge_policy/
   * @secure
   */
  accountsSetHedgePolicyCreate = (
    id: number,
    data: PangeaHedgePolicyForAccountView,
    params: RequestParams = {},
  ) =>
    this.request<PangeaHedgeSettings, any>({
      path: `/api/v1/accounts/${id}/set_hedge_policy/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Add a recurring cashflow for an account
   *
   * @tags installments
   * @name InstallmentsCreate
   * @request POST:/api/v1/installments/
   * @secure
   */
  installmentsCreate = (data: PangeaInstallment, params: RequestParams = {}) =>
    this.request<PangeaInstallment, any>({
      path: `/api/v1/installments/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all the recurring cashflow for an account
   *
   * @tags installments
   * @name InstallmentsList
   * @request GET:/api/v1/installments/
   * @secure
   */
  installmentsList = (
    query: PangeaInstallmentsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedInstallmentList, any>({
      path: `/api/v1/installments/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Remove a recurring cashflow from an account
   *
   * @tags installments
   * @name InstallmentsDestroy
   * @request DELETE:/api/v1/installments/{id}/
   * @secure
   */
  installmentsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/installments/${id}/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Replace an existing recurring cashflow with a new one, effectively 'updating' or 'editing' a cashflow The cashflow must have the same name as an existing cashflow, which it is editing. The name must not be None.
   *
   * @tags installments
   * @name InstallmentsUpdate
   * @request PUT:/api/v1/installments/{id}/
   * @secure
   */
  installmentsUpdate = (
    id: number,
    data: PangeaInstallment,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInstallment, any>({
      path: `/api/v1/installments/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get a recurring cashflow by id
   *
   * @tags installments
   * @name InstallmentsRetrieve
   * @request GET:/api/v1/installments/{id}/
   * @secure
   */
  installmentsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaInstallment, any>({
      path: `/api/v1/installments/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Create a company
   *
   * @tags company
   * @name CompanyCreate
   * @request POST:/api/v1/company/
   * @secure
   */
  companyCreate = (data: PangeaCreateCompany, params: RequestParams = {}) =>
    this.request<PangeaCompany, any>({
      path: `/api/v1/company/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get user company
   *
   * @tags company
   * @name CompanyList
   * @request GET:/api/v1/company/
   * @secure
   */
  companyList = (params: RequestParams = {}) =>
    this.request<PangeaCompany[], any>({
      path: `/api/v1/company/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Deactivate a company Note that this will lead to all accounts for the company being deactivated and all hedges being unwound.
   *
   * @tags company
   * @name CompanyDeactivateUpdate
   * @request PUT:/api/v1/company/deactivate/
   * @secure
   */
  companyDeactivateUpdate = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/company/deactivate/`,
      method: 'PUT',
      secure: true,
      ...params,
    });
  /**
   * @description Update a company
   *
   * @tags company
   * @name CompanyUpdate
   * @request PUT:/api/v1/company/{id}/
   * @secure
   */
  companyUpdate = (
    id: number,
    data: PangeaCompany,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCompany, Record<string, any>>({
      path: `/api/v1/company/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags company
   * @name CompanyPartialUpdate
   * @request PATCH:/api/v1/company/{id}/
   * @secure
   */
  companyPartialUpdate = (
    id: number,
    data: PangeaPatchedCompany,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCompany, Record<string, any>>({
      path: `/api/v1/company/${id}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Create new user
   *
   * @tags user
   * @name UserCreate
   * @request POST:/api/v1/user/
   * @secure
   */
  userCreate = (data: PangeaUserCreation, params: RequestParams = {}) =>
    this.request<PangeaUser, PangeaResourceAlreadyExists>({
      path: `/api/v1/user/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get current user
   *
   * @tags user
   * @name UserList
   * @request GET:/api/v1/user/
   * @secure
   */
  userList = (params: RequestParams = {}) =>
    this.request<PangeaUser[], any>({
      path: `/api/v1/user/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Edit current user
   *
   * @tags user
   * @name UserUpdate
   * @request PUT:/api/v1/user/{id}/
   * @secure
   */
  userUpdate = (
    id: number,
    data: PangeaUserUpdate,
    params: RequestParams = {},
  ) =>
    this.request<PangeaUser, PangeaResourceAlreadyExists>({
      path: `/api/v1/user/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserPartialUpdate
   * @request PATCH:/api/v1/user/{id}/
   * @secure
   */
  userPartialUpdate = (
    id: number,
    data: PangeaPatchedUserUpdate,
    params: RequestParams = {},
  ) =>
    this.request<PangeaUser, PangeaResourceAlreadyExists>({
      path: `/api/v1/user/${id}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags cashflows
   * @name CashflowsList
   * @request GET:/api/v1/cashflows/
   * @secure
   */
  cashflowsList = (
    query: PangeaCashflowsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedCashflowList, any>({
      path: `/api/v1/cashflows/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags cashflows
   * @name CashflowsRetrieve
   * @request GET:/api/v1/cashflows/{id}/
   * @secure
   */
  cashflowsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaCashflow, any>({
      path: `/api/v1/cashflows/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags drafts
   * @name DraftsCreate
   * @request POST:/api/v1/drafts/
   * @secure
   */
  draftsCreate = (data: PangeaDraftCashflow, params: RequestParams = {}) =>
    this.request<PangeaDraftCashflow, any>({
      path: `/api/v1/drafts/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags drafts
   * @name DraftsList
   * @request GET:/api/v1/drafts/
   * @secure
   */
  draftsList = (query: PangeaDraftsListParams, params: RequestParams = {}) =>
    this.request<PangeaPaginatedDraftCashflowList, any>({
      path: `/api/v1/drafts/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags drafts
   * @name DraftsUpdate
   * @request PUT:/api/v1/drafts/{id}/
   * @secure
   */
  draftsUpdate = (
    id: number,
    data: PangeaDraftCashflow,
    params: RequestParams = {},
  ) =>
    this.request<PangeaDraftCashflow, any>({
      path: `/api/v1/drafts/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags drafts
   * @name DraftsDestroy
   * @request DELETE:/api/v1/drafts/{id}/
   * @secure
   */
  draftsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/drafts/${id}/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags drafts
   * @name DraftsRetrieve
   * @request GET:/api/v1/drafts/{id}/
   * @secure
   */
  draftsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaDraftCashflow, any>({
      path: `/api/v1/drafts/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags drafts
   * @name DraftsPartialUpdate
   * @request PATCH:/api/v1/drafts/{id}/
   * @secure
   */
  draftsPartialUpdate = (
    id: number,
    data: PangeaPatchedDraftCashflow,
    params: RequestParams = {},
  ) =>
    this.request<PangeaDraftCashflow, any>({
      path: `/api/v1/drafts/${id}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsParachuteDataCreate
   * @request POST:/api/v1/accounts/{account_pk}/parachute_data/
   * @secure
   */
  accountsParachuteDataCreate = (
    accountPk: string,
    data: PangeaParachuteDataRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaParachuteData, any>({
      path: `/api/v1/accounts/${accountPk}/parachute_data/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsParachuteDataUpdate
   * @request PUT:/api/v1/accounts/{account_pk}/parachute_data/{id}/
   * @secure
   */
  accountsParachuteDataUpdate = (
    accountPk: string,
    id: string,
    data: PangeaParachuteData,
    params: RequestParams = {},
  ) =>
    this.request<PangeaParachuteData, any>({
      path: `/api/v1/accounts/${accountPk}/parachute_data/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsParachuteDataRetrieve
   * @request GET:/api/v1/accounts/{account_pk}/parachute_data/{id}/
   * @secure
   */
  accountsParachuteDataRetrieve = (
    accountPk: string,
    id: string,
    params: RequestParams = {},
  ) =>
    this.request<PangeaParachuteData, any>({
      path: `/api/v1/accounts/${accountPk}/parachute_data/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsParachuteDataPartialUpdate
   * @request PATCH:/api/v1/accounts/{account_pk}/parachute_data/{id}/
   * @secure
   */
  accountsParachuteDataPartialUpdate = (
    accountPk: string,
    id: string,
    data: PangeaPatchedParachuteData,
    params: RequestParams = {},
  ) =>
    this.request<PangeaParachuteData, any>({
      path: `/api/v1/accounts/${accountPk}/parachute_data/${id}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsAutopilotDataCreate
   * @request POST:/api/v1/accounts/{account_pk}/autopilot_data/
   * @secure
   */
  accountsAutopilotDataCreate = (
    accountPk: string,
    data: PangeaAutopilotDataRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaAutopilotData, any>({
      path: `/api/v1/accounts/${accountPk}/autopilot_data/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsAutopilotDataUpdate
   * @request PUT:/api/v1/accounts/{account_pk}/autopilot_data/{id}/
   * @secure
   */
  accountsAutopilotDataUpdate = (
    accountPk: string,
    id: string,
    data: PangeaAutopilotData,
    params: RequestParams = {},
  ) =>
    this.request<PangeaAutopilotData, any>({
      path: `/api/v1/accounts/${accountPk}/autopilot_data/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsAutopilotDataRetrieve
   * @request GET:/api/v1/accounts/{account_pk}/autopilot_data/{id}/
   * @secure
   */
  accountsAutopilotDataRetrieve = (
    accountPk: string,
    id: string,
    params: RequestParams = {},
  ) =>
    this.request<PangeaAutopilotData, any>({
      path: `/api/v1/accounts/${accountPk}/autopilot_data/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsAutopilotDataPartialUpdate
   * @request PATCH:/api/v1/accounts/{account_pk}/autopilot_data/{id}/
   * @secure
   */
  accountsAutopilotDataPartialUpdate = (
    accountPk: string,
    id: string,
    data: PangeaPatchedAutopilotData,
    params: RequestParams = {},
  ) =>
    this.request<PangeaAutopilotData, any>({
      path: `/api/v1/accounts/${accountPk}/autopilot_data/${id}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Add a cashflow for an account
   *
   * @tags accounts
   * @name AccountsCashflowCreate
   * @request POST:/api/v1/accounts/{account_pk}/cashflow/
   * @secure
   */
  accountsCashflowCreate = (
    { accountPk, ...query }: PangeaAccountsCashflowCreateParams,
    data: PangeaCashFlowCore,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashflow, PangeaCashFlowActionStatus>({
      path: `/api/v1/accounts/${accountPk}/cashflow/`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all the cashflows for an account
   *
   * @tags accounts
   * @name AccountsCashflowList
   * @request GET:/api/v1/accounts/{account_pk}/cashflow/
   * @secure
   */
  accountsCashflowList = (
    { accountPk, ...query }: PangeaAccountsCashflowListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashflow[], any>({
      path: `/api/v1/accounts/${accountPk}/cashflow/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Replace an existing cashflow with a new one, effectively 'updating' or 'editing' a cashflow
   *
   * @tags accounts
   * @name AccountsCashflowUpdate
   * @request PUT:/api/v1/accounts/{account_pk}/cashflow/{id}/
   * @secure
   */
  accountsCashflowUpdate = (
    accountPk: number,
    id: number,
    data: PangeaCashFlowCore,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashflow, PangeaCashFlowActionStatus>({
      path: `/api/v1/accounts/${accountPk}/cashflow/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Remove a cashflow from an account
   *
   * @tags accounts
   * @name AccountsCashflowDestroy
   * @request DELETE:/api/v1/accounts/{account_pk}/cashflow/{id}/
   * @secure
   */
  accountsCashflowDestroy = (
    accountPk: number,
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/accounts/${accountPk}/cashflow/${id}/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * @description Approve a cashflow from an account
   *
   * @tags accounts
   * @name AccountsCashflowApproveCreate
   * @request POST:/api/v1/accounts/{account_pk}/cashflow/{id}/approve/
   * @secure
   */
  accountsCashflowApproveCreate = (
    accountPk: number,
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashflow, any>({
      path: `/api/v1/accounts/${accountPk}/cashflow/${id}/approve/`,
      method: 'POST',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Add a Note for a Cashflow
   *
   * @tags accounts
   * @name AccountsCashflowNotesCreate
   * @request POST:/api/v1/accounts/{account_pk}/cashflow/{cashflow_pk}/notes/
   * @secure
   */
  accountsCashflowNotesCreate = (
    accountPk: string,
    cashflowPk: number,
    data: PangeaCashflowNote,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashflowNote, any>({
      path: `/api/v1/accounts/${accountPk}/cashflow/${cashflowPk}/notes/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all Notes from a Cashflow
   *
   * @tags accounts
   * @name AccountsCashflowNotesList
   * @request GET:/api/v1/accounts/{account_pk}/cashflow/{cashflow_pk}/notes/
   * @secure
   */
  accountsCashflowNotesList = (
    accountPk: string,
    cashflowPk: number,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashflowNote[], any>({
      path: `/api/v1/accounts/${accountPk}/cashflow/${cashflowPk}/notes/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Update a Note
   *
   * @tags accounts
   * @name AccountsCashflowNotesUpdate
   * @request PUT:/api/v1/accounts/{account_pk}/cashflow/{cashflow_pk}/notes/{id}/
   * @secure
   */
  accountsCashflowNotesUpdate = (
    accountPk: string,
    cashflowPk: number,
    id: number,
    data: PangeaCashflowNote,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashflowNote, any>({
      path: `/api/v1/accounts/${accountPk}/cashflow/${cashflowPk}/notes/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsCashflowDraftCreate
   * @request POST:/api/v1/accounts/{account_pk}/cashflow/{cashflow_pk}/draft/
   * @secure
   */
  accountsCashflowDraftCreate = (
    accountPk: number,
    cashflowPk: string,
    data: PangeaDraftCashflow,
    params: RequestParams = {},
  ) =>
    this.request<PangeaDraftCashflow, any>({
      path: `/api/v1/accounts/${accountPk}/cashflow/${cashflowPk}/draft/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsCashflowDraftUpdate
   * @request PUT:/api/v1/accounts/{account_pk}/cashflow/{cashflow_pk}/draft/{id}/
   * @secure
   */
  accountsCashflowDraftUpdate = (
    accountPk: number,
    cashflowPk: string,
    id: number,
    data: PangeaDraftCashflow,
    params: RequestParams = {},
  ) =>
    this.request<PangeaDraftCashflow, any>({
      path: `/api/v1/accounts/${accountPk}/cashflow/${cashflowPk}/draft/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Remove a cashflow from an account
   *
   * @tags accounts
   * @name AccountsCashflowDraftDestroy
   * @request DELETE:/api/v1/accounts/{account_pk}/cashflow/{cashflow_pk}/draft/{id}/
   * @secure
   */
  accountsCashflowDraftDestroy = (
    accountPk: number,
    cashflowPk: string,
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/accounts/${accountPk}/cashflow/${cashflowPk}/draft/${id}/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name AccountsCashflowDraftActivateUpdate
   * @request PUT:/api/v1/accounts/{account_pk}/cashflow/{cashflow_pk}/draft/{id}/activate/
   * @secure
   */
  accountsCashflowDraftActivateUpdate = (
    accountPk: number,
    cashflowPk: string,
    id: number,
    data: PangeaDraftCashflow,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashflow, PangeaCashFlowActionStatus>({
      path: `/api/v1/accounts/${accountPk}/cashflow/${cashflowPk}/draft/${id}/activate/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags company
   * @name CompanyUserList
   * @request GET:/api/v1/company/{company_pk}/user/
   * @secure
   */
  companyUserList = (companyPk: number, params: RequestParams = {}) =>
    this.request<PangeaUser[], any>({
      path: `/api/v1/company/${companyPk}/user/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all currency definitions
   *
   * @tags company
   * @name CompanyCurrenciesList
   * @request GET:/api/v1/company/{company_pk}/currencies/
   * @secure
   */
  companyCurrenciesList = (companyPk: string, params: RequestParams = {}) =>
    this.request<PangeaCurrency[], any>({
      path: `/api/v1/company/${companyPk}/currencies/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags company
   * @name CompanyContactOrderCreate
   * @request POST:/api/v1/company/{company_pk}/contact_order/
   * @secure
   */
  companyContactOrderCreate = (
    companyPk: number,
    data: PangeaCompanyContactOrderRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaActionStatus, PangeaActionStatus>({
      path: `/api/v1/company/${companyPk}/contact_order/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags company
   * @name CompanyContactOrderList
   * @request GET:/api/v1/company/{company_pk}/contact_order/
   * @secure
   */
  companyContactOrderList = (
    { companyPk, ...query }: PangeaCompanyContactOrderListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedCompanyContactOrderList, any>({
      path: `/api/v1/company/${companyPk}/contact_order/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags company
   * @name CompanyJoinRequestList
   * @request GET:/api/v1/company/{company_pk}/join_request/
   * @secure
   */
  companyJoinRequestList = (
    { companyPk, ...query }: PangeaCompanyJoinRequestListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedCompanyJoinRequestList, any>({
      path: `/api/v1/company/${companyPk}/join_request/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags company
   * @name CompanyJoinRequestRetrieve
   * @request GET:/api/v1/company/{company_pk}/join_request/{id}/
   * @secure
   */
  companyJoinRequestRetrieve = (
    companyPk: number,
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCompanyJoinRequest, any>({
      path: `/api/v1/company/${companyPk}/join_request/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags invite
   * @name InviteCreate
   * @request POST:/api/v1/invite/
   * @secure
   */
  inviteCreate = (data: PangeaExtendInvite, params: RequestParams = {}) =>
    this.request<PangeaInviteResponse, any>({
      path: `/api/v1/invite/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags invite
   * @name InviteConfirmCreate
   * @request POST:/api/v1/invite/confirm
   * @secure
   */
  inviteConfirmCreate = (
    data: PangeaSetUserPassword,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInviteResponse, any>({
      path: `/api/v1/invite/confirm`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags invite
   * @name InviteVerifyTokenRetrieve
   * @request GET:/api/v1/invite/verify-token
   * @secure
   */
  inviteVerifyTokenRetrieve = (
    query: PangeaInviteVerifyTokenRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInviteTokenResponse, PangeaInviteTokenError>({
      path: `/api/v1/invite/verify-token`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserActivateRetrieve
   * @request GET:/api/v1/user/activate
   * @secure
   */
  userActivateRetrieve = (
    query: PangeaUserActivateRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaActivateUserResponse, PangeaActivateUserResponse>({
      path: `/api/v1/user/activate`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserExistsRetrieve
   * @request GET:/api/v1/user/exists
   * @secure
   */
  userExistsRetrieve = (
    query: PangeaUserExistsRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaUserEmailExistsResponse, any>({
      path: `/api/v1/user/exists`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserPhoneConfirmCreate
   * @request POST:/api/v1/user/phone/confirm
   * @secure
   */
  userPhoneConfirmCreate = (
    data: PangeaUserConfirmPhone,
    params: RequestParams = {},
  ) =>
    this.request<PangeaStatusResponse, PangeaStatusResponse>({
      path: `/api/v1/user/phone/confirm`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserPhoneVerifyOtpCreate
   * @request POST:/api/v1/user/phone/verify-otp
   * @secure
   */
  userPhoneVerifyOtpCreate = (
    data: PangeaUserVerifyPhoneOTP,
    params: RequestParams = {},
  ) =>
    this.request<PangeaStatusResponse, PangeaStatusResponse>({
      path: `/api/v1/user/phone/verify-otp`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserPermissionUpdate
   * @request PUT:/api/v1/user/{id}/permission
   * @secure
   */
  userPermissionUpdate = (
    id: number,
    data: PangeaUpdateUserPermissionGroup,
    params: RequestParams = {},
  ) =>
    this.request<PangeaUser, any>({
      path: `/api/v1/user/${id}/permission`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserPermissionPartialUpdate
   * @request PATCH:/api/v1/user/{id}/permission
   * @secure
   */
  userPermissionPartialUpdate = (
    id: number,
    data: PangeaPatchedUpdateUserPermissionGroup,
    params: RequestParams = {},
  ) =>
    this.request<PangeaUser, any>({
      path: `/api/v1/user/${id}/permission`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserRemoveUpdate
   * @request PUT:/api/v1/user/{id}/remove
   * @secure
   */
  userRemoveUpdate = (id: number, params: RequestParams = {}) =>
    this.request<PangeaUser, any>({
      path: `/api/v1/user/${id}/remove`,
      method: 'PUT',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags user
   * @name UserRemovePartialUpdate
   * @request PATCH:/api/v1/user/{id}/remove
   * @secure
   */
  userRemovePartialUpdate = (id: number, params: RequestParams = {}) =>
    this.request<PangeaUser, any>({
      path: `/api/v1/user/${id}/remove`,
      method: 'PATCH',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags password
   * @name PasswordChangePasswordUpdate
   * @request PUT:/api/v1/password/change-password
   * @secure
   */
  passwordChangePasswordUpdate = (
    data: PangeaChangePassword,
    params: RequestParams = {},
  ) =>
    this.request<PangeaActionStatus, PangeaActionStatus>({
      path: `/api/v1/password/change-password`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description An Api View which provides a method to verify that a token is valid
   *
   * @tags password
   * @name PasswordPasswordResetValidateTokenCreate
   * @request POST:/api/v1/password/password-reset/validate_token/
   */
  passwordPasswordResetValidateTokenCreate = (
    data: PangeaResetToken,
    params: RequestParams = {},
  ) =>
    this.request<PangeaResetToken, any>({
      path: `/api/v1/password/password-reset/validate_token/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description An Api View which provides a method to reset a password based on a unique token
   *
   * @tags password
   * @name PasswordPasswordResetConfirmCreate
   * @request POST:/api/v1/password/password-reset/confirm/
   */
  passwordPasswordResetConfirmCreate = (
    data: PangeaPasswordToken,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPasswordToken, any>({
      path: `/api/v1/password/password-reset/confirm/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description An Api View which provides a method to request a password reset token based on an e-mail address Sends a signal reset_password_token_created when a reset token was created
   *
   * @tags password
   * @name PasswordPasswordResetCreate
   * @request POST:/api/v1/password/password-reset/
   */
  passwordPasswordResetCreate = (
    data: PangeaEmail,
    params: RequestParams = {},
  ) =>
    this.request<PangeaEmail, any>({
      path: `/api/v1/password/password-reset/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags support
   * @name SupportMessageCreate
   * @request POST:/api/v1/support/message
   * @secure
   */
  supportMessageCreate = (
    data: PangeaSendAuthenticatedSupportMessage,
    params: RequestParams = {},
  ) =>
    this.request<PangeaActionStatus, PangeaActionStatus>({
      path: `/api/v1/support/message`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags support
   * @name SupportGeneralMessageCreate
   * @request POST:/api/v1/support/general/message
   * @secure
   */
  supportGeneralMessageCreate = (
    data: PangeaSendGeneralSupportMessage,
    params: RequestParams = {},
  ) =>
    this.request<PangeaActionStatus, PangeaActionStatus>({
      path: `/api/v1/support/general/message`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags company
   * @name CompanyEinCreate
   * @request POST:/api/v1/company/ein
   * @secure
   */
  companyEinCreate = (
    data: PangeaGetCompanyByEINRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCompany, any>({
      path: `/api/v1/company/ein`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags company
   * @name CompanyJoinRequestCreate
   * @request POST:/api/v1/company/{company_pk}/join_request
   * @secure
   */
  companyJoinRequestCreate = (
    companyPk: number,
    data: PangeaCreateCompanyJoinRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCompanyJoinRequest, any>({
      path: `/api/v1/company/${companyPk}/join_request`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags company
   * @name CompanyJoinRequestApproveCreate
   * @request POST:/api/v1/company/{company_pk}/join_request/{id}/approve
   * @secure
   */
  companyJoinRequestApproveCreate = (
    companyPk: number,
    id: number,
    data: PangeaApproveCompanyJoinRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCompanyJoinRequest, any>({
      path: `/api/v1/company/${companyPk}/join_request/${id}/approve`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags company
   * @name CompanyJoinRequestRejectCreate
   * @request POST:/api/v1/company/{company_pk}/join_request/{id}/reject
   * @secure
   */
  companyJoinRequestRejectCreate = (
    companyPk: number,
    id: number,
    data: PangeaRejectCompanyJoinRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCompanyJoinRequest, any>({
      path: `/api/v1/company/${companyPk}/join_request/${id}/reject`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthActivateCreate
   * @request POST:/api/v1/auth/{method}/activate/
   * @secure
   */
  authActivateCreate = (method: string, params: RequestParams = {}) =>
    this.request<
      PangeaMFAMethodDetailsResponse,
      PangeaMFAMethodActivationErrorResponse
    >({
      path: `/api/v1/auth/${method}/activate/`,
      method: 'POST',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthActivateConfirmCreate
   * @request POST:/api/v1/auth/{method}/activate/confirm/
   * @secure
   */
  authActivateConfirmCreate = (
    method: string,
    data: PangeaMFAMethodCodeRequest,
    params: RequestParams = {},
  ) =>
    this.request<
      PangeaMFAMethodBackupCodeSuccessResponse,
      PangeaMFAMethodCodeErrorResponse
    >({
      path: `/api/v1/auth/${method}/activate/confirm/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthDeactivateCreate
   * @request POST:/api/v1/auth/{method}/deactivate/
   * @secure
   */
  authDeactivateCreate = (
    method: string,
    data: PangeaMFAMethodCodeRequest,
    params: RequestParams = {},
  ) =>
    this.request<void, PangeaMFAMethodCodeErrorResponse>({
      path: `/api/v1/auth/${method}/deactivate/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthCodesRegenerateCreate
   * @request POST:/api/v1/auth/{method}/codes/regenerate/
   * @secure
   */
  authCodesRegenerateCreate = (
    method: string,
    data: PangeaMFAMethodCodeRequest,
    params: RequestParams = {},
  ) =>
    this.request<
      PangeaMFAMethodBackupCodeSuccessResponse,
      PangeaMFAMethodCodeErrorResponse
    >({
      path: `/api/v1/auth/${method}/codes/regenerate/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthCodeRequestCreate
   * @request POST:/api/v1/auth/code/request/
   * @secure
   */
  authCodeRequestCreate = (
    data: PangeaMFAMethodRequestCodeRequest,
    params: RequestParams = {},
  ) =>
    this.request<void, PangeaMFAMethodDetailsResponse>({
      path: `/api/v1/auth/code/request/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthMfaConfigRetrieve
   * @request GET:/api/v1/auth/mfa/config/
   * @secure
   */
  authMfaConfigRetrieve = (params: RequestParams = {}) =>
    this.request<PangeaMFAConfigViewSuccessResponse, any>({
      path: `/api/v1/auth/mfa/config/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthMfaUserActiveMethodsList
   * @request GET:/api/v1/auth/mfa/user-active-methods/
   * @secure
   */
  authMfaUserActiveMethodsList = (
    query: PangeaAuthMfaUserActiveMethodsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaMFAActiveUserMethod[], any>({
      path: `/api/v1/auth/mfa/user-active-methods/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthMfaChangePrimaryMethodCreate
   * @request POST:/api/v1/auth/mfa/change-primary-method/
   * @secure
   */
  authMfaChangePrimaryMethodCreate = (
    data: PangeaMFAMethodPrimaryMethodChangeRequest,
    params: RequestParams = {},
  ) =>
    this.request<void, PangeaMFAMethodCodeErrorResponse>({
      path: `/api/v1/auth/mfa/change-primary-method/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthLoginCreate
   * @request POST:/api/v1/auth/login/
   * @secure
   */
  authLoginCreate = (
    data: PangeaMFAFirstStepJWTRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaMFAFirstStepJWTSuccess, PangeaMFAMethodDetailsResponse>({
      path: `/api/v1/auth/login/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthLoginCodeCreate
   * @request POST:/api/v1/auth/login/code/
   * @secure
   */
  authLoginCodeCreate = (
    data: PangeaMFASecondStepJWTRequest,
    params: RequestParams = {},
  ) =>
    this.request<
      PangeaMFAJWTAccessRefreshResponse,
      PangeaMFAMethodDetailsResponse
    >({
      path: `/api/v1/auth/login/code/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all currency definitions
   *
   * @tags currency
   * @name CurrencyCurrenciesList
   * @request GET:/api/v1/currency/currencies/
   * @secure
   */
  currencyCurrenciesList = (params: RequestParams = {}) =>
    this.request<PangeaCurrency[], any>({
      path: `/api/v1/currency/currencies/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retreive the currency (response)
   *
   * @tags currency
   * @name CurrencyCurrenciesRetrieve
   * @request GET:/api/v1/currency/currencies/{mnemonic}/
   * @secure
   */
  currencyCurrenciesRetrieve = (mnemonic: string, params: RequestParams = {}) =>
    this.request<PangeaCurrency, any>({
      path: `/api/v1/currency/currencies/${mnemonic}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all stability index definitions
   *
   * @tags currency
   * @name CurrencyStabilityIndexesList
   * @request GET:/api/v1/currency/stability-indexes/
   * @secure
   */
  currencyStabilityIndexesList = (params: RequestParams = {}) =>
    this.request<PangeaStabilityIndex[], any>({
      path: `/api/v1/currency/stability-indexes/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retrieve stability indexes for a specific currency
   *
   * @tags currency
   * @name CurrencyStabilityIndexRetrieve
   * @request GET:/api/v1/currency/stability-index/{mnemonic}/{year}
   * @secure
   */
  currencyStabilityIndexRetrieve = (
    mnemonic: string,
    year: string,
    params: RequestParams = {},
  ) =>
    this.request<PangeaStabilityIndex, any>({
      path: `/api/v1/currency/stability-index/${mnemonic}/${year}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags currency
   * @name CurrencyFxpairsList
   * @request GET:/api/v1/currency/fxpairs/
   * @secure
   */
  currencyFxpairsList = (
    query: PangeaCurrencyFxpairsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedFxPairList, any>({
      path: `/api/v1/currency/fxpairs/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags currency
   * @name CurrencyFxpairsRetrieve
   * @request GET:/api/v1/currency/fxpairs/{id}/
   * @secure
   */
  currencyFxpairsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaFxPair, any>({
      path: `/api/v1/currency/fxpairs/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags currency
   * @name CurrencyDeliveryTimeList
   * @request GET:/api/v1/currency/delivery-time/
   * @secure
   */
  currencyDeliveryTimeList = (
    query: PangeaCurrencyDeliveryTimeListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedCurrencyDeliveryList, any>({
      path: `/api/v1/currency/delivery-time/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags currency
   * @name CurrencyDeliveryTimeRetrieve
   * @request GET:/api/v1/currency/delivery-time/{id}/
   * @secure
   */
  currencyDeliveryTimeRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaCurrencyDelivery, any>({
      path: `/api/v1/currency/delivery-time/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retreive the currency delivery time (response)
   *
   * @tags currency
   * @name CurrencyCurrencyDeliverytimeRetrieve
   * @request GET:/api/v1/currency/currency-deliverytime/{mnemonic}/
   * @secure
   */
  currencyCurrencyDeliverytimeRetrieve = (
    mnemonic: string,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCurrencyDelivery, any>({
      path: `/api/v1/currency/currency-deliverytime/${mnemonic}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all currency definitions
   *
   * @tags country
   * @name CountryRetrieve
   * @request GET:/api/v1/country/
   * @secure
   */
  countryRetrieve = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/country/`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description Retreive the currency (response)
   *
   * @tags country
   * @name CountryCountryCodeRetrieve
   * @request GET:/api/v1/country/country_code/{country_code}/
   * @secure
   */
  countryCountryCodeRetrieve = (
    countryCode: string,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/v1/country/country_code/${countryCode}/`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description Retreive the currency (response)
   *
   * @tags country
   * @name CountryMnemonicRetrieve
   * @request GET:/api/v1/country/mnemonic/{mnemonic}/
   * @secure
   */
  countryMnemonicRetrieve = (mnemonic: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/country/mnemonic/${mnemonic}/`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags risk
   * @name RiskGetCashflowRiskConesCreate
   * @request POST:/api/v1/risk/get_cashflow_risk_cones/
   * @secure
   */
  riskGetCashflowRiskConesCreate = (
    query: PangeaRiskGetCashflowRiskConesCreateParams,
    data: PangeaGetCashflowRiskCone,
    params: RequestParams = {},
  ) =>
    this.request<PangeaGetCashflowRiskConeResponse, any>({
      path: `/api/v1/risk/get_cashflow_risk_cones/`,
      method: 'POST',
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get the margin and fee for a given account. The request includes a draft ID. If the draft is associated with a live cashflow then it is treated as an edit to an existing cashflow. Otherwise, it is treated as a new cashflow. If the cashflow is an existing one, then the account id should be left empty. If the cashflow is a new one then you must specify an account id to get back the margin update.
   *
   * @tags risk
   * @name RiskMarginAndFeesCreate
   * @request POST:/api/v1/risk/margin_and_fees/
   * @secure
   */
  riskMarginAndFeesCreate = (
    data: PangeaMarginAndFeeRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaMarginAndFeesResponse, any>({
      path: `/api/v1/risk/margin_and_fees/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get the margin health report for a given company.
   *
   * @tags risk
   * @name RiskMarginHealthCreate
   * @request POST:/api/v1/risk/margin_health/
   * @secure
   */
  riskMarginHealthCreate = (
    data: PangeaMarginHealthRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaMarginHealthResponse, any>({
      path: `/api/v1/risk/margin_health/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeMarginHealthRetrieve
   * @request GET:/api/v1/hedge/margin_health/
   * @secure
   */
  hedgeMarginHealthRetrieve = (params: RequestParams = {}) =>
    this.request<PangeaAutopilotMarginHealthResponse, any>({
      path: `/api/v1/hedge/margin_health/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get all the positions for an account
   *
   * @tags hedge
   * @name HedgePositionsRetrieve
   * @request GET:/api/v1/hedge/positions/
   * @secure
   */
  hedgePositionsRetrieve = (params: RequestParams = {}) =>
    this.request<PangeaActionStatus, PangeaActionStatus>({
      path: `/api/v1/hedge/positions/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get the realized PnL of an account
   *
   * @tags hedge
   * @name HedgeRealizedPnlRetrieve
   * @request GET:/api/v1/hedge/realized_pnl/
   * @secure
   */
  hedgeRealizedPnlRetrieve = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/hedge/realized_pnl/`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * @description Get realized variance for an account
   *
   * @tags hedge
   * @name HedgeRealizedVarianceRetrieve
   * @request GET:/api/v1/hedge/realized_variance/
   * @secure
   */
  hedgeRealizedVarianceRetrieve = (params: RequestParams = {}) =>
    this.request<PangeaActionStatus, PangeaActionStatus>({
      path: `/api/v1/hedge/realized_variance/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get the unrealized PnL of an account
   *
   * @tags hedge
   * @name HedgeUnrealizedPnlRetrieve
   * @request GET:/api/v1/hedge/unrealized_pnl/
   * @secure
   */
  hedgeUnrealizedPnlRetrieve = (params: RequestParams = {}) =>
    this.request<PangeaActionStatus, PangeaActionStatus>({
      path: `/api/v1/hedge/unrealized_pnl/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeForwardUpdateRequestCreate
   * @request POST:/api/v1/hedge/forward/update/request/
   * @secure
   */
  hedgeForwardUpdateRequestCreate = (
    data: PangeaUpdateRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaUpdateRequest, any>({
      path: `/api/v1/hedge/forward/update/request/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeForwardNdfCreate
   * @request POST:/api/v1/hedge/forward/ndf/
   * @secure
   */
  hedgeForwardNdfCreate = (data: PangeaUpdateNDF, params: RequestParams = {}) =>
    this.request<PangeaUpdateNDF, any>({
      path: `/api/v1/hedge/forward/ndf/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeForwardCreate
   * @request POST:/api/v1/hedge/forward/
   * @secure
   */
  hedgeForwardCreate = (
    data: PangeaDraftFxForward,
    params: RequestParams = {},
  ) =>
    this.request<PangeaDraftFxForward, any>({
      path: `/api/v1/hedge/forward/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeForwardList
   * @request GET:/api/v1/hedge/forward/
   * @secure
   */
  hedgeForwardList = (
    query: PangeaHedgeForwardListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedDraftFxForwardList, any>({
      path: `/api/v1/hedge/forward/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeForwardUpdate
   * @request PUT:/api/v1/hedge/forward/{id}/
   * @secure
   */
  hedgeForwardUpdate = (
    id: number,
    data: PangeaDraftFxForward,
    params: RequestParams = {},
  ) =>
    this.request<PangeaDraftFxForward, any>({
      path: `/api/v1/hedge/forward/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeForwardDestroy
   * @request DELETE:/api/v1/hedge/forward/{id}/
   * @secure
   */
  hedgeForwardDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/hedge/forward/${id}/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeForwardRetrieve
   * @request GET:/api/v1/hedge/forward/{id}/
   * @secure
   */
  hedgeForwardRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaDraftFxForward, any>({
      path: `/api/v1/hedge/forward/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeForwardPartialUpdate
   * @request PATCH:/api/v1/hedge/forward/{id}/
   * @secure
   */
  hedgeForwardPartialUpdate = (
    id: number,
    data: PangeaPatchedDraftFxForward,
    params: RequestParams = {},
  ) =>
    this.request<PangeaDraftFxForward, any>({
      path: `/api/v1/hedge/forward/${id}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeForwardActivateUpdate
   * @request PUT:/api/v1/hedge/forward/{id}/activate/
   * @secure
   */
  hedgeForwardActivateUpdate = (
    id: number,
    data: PangeaActivateDraftFxPosition,
    params: RequestParams = {},
  ) =>
    this.request<PangeaDraftFxForward, any>({
      path: `/api/v1/hedge/forward/${id}/activate/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags hedge
   * @name HedgeForwardWhatIfRetrieve
   * @request GET:/api/v1/hedge/forward/{id}/what_if/
   * @secure
   */
  hedgeForwardWhatIfRetrieve = (
    { id, ...query }: PangeaHedgeForwardWhatIfRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaWhatIf, PangeaMessageResponse>({
      path: `/api/v1/hedge/forward/${id}/what_if/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags payments
   * @name PaymentsStripeSetupIntentRetrieve
   * @request GET:/api/v1/payments/stripe/setup_intent
   * @secure
   */
  paymentsStripeSetupIntentRetrieve = (params: RequestParams = {}) =>
    this.request<PangeaStripeSetupIntent, any>({
      path: `/api/v1/payments/stripe/setup_intent`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags payments
   * @name PaymentsStripeSetupIntentCreate
   * @request POST:/api/v1/payments/stripe/setup_intent
   * @secure
   */
  paymentsStripeSetupIntentCreate = (params: RequestParams = {}) =>
    this.request<PangeaStripeSetupIntent, any>({
      path: `/api/v1/payments/stripe/setup_intent`,
      method: 'POST',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags payments
   * @name PaymentsStripePaymentMethodCreate
   * @request POST:/api/v1/payments/stripe/payment_method
   * @secure
   */
  paymentsStripePaymentMethodCreate = (
    data: PangeaStripePaymentMethodRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaStripePaymentMethodResponse, any>({
      path: `/api/v1/payments/stripe/payment_method`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Create new company's payment
   *
   * @tags payments
   * @name PaymentsCreate
   * @request POST:/api/v1/payments/
   * @secure
   */
  paymentsCreate = (data: PangeaPayment, params: RequestParams = {}) =>
    this.request<
      PangeaPayment,
      PangeaPaymentValidationError | PangeaPaymentError
    >({
      path: `/api/v1/payments/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Retrieve list of company's payment records
   *
   * @tags payments
   * @name PaymentsList
   * @request GET:/api/v1/payments/
   * @secure
   */
  paymentsList = (
    query: PangeaPaymentsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedPaymentList, PangeaPaymentError>({
      path: `/api/v1/payments/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Update company's payment detail by id
   *
   * @tags payments
   * @name PaymentsUpdate
   * @request PUT:/api/v1/payments/{id}/
   * @secure
   */
  paymentsUpdate = (
    id: number,
    data: PangeaPayment,
    params: RequestParams = {},
  ) =>
    this.request<
      PangeaPayment,
      PangeaPaymentValidationError | PangeaPaymentError
    >({
      path: `/api/v1/payments/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Remove company's payment by id
   *
   * @tags payments
   * @name PaymentsDestroy
   * @request DELETE:/api/v1/payments/{id}/
   * @secure
   */
  paymentsDestroy = (id: number, params: RequestParams = {}) =>
    this.request<PangeaPayment, PangeaPaymentError>({
      path: `/api/v1/payments/${id}/`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retrieve company's payment detail by id
   *
   * @tags payments
   * @name PaymentsRetrieve
   * @request GET:/api/v1/payments/{id}/
   * @secure
   */
  paymentsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaPayment, PangeaPaymentError>({
      path: `/api/v1/payments/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags payments
   * @name PaymentsCalendarValueDateCreate
   * @request POST:/api/v1/payments/calendar/value-date/
   * @secure
   */
  paymentsCalendarValueDateCreate = (
    data: PangeaValueDateCalendarRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaValueDateCalendarResponse, any>({
      path: `/api/v1/payments/calendar/value-date/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Create new cashflow payment record that will be tied to a certain payment
   *
   * @tags payments
   * @name PaymentsCashflowsCreate
   * @request POST:/api/v1/payments/{payment_id}/cashflows/
   * @secure
   */
  paymentsCashflowsCreate = (
    paymentId: number,
    data: PangeaInstallmentCashflow,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInstallmentCashflow, PangeaPaymentError>({
      path: `/api/v1/payments/${paymentId}/cashflows/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Retrieve list of company's cashflow payment records that tied to a certain payment
   *
   * @tags payments
   * @name PaymentsCashflowsList
   * @request GET:/api/v1/payments/{payment_id}/cashflows/
   * @secure
   */
  paymentsCashflowsList = (
    { paymentId, ...query }: PangeaPaymentsCashflowsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInstallmentCashflow[], PangeaPaymentError>({
      path: `/api/v1/payments/${paymentId}/cashflows/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Update company's cashflow payment detail by id that tied to a certain payment
   *
   * @tags payments
   * @name PaymentsCashflowsUpdate
   * @request PUT:/api/v1/payments/{payment_id}/cashflows/{cashflow_id}/
   * @secure
   */
  paymentsCashflowsUpdate = (
    cashflowId: string,
    paymentId: number,
    data: PangeaInstallmentCashflow,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInstallmentCashflow, PangeaPaymentError>({
      path: `/api/v1/payments/${paymentId}/cashflows/${cashflowId}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Remove company's cashflow payment by id that tied to a certain payment
   *
   * @tags payments
   * @name PaymentsCashflowsDestroy
   * @request DELETE:/api/v1/payments/{payment_id}/cashflows/{cashflow_id}/
   * @secure
   */
  paymentsCashflowsDestroy = (
    cashflowId: string,
    paymentId: number,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInstallmentCashflow, PangeaPaymentError>({
      path: `/api/v1/payments/${paymentId}/cashflows/${cashflowId}/`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retrieve company's cashflow payment detail by id that tied to a certain payment
   *
   * @tags payments
   * @name PaymentsCashflowsRetrieve
   * @request GET:/api/v1/payments/{payment_id}/cashflows/{cashflow_id}/
   * @secure
   */
  paymentsCashflowsRetrieve = (
    cashflowId: string,
    paymentId: number,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInstallmentCashflow, PangeaPaymentError>({
      path: `/api/v1/payments/${paymentId}/cashflows/${cashflowId}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags payments
   * @name PaymentsRfqRetrieve
   * @request GET:/api/v1/payments/{id}/rfq/
   * @secure
   */
  paymentsRfqRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaDetailedPaymentRfqResponse, any>({
      path: `/api/v1/payments/${id}/rfq/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags payments
   * @name PaymentsExecuteRetrieve
   * @request GET:/api/v1/payments/{id}/execute/
   * @secure
   */
  paymentsExecuteRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaPaymentExecutionResponse, any>({
      path: `/api/v1/payments/${id}/execute/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Create new company's bulk payment
   *
   * @tags payments
   * @name PaymentsBulkPaymentsCreate
   * @request POST:/api/v1/payments/bulk-payments/
   * @secure
   */
  paymentsBulkPaymentsCreate = (
    data: PangeaBulkPaymentRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBulkPaymentResponse, any>({
      path: `/api/v1/payments/bulk-payments/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Update company's bulk payment
   *
   * @tags payments
   * @name PaymentsBulkPaymentsUpdate
   * @request PUT:/api/v1/payments/bulk-payments/
   * @secure
   */
  paymentsBulkPaymentsUpdate = (
    data: PangeaBulkPaymentUpdate,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBulkPaymentResponse, any>({
      path: `/api/v1/payments/bulk-payments/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Validate company's bulk payment data
   *
   * @tags payments
   * @name PaymentsBulkPaymentsValidateCreate
   * @request POST:/api/v1/payments/bulk-payments/validate/
   * @secure
   */
  paymentsBulkPaymentsValidateCreate = (
    data: PangeaBulkPaymentRequest,
    params: RequestParams = {},
  ) =>
    this.request<
      PangeaBulkPaymentRequest,
      PangeaBulkPaymentValidationErrorResponse
    >({
      path: `/api/v1/payments/bulk-payments/validate/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags payments
   * @name PaymentsBulkPaymentsRfqCreate
   * @request POST:/api/v1/payments/bulk-payments-rfq/
   * @secure
   */
  paymentsBulkPaymentsRfqCreate = (
    data: PangeaBulkPaymentRfq,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBulkRfqStatus, any>({
      path: `/api/v1/payments/bulk-payments-rfq/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags payments
   * @name PaymentsBulkPaymentsExecutionCreate
   * @request POST:/api/v1/payments/bulk-payments-execution/
   * @secure
   */
  paymentsBulkPaymentsExecutionCreate = (
    data: PangeaBulkPaymentExecution,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBulkExecutionStatus, any>({
      path: `/api/v1/payments/bulk-payments-execution/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get spot dates from provided market/pair list
   *
   * @tags payments
   * @name PaymentsMarketSpotDatesCreate
   * @request POST:/api/v1/payments/market-spot-dates/
   * @secure
   */
  paymentsMarketSpotDatesCreate = (
    data: PangeaMarketSpotDateRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaMarketSpotDates, any>({
      path: `/api/v1/payments/market-spot-dates/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags notification
   * @name NotificationEventsList
   * @request GET:/api/v1/notification/events/
   * @secure
   */
  notificationEventsList = (
    query: PangeaNotificationEventsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedNotificationEventList, any>({
      path: `/api/v1/notification/events/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags notification
   * @name NotificationEventsRetrieve
   * @request GET:/api/v1/notification/events/{id}/
   * @secure
   */
  notificationEventsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaNotificationEvent, any>({
      path: `/api/v1/notification/events/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags notification
   * @name NotificationUserCreate
   * @request POST:/api/v1/notification/user/
   * @secure
   */
  notificationUserCreate = (
    data: PangeaUserNotification,
    params: RequestParams = {},
  ) =>
    this.request<PangeaUserNotification, any>({
      path: `/api/v1/notification/user/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags notification
   * @name NotificationUserList
   * @request GET:/api/v1/notification/user/
   * @secure
   */
  notificationUserList = (
    query: PangeaNotificationUserListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedUserNotificationList, any>({
      path: `/api/v1/notification/user/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags notification
   * @name NotificationUserBulkCreateUpdateUpdate
   * @request PUT:/api/v1/notification/user/bulk_create_update/
   * @secure
   */
  notificationUserBulkCreateUpdateUpdate = (
    data: PangeaUserNotificationBulkCreateUpdate[],
    params: RequestParams = {},
  ) =>
    this.request<PangeaUserNotificationBulkCreateUpdate[], Record<string, any>>(
      {
        path: `/api/v1/notification/user/bulk_create_update/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      },
    );
  /**
   * No description
   *
   * @tags notification
   * @name NotificationUserUpdate
   * @request PUT:/api/v1/notification/user/{id}/
   * @secure
   */
  notificationUserUpdate = (
    id: number,
    data: PangeaUserNotification,
    params: RequestParams = {},
  ) =>
    this.request<PangeaUserNotification, any>({
      path: `/api/v1/notification/user/${id}/`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags notification
   * @name NotificationUserDestroy
   * @request DELETE:/api/v1/notification/user/{id}/
   * @secure
   */
  notificationUserDestroy = (id: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/notification/user/${id}/`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags notification
   * @name NotificationUserRetrieve
   * @request GET:/api/v1/notification/user/{id}/
   * @secure
   */
  notificationUserRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaUserNotification, any>({
      path: `/api/v1/notification/user/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags notification
   * @name NotificationUserPartialUpdate
   * @request PATCH:/api/v1/notification/user/{id}/
   * @secure
   */
  notificationUserPartialUpdate = (
    id: number,
    data: PangeaPatchedUserNotification,
    params: RequestParams = {},
  ) =>
    this.request<PangeaUserNotification, any>({
      path: `/api/v1/notification/user/${id}/`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags notification
   * @name NotificationResendCreate
   * @request POST:/api/v1/notification/resend
   * @secure
   */
  notificationResendCreate = (
    data: PangeaResendNotificationRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaResendNotificationResponse, any>({
      path: `/api/v1/notification/resend`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbEcaApplicationCreate
   * @request POST:/api/v1/broker/ib/eca/application
   * @secure
   */
  brokerIbEcaApplicationCreate = (
    data: PangeaIBApplications,
    params: RequestParams = {},
  ) =>
    this.request<PangeaIBApplications, any>({
      path: `/api/v1/broker/ib/eca/application`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbEcaSsoUrlCreate
   * @request POST:/api/v1/broker/ib/eca/sso_url
   * @secure
   */
  brokerIbEcaSsoUrlCreate = (
    data: PangeaCreateECASSO,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCreateECASSOResponse, any>({
      path: `/api/v1/broker/ib/eca/sso_url`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Service to query status of account(s).
   *
   * @tags broker
   * @name BrokerIbEcaAccountStatusesList
   * @request GET:/api/v1/broker/ib/eca/account_statuses
   * @secure
   */
  brokerIbEcaAccountStatusesList = (params: RequestParams = {}) =>
    this.request<PangeaIBAccountStatusRequest[], any>({
      path: `/api/v1/broker/ib/eca/account_statuses`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbEcaAccountStatusRetrieve
   * @request GET:/api/v1/broker/ib/eca/account_status
   * @secure
   */
  brokerIbEcaAccountStatusRetrieve = (
    query: PangeaBrokerIbEcaAccountStatusRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaIBAccountStatusResponse, any>({
      path: `/api/v1/broker/ib/eca/account_status`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbEcaPendingTasksRetrieve
   * @request GET:/api/v1/broker/ib/eca/pending_tasks
   * @secure
   */
  brokerIbEcaPendingTasksRetrieve = (
    query: PangeaBrokerIbEcaPendingTasksRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPendingTasksResponse, any>({
      path: `/api/v1/broker/ib/eca/pending_tasks`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbEcaRegistrationTasksRetrieve
   * @request GET:/api/v1/broker/ib/eca/registration_tasks
   * @secure
   */
  brokerIbEcaRegistrationTasksRetrieve = (
    query: PangeaBrokerIbEcaRegistrationTasksRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaRegistrationTasksResponse, any>({
      path: `/api/v1/broker/ib/eca/registration_tasks`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbFbInstructionNameRetrieve
   * @request GET:/api/v1/broker/ib/fb/instruction_name
   * @secure
   */
  brokerIbFbInstructionNameRetrieve = (
    query: PangeaBrokerIbFbInstructionNameRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaIBFBResponse, any>({
      path: `/api/v1/broker/ib/fb/instruction_name`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbFbDepositFundsCreate
   * @request POST:/api/v1/broker/ib/fb/deposit_funds
   * @secure
   */
  brokerIbFbDepositFundsCreate = (
    data: PangeaDepositRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaIBFBResponse, any>({
      path: `/api/v1/broker/ib/fb/deposit_funds`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbFbWithdrawFundCreate
   * @request POST:/api/v1/broker/ib/fb/withdraw_fund
   * @secure
   */
  brokerIbFbWithdrawFundCreate = (
    data: PangeaWithdrawRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaIBFBResponse, any>({
      path: `/api/v1/broker/ib/fb/withdraw_fund`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Service is used to poll for status using the previously uploaded fund request.
   *
   * @tags broker
   * @name BrokerIbFbStatusRetrieve
   * @request GET:/api/v1/broker/ib/fb/status
   * @secure
   */
  brokerIbFbStatusRetrieve = (
    query: PangeaBrokerIbFbStatusRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaIBFBResponse, any>({
      path: `/api/v1/broker/ib/fb/status`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbFbFundingRequestsList
   * @request GET:/api/v1/broker/ib/fb/funding_requests
   * @secure
   */
  brokerIbFbFundingRequestsList = (
    query: PangeaBrokerIbFbFundingRequestsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedFundingRequestList, any>({
      path: `/api/v1/broker/ib/fb/funding_requests`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbFbWireInstructionsList
   * @request GET:/api/v1/broker/ib/fb/wire_instructions
   * @secure
   */
  brokerIbFbWireInstructionsList = (
    query: PangeaBrokerIbFbWireInstructionsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedWireInstructionList, any>({
      path: `/api/v1/broker/ib/fb/wire_instructions`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerIbFbPredefinedDestinationInstructionCreate
   * @request POST:/api/v1/broker/ib/fb/predefined_destination_instruction
   * @secure
   */
  brokerIbFbPredefinedDestinationInstructionCreate = (
    data: PangeaPredefinedDestinationInstructionRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaFundingRequest, any>({
      path: `/api/v1/broker/ib/fb/predefined_destination_instruction`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Retreive the contract (response)
   *
   * @tags broker
   * @name BrokerIbContractDetailRetrieve
   * @request GET:/api/v1/broker/ib/contract/detail/{symbol}
   * @secure
   */
  brokerIbContractDetailRetrieve = (
    symbol: string,
    params: RequestParams = {},
  ) =>
    this.request<PangeaFutureContract, any>({
      path: `/api/v1/broker/ib/contract/detail/${symbol}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retreive all contracts by base_currency (response)
   *
   * @tags broker
   * @name BrokerIbContractList
   * @request GET:/api/v1/broker/ib/contract/{base}
   * @secure
   */
  brokerIbContractList = (base: string, params: RequestParams = {}) =>
    this.request<PangeaFutureContract[], any>({
      path: `/api/v1/broker/ib/contract/${base}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retreive all contracts by base_currency (response)
   *
   * @tags broker
   * @name BrokerIbContractActiveList2
   * @request GET:/api/v1/broker/ib/contract/active/{base}
   * @secure
   */
  brokerIbContractActiveList2 = (base: string, params: RequestParams = {}) =>
    this.request<PangeaFutureContract[], any>({
      path: `/api/v1/broker/ib/contract/active/${base}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Retreive all contracts by base_currency (response)
   *
   * @tags broker
   * @name BrokerIbContractActiveList
   * @request GET:/api/v1/broker/ib/contract/active/
   * @secure
   */
  brokerIbContractActiveList = (params: RequestParams = {}) =>
    this.request<PangeaFutureContract[], any>({
      path: `/api/v1/broker/ib/contract/active/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description List of companies to get account summary for
   *
   * @tags broker
   * @name BrokerIbSystemCompaniesRetrieve
   * @request GET:/api/v1/broker/ib/system/companies/
   * @secure
   */
  brokerIbSystemCompaniesRetrieve = (params: RequestParams = {}) =>
    this.request<number[], any>({
      path: `/api/v1/broker/ib/system/companies/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpaySpotRateCreate
   * @request POST:/api/v1/broker/corpay/spot/rate
   * @secure
   */
  brokerCorpaySpotRateCreate = (
    data: PangeaSpotRateRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaSpotRateResponse, any>({
      path: `/api/v1/broker/corpay/spot/rate`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpaySpotBookDealCreate
   * @request POST:/api/v1/broker/corpay/spot/book-deal
   * @secure
   */
  brokerCorpaySpotBookDealCreate = (
    data: PangeaBookDealRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBookDealResponse, any>({
      path: `/api/v1/broker/corpay/spot/book-deal`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpaySpotInstructDealCreate
   * @request POST:/api/v1/broker/corpay/spot/instruct-deal
   * @secure
   */
  brokerCorpaySpotInstructDealCreate = (
    data: PangeaInstructDealRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInstructDealResponse, any>({
      path: `/api/v1/broker/corpay/spot/instruct-deal`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpaySpotBookInstructDealCreate
   * @request POST:/api/v1/broker/corpay/spot/book-instruct-deal
   * @secure
   */
  brokerCorpaySpotBookInstructDealCreate = (
    data: PangeaBookInstructDealRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaInstructDealResponse, any>({
      path: `/api/v1/broker/corpay/spot/book-instruct-deal`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpaySpotPurposeOfPaymentRetrieve
   * @request GET:/api/v1/broker/corpay/spot/purpose-of-payment
   * @secure
   */
  brokerCorpaySpotPurposeOfPaymentRetrieve = (
    query: PangeaBrokerCorpaySpotPurposeOfPaymentRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPurposeOfPaymentResponse, any>({
      path: `/api/v1/broker/corpay/spot/purpose-of-payment`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpaySettlementAccountsRetrieve
   * @request GET:/api/v1/broker/corpay/settlement/accounts
   * @secure
   */
  brokerCorpaySettlementAccountsRetrieve = (params: RequestParams = {}) =>
    this.request<PangeaSettlementAccountsResponse, any>({
      path: `/api/v1/broker/corpay/settlement/accounts`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayFxBalanceAccountsRetrieve
   * @request GET:/api/v1/broker/corpay/fx-balance/accounts
   * @secure
   */
  brokerCorpayFxBalanceAccountsRetrieve = (
    query: PangeaBrokerCorpayFxBalanceAccountsRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaFXBalanceAccountsResponse, any>({
      path: `/api/v1/broker/corpay/fx-balance/accounts`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayFxBalanceHistoryList
   * @request GET:/api/v1/broker/corpay/fx-balance/history
   * @secure
   */
  brokerCorpayFxBalanceHistoryList = (
    query: PangeaBrokerCorpayFxBalanceHistoryListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedFXBalanceAccountHistoryRowList, any>({
      path: `/api/v1/broker/corpay/fx-balance/history`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayFxBalanceCompanyList
   * @request GET:/api/v1/broker/corpay/fx-balance/company
   * @secure
   */
  brokerCorpayFxBalanceCompanyList = (
    query: PangeaBrokerCorpayFxBalanceCompanyListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedCompanyFXBalanceAccountHistoryList, any>({
      path: `/api/v1/broker/corpay/fx-balance/company`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayBeneficiaryBanksRetrieve
   * @request GET:/api/v1/broker/corpay/beneficiary/banks
   * @secure
   */
  brokerCorpayBeneficiaryBanksRetrieve = (
    query: PangeaBrokerCorpayBeneficiaryBanksRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaListBankResponse, any>({
      path: `/api/v1/broker/corpay/beneficiary/banks`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayBeneficiaryIbanValidationCreate
   * @request POST:/api/v1/broker/corpay/beneficiary/iban-validation
   * @secure
   */
  brokerCorpayBeneficiaryIbanValidationCreate = (
    data: PangeaIbanValidationRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaIbanValidationResponse, any>({
      path: `/api/v1/broker/corpay/beneficiary/iban-validation`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayBeneficiaryRulesRetrieve
   * @request GET:/api/v1/broker/corpay/beneficiary/rules
   * @secure
   */
  brokerCorpayBeneficiaryRulesRetrieve = (
    query: PangeaBrokerCorpayBeneficiaryRulesRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBeneficiaryRulesResponse, any>({
      path: `/api/v1/broker/corpay/beneficiary/rules`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayBeneficiaryRetrieve
   * @request GET:/api/v1/broker/corpay/beneficiary
   * @secure
   */
  brokerCorpayBeneficiaryRetrieve = (
    query: PangeaBrokerCorpayBeneficiaryRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaRetrieveBeneficiaryResponse, any>({
      path: `/api/v1/broker/corpay/beneficiary`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayBeneficiaryCreate
   * @request POST:/api/v1/broker/corpay/beneficiary
   * @secure
   */
  brokerCorpayBeneficiaryCreate = (
    data: PangeaBeneficiaryRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBeneficiaryResponse, any>({
      path: `/api/v1/broker/corpay/beneficiary`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayBeneficiaryDestroy
   * @request DELETE:/api/v1/broker/corpay/beneficiary
   * @secure
   */
  brokerCorpayBeneficiaryDestroy = (
    query: PangeaBrokerCorpayBeneficiaryDestroyParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaDeleteBeneficiaryResponse, any>({
      path: `/api/v1/broker/corpay/beneficiary`,
      method: 'DELETE',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayBeneficiariesRetrieve
   * @request GET:/api/v1/broker/corpay/beneficiaries
   * @secure
   */
  brokerCorpayBeneficiariesRetrieve = (
    query: PangeaBrokerCorpayBeneficiariesRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaListBeneficiaryResponse, any>({
      path: `/api/v1/broker/corpay/beneficiaries`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayClientOnboardingCreate
   * @request POST:/api/v1/broker/corpay/client-onboarding
   * @secure
   */
  brokerCorpayClientOnboardingCreate = (
    data: PangeaOnboardingRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaOnboardingResponse, any>({
      path: `/api/v1/broker/corpay/client-onboarding`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayClientOnboardingPicklistRetrieve
   * @request GET:/api/v1/broker/corpay/client-onboarding/picklist
   * @secure
   */
  brokerCorpayClientOnboardingPicklistRetrieve = (
    query: PangeaBrokerCorpayClientOnboardingPicklistRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaOnboardingPickListResponse, any>({
      path: `/api/v1/broker/corpay/client-onboarding/picklist`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayClientOnboardingUploadCreate
   * @request POST:/api/v1/broker/corpay/client-onboarding/upload
   * @secure
   */
  brokerCorpayClientOnboardingUploadCreate = (
    data: PangeaOnboardingFileUploadRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaOnboardingFileUploadResponse, any>({
      path: `/api/v1/broker/corpay/client-onboarding/upload`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayCostsRetrieve
   * @request GET:/api/v1/broker/corpay/costs
   * @secure
   */
  brokerCorpayCostsRetrieve = (
    query: PangeaBrokerCorpayCostsRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCostResponse, any>({
      path: `/api/v1/broker/corpay/costs`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayProxyCreate
   * @request POST:/api/v1/broker/corpay/proxy
   * @secure
   */
  brokerCorpayProxyCreate = (
    data: PangeaProxyRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaProxy, any>({
      path: `/api/v1/broker/corpay/proxy`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayFxpairsList
   * @request GET:/api/v1/broker/corpay/fxpairs/
   * @secure
   */
  brokerCorpayFxpairsList = (
    query: PangeaBrokerCorpayFxpairsListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedSupportedFxPairsList, any>({
      path: `/api/v1/broker/corpay/fxpairs/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayFxpairsRetrieve
   * @request GET:/api/v1/broker/corpay/fxpairs/{id}/
   * @secure
   */
  brokerCorpayFxpairsRetrieve = (id: number, params: RequestParams = {}) =>
    this.request<PangeaSupportedFxPairs, any>({
      path: `/api/v1/broker/corpay/fxpairs/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayCreditUtilizationList
   * @request GET:/api/v1/broker/corpay/credit-utilization/
   * @secure
   */
  brokerCorpayCreditUtilizationList = (params: RequestParams = {}) =>
    this.request<PangeaCreditUtilization[], any>({
      path: `/api/v1/broker/corpay/credit-utilization/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayCurrencyDefinitionList
   * @request GET:/api/v1/broker/corpay/currency-definition/
   * @secure
   */
  brokerCorpayCurrencyDefinitionList = (
    query: PangeaBrokerCorpayCurrencyDefinitionListParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPaginatedCurrencyDefinitionList, any>({
      path: `/api/v1/broker/corpay/currency-definition/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayCurrencyDefinitionRetrieve
   * @request GET:/api/v1/broker/corpay/currency-definition/{id}/
   * @secure
   */
  brokerCorpayCurrencyDefinitionRetrieve = (
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCurrencyDefinition, any>({
      path: `/api/v1/broker/corpay/currency-definition/${id}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpaySpotSaveInstructDealRequestCreate
   * @request POST:/api/v1/broker/corpay/spot/save-instruct-deal-request
   * @secure
   */
  brokerCorpaySpotSaveInstructDealRequestCreate = (
    data: PangeaSaveInstructRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaSaveInstructRequestResponse, any>({
      path: `/api/v1/broker/corpay/spot/save-instruct-deal-request`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayForwardQuoteCreate
   * @request POST:/api/v1/broker/corpay/forward/quote
   * @secure
   */
  brokerCorpayForwardQuoteCreate = (
    data: PangeaForwardQuoteRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaForwardQuoteResponse, any>({
      path: `/api/v1/broker/corpay/forward/quote`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayForwardBookQuoteCreate
   * @request POST:/api/v1/broker/corpay/forward/book-quote
   * @secure
   */
  brokerCorpayForwardBookQuoteCreate = (
    data: PangeaForwardBookQuoteRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaForwardBookQuoteResponse, any>({
      path: `/api/v1/broker/corpay/forward/book-quote`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayForwardCompleteOrderCreate
   * @request POST:/api/v1/broker/corpay/forward/complete-order
   * @secure
   */
  brokerCorpayForwardCompleteOrderCreate = (
    data: PangeaForwardCompleteOrderRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaForwardCompleteOrderResponse, any>({
      path: `/api/v1/broker/corpay/forward/complete-order`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayMassPaymentsQuotePaymentsCreate
   * @request POST:/api/v1/broker/corpay/mass-payments/quote-payments
   * @secure
   */
  brokerCorpayMassPaymentsQuotePaymentsCreate = (
    data: PangeaQuotePaymentsRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaQuotePaymentsResponse, any>({
      path: `/api/v1/broker/corpay/mass-payments/quote-payments`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayMassPaymentsBookPaymentsCreate
   * @request POST:/api/v1/broker/corpay/mass-payments/book-payments
   * @secure
   */
  brokerCorpayMassPaymentsBookPaymentsCreate = (
    data: PangeaBookPaymentsRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBookPaymentsResponse, any>({
      path: `/api/v1/broker/corpay/mass-payments/book-payments`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayPaymentQuoteCreate
   * @request POST:/api/v1/broker/corpay/payment/quote
   * @secure
   */
  brokerCorpayPaymentQuoteCreate = (
    data: PangeaQuotePayment,
    params: RequestParams = {},
  ) =>
    this.request<PangeaQuotePaymentResponse, any>({
      path: `/api/v1/broker/corpay/payment/quote`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCorpayPaymentBookCreate
   * @request POST:/api/v1/broker/corpay/payment/book
   * @secure
   */
  brokerCorpayPaymentBookCreate = (
    data: PangeaBookPaymentRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBookPaymentsResponse, any>({
      path: `/api/v1/broker/corpay/payment/book`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Takes a set of user credentials and returns an access and refresh JSON web token pair to prove the authentication of those credentials.
   *
   * @tags token
   * @name TokenCreate
   * @request POST:/api/v1/token/
   */
  tokenCreate = (data: PangeaTokenObtainPair, params: RequestParams = {}) =>
    this.request<PangeaTokenObtainPairResponse, any>({
      path: `/api/v1/token/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
   *
   * @tags token
   * @name TokenRefreshCreate
   * @request POST:/api/v1/token/refresh
   */
  tokenRefreshCreate = (data: PangeaTokenRefresh, params: RequestParams = {}) =>
    this.request<PangeaTokenRefreshResponse, any>({
      path: `/api/v1/token/refresh`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Takes a token and indicates if it is valid.  This view provides no information about a token's fitness for a particular use.
   *
   * @tags token
   * @name TokenVerifyCreate
   * @request POST:/api/v1/token/verify
   */
  tokenVerifyCreate = (data: PangeaTokenVerify, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/token/verify`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags marketing
   * @name MarketingFxCalculatorRateCreate
   * @request POST:/api/v1/marketing/fx/calculator/rate
   * @secure
   */
  marketingFxCalculatorRateCreate = (
    data: PangeaFxCalculator,
    params: RequestParams = {},
  ) =>
    this.request<PangeaFxCalculatorResponse, any>({
      path: `/api/v1/marketing/fx/calculator/rate`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags marketing
   * @name MarketingDemoFormSubmitCreate
   * @request POST:/api/v1/marketing/demo-form/submit
   * @secure
   */
  marketingDemoFormSubmitCreate = (
    data: PangeaDemoFormRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaDemoResponse, any>({
      path: `/api/v1/marketing/demo-form/submit`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags ndl
   * @name NdlSgeListList
   * @summary Get all currency definitions
   * @request GET:/api/v1/ndl/sge/list/
   * @secure
   */
  ndlSgeListList = (params: RequestParams = {}) =>
    this.request<Pangea_SGE[], any>({
      path: `/api/v1/ndl/sge/list/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags ndl
   * @name NdlSgeDetailList
   * @summary Retrieve specific currency records based on currency_code and value_type
   * @request GET:/api/v1/ndl/sge/detail/{currency_code}/{value_type}/
   * @secure
   */
  ndlSgeDetailList = (
    currencyCode: string,
    valueType: string,
    params: RequestParams = {},
  ) =>
    this.request<Pangea_SGE[], Record<string, any>>({
      path: `/api/v1/ndl/sge/detail/${currencyCode}/${valueType}/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags ndl
   * @name NdlSgeAverageP10Retrieve
   * @request GET:/api/v1/ndl/sge/average/p10/{value_type}/
   * @secure
   */
  ndlSgeAverageP10Retrieve = (valueType: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/ndl/sge/average/p10/${valueType}/`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags dataprovider
   * @name DataproviderProfileParallelOptionRetrieve
   * @request GET:/api/v1/dataprovider/profile/parallel-option
   * @secure
   */
  dataproviderProfileParallelOptionRetrieve = (
    query: PangeaDataproviderProfileParallelOptionRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaProfileParallelOptionResponse, any>({
      path: `/api/v1/dataprovider/profile/parallel-option`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerUniverseCreate
   * @request POST:/api/v1/broker/universe/
   * @secure
   */
  brokerUniverseCreate = (data: PangeaBuySell, params: RequestParams = {}) =>
    this.request<PangeaResponse, PangeaError>({
      path: `/api/v1/broker/universe/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags broker
   * @name BrokerCreate
   * @request POST:/api/v1/broker/{broker}/{action}
   * @secure
   */
  brokerCreate = (action: string, broker: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/broker/${broker}/${action}`,
      method: 'POST',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags slack
   * @name SlackCreate
   * @request POST:/api/v1/slack/{action}
   * @secure
   */
  slackCreate = (action: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/v1/slack/${action}`,
      method: 'POST',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags approval
   * @name ApprovalApproverCreate
   * @request POST:/api/v1/approval/approver/
   * @secure
   */
  approvalApproverCreate = (
    data: PangeaApproverRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaApproverResponse, any>({
      path: `/api/v1/approval/approver/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags approval
   * @name ApprovalRequestPaymentApprovalCreate
   * @request POST:/api/v1/approval/request-payment-approval/
   * @secure
   */
  approvalRequestPaymentApprovalCreate = (
    data: PangeaRequestApproval,
    params: RequestParams = {},
  ) =>
    this.request<PangeaActionStatus, PangeaActionStatus | PangeaPaymentError>({
      path: `/api/v1/approval/request-payment-approval/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags approval
   * @name ApprovalApproveRequestRetrieve
   * @request GET:/api/v1/approval/approve-request/
   * @secure
   */
  approvalApproveRequestRetrieve = (
    query: PangeaApprovalApproveRequestRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaActionStatus, PangeaActionStatus | PangeaPaymentError>({
      path: `/api/v1/approval/approve-request/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags history
   * @name HistoryActivitiesRetrieve
   * @request GET:/api/v1/history/activities/
   * @secure
   */
  historyActivitiesRetrieve = (
    query: PangeaHistoryActivitiesRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaActivities, PangeaActionStatus>({
      path: `/api/v1/history/activities/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags history
   * @name HistoryFeesPaymentsRetrieve
   * @request GET:/api/v1/history/fees-payments/
   * @secure
   */
  historyFeesPaymentsRetrieve = (
    query: PangeaHistoryFeesPaymentsRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaFeesPayments, PangeaActionStatus>({
      path: `/api/v1/history/fees-payments/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags history
   * @name HistoryBankStatementsRetrieve
   * @request GET:/api/v1/history/bank-statements/
   * @secure
   */
  historyBankStatementsRetrieve = (
    query: PangeaHistoryBankStatementsRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaBankStatements, PangeaActionStatus>({
      path: `/api/v1/history/bank-statements/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags history
   * @name HistoryTradesRetrieve
   * @request GET:/api/v1/history/trades/
   * @secure
   */
  historyTradesRetrieve = (
    query: PangeaHistoryTradesRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PangeaTrades, PangeaActionStatus>({
      path: `/api/v1/history/trades/`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * @description Get the NPV of a cashflow, the NPV of the account it is part of, and NPV of the company.
   *
   * @tags history
   * @name HistoryCashflowWeightCreate
   * @request POST:/api/v1/history/cashflow_weight/
   * @secure
   */
  historyCashflowWeightCreate = (
    data: PangeaCashFlowWeightRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashFlowWeightResponse, any>({
      path: `/api/v1/history/cashflow_weight/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get the performance of the portfolio or company (hedged values), along with the performance of a hypothetical unhedged portfolio with the same cash exposures (unhedged values). Returns three lists, a list of "dates", a list of "unhedged_values," and a list of "hedged_values."
   *
   * @tags history
   * @name HistoryPerformanceCreate
   * @request POST:/api/v1/history/performance/
   * @secure
   */
  historyPerformanceCreate = (
    data: PangeaPerformanceRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaPerformanceResponse, any>({
      path: `/api/v1/history/performance/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags history
   * @name HistoryRealizedVolatilityCreate
   * @request POST:/api/v1/history/realized_volatility/
   * @secure
   */
  historyRealizedVolatilityCreate = (
    data: PangeaRealizedVolatilityRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaRealizedVolatilityResponse, any>({
      path: `/api/v1/history/realized_volatility/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags history
   * @name HistoryCashflowAbsForwardCreate
   * @request POST:/api/v1/history/cashflow_abs_forward/
   * @secure
   */
  historyCashflowAbsForwardCreate = (
    data: PangeaCashflowAbsForwardRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaCashflowAbsForwardResponse, any>({
      path: `/api/v1/history/cashflow_abs_forward/`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description Get the NPV of a cashflow, the NPV of the account it is part of, and NPV of the company.
   *
   * @tags history
   * @name HistoryAccountPnlsCreate
   * @request POST:/api/v1/history/account_pnls
   * @secure
   */
  historyAccountPnlsCreate = (
    data: PangeaAccountPnLRequest,
    params: RequestParams = {},
  ) =>
    this.request<PangeaAccountPnLResponse, any>({
      path: `/api/v1/history/account_pnls`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
