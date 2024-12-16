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

export interface PangeaAccount {
  id: number;
  company: number;
  type: string;
  hedge_settings: PangeaHedgeSettings;
  parachute_data?: PangeaParachuteData;
  autopilot_data?: PangeaAutopilotData;
  /** @maxLength 255 */
  name: string;
  /** @format date-time */
  created: string;
  is_active?: boolean;
  is_hidden?: boolean;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  strategy?: PangeaStrategyEnum;
}

export interface PangeaAccountCompany {
  id: number;
  /** @maxLength 255 */
  name: string;
}

/** An object representing a request to get some account's PnL. */
export interface PangeaAccountPnLRequest {
  start_date: string;
  end_date: string;
  account_id?: number;
}

export interface PangeaAccountPnLResponse {
  times: string[];
  unhedged_pnl: number[];
  hedged_pnl: number[];
}

/** A serializer representing condensed information about the account. */
export interface PangeaAccountSummary {
  id: number;
  /** @maxLength 255 */
  name: string;
}

/**
 * * `1` - Live
 * * `2` - Paper
 */
export enum PangeaAccountTypeEnum {
  Value1 = 1,
  Value2 = 2,
}

/**
 * * `rfq` - RFQ
 * * `execute` - Execute
 */
export enum PangeaAction8DeEnum {
  Rfq = 'rfq',
  Execute = 'execute',
}

export interface PangeaActionStatus {
  message?: string;
  status?: string;
  code?: number;
  data?: any;
}

export interface PangeaActivateBeneficiaryRequest {
  /** This can be either be beneficiary_id or alias */
  identifier: string;
}

export interface PangeaActivateDraftFxPosition {
  funding_account?: string | null;
}

export interface PangeaActivateUserResponse {
  status: boolean;
  message?: string;
}

export interface PangeaActivity {
  /** @format date-time */
  created: string;
  changes: string;
  user: PangeaActivityUser;
  /**
   * * `UserAdded` - USER_ADDED
   * * `PasswordReset` - PASSWORD_RESET
   * * `EmailChange` - EMAIL_CHANGE
   * * `AccountCreated` - ACCOUNT_CREATED
   * * `IbVerified` - IB_VERIFIED
   * * `CompanyVerified` - COMPANY_VERIFIED
   * * `PaymentCreated` - PAYMENT_CREATED
   * * `PaymentChanged` - PAYMENT_CHANGED
   */
  activity_type: PangeaActivityTypeEnum;
}

/**
 * * `UserAdded` - USER_ADDED
 * * `PasswordReset` - PASSWORD_RESET
 * * `EmailChange` - EMAIL_CHANGE
 * * `AccountCreated` - ACCOUNT_CREATED
 * * `IbVerified` - IB_VERIFIED
 * * `CompanyVerified` - COMPANY_VERIFIED
 * * `PaymentCreated` - PAYMENT_CREATED
 * * `PaymentChanged` - PAYMENT_CHANGED
 */
export enum PangeaActivityTypeEnum {
  UserAdded = 'UserAdded',
  PasswordReset = 'PasswordReset',
  EmailChange = 'EmailChange',
  AccountCreated = 'AccountCreated',
  IbVerified = 'IbVerified',
  CompanyVerified = 'CompanyVerified',
  PaymentCreated = 'PaymentCreated',
  PaymentChanged = 'PaymentChanged',
}

export interface PangeaActivityUser {
  id: number;
}

export interface PangeaApproveCompanyJoinRequest {
  company_join_request_id: number;
}

export interface PangeaApprover {
  id: number;
  /** @maxLength 150 */
  first_name?: string;
  /** @maxLength 150 */
  last_name?: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
}

export interface PangeaApproverRequest {
  lock_side_currency: string;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  lock_side_amount: number;
  /** @format date */
  value_date: string;
}

export interface PangeaApproverResponse {
  approvers: PangeaApprover[];
}

export interface PangeaAutopilotData {
  id: number;
  account: number;
  /** @format double */
  upper_limit?: number;
  /** @format double */
  lower_limit?: number;
}

export interface PangeaAutopilotDataRequest {
  /** @format double */
  upper_limit?: number;
  /** @format double */
  lower_limit?: number;
}

export interface PangeaAutopilotHedgeMetricResponse {
  /** @format double */
  potential_loss_mitigated: number;
  /** @format double */
  upside_preservation: number;
  /** @format double */
  hedge_efficiency_ratio?: number | null;
}

export interface PangeaAutopilotMarginHealthResponse {
  credit_usage: PangeaCreditUtilizationResponse;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  margin_call_at: string;
}

export interface PangeaAutopilotWhatIfResponse {
  credit_usage: PangeaCreditUsageResponse;
  rate: PangeaRateResponse;
  fee: PangeaFeeResponse[];
  hedge_metric: PangeaAutopilotHedgeMetricResponse;
}

export interface PangeaAverageFxSpotPrice {
  pair: PangeaFxPair;
  /** @format double */
  average_rate: number;
  /** @format double */
  average_rate_bid: number;
  /** @format double */
  average_rate_ask: number;
}

/**
 * * `iban` - IBAN
 * * `clabe` - CLABE
 * * `account_number` - Account Number
 */
export enum PangeaBankAccountNumberTypeEnum {
  Iban = 'iban',
  Clabe = 'clabe',
  AccountNumber = 'account_number',
}

/**
 * * `current` - Current
 * * `saving` - Saving
 * * `maestra` - Maestra
 * * `checking` - Checking
 */
export enum PangeaBankAccountTypeEnum {
  Current = 'current',
  Saving = 'saving',
  Maestra = 'maestra',
  Checking = 'checking',
}

export interface PangeaBankStatement {
  description: string;
  amount: string;
  account: string;
  funding_request_id: string;
  date: string;
}

/**
 * * `AUD` - AUD
 * * `DKK` - DKK
 * * `ILS` - ILS
 * * `NZD` - NZD
 * * `TRY` - TRY
 * * `CAD` - CAD
 * * `EUR` - EUR
 * * `JPY` - JPY
 * * `PLN` - PLN
 * * `USD` - USD
 * * `CHF` - CHF
 * * `GBP` - GBP
 * * `KRW` - KRW
 * * `RUB` - RUB
 * * `ZAR` - ZAR
 * * `CNH` - CNH
 * * `HKD` - HKD
 * * `MXN` - MXN
 * * `SEK` - SEK
 * * `CZK` - CZK
 * * `HUF` - HUF
 * * `NOK` - NOK
 * * `SGD` - SGD
 */
export enum PangeaBaseCurrencyEnum {
  AUD = 'AUD',
  DKK = 'DKK',
  ILS = 'ILS',
  NZD = 'NZD',
  TRY = 'TRY',
  CAD = 'CAD',
  EUR = 'EUR',
  JPY = 'JPY',
  PLN = 'PLN',
  USD = 'USD',
  CHF = 'CHF',
  GBP = 'GBP',
  KRW = 'KRW',
  RUB = 'RUB',
  ZAR = 'ZAR',
  CNH = 'CNH',
  HKD = 'HKD',
  MXN = 'MXN',
  SEK = 'SEK',
  CZK = 'CZK',
  HUF = 'HUF',
  NOK = 'NOK',
  SGD = 'SGD',
}

export interface PangeaBatchResponse {
  success: boolean;
  data: PangeaBatchRowResponse[];
}

export interface PangeaBatchRowResponse {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code used to indicate which amount you are defining the value of. The non-lock_side amount will be calculated. */
  lock_side: string;
  /**
   * The amount of lock_side currency
   * @format double
   * @min 0.01
   */
  amount: number;
  /** The date when the transaction will settle. Defaults to the following business day if settlement cannot occur on the provided value_date. */
  value_date: string;
  /** @default "market" */
  execution_strategy?: PangeaExecutionStrategy183Enum;
  /** Client-provided funding identifier. Will use default if configured. Otherwise, post-funded. */
  settle_account_id?: string | null;
  /** Client-provided beneficiary identifier. */
  beneficiary_id?: string | null;
  /** Identifier for the customer associated with the company for the transaction. */
  customer_id?: string | null;
  /** Unique identifier for the cashflow. If cashflow_id is provided, required fields are not necessary as they will be filled in appropriately from the cashflow. */
  cashflow_id?: string | null;
  /** Client-provided unique identifier for the transaction. */
  transaction_id?: string | null;
  /** Client-supplied identifier to provide transaction grouping. */
  transaction_group?: string | null;
  /** Internal free-form payment memo. */
  payment_memo?: string | null;
  /**
   * Execution begins when client price goes above this threshold.
   * @format double
   */
  upper_trigger?: number | null;
  /**
   * Execution begins when client price goes below this threshold.
   * @format double
   */
  lower_trigger?: number | null;
  upload_status: string;
  error: string;
}

export interface PangeaBeneMethod {
  method: string;
  method_name: string;
  is_preferred: boolean;
  beneficiary_account_number: string;
  routing_code: string;
  routing_code2?: string;
}

export interface PangeaBeneficialOwner {
  full_name: string;
  nationality: string;
  ssn: string;
  residential_address: string;
  /** @format double */
  ownership_percentage: number;
  /** @format date */
  beneficiary_owner_dob?: string;
}

export interface PangeaBeneficiary {
  /**
   * Unique identifier of the beneficiary
   * @format uuid
   */
  beneficiary_id: string;
  /**
   * Beneficiary account type
   *
   * * `individual` - Individual
   * * `corporate` - Corporate
   */
  beneficiary_account_type: PangeaBeneficiaryAccountTypeEnum;
  /**
   * This field accepts the <a href="https://docs.pangea.io/reference/currency-and-country-codes"> ISO-2 country code</a>
   * @maxLength 2
   */
  destination_country: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  destination_currency: string;
  /** Payment methods */
  payment_methods: PangeaPaymentDeliveryMethodEnum[];
  /** Settlement methods */
  settlement_methods: PangeaPaymentDeliveryMethodEnum[];
  /**
   * Preferred payment method
   *
   * * `local` - Local
   * * `swift` - Swift
   * * `wallet` - Wallet
   * * `card` - Card
   * * `proxy` - Proxy
   */
  preferred_method?:
    | PangeaPaymentDeliveryMethodEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Payment reference */
  payment_reference?: string | null;
  /** Full name of the account holder. Maximum 100 characters. */
  beneficiary_name: string;
  /** Beneficiary alias */
  beneficiary_alias?: string | null;
  /** Ex: 123 Main St. */
  beneficiary_address_1?: string | null;
  /** Ex: Apt. #4 */
  beneficiary_address_2?: string | null;
  /**
   * The beneficiary's country. This field accepts the <a href="https://docs.pangea.io/reference/currency-and-country-codes"> ISO-2 country code</a>
   * @maxLength 2
   */
  beneficiary_country: string;
  /** State, Province, etc. */
  beneficiary_region: string;
  /** Postal code */
  beneficiary_postal: string;
  /** City */
  beneficiary_city: string;
  /** Phone number with country code, eg. +1-415-333-4444 */
  beneficiary_phone: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  beneficiary_email?: string | null;
  /**
   * Classification of the beneficiary
   *
   * * `individual` - Individual
   * * `business` - Business
   * * `aerospace_defense` - Aerospace and defense
   * * `agriculture_agrifood` - Agriculture and agric-food
   * * `apparel_clothing` - Apparel / Clothing
   * * `automotive_trucking` - Automotive / Trucking
   * * `books_magazines` - Books / Magazines
   * * `broadcasting` - Broadcasting
   * * `building_products` - Building products
   * * `chemicals` - Chemicals
   * * `dairy` - Dairy
   * * `e_business` - E-business
   * * `educational_institute` - Educational Institutes
   * * `environment` - Environment
   * * `explosives` - Explosives
   * * `fisheries_oceans` - Fisheries and oceans
   * * `food_beverage_distribution` - Food / Beverage distribution
   * * `footwear` - Footwear
   * * `forest_industries` - Forest industries
   * * `furniture` - Furniture
   * * `giftware_crafts` - Giftware and crafts
   * * `horticulture` - Horticulture
   * * `hydroelectric_energy` - Hydroelectric energy
   * * `ict` - Information and communication technologies
   * * `intelligent_systems` - Intelligent systems
   * * `livestock` - Livestock
   * * `medical_devices` - Medical devices
   * * `medical_treatment` - Medical treatment
   * * `minerals_metals_mining` - Minerals, metals and mining
   * * `oil_gas` - Oil and gas
   * * `pharmaceuticals_biopharmaceuticals` - Pharmaceuticals and biopharmaceuticals
   * * `plastics` - Plastics
   * * `poultry_eggs` - Poultry and eggs
   * * `printing_publishing` - Printing / Publishing
   * * `product_design_development` - Product design and development
   * * `railway` - Railway
   * * `retail` - Retail
   * * `shipping_industrial_marine` - Shipping and industrial marine
   * * `soil` - Soil
   * * `sound_recording` - Sound recording
   * * `sporting_goods` - Sporting goods
   * * `telecommunications_equipment` - Telecommunications equipment
   * * `television` - Television
   * * `textiles` - Textiles
   * * `tourism` - Tourism
   * * `trademakrs_law` - Trademarks / Law
   * * `water_supply` - Water supply
   * * `wholesale` - Wholesale
   */
  classification: PangeaClassificationEnum;
  /**
   * Date of birth
   * @format date
   */
  date_of_birth?: string | null;
  /**
   * Type of identification document
   *
   * * `passport` - Passport
   * * `national_id` - National ID
   * * `driving_license` - Driving License
   * * `others` - Others
   * * `cpf` - CPF
   * * `cnpj` - CNPJ
   */
  identification_type?: PangeaIdentificationTypeEnum | PangeaBlankEnum;
  /**
   * Identification document number
   * @maxLength 50
   */
  identification_value?: string;
  /**
   * Bank account type
   *
   * * `current` - Current
   * * `saving` - Saving
   * * `maestra` - Maestra
   * * `checking` - Checking
   */
  bank_account_type?:
    | PangeaBankAccountTypeEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Bank code */
  bank_code?: string | null;
  /** Bank account number, IBAN, etc. */
  bank_account_number: string;
  /**
   * Bank account number type
   *
   * * `iban` - IBAN
   * * `clabe` - CLABE
   * * `account_number` - Account Number
   */
  bank_account_number_type: PangeaBankAccountNumberTypeEnum;
  /** Bank name */
  bank_name: string;
  /**
   * This field accepts the <a href="https://docs.pangea.io/reference/currency-and-country-codes"> ISO-2 country code</a>
   * @maxLength 2
   */
  bank_country: string;
  /** State, Province, etc. */
  bank_region?: string | null;
  /** Bank city */
  bank_city: string;
  /** Bank postal code */
  bank_postal?: string | null;
  /** Bank address line 1 */
  bank_address_1: string;
  /** Bank address line 2 */
  bank_address_2?: string | null;
  /** Bank Branch Name */
  bank_branch_name?: string | null;
  /** Wiring instruction */
  bank_instruction?: string | null;
  /** Bank routing code 1 */
  bank_routing_code_value_1?: string | null;
  /**
   * Bank Routing Code 1 Type
   *
   * * `swift` - SWIFT
   * * `ifsc` - IFSC
   * * `sort_code` - SORT Code
   * * `ach_code` - ACH Code
   * * `branch_code` - Branch Code
   * * `bsb_code` - BSB Code
   * * `bank_code` - Bank Code
   * * `aba_code` - ABA Code
   * * `transit_code` - Transit Code
   * * `generic` - Generic
   * * `wallet` - Wallet
   * * `location_id` - Location ID
   * * `branch_name` - Branch Name
   * * `cnaps` - CNAPS
   * * `fedwire` - Fedwire
   * * `interac` - Interac
   * * `check` - Check
   */
  bank_routing_code_type_1?:
    | PangeaInterBankRoutingCodeType2Enum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Bank routing code 2 */
  bank_routing_code_value_2?: string | null;
  /**
   * Bank Routing Code 2 Type
   *
   * * `swift` - SWIFT
   * * `ifsc` - IFSC
   * * `sort_code` - SORT Code
   * * `ach_code` - ACH Code
   * * `branch_code` - Branch Code
   * * `bsb_code` - BSB Code
   * * `bank_code` - Bank Code
   * * `aba_code` - ABA Code
   * * `transit_code` - Transit Code
   * * `generic` - Generic
   * * `wallet` - Wallet
   * * `location_id` - Location ID
   * * `branch_name` - Branch Name
   * * `cnaps` - CNAPS
   * * `fedwire` - Fedwire
   * * `interac` - Interac
   * * `check` - Check
   */
  bank_routing_code_type_2?:
    | PangeaInterBankRoutingCodeType2Enum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Bank routing code 3 */
  bank_routing_code_value_3?: string | null;
  /**
   * Bank Routing Code 3 Type
   *
   * * `swift` - SWIFT
   * * `ifsc` - IFSC
   * * `sort_code` - SORT Code
   * * `ach_code` - ACH Code
   * * `branch_code` - Branch Code
   * * `bsb_code` - BSB Code
   * * `bank_code` - Bank Code
   * * `aba_code` - ABA Code
   * * `transit_code` - Transit Code
   * * `generic` - Generic
   * * `wallet` - Wallet
   * * `location_id` - Location ID
   * * `branch_name` - Branch Name
   * * `cnaps` - CNAPS
   * * `fedwire` - Fedwire
   * * `interac` - Interac
   * * `check` - Check
   */
  bank_routing_code_type_3?:
    | PangeaInterBankRoutingCodeType2Enum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /**
   * Bank account type
   *
   * * `current` - Current
   * * `saving` - Saving
   * * `maestra` - Maestra
   * * `checking` - Checking
   */
  inter_bank_account_type?:
    | PangeaInterBankAccountTypeEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Intermediary bank code */
  inter_bank_code?: string | null;
  /** Intermediary bank account number */
  inter_bank_account_number?: string | null;
  /**
   * Intermediary bank account number type
   *
   * * `iban` - IBAN
   * * `clabe` - CLABE
   * * `account_number` - Account Number
   */
  inter_bank_account_number_type?:
    | PangeaInterBankAccountNumberTypeEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Intermediary Bank name */
  inter_bank_name?: string | null;
  /** Intermediary Bank country */
  inter_bank_country?: string | null;
  /** Intermediary Bank region */
  inter_bank_region?: string | null;
  /** Intermediary Bank city */
  inter_bank_city?: string | null;
  /** Intermediary Bank postal code */
  inter_bank_postal?: string | null;
  /** Intermediary Bank address line 1 */
  inter_bank_address_1?: string | null;
  /** Intermediary Bank address line 2 */
  inter_bank_address_2?: string | null;
  /** Intermediary Bank Branch Name */
  inter_bank_branch_name?: string | null;
  /** Intermediary Bank instruction */
  inter_bank_instruction?: string | null;
  /** Intermediary bank Routing Code 1 */
  inter_bank_routing_code_value_1?: string | null;
  /**
   * Intermediary bank Routing Code 1 Type
   *
   * * `swift` - SWIFT
   * * `ifsc` - IFSC
   * * `sort_code` - SORT Code
   * * `ach_code` - ACH Code
   * * `branch_code` - Branch Code
   * * `bsb_code` - BSB Code
   * * `bank_code` - Bank Code
   * * `aba_code` - ABA Code
   * * `transit_code` - Transit Code
   * * `generic` - Generic
   * * `wallet` - Wallet
   * * `location_id` - Location ID
   * * `branch_name` - Branch Name
   * * `cnaps` - CNAPS
   * * `fedwire` - Fedwire
   * * `interac` - Interac
   * * `check` - Check
   */
  inter_bank_routing_code_type_1?:
    | PangeaInterBankRoutingCodeType2Enum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Intermediary bank routing code 2 */
  inter_bank_routing_code_value_2?: string | null;
  /**
   * Intermediary bank Routing Code 2 Type
   *
   * * `swift` - SWIFT
   * * `ifsc` - IFSC
   * * `sort_code` - SORT Code
   * * `ach_code` - ACH Code
   * * `branch_code` - Branch Code
   * * `bsb_code` - BSB Code
   * * `bank_code` - Bank Code
   * * `aba_code` - ABA Code
   * * `transit_code` - Transit Code
   * * `generic` - Generic
   * * `wallet` - Wallet
   * * `location_id` - Location ID
   * * `branch_name` - Branch Name
   * * `cnaps` - CNAPS
   * * `fedwire` - Fedwire
   * * `interac` - Interac
   * * `check` - Check
   */
  inter_bank_routing_code_type_2?:
    | PangeaInterBankRoutingCodeType2Enum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /**
   * This field accepts the <a href="https://docs.pangea.io/reference/currency-and-country-codes"> ISO-2 country code</a>
   * @maxLength 2
   */
  client_legal_entity: string;
  /**
   * Beneficiary default payment purpose
   *
   * * `1` - Intercompany Payment
   * * `2` - Purchase/Sale of Goods
   * * `3` - Purchase/Sale of Services
   * * `4` - Personnel Payment
   * * `5` - Financial Transaction
   * * `6` - Other
   * @min -2147483648
   * @max 2147483647
   */
  default_purpose?: PangeaDefaultPurposeEnum;
  /** Please be specific, eg. “This company is a supplier of leather goods. Each month we pay this company for wallets and belts” */
  default_purpose_description?: string | null;
  /**
   * The proxy type sent in the payment request
   *
   * * `mobile` - Mobile
   * * `uen` - UEN
   * * `nric` - NRIC
   * * `vpa` - VPA
   * * `id` - ID
   * * `email` - Email
   * * `random_key` - Random Key
   * * `abn` - ABN
   * * `organization_id` - Organisation ID
   * * `passport` - Passport
   * * `corporate_registration_number` - Corporate Registration Number
   * * `army_id` - Army ID
   */
  proxy_type?: PangeaProxyTypeEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /** The proxy value such as VPA, UEN, or mobile number etc. */
  proxy_value?: string | null;
  /** Further name */
  further_name?: string | null;
  /** Further account number */
  further_account_number?: string | null;
  /**
   * The status of the beneficiary
   *
   * * `draft` - Draft
   * * `pending` - Pending
   * * `approved` - Approved
   * * `synced` - Synced
   * * `pending_update` - Pending Update
   * * `pending_delete` - Pending Delete
   * * `deleted` - Deleted
   * * `partially_synced` - Partially Synced
   * * `partially_deleted` - Partially Deleted
   */
  status: PangeaBeneficiaryStatusEnum;
  /** Additional broker-specific fields as key-value pairs */
  additional_fields?: any;
  /** The fields and corresponding values needed to satisfy regulatory requirements for the destination country. */
  regulatory?: any;
  brokers: PangeaBroker[];
}

/**
 * * `individual` - Individual
 * * `corporate` - Corporate
 */
export enum PangeaBeneficiaryAccountTypeEnum {
  Individual = 'individual',
  Corporate = 'corporate',
}

export interface PangeaBeneficiaryRegulatoryRule {
  id: string;
  regex: string;
  is_required: boolean;
  error_message?: string;
  is_required_in_value_set: boolean;
  value_set?: PangeaValueSet[];
  order: number;
  label: string;
}

export interface PangeaBeneficiaryRequest {
  account_holder_name: string;
  template_identifier?: string;
  destination_country: string;
  bank_currency: string;
  classification: string;
  payment_methods: PangeaSettlementAccountDeliveryMethodEnum[];
  preferred_method: string;
  account_number: string;
  local_account_number?: string;
  routing_code?: string;
  local_routing_code?: string;
  account_holder_country: string;
  account_holder_region?: string;
  account_holder_address1: string;
  account_holder_address2?: string;
  account_holder_city: string;
  account_holder_postal?: string;
  account_holder_phone_number?: string;
  /** @format email */
  account_holder_email?: string;
  send_pay_tracker?: boolean;
  iban?: string;
  swift_bic_code: string;
  bank_name: string;
  bank_country: string;
  bank_region?: string;
  bank_city: string;
  bank_address_line1: string;
  bank_address_line2?: string;
  bank_postal?: string;
  payment_reference?: string;
  purpose_of_payment?: string;
  internal_payment_alert?: string;
  external_payment_alert?: string;
  method_of_delivery?: string;
  regulatory: PangeaKeyValue[];
  /** @default false */
  is_withdraw?: boolean;
}

export interface PangeaBeneficiaryResponse {
  template_id: string;
  client_integration_id: string;
}

export interface PangeaBeneficiaryRule {
  id: string;
  regex: string;
  is_required: boolean;
  error_message?: string;
  is_required_in_value_set: boolean;
  value_set?: PangeaValueSet[];
  links?: PangeaLink[];
}

export interface PangeaBeneficiaryRulesResponse {
  template_guide: PangeaBeneficiaryRulesTemplateGuide;
}

export interface PangeaBeneficiaryRulesTemplateGuide {
  rules: PangeaBeneficiaryRule[];
  regulatory_rules: PangeaBeneficiaryRegulatoryRule[];
  provide: string[];
}

/**
 * * `draft` - Draft
 * * `pending` - Pending
 * * `approved` - Approved
 * * `synced` - Synced
 * * `pending_update` - Pending Update
 * * `pending_delete` - Pending Delete
 * * `deleted` - Deleted
 * * `partially_synced` - Partially Synced
 * * `partially_deleted` - Partially Deleted
 */
export enum PangeaBeneficiaryStatusEnum {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Synced = 'synced',
  PendingUpdate = 'pending_update',
  PendingDelete = 'pending_delete',
  Deleted = 'deleted',
  PartiallySynced = 'partially_synced',
  PartiallyDeleted = 'partially_deleted',
}

export interface PangeaBestExecution {
  market: string;
  recommend: boolean;
  session?: string | null;
  /** @format date-time */
  execute_before?: string | null;
  unsupported: boolean;
}

export interface PangeaBestExecutionData {
  liquidity_insight: PangeaLiquidityInsight;
  /** @format date */
  spot_value_date: string;
}

export interface PangeaBestExecutionStatus {
  label: string;
  value: string;
  market: string;
  recommend?: boolean;
  session?: string;
  /** @format date-time */
  check_back?: string;
  /** @format date-time */
  execute_before?: string;
  unsupported?: boolean;
}

export interface PangeaBestExecutionTiming {
  execution_timings: PangeaBestExecutionStatus[];
  execution_data?: PangeaBestExecutionData;
}

export enum PangeaBlankEnum {
  Value = '',
}

export interface PangeaBookDealRequest {
  quote_id: string;
}

export interface PangeaBookDealResponse {
  order_number: string;
  /** @format uuid */
  token: string;
  /** @format date */
  settlement_date?: string;
}

export interface PangeaBookInstructDealRequest {
  book_request: PangeaBookDealRequest;
  instruct_request: PangeaInstructDealRequest;
}

export interface PangeaBookPaymentRequest {
  quote_id: string;
  session_id: string;
}

export interface PangeaBookPaymentsRequest {
  quote_id: string;
  session_id: string;
  combine_settlements: boolean;
}

export interface PangeaBookPaymentsResponse {
  message: string;
  order_number: number;
}

export interface PangeaBroker {
  id: number;
  /** @maxLength 255 */
  name: string;
  broker_provider?: PangeaFwdBrokerEnum | PangeaBlankEnum;
}

export interface PangeaBrokerAccount {
  id: number;
  /** @maxLength 255 */
  broker_account_name: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  account_type: PangeaAccountTypeEnum;
  company: number;
  broker: number;
  capabilities: number[];
}

export interface PangeaBulkDetailedPaymentRfqResponse {
  payment_id: number;
  rfq_status: PangeaDetailedPaymentRfqResponse;
}

export interface PangeaBulkExecutionStatus {
  executions: PangeaBulkPaymentExecutionResponse[];
}

export interface PangeaBulkPaymentExecution {
  payment_ids: number[];
}

export interface PangeaBulkPaymentExecutionResponse {
  payment_id: string;
  execution_status: PangeaPaymentExecutionResponse;
}

export interface PangeaBulkPaymentNettingResult {
  buy_currency: string;
  /** @format double */
  sum_amount: number;
}

export interface PangeaBulkPaymentRequest {
  payments: PangeaSimplePayment[];
}

export interface PangeaBulkPaymentResponse {
  payments: PangeaPayment[];
  netting: PangeaBulkPaymentNettingResult[];
}

export interface PangeaBulkPaymentRfq {
  payment_ids: number[];
}

export interface PangeaBulkPaymentUpdate {
  payment_group: string;
  added_payments?: PangeaSimplePayment[];
  updated_payments: PangeaSimpleUpdatePayment[];
  deleted_payments?: string[];
}

export interface PangeaBulkPaymentValidationError {
  row_id: number;
  is_valid: boolean;
  error_fields: Record<string, string[]>;
}

export interface PangeaBulkPaymentValidationErrorResponse {
  validation_results: PangeaBulkPaymentValidationError[];
}

export interface PangeaBulkRfqStatus {
  rfqs: PangeaBulkDetailedPaymentRfqResponse[];
}

export interface PangeaBuySell {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency?: string | null;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency?: string | null;
}

/**
 * * `NULL_CALENDAR` - NULL_CALENDAR
 * * `WESTERN_CALENDAR` - WESTERN_CALENDAR
 */
export enum PangeaCalendarEnum {
  NULL_CALENDAR = 'NULL_CALENDAR',
  WESTERN_CALENDAR = 'WESTERN_CALENDAR',
}

export interface PangeaCashFlowActionStatus {
  message?: string;
  status?: string;
  /**
   * * `missing_setup_intent` - Missing setup intent
   * * `missing_payment` - Missing Payment
   * * `charge_failed` - Charge failed
   * * `internal_server_error` - Internal server error
   */
  code: PangeaCashFlowActionStatusCodeEnum;
  data?: any;
}

/**
 * * `missing_setup_intent` - Missing setup intent
 * * `missing_payment` - Missing Payment
 * * `charge_failed` - Charge failed
 * * `internal_server_error` - Internal server error
 */
export enum PangeaCashFlowActionStatusCodeEnum {
  MissingSetupIntent = 'missing_setup_intent',
  MissingPayment = 'missing_payment',
  ChargeFailed = 'charge_failed',
  InternalServerError = 'internal_server_error',
}

/** This serializer is used to serialize incoming cashflow requests. */
export interface PangeaCashFlowCore {
  /** @format double */
  amount: number;
  currency: string;
  /** @format date-time */
  pay_date: string;
  name?: string;
  description?: string;
  periodicity?: string;
  /** @default "NULL_CALENDAR" */
  calendar?: PangeaCalendarEnum;
  /** @format date-time */
  end_date?: string;
  /** @default "UNADJUSTED" */
  roll_convention?: PangeaRollConventionEnum;
  /**
   * A serializer for the DraftCashFlow model.
   *
   * Note that date fields should be be in the format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
   */
  draft?: PangeaDraftCashflow;
  installment?: number;
  fx_forward?: PangeaFxForward[];
  draft_fx_forward?: PangeaDraftFxForward[];
}

/**
 * A serializer for the DraftCashFlow model.
 *
 * Note that date fields should be be in the format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
 */
export interface PangeaCashFlowGenerator {
  /**
   * The unique ID of the cashflow
   * @format uuid
   */
  cashflow_id: string;
  status: string;
  /**
   * A name for the cashflow
   * @maxLength 255
   */
  name?: string | null;
  /** A description of the cashflow */
  description?: string | null;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code used to indicate which amount you are defining the value of. The non-lock_side amount will be calculated. */
  lock_side: string;
  /**
   * The amount of the cashflow
   * @format double
   */
  amount?: number | null;
  /**
   * The date when the transaction will settle. Defaults to the following business day if settlement cannot occur on the provided value_date.
   * @format date
   */
  value_date?: string | null;
  /** “true” = cashflow is a draft, “false” = cashflow is approved and executable */
  is_draft: boolean;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
}

/** An object representing a request to get the cashflow weight. */
export interface PangeaCashFlowWeightRequest {
  start_date: string;
  end_date: string;
  cashflow_ids: number[];
}

export interface PangeaCashFlowWeightResponse {
  times: string[];
  cashflow_npv: number[];
  account_npv: number[];
  company_npv: number[];
}

/** A serializer for the CashFlow model. */
export interface PangeaCashflow {
  id: number;
  /** @format date-time */
  date: string;
  /** @format date-time */
  end_date?: string | null;
  next_date: string;
  currency: PangeaCurrency;
  /** @format double */
  amount: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /** @maxLength 60 */
  name?: string | null;
  description?: string | null;
  /**
   * * `inactive` - INACTIVE
   * * `pending_approval` - PENDING APPROVAL
   * * `pending_activation` - PENDING ACTIVATION
   * * `active` - ACTIVE
   * * `pending_deactivation` - PENDING DEACTIVATION
   * * `pending_margin` - PENDING MARGIN
   * * `pending_payment` - PENDING PAYMENT
   * * `payment_fail` - PAYMENT FAIL
   */
  status?: PangeaCashflowStatusEnum;
  installment?: PangeaInstallment;
  /** A serializer representing condensed information about the account. */
  account: PangeaAccountSummary;
  periodicity?: string | null;
  /** @default "NULL_CALENDAR" */
  calendar?: PangeaCalendarEnum;
  /** @default "UNADJUSTED" */
  roll_convention?: PangeaRollConventionEnum;
  /**
   * A serializer for the DraftCashFlow model.
   *
   * Note that date fields should be be in the format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
   */
  draft?: PangeaDraftCashflow;
  draft_fxforward: PangeaDraftFxForward[];
  fxforward: PangeaFxForward[];
  /** @default false */
  is_forward?: boolean;
  /** @format double */
  indicative_rate?: number | null;
  /** @format double */
  indicative_base_amount?: number | null;
  /** @format double */
  indicative_cntr_amount?: number | null;
  /** @format double */
  booked_rate: number;
  /** @format double */
  booked_base_amount: number;
  /** @format double */
  booked_cntr_amount: number;
}

export interface PangeaCashflowAbsForwardRequest {
  start_date: string;
  end_date: string;
  account_id?: number;
  /** @default true */
  is_live?: boolean;
}

export interface PangeaCashflowAbsForwardResponse {
  times: string[];
  cashflow_abs_fwd: number[];
  num_cashflows: number[];
}

/** A serializer for the CashFlowNote model. */
export interface PangeaCashflowNote {
  id: number;
  cashflow: number;
  description: string;
  /** @format date-time */
  created: string;
  created_by: number;
  /** @format date-time */
  modified: string;
  modified_by: number;
}

/**
 * * `inactive` - INACTIVE
 * * `pending_approval` - PENDING APPROVAL
 * * `pending_activation` - PENDING ACTIVATION
 * * `active` - ACTIVE
 * * `pending_deactivation` - PENDING DEACTIVATION
 * * `pending_margin` - PENDING MARGIN
 * * `pending_payment` - PENDING PAYMENT
 * * `payment_fail` - PAYMENT FAIL
 */
export enum PangeaCashflowStatusEnum {
  Inactive = 'inactive',
  PendingApproval = 'pending_approval',
  PendingActivation = 'pending_activation',
  Active = 'active',
  PendingDeactivation = 'pending_deactivation',
  PendingMargin = 'pending_margin',
  PendingPayment = 'pending_payment',
  PaymentFail = 'payment_fail',
}

export interface PangeaChangePassword {
  old_password: string;
  new_password: string;
}

/**
 * * `AF` - Afghanistan
 * * `AX` - Åland Islands
 * * `AL` - Albania
 * * `DZ` - Algeria
 * * `AS` - American Samoa
 * * `AD` - Andorra
 * * `AO` - Angola
 * * `AI` - Anguilla
 * * `AQ` - Antarctica
 * * `AG` - Antigua and Barbuda
 * * `AR` - Argentina
 * * `AM` - Armenia
 * * `AW` - Aruba
 * * `AU` - Australia
 * * `AT` - Austria
 * * `AZ` - Azerbaijan
 * * `BS` - Bahamas
 * * `BH` - Bahrain
 * * `BD` - Bangladesh
 * * `BB` - Barbados
 * * `BY` - Belarus
 * * `BE` - Belgium
 * * `BZ` - Belize
 * * `BJ` - Benin
 * * `BM` - Bermuda
 * * `BT` - Bhutan
 * * `BO` - Bolivia
 * * `BQ` - Bonaire, Sint Eustatius and Saba
 * * `BA` - Bosnia and Herzegovina
 * * `BW` - Botswana
 * * `BV` - Bouvet Island
 * * `BR` - Brazil
 * * `IO` - British Indian Ocean Territory
 * * `BN` - Brunei
 * * `BG` - Bulgaria
 * * `BF` - Burkina Faso
 * * `BI` - Burundi
 * * `CV` - Cabo Verde
 * * `KH` - Cambodia
 * * `CM` - Cameroon
 * * `CA` - Canada
 * * `KY` - Cayman Islands
 * * `CF` - Central African Republic
 * * `TD` - Chad
 * * `CL` - Chile
 * * `CN` - China
 * * `CX` - Christmas Island
 * * `CC` - Cocos (Keeling) Islands
 * * `CO` - Colombia
 * * `KM` - Comoros
 * * `CG` - Congo
 * * `CD` - Congo (the Democratic Republic of the)
 * * `CK` - Cook Islands
 * * `CR` - Costa Rica
 * * `CI` - Côte d'Ivoire
 * * `HR` - Croatia
 * * `CU` - Cuba
 * * `CW` - Curaçao
 * * `CY` - Cyprus
 * * `CZ` - Czechia
 * * `DK` - Denmark
 * * `DJ` - Djibouti
 * * `DM` - Dominica
 * * `DO` - Dominican Republic
 * * `EC` - Ecuador
 * * `EG` - Egypt
 * * `SV` - El Salvador
 * * `GQ` - Equatorial Guinea
 * * `ER` - Eritrea
 * * `EE` - Estonia
 * * `SZ` - Eswatini
 * * `ET` - Ethiopia
 * * `FK` - Falkland Islands (Malvinas)
 * * `FO` - Faroe Islands
 * * `FJ` - Fiji
 * * `FI` - Finland
 * * `FR` - France
 * * `GF` - French Guiana
 * * `PF` - French Polynesia
 * * `TF` - French Southern Territories
 * * `GA` - Gabon
 * * `GM` - Gambia
 * * `GE` - Georgia
 * * `DE` - Germany
 * * `GH` - Ghana
 * * `GI` - Gibraltar
 * * `GR` - Greece
 * * `GL` - Greenland
 * * `GD` - Grenada
 * * `GP` - Guadeloupe
 * * `GU` - Guam
 * * `GT` - Guatemala
 * * `GG` - Guernsey
 * * `GN` - Guinea
 * * `GW` - Guinea-Bissau
 * * `GY` - Guyana
 * * `HT` - Haiti
 * * `HM` - Heard Island and McDonald Islands
 * * `VA` - Holy See
 * * `HN` - Honduras
 * * `HK` - Hong Kong
 * * `HU` - Hungary
 * * `IS` - Iceland
 * * `IN` - India
 * * `ID` - Indonesia
 * * `IR` - Iran
 * * `IQ` - Iraq
 * * `IE` - Ireland
 * * `IM` - Isle of Man
 * * `IL` - Israel
 * * `IT` - Italy
 * * `JM` - Jamaica
 * * `JP` - Japan
 * * `JE` - Jersey
 * * `JO` - Jordan
 * * `KZ` - Kazakhstan
 * * `KE` - Kenya
 * * `KI` - Kiribati
 * * `KW` - Kuwait
 * * `KG` - Kyrgyzstan
 * * `LA` - Laos
 * * `LV` - Latvia
 * * `LB` - Lebanon
 * * `LS` - Lesotho
 * * `LR` - Liberia
 * * `LY` - Libya
 * * `LI` - Liechtenstein
 * * `LT` - Lithuania
 * * `LU` - Luxembourg
 * * `MO` - Macao
 * * `MG` - Madagascar
 * * `MW` - Malawi
 * * `MY` - Malaysia
 * * `MV` - Maldives
 * * `ML` - Mali
 * * `MT` - Malta
 * * `MH` - Marshall Islands
 * * `MQ` - Martinique
 * * `MR` - Mauritania
 * * `MU` - Mauritius
 * * `YT` - Mayotte
 * * `MX` - Mexico
 * * `FM` - Micronesia
 * * `MD` - Moldova
 * * `MC` - Monaco
 * * `MN` - Mongolia
 * * `ME` - Montenegro
 * * `MS` - Montserrat
 * * `MA` - Morocco
 * * `MZ` - Mozambique
 * * `MM` - Myanmar
 * * `NA` - Namibia
 * * `NR` - Nauru
 * * `NP` - Nepal
 * * `NL` - Netherlands
 * * `NC` - New Caledonia
 * * `NZ` - New Zealand
 * * `NI` - Nicaragua
 * * `NE` - Niger
 * * `NG` - Nigeria
 * * `NU` - Niue
 * * `NF` - Norfolk Island
 * * `KP` - North Korea
 * * `MK` - North Macedonia
 * * `MP` - Northern Mariana Islands
 * * `NO` - Norway
 * * `OM` - Oman
 * * `PK` - Pakistan
 * * `PW` - Palau
 * * `PS` - Palestine, State of
 * * `PA` - Panama
 * * `PG` - Papua New Guinea
 * * `PY` - Paraguay
 * * `PE` - Peru
 * * `PH` - Philippines
 * * `PN` - Pitcairn
 * * `PL` - Poland
 * * `PT` - Portugal
 * * `PR` - Puerto Rico
 * * `QA` - Qatar
 * * `RE` - Réunion
 * * `RO` - Romania
 * * `RU` - Russia
 * * `RW` - Rwanda
 * * `BL` - Saint Barthélemy
 * * `SH` - Saint Helena, Ascension and Tristan da Cunha
 * * `KN` - Saint Kitts and Nevis
 * * `LC` - Saint Lucia
 * * `MF` - Saint Martin (French part)
 * * `PM` - Saint Pierre and Miquelon
 * * `VC` - Saint Vincent and the Grenadines
 * * `WS` - Samoa
 * * `SM` - San Marino
 * * `ST` - Sao Tome and Principe
 * * `SA` - Saudi Arabia
 * * `SN` - Senegal
 * * `RS` - Serbia
 * * `SC` - Seychelles
 * * `SL` - Sierra Leone
 * * `SG` - Singapore
 * * `SX` - Sint Maarten (Dutch part)
 * * `SK` - Slovakia
 * * `SI` - Slovenia
 * * `SB` - Solomon Islands
 * * `SO` - Somalia
 * * `ZA` - South Africa
 * * `GS` - South Georgia and the South Sandwich Islands
 * * `KR` - South Korea
 * * `SS` - South Sudan
 * * `ES` - Spain
 * * `LK` - Sri Lanka
 * * `SD` - Sudan
 * * `SR` - Suriname
 * * `SJ` - Svalbard and Jan Mayen
 * * `SE` - Sweden
 * * `CH` - Switzerland
 * * `SY` - Syria
 * * `TW` - Taiwan
 * * `TJ` - Tajikistan
 * * `TZ` - Tanzania
 * * `TH` - Thailand
 * * `TL` - Timor-Leste
 * * `TG` - Togo
 * * `TK` - Tokelau
 * * `TO` - Tonga
 * * `TT` - Trinidad and Tobago
 * * `TN` - Tunisia
 * * `TR` - Türkiye
 * * `TM` - Turkmenistan
 * * `TC` - Turks and Caicos Islands
 * * `TV` - Tuvalu
 * * `UG` - Uganda
 * * `UA` - Ukraine
 * * `AE` - United Arab Emirates
 * * `GB` - United Kingdom
 * * `UM` - United States Minor Outlying Islands
 * * `US` - United States of America
 * * `UY` - Uruguay
 * * `UZ` - Uzbekistan
 * * `VU` - Vanuatu
 * * `VE` - Venezuela
 * * `VN` - Vietnam
 * * `VG` - Virgin Islands (British)
 * * `VI` - Virgin Islands (U.S.)
 * * `WF` - Wallis and Futuna
 * * `EH` - Western Sahara
 * * `YE` - Yemen
 * * `ZM` - Zambia
 * * `ZW` - Zimbabwe
 */
export enum PangeaCitizenshipEnum {
  AF = 'AF',
  AX = 'AX',
  AL = 'AL',
  DZ = 'DZ',
  AS = 'AS',
  AD = 'AD',
  AO = 'AO',
  AI = 'AI',
  AQ = 'AQ',
  AG = 'AG',
  AR = 'AR',
  AM = 'AM',
  AW = 'AW',
  AU = 'AU',
  AT = 'AT',
  AZ = 'AZ',
  BS = 'BS',
  BH = 'BH',
  BD = 'BD',
  BB = 'BB',
  BY = 'BY',
  BE = 'BE',
  BZ = 'BZ',
  BJ = 'BJ',
  BM = 'BM',
  BT = 'BT',
  BO = 'BO',
  BQ = 'BQ',
  BA = 'BA',
  BW = 'BW',
  BV = 'BV',
  BR = 'BR',
  IO = 'IO',
  BN = 'BN',
  BG = 'BG',
  BF = 'BF',
  BI = 'BI',
  CV = 'CV',
  KH = 'KH',
  CM = 'CM',
  CA = 'CA',
  KY = 'KY',
  CF = 'CF',
  TD = 'TD',
  CL = 'CL',
  CN = 'CN',
  CX = 'CX',
  CC = 'CC',
  CO = 'CO',
  KM = 'KM',
  CG = 'CG',
  CD = 'CD',
  CK = 'CK',
  CR = 'CR',
  CI = 'CI',
  HR = 'HR',
  CU = 'CU',
  CW = 'CW',
  CY = 'CY',
  CZ = 'CZ',
  DK = 'DK',
  DJ = 'DJ',
  DM = 'DM',
  DO = 'DO',
  EC = 'EC',
  EG = 'EG',
  SV = 'SV',
  GQ = 'GQ',
  ER = 'ER',
  EE = 'EE',
  SZ = 'SZ',
  ET = 'ET',
  FK = 'FK',
  FO = 'FO',
  FJ = 'FJ',
  FI = 'FI',
  FR = 'FR',
  GF = 'GF',
  PF = 'PF',
  TF = 'TF',
  GA = 'GA',
  GM = 'GM',
  GE = 'GE',
  DE = 'DE',
  GH = 'GH',
  GI = 'GI',
  GR = 'GR',
  GL = 'GL',
  GD = 'GD',
  GP = 'GP',
  GU = 'GU',
  GT = 'GT',
  GG = 'GG',
  GN = 'GN',
  GW = 'GW',
  GY = 'GY',
  HT = 'HT',
  HM = 'HM',
  VA = 'VA',
  HN = 'HN',
  HK = 'HK',
  HU = 'HU',
  IS = 'IS',
  IN = 'IN',
  ID = 'ID',
  IR = 'IR',
  IQ = 'IQ',
  IE = 'IE',
  IM = 'IM',
  IL = 'IL',
  IT = 'IT',
  JM = 'JM',
  JP = 'JP',
  JE = 'JE',
  JO = 'JO',
  KZ = 'KZ',
  KE = 'KE',
  KI = 'KI',
  KW = 'KW',
  KG = 'KG',
  LA = 'LA',
  LV = 'LV',
  LB = 'LB',
  LS = 'LS',
  LR = 'LR',
  LY = 'LY',
  LI = 'LI',
  LT = 'LT',
  LU = 'LU',
  MO = 'MO',
  MG = 'MG',
  MW = 'MW',
  MY = 'MY',
  MV = 'MV',
  ML = 'ML',
  MT = 'MT',
  MH = 'MH',
  MQ = 'MQ',
  MR = 'MR',
  MU = 'MU',
  YT = 'YT',
  MX = 'MX',
  FM = 'FM',
  MD = 'MD',
  MC = 'MC',
  MN = 'MN',
  ME = 'ME',
  MS = 'MS',
  MA = 'MA',
  MZ = 'MZ',
  MM = 'MM',
  NA = 'NA',
  NR = 'NR',
  NP = 'NP',
  NL = 'NL',
  NC = 'NC',
  NZ = 'NZ',
  NI = 'NI',
  NE = 'NE',
  NG = 'NG',
  NU = 'NU',
  NF = 'NF',
  KP = 'KP',
  MK = 'MK',
  MP = 'MP',
  NO = 'NO',
  OM = 'OM',
  PK = 'PK',
  PW = 'PW',
  PS = 'PS',
  PA = 'PA',
  PG = 'PG',
  PY = 'PY',
  PE = 'PE',
  PH = 'PH',
  PN = 'PN',
  PL = 'PL',
  PT = 'PT',
  PR = 'PR',
  QA = 'QA',
  RE = 'RE',
  RO = 'RO',
  RU = 'RU',
  RW = 'RW',
  BL = 'BL',
  SH = 'SH',
  KN = 'KN',
  LC = 'LC',
  MF = 'MF',
  PM = 'PM',
  VC = 'VC',
  WS = 'WS',
  SM = 'SM',
  ST = 'ST',
  SA = 'SA',
  SN = 'SN',
  RS = 'RS',
  SC = 'SC',
  SL = 'SL',
  SG = 'SG',
  SX = 'SX',
  SK = 'SK',
  SI = 'SI',
  SB = 'SB',
  SO = 'SO',
  ZA = 'ZA',
  GS = 'GS',
  KR = 'KR',
  SS = 'SS',
  ES = 'ES',
  LK = 'LK',
  SD = 'SD',
  SR = 'SR',
  SJ = 'SJ',
  SE = 'SE',
  CH = 'CH',
  SY = 'SY',
  TW = 'TW',
  TJ = 'TJ',
  TZ = 'TZ',
  TH = 'TH',
  TL = 'TL',
  TG = 'TG',
  TK = 'TK',
  TO = 'TO',
  TT = 'TT',
  TN = 'TN',
  TR = 'TR',
  TM = 'TM',
  TC = 'TC',
  TV = 'TV',
  UG = 'UG',
  UA = 'UA',
  AE = 'AE',
  GB = 'GB',
  UM = 'UM',
  US = 'US',
  UY = 'UY',
  UZ = 'UZ',
  VU = 'VU',
  VE = 'VE',
  VN = 'VN',
  VG = 'VG',
  VI = 'VI',
  WF = 'WF',
  EH = 'EH',
  YE = 'YE',
  ZM = 'ZM',
  ZW = 'ZW',
}

/**
 * * `individual` - Individual
 * * `business` - Business
 * * `aerospace_defense` - Aerospace and defense
 * * `agriculture_agrifood` - Agriculture and agric-food
 * * `apparel_clothing` - Apparel / Clothing
 * * `automotive_trucking` - Automotive / Trucking
 * * `books_magazines` - Books / Magazines
 * * `broadcasting` - Broadcasting
 * * `building_products` - Building products
 * * `chemicals` - Chemicals
 * * `dairy` - Dairy
 * * `e_business` - E-business
 * * `educational_institute` - Educational Institutes
 * * `environment` - Environment
 * * `explosives` - Explosives
 * * `fisheries_oceans` - Fisheries and oceans
 * * `food_beverage_distribution` - Food / Beverage distribution
 * * `footwear` - Footwear
 * * `forest_industries` - Forest industries
 * * `furniture` - Furniture
 * * `giftware_crafts` - Giftware and crafts
 * * `horticulture` - Horticulture
 * * `hydroelectric_energy` - Hydroelectric energy
 * * `ict` - Information and communication technologies
 * * `intelligent_systems` - Intelligent systems
 * * `livestock` - Livestock
 * * `medical_devices` - Medical devices
 * * `medical_treatment` - Medical treatment
 * * `minerals_metals_mining` - Minerals, metals and mining
 * * `oil_gas` - Oil and gas
 * * `pharmaceuticals_biopharmaceuticals` - Pharmaceuticals and biopharmaceuticals
 * * `plastics` - Plastics
 * * `poultry_eggs` - Poultry and eggs
 * * `printing_publishing` - Printing / Publishing
 * * `product_design_development` - Product design and development
 * * `railway` - Railway
 * * `retail` - Retail
 * * `shipping_industrial_marine` - Shipping and industrial marine
 * * `soil` - Soil
 * * `sound_recording` - Sound recording
 * * `sporting_goods` - Sporting goods
 * * `telecommunications_equipment` - Telecommunications equipment
 * * `television` - Television
 * * `textiles` - Textiles
 * * `tourism` - Tourism
 * * `trademakrs_law` - Trademarks / Law
 * * `water_supply` - Water supply
 * * `wholesale` - Wholesale
 */
export enum PangeaClassificationEnum {
  Individual = 'individual',
  Business = 'business',
  AerospaceDefense = 'aerospace_defense',
  AgricultureAgrifood = 'agriculture_agrifood',
  ApparelClothing = 'apparel_clothing',
  AutomotiveTrucking = 'automotive_trucking',
  BooksMagazines = 'books_magazines',
  Broadcasting = 'broadcasting',
  BuildingProducts = 'building_products',
  Chemicals = 'chemicals',
  Dairy = 'dairy',
  EBusiness = 'e_business',
  EducationalInstitute = 'educational_institute',
  Environment = 'environment',
  Explosives = 'explosives',
  FisheriesOceans = 'fisheries_oceans',
  FoodBeverageDistribution = 'food_beverage_distribution',
  Footwear = 'footwear',
  ForestIndustries = 'forest_industries',
  Furniture = 'furniture',
  GiftwareCrafts = 'giftware_crafts',
  Horticulture = 'horticulture',
  HydroelectricEnergy = 'hydroelectric_energy',
  Ict = 'ict',
  IntelligentSystems = 'intelligent_systems',
  Livestock = 'livestock',
  MedicalDevices = 'medical_devices',
  MedicalTreatment = 'medical_treatment',
  MineralsMetalsMining = 'minerals_metals_mining',
  OilGas = 'oil_gas',
  PharmaceuticalsBiopharmaceuticals = 'pharmaceuticals_biopharmaceuticals',
  Plastics = 'plastics',
  PoultryEggs = 'poultry_eggs',
  PrintingPublishing = 'printing_publishing',
  ProductDesignDevelopment = 'product_design_development',
  Railway = 'railway',
  Retail = 'retail',
  ShippingIndustrialMarine = 'shipping_industrial_marine',
  Soil = 'soil',
  SoundRecording = 'sound_recording',
  SportingGoods = 'sporting_goods',
  TelecommunicationsEquipment = 'telecommunications_equipment',
  Television = 'television',
  Textiles = 'textiles',
  Tourism = 'tourism',
  TrademakrsLaw = 'trademakrs_law',
  WaterSupply = 'water_supply',
  Wholesale = 'wholesale',
}

export interface PangeaCnyExecution {
  id: number;
  market: string;
  subaccounts: string[];
  staging?: boolean;
  /**
   * * `CORPAY` - CORPAY
   * * `IBKR` - IBKR
   * * `CORPAY_MP` - CORPAY_MP
   * * `VERTO` - VERTO
   * * `NIUM` - NIUM
   * * `AZA` - AZA
   * * `MONEX` - MONEX
   * * `CONVERA` - CONVERA
   * * `OFX` - OFX
   * * `XE` - XE
   * * `OANDA` - OANDA
   * * `AIRWALLEX` - AIRWALLEX
   */
  spot_broker?: PangeaFwdBrokerEnum;
  /**
   * * `CORPAY` - CORPAY
   * * `IBKR` - IBKR
   * * `CORPAY_MP` - CORPAY_MP
   * * `VERTO` - VERTO
   * * `NIUM` - NIUM
   * * `AZA` - AZA
   * * `MONEX` - MONEX
   * * `CONVERA` - CONVERA
   * * `OFX` - OFX
   * * `XE` - XE
   * * `OANDA` - OANDA
   * * `AIRWALLEX` - AIRWALLEX
   */
  fwd_broker?: PangeaFwdBrokerEnum;
  /**
   * * `api` - API
   * * `manual` - MANUAL
   * * `unsupported` - UNSUPPORTED
   * * `indicative` - INDICATIVE
   * * `norfq` - NORFQ
   */
  spot_rfq_type?: PangeaSpotRfqTypeEnum;
  /**
   * * `api` - API
   * * `manual` - MANUAL
   * * `unsupported` - UNSUPPORTED
   * * `indicative` - INDICATIVE
   * * `norfq` - NORFQ
   */
  fwd_rfq_type?: PangeaFwdRfqTypeEnum;
  /** @maxLength 255 */
  spot_rfq_dest?: string;
  /** @maxLength 255 */
  fwd_rfq_dest?: string;
  /** @maxLength 255 */
  spot_dest?: string;
  /** @maxLength 255 */
  fwd_dest?: string;
  use_triggers?: boolean;
  active?: boolean;
  /**
   * The maximum allowed tenor of the transaction.
   *
   * * `ON` - ON
   * * `TN` - TN
   * * `spot` - Spot
   * * `SN` - SN
   * * `SW` - SW
   * * `1W` - 1W
   * * `2W` - 2W
   * * `3W` - 3W
   * * `1M` - 1M
   * * `2M` - 2M
   * * `3M` - 3M
   * * `4M` - 4M
   * * `5M` - 5M
   * * `6M` - 6M
   * * `7M` - 7M
   * * `8M` - 8M
   * * `9M` - 9M
   * * `1Y` - 1Y
   * * `IMM1` - IMM1
   * * `IMM2` - IMM2
   * * `IMM3` - IMM3
   * * `IMM4` - IMM4
   * * `EOM1` - EOM1
   * * `EOM2` - EOM2
   * * `EOM3` - EOM3
   * * `EOM4` - EOM4
   * * `EOM5` - EOM5
   * * `EOM6` - EOM6
   * * `EOM7` - EOM7
   * * `EOM8` - EOM8
   * * `EOM9` - EOM9
   * * `EOM10` - EOM10
   * * `EOM11` - EOM11
   * * `EOM12` - EOM12
   */
  max_tenor?: PangeaMaxTenorEnum;
  company: number;
}

export interface PangeaCompany {
  id: number;
  currency: string;
  status: string;
  /**
   * * `Africa/Abidjan` - Africa/Abidjan
   * * `Africa/Accra` - Africa/Accra
   * * `Africa/Addis_Ababa` - Africa/Addis_Ababa
   * * `Africa/Algiers` - Africa/Algiers
   * * `Africa/Asmara` - Africa/Asmara
   * * `Africa/Bamako` - Africa/Bamako
   * * `Africa/Bangui` - Africa/Bangui
   * * `Africa/Banjul` - Africa/Banjul
   * * `Africa/Bissau` - Africa/Bissau
   * * `Africa/Blantyre` - Africa/Blantyre
   * * `Africa/Brazzaville` - Africa/Brazzaville
   * * `Africa/Bujumbura` - Africa/Bujumbura
   * * `Africa/Cairo` - Africa/Cairo
   * * `Africa/Casablanca` - Africa/Casablanca
   * * `Africa/Ceuta` - Africa/Ceuta
   * * `Africa/Conakry` - Africa/Conakry
   * * `Africa/Dakar` - Africa/Dakar
   * * `Africa/Dar_es_Salaam` - Africa/Dar_es_Salaam
   * * `Africa/Djibouti` - Africa/Djibouti
   * * `Africa/Douala` - Africa/Douala
   * * `Africa/El_Aaiun` - Africa/El_Aaiun
   * * `Africa/Freetown` - Africa/Freetown
   * * `Africa/Gaborone` - Africa/Gaborone
   * * `Africa/Harare` - Africa/Harare
   * * `Africa/Johannesburg` - Africa/Johannesburg
   * * `Africa/Juba` - Africa/Juba
   * * `Africa/Kampala` - Africa/Kampala
   * * `Africa/Khartoum` - Africa/Khartoum
   * * `Africa/Kigali` - Africa/Kigali
   * * `Africa/Kinshasa` - Africa/Kinshasa
   * * `Africa/Lagos` - Africa/Lagos
   * * `Africa/Libreville` - Africa/Libreville
   * * `Africa/Lome` - Africa/Lome
   * * `Africa/Luanda` - Africa/Luanda
   * * `Africa/Lubumbashi` - Africa/Lubumbashi
   * * `Africa/Lusaka` - Africa/Lusaka
   * * `Africa/Malabo` - Africa/Malabo
   * * `Africa/Maputo` - Africa/Maputo
   * * `Africa/Maseru` - Africa/Maseru
   * * `Africa/Mbabane` - Africa/Mbabane
   * * `Africa/Mogadishu` - Africa/Mogadishu
   * * `Africa/Monrovia` - Africa/Monrovia
   * * `Africa/Nairobi` - Africa/Nairobi
   * * `Africa/Ndjamena` - Africa/Ndjamena
   * * `Africa/Niamey` - Africa/Niamey
   * * `Africa/Nouakchott` - Africa/Nouakchott
   * * `Africa/Ouagadougou` - Africa/Ouagadougou
   * * `Africa/Porto-Novo` - Africa/Porto-Novo
   * * `Africa/Sao_Tome` - Africa/Sao_Tome
   * * `Africa/Tripoli` - Africa/Tripoli
   * * `Africa/Tunis` - Africa/Tunis
   * * `Africa/Windhoek` - Africa/Windhoek
   * * `America/Adak` - America/Adak
   * * `America/Anchorage` - America/Anchorage
   * * `America/Anguilla` - America/Anguilla
   * * `America/Antigua` - America/Antigua
   * * `America/Araguaina` - America/Araguaina
   * * `America/Argentina/Buenos_Aires` - America/Argentina/Buenos_Aires
   * * `America/Argentina/Catamarca` - America/Argentina/Catamarca
   * * `America/Argentina/Cordoba` - America/Argentina/Cordoba
   * * `America/Argentina/Jujuy` - America/Argentina/Jujuy
   * * `America/Argentina/La_Rioja` - America/Argentina/La_Rioja
   * * `America/Argentina/Mendoza` - America/Argentina/Mendoza
   * * `America/Argentina/Rio_Gallegos` - America/Argentina/Rio_Gallegos
   * * `America/Argentina/Salta` - America/Argentina/Salta
   * * `America/Argentina/San_Juan` - America/Argentina/San_Juan
   * * `America/Argentina/San_Luis` - America/Argentina/San_Luis
   * * `America/Argentina/Tucuman` - America/Argentina/Tucuman
   * * `America/Argentina/Ushuaia` - America/Argentina/Ushuaia
   * * `America/Aruba` - America/Aruba
   * * `America/Asuncion` - America/Asuncion
   * * `America/Atikokan` - America/Atikokan
   * * `America/Bahia` - America/Bahia
   * * `America/Bahia_Banderas` - America/Bahia_Banderas
   * * `America/Barbados` - America/Barbados
   * * `America/Belem` - America/Belem
   * * `America/Belize` - America/Belize
   * * `America/Blanc-Sablon` - America/Blanc-Sablon
   * * `America/Boa_Vista` - America/Boa_Vista
   * * `America/Bogota` - America/Bogota
   * * `America/Boise` - America/Boise
   * * `America/Cambridge_Bay` - America/Cambridge_Bay
   * * `America/Campo_Grande` - America/Campo_Grande
   * * `America/Cancun` - America/Cancun
   * * `America/Caracas` - America/Caracas
   * * `America/Cayenne` - America/Cayenne
   * * `America/Cayman` - America/Cayman
   * * `America/Chicago` - America/Chicago
   * * `America/Chihuahua` - America/Chihuahua
   * * `America/Ciudad_Juarez` - America/Ciudad_Juarez
   * * `America/Costa_Rica` - America/Costa_Rica
   * * `America/Creston` - America/Creston
   * * `America/Cuiaba` - America/Cuiaba
   * * `America/Curacao` - America/Curacao
   * * `America/Danmarkshavn` - America/Danmarkshavn
   * * `America/Dawson` - America/Dawson
   * * `America/Dawson_Creek` - America/Dawson_Creek
   * * `America/Denver` - America/Denver
   * * `America/Detroit` - America/Detroit
   * * `America/Dominica` - America/Dominica
   * * `America/Edmonton` - America/Edmonton
   * * `America/Eirunepe` - America/Eirunepe
   * * `America/El_Salvador` - America/El_Salvador
   * * `America/Fort_Nelson` - America/Fort_Nelson
   * * `America/Fortaleza` - America/Fortaleza
   * * `America/Glace_Bay` - America/Glace_Bay
   * * `America/Goose_Bay` - America/Goose_Bay
   * * `America/Grand_Turk` - America/Grand_Turk
   * * `America/Grenada` - America/Grenada
   * * `America/Guadeloupe` - America/Guadeloupe
   * * `America/Guatemala` - America/Guatemala
   * * `America/Guayaquil` - America/Guayaquil
   * * `America/Guyana` - America/Guyana
   * * `America/Halifax` - America/Halifax
   * * `America/Havana` - America/Havana
   * * `America/Hermosillo` - America/Hermosillo
   * * `America/Indiana/Indianapolis` - America/Indiana/Indianapolis
   * * `America/Indiana/Knox` - America/Indiana/Knox
   * * `America/Indiana/Marengo` - America/Indiana/Marengo
   * * `America/Indiana/Petersburg` - America/Indiana/Petersburg
   * * `America/Indiana/Tell_City` - America/Indiana/Tell_City
   * * `America/Indiana/Vevay` - America/Indiana/Vevay
   * * `America/Indiana/Vincennes` - America/Indiana/Vincennes
   * * `America/Indiana/Winamac` - America/Indiana/Winamac
   * * `America/Inuvik` - America/Inuvik
   * * `America/Iqaluit` - America/Iqaluit
   * * `America/Jamaica` - America/Jamaica
   * * `America/Juneau` - America/Juneau
   * * `America/Kentucky/Louisville` - America/Kentucky/Louisville
   * * `America/Kentucky/Monticello` - America/Kentucky/Monticello
   * * `America/Kralendijk` - America/Kralendijk
   * * `America/La_Paz` - America/La_Paz
   * * `America/Lima` - America/Lima
   * * `America/Los_Angeles` - America/Los_Angeles
   * * `America/Lower_Princes` - America/Lower_Princes
   * * `America/Maceio` - America/Maceio
   * * `America/Managua` - America/Managua
   * * `America/Manaus` - America/Manaus
   * * `America/Marigot` - America/Marigot
   * * `America/Martinique` - America/Martinique
   * * `America/Matamoros` - America/Matamoros
   * * `America/Mazatlan` - America/Mazatlan
   * * `America/Menominee` - America/Menominee
   * * `America/Merida` - America/Merida
   * * `America/Metlakatla` - America/Metlakatla
   * * `America/Mexico_City` - America/Mexico_City
   * * `America/Miquelon` - America/Miquelon
   * * `America/Moncton` - America/Moncton
   * * `America/Monterrey` - America/Monterrey
   * * `America/Montevideo` - America/Montevideo
   * * `America/Montserrat` - America/Montserrat
   * * `America/Nassau` - America/Nassau
   * * `America/New_York` - America/New_York
   * * `America/Nome` - America/Nome
   * * `America/Noronha` - America/Noronha
   * * `America/North_Dakota/Beulah` - America/North_Dakota/Beulah
   * * `America/North_Dakota/Center` - America/North_Dakota/Center
   * * `America/North_Dakota/New_Salem` - America/North_Dakota/New_Salem
   * * `America/Nuuk` - America/Nuuk
   * * `America/Ojinaga` - America/Ojinaga
   * * `America/Panama` - America/Panama
   * * `America/Paramaribo` - America/Paramaribo
   * * `America/Phoenix` - America/Phoenix
   * * `America/Port-au-Prince` - America/Port-au-Prince
   * * `America/Port_of_Spain` - America/Port_of_Spain
   * * `America/Porto_Velho` - America/Porto_Velho
   * * `America/Puerto_Rico` - America/Puerto_Rico
   * * `America/Punta_Arenas` - America/Punta_Arenas
   * * `America/Rankin_Inlet` - America/Rankin_Inlet
   * * `America/Recife` - America/Recife
   * * `America/Regina` - America/Regina
   * * `America/Resolute` - America/Resolute
   * * `America/Rio_Branco` - America/Rio_Branco
   * * `America/Santarem` - America/Santarem
   * * `America/Santiago` - America/Santiago
   * * `America/Santo_Domingo` - America/Santo_Domingo
   * * `America/Sao_Paulo` - America/Sao_Paulo
   * * `America/Scoresbysund` - America/Scoresbysund
   * * `America/Sitka` - America/Sitka
   * * `America/St_Barthelemy` - America/St_Barthelemy
   * * `America/St_Johns` - America/St_Johns
   * * `America/St_Kitts` - America/St_Kitts
   * * `America/St_Lucia` - America/St_Lucia
   * * `America/St_Thomas` - America/St_Thomas
   * * `America/St_Vincent` - America/St_Vincent
   * * `America/Swift_Current` - America/Swift_Current
   * * `America/Tegucigalpa` - America/Tegucigalpa
   * * `America/Thule` - America/Thule
   * * `America/Tijuana` - America/Tijuana
   * * `America/Toronto` - America/Toronto
   * * `America/Tortola` - America/Tortola
   * * `America/Vancouver` - America/Vancouver
   * * `America/Whitehorse` - America/Whitehorse
   * * `America/Winnipeg` - America/Winnipeg
   * * `America/Yakutat` - America/Yakutat
   * * `Antarctica/Casey` - Antarctica/Casey
   * * `Antarctica/Davis` - Antarctica/Davis
   * * `Antarctica/DumontDUrville` - Antarctica/DumontDUrville
   * * `Antarctica/Macquarie` - Antarctica/Macquarie
   * * `Antarctica/Mawson` - Antarctica/Mawson
   * * `Antarctica/McMurdo` - Antarctica/McMurdo
   * * `Antarctica/Palmer` - Antarctica/Palmer
   * * `Antarctica/Rothera` - Antarctica/Rothera
   * * `Antarctica/Syowa` - Antarctica/Syowa
   * * `Antarctica/Troll` - Antarctica/Troll
   * * `Antarctica/Vostok` - Antarctica/Vostok
   * * `Arctic/Longyearbyen` - Arctic/Longyearbyen
   * * `Asia/Aden` - Asia/Aden
   * * `Asia/Almaty` - Asia/Almaty
   * * `Asia/Amman` - Asia/Amman
   * * `Asia/Anadyr` - Asia/Anadyr
   * * `Asia/Aqtau` - Asia/Aqtau
   * * `Asia/Aqtobe` - Asia/Aqtobe
   * * `Asia/Ashgabat` - Asia/Ashgabat
   * * `Asia/Atyrau` - Asia/Atyrau
   * * `Asia/Baghdad` - Asia/Baghdad
   * * `Asia/Bahrain` - Asia/Bahrain
   * * `Asia/Baku` - Asia/Baku
   * * `Asia/Bangkok` - Asia/Bangkok
   * * `Asia/Barnaul` - Asia/Barnaul
   * * `Asia/Beirut` - Asia/Beirut
   * * `Asia/Bishkek` - Asia/Bishkek
   * * `Asia/Brunei` - Asia/Brunei
   * * `Asia/Chita` - Asia/Chita
   * * `Asia/Colombo` - Asia/Colombo
   * * `Asia/Damascus` - Asia/Damascus
   * * `Asia/Dhaka` - Asia/Dhaka
   * * `Asia/Dili` - Asia/Dili
   * * `Asia/Dubai` - Asia/Dubai
   * * `Asia/Dushanbe` - Asia/Dushanbe
   * * `Asia/Famagusta` - Asia/Famagusta
   * * `Asia/Gaza` - Asia/Gaza
   * * `Asia/Hebron` - Asia/Hebron
   * * `Asia/Ho_Chi_Minh` - Asia/Ho_Chi_Minh
   * * `Asia/Hong_Kong` - Asia/Hong_Kong
   * * `Asia/Hovd` - Asia/Hovd
   * * `Asia/Irkutsk` - Asia/Irkutsk
   * * `Asia/Jakarta` - Asia/Jakarta
   * * `Asia/Jayapura` - Asia/Jayapura
   * * `Asia/Jerusalem` - Asia/Jerusalem
   * * `Asia/Kabul` - Asia/Kabul
   * * `Asia/Kamchatka` - Asia/Kamchatka
   * * `Asia/Karachi` - Asia/Karachi
   * * `Asia/Kathmandu` - Asia/Kathmandu
   * * `Asia/Khandyga` - Asia/Khandyga
   * * `Asia/Kolkata` - Asia/Kolkata
   * * `Asia/Krasnoyarsk` - Asia/Krasnoyarsk
   * * `Asia/Kuala_Lumpur` - Asia/Kuala_Lumpur
   * * `Asia/Kuching` - Asia/Kuching
   * * `Asia/Kuwait` - Asia/Kuwait
   * * `Asia/Macau` - Asia/Macau
   * * `Asia/Magadan` - Asia/Magadan
   * * `Asia/Makassar` - Asia/Makassar
   * * `Asia/Manila` - Asia/Manila
   * * `Asia/Muscat` - Asia/Muscat
   * * `Asia/Nicosia` - Asia/Nicosia
   * * `Asia/Novokuznetsk` - Asia/Novokuznetsk
   * * `Asia/Novosibirsk` - Asia/Novosibirsk
   * * `Asia/Omsk` - Asia/Omsk
   * * `Asia/Oral` - Asia/Oral
   * * `Asia/Phnom_Penh` - Asia/Phnom_Penh
   * * `Asia/Pontianak` - Asia/Pontianak
   * * `Asia/Pyongyang` - Asia/Pyongyang
   * * `Asia/Qatar` - Asia/Qatar
   * * `Asia/Qostanay` - Asia/Qostanay
   * * `Asia/Qyzylorda` - Asia/Qyzylorda
   * * `Asia/Riyadh` - Asia/Riyadh
   * * `Asia/Sakhalin` - Asia/Sakhalin
   * * `Asia/Samarkand` - Asia/Samarkand
   * * `Asia/Seoul` - Asia/Seoul
   * * `Asia/Shanghai` - Asia/Shanghai
   * * `Asia/Singapore` - Asia/Singapore
   * * `Asia/Srednekolymsk` - Asia/Srednekolymsk
   * * `Asia/Taipei` - Asia/Taipei
   * * `Asia/Tashkent` - Asia/Tashkent
   * * `Asia/Tbilisi` - Asia/Tbilisi
   * * `Asia/Tehran` - Asia/Tehran
   * * `Asia/Thimphu` - Asia/Thimphu
   * * `Asia/Tokyo` - Asia/Tokyo
   * * `Asia/Tomsk` - Asia/Tomsk
   * * `Asia/Ulaanbaatar` - Asia/Ulaanbaatar
   * * `Asia/Urumqi` - Asia/Urumqi
   * * `Asia/Ust-Nera` - Asia/Ust-Nera
   * * `Asia/Vientiane` - Asia/Vientiane
   * * `Asia/Vladivostok` - Asia/Vladivostok
   * * `Asia/Yakutsk` - Asia/Yakutsk
   * * `Asia/Yangon` - Asia/Yangon
   * * `Asia/Yekaterinburg` - Asia/Yekaterinburg
   * * `Asia/Yerevan` - Asia/Yerevan
   * * `Atlantic/Azores` - Atlantic/Azores
   * * `Atlantic/Bermuda` - Atlantic/Bermuda
   * * `Atlantic/Canary` - Atlantic/Canary
   * * `Atlantic/Cape_Verde` - Atlantic/Cape_Verde
   * * `Atlantic/Faroe` - Atlantic/Faroe
   * * `Atlantic/Madeira` - Atlantic/Madeira
   * * `Atlantic/Reykjavik` - Atlantic/Reykjavik
   * * `Atlantic/South_Georgia` - Atlantic/South_Georgia
   * * `Atlantic/St_Helena` - Atlantic/St_Helena
   * * `Atlantic/Stanley` - Atlantic/Stanley
   * * `Australia/Adelaide` - Australia/Adelaide
   * * `Australia/Brisbane` - Australia/Brisbane
   * * `Australia/Broken_Hill` - Australia/Broken_Hill
   * * `Australia/Darwin` - Australia/Darwin
   * * `Australia/Eucla` - Australia/Eucla
   * * `Australia/Hobart` - Australia/Hobart
   * * `Australia/Lindeman` - Australia/Lindeman
   * * `Australia/Lord_Howe` - Australia/Lord_Howe
   * * `Australia/Melbourne` - Australia/Melbourne
   * * `Australia/Perth` - Australia/Perth
   * * `Australia/Sydney` - Australia/Sydney
   * * `Canada/Atlantic` - Canada/Atlantic
   * * `Canada/Central` - Canada/Central
   * * `Canada/Eastern` - Canada/Eastern
   * * `Canada/Mountain` - Canada/Mountain
   * * `Canada/Newfoundland` - Canada/Newfoundland
   * * `Canada/Pacific` - Canada/Pacific
   * * `Europe/Amsterdam` - Europe/Amsterdam
   * * `Europe/Andorra` - Europe/Andorra
   * * `Europe/Astrakhan` - Europe/Astrakhan
   * * `Europe/Athens` - Europe/Athens
   * * `Europe/Belgrade` - Europe/Belgrade
   * * `Europe/Berlin` - Europe/Berlin
   * * `Europe/Bratislava` - Europe/Bratislava
   * * `Europe/Brussels` - Europe/Brussels
   * * `Europe/Bucharest` - Europe/Bucharest
   * * `Europe/Budapest` - Europe/Budapest
   * * `Europe/Busingen` - Europe/Busingen
   * * `Europe/Chisinau` - Europe/Chisinau
   * * `Europe/Copenhagen` - Europe/Copenhagen
   * * `Europe/Dublin` - Europe/Dublin
   * * `Europe/Gibraltar` - Europe/Gibraltar
   * * `Europe/Guernsey` - Europe/Guernsey
   * * `Europe/Helsinki` - Europe/Helsinki
   * * `Europe/Isle_of_Man` - Europe/Isle_of_Man
   * * `Europe/Istanbul` - Europe/Istanbul
   * * `Europe/Jersey` - Europe/Jersey
   * * `Europe/Kaliningrad` - Europe/Kaliningrad
   * * `Europe/Kirov` - Europe/Kirov
   * * `Europe/Kyiv` - Europe/Kyiv
   * * `Europe/Lisbon` - Europe/Lisbon
   * * `Europe/Ljubljana` - Europe/Ljubljana
   * * `Europe/London` - Europe/London
   * * `Europe/Luxembourg` - Europe/Luxembourg
   * * `Europe/Madrid` - Europe/Madrid
   * * `Europe/Malta` - Europe/Malta
   * * `Europe/Mariehamn` - Europe/Mariehamn
   * * `Europe/Minsk` - Europe/Minsk
   * * `Europe/Monaco` - Europe/Monaco
   * * `Europe/Moscow` - Europe/Moscow
   * * `Europe/Oslo` - Europe/Oslo
   * * `Europe/Paris` - Europe/Paris
   * * `Europe/Podgorica` - Europe/Podgorica
   * * `Europe/Prague` - Europe/Prague
   * * `Europe/Riga` - Europe/Riga
   * * `Europe/Rome` - Europe/Rome
   * * `Europe/Samara` - Europe/Samara
   * * `Europe/San_Marino` - Europe/San_Marino
   * * `Europe/Sarajevo` - Europe/Sarajevo
   * * `Europe/Saratov` - Europe/Saratov
   * * `Europe/Simferopol` - Europe/Simferopol
   * * `Europe/Skopje` - Europe/Skopje
   * * `Europe/Sofia` - Europe/Sofia
   * * `Europe/Stockholm` - Europe/Stockholm
   * * `Europe/Tallinn` - Europe/Tallinn
   * * `Europe/Tirane` - Europe/Tirane
   * * `Europe/Ulyanovsk` - Europe/Ulyanovsk
   * * `Europe/Vaduz` - Europe/Vaduz
   * * `Europe/Vatican` - Europe/Vatican
   * * `Europe/Vienna` - Europe/Vienna
   * * `Europe/Vilnius` - Europe/Vilnius
   * * `Europe/Volgograd` - Europe/Volgograd
   * * `Europe/Warsaw` - Europe/Warsaw
   * * `Europe/Zagreb` - Europe/Zagreb
   * * `Europe/Zurich` - Europe/Zurich
   * * `GMT` - GMT
   * * `Indian/Antananarivo` - Indian/Antananarivo
   * * `Indian/Chagos` - Indian/Chagos
   * * `Indian/Christmas` - Indian/Christmas
   * * `Indian/Cocos` - Indian/Cocos
   * * `Indian/Comoro` - Indian/Comoro
   * * `Indian/Kerguelen` - Indian/Kerguelen
   * * `Indian/Mahe` - Indian/Mahe
   * * `Indian/Maldives` - Indian/Maldives
   * * `Indian/Mauritius` - Indian/Mauritius
   * * `Indian/Mayotte` - Indian/Mayotte
   * * `Indian/Reunion` - Indian/Reunion
   * * `Pacific/Apia` - Pacific/Apia
   * * `Pacific/Auckland` - Pacific/Auckland
   * * `Pacific/Bougainville` - Pacific/Bougainville
   * * `Pacific/Chatham` - Pacific/Chatham
   * * `Pacific/Chuuk` - Pacific/Chuuk
   * * `Pacific/Easter` - Pacific/Easter
   * * `Pacific/Efate` - Pacific/Efate
   * * `Pacific/Fakaofo` - Pacific/Fakaofo
   * * `Pacific/Fiji` - Pacific/Fiji
   * * `Pacific/Funafuti` - Pacific/Funafuti
   * * `Pacific/Galapagos` - Pacific/Galapagos
   * * `Pacific/Gambier` - Pacific/Gambier
   * * `Pacific/Guadalcanal` - Pacific/Guadalcanal
   * * `Pacific/Guam` - Pacific/Guam
   * * `Pacific/Honolulu` - Pacific/Honolulu
   * * `Pacific/Kanton` - Pacific/Kanton
   * * `Pacific/Kiritimati` - Pacific/Kiritimati
   * * `Pacific/Kosrae` - Pacific/Kosrae
   * * `Pacific/Kwajalein` - Pacific/Kwajalein
   * * `Pacific/Majuro` - Pacific/Majuro
   * * `Pacific/Marquesas` - Pacific/Marquesas
   * * `Pacific/Midway` - Pacific/Midway
   * * `Pacific/Nauru` - Pacific/Nauru
   * * `Pacific/Niue` - Pacific/Niue
   * * `Pacific/Norfolk` - Pacific/Norfolk
   * * `Pacific/Noumea` - Pacific/Noumea
   * * `Pacific/Pago_Pago` - Pacific/Pago_Pago
   * * `Pacific/Palau` - Pacific/Palau
   * * `Pacific/Pitcairn` - Pacific/Pitcairn
   * * `Pacific/Pohnpei` - Pacific/Pohnpei
   * * `Pacific/Port_Moresby` - Pacific/Port_Moresby
   * * `Pacific/Rarotonga` - Pacific/Rarotonga
   * * `Pacific/Saipan` - Pacific/Saipan
   * * `Pacific/Tahiti` - Pacific/Tahiti
   * * `Pacific/Tarawa` - Pacific/Tarawa
   * * `Pacific/Tongatapu` - Pacific/Tongatapu
   * * `Pacific/Wake` - Pacific/Wake
   * * `Pacific/Wallis` - Pacific/Wallis
   * * `US/Alaska` - US/Alaska
   * * `US/Arizona` - US/Arizona
   * * `US/Central` - US/Central
   * * `US/Eastern` - US/Eastern
   * * `US/Hawaii` - US/Hawaii
   * * `US/Mountain` - US/Mountain
   * * `US/Pacific` - US/Pacific
   * * `UTC` - UTC
   */
  timezone: PangeaTimezoneEnum;
  broker_accounts: PangeaBrokerAccount[];
  acct_company: PangeaAccountCompany[];
  ibkr_application: PangeaIbkrApplication[];
  rep: PangeaCompanyRep;
  show_pnl_graph: boolean;
  settings: PangeaCompanySettings;
  /** @maxLength 255 */
  name: string;
  /** @maxLength 255 */
  legal_name?: string | null;
  /** @maxLength 128 */
  phone?: string | null;
  /** @maxLength 255 */
  address_1?: string | null;
  /** @maxLength 255 */
  address_2?: string | null;
  /** @maxLength 255 */
  city?: string | null;
  state?: PangeaStateEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /** @maxLength 10 */
  zip_code?: string | null;
  /** @maxLength 255 */
  region?: string | null;
  /** @maxLength 255 */
  postal?: string | null;
  country?: PangeaCountryEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /** @maxLength 255 */
  ein?: string | null;
  /** @maxLength 255 */
  domain?: string | null;
  nonprofit?: boolean;
  /** Client Services Agreement Signed */
  onboarded?: boolean;
  /** @format date-time */
  created: string;
  /** @maxLength 255 */
  stripe_customer_id?: string | null;
  /** @maxLength 255 */
  stripe_setup_intent_id?: string | null;
  /**
   * @format int64
   * @min -9223372036854776000
   * @max 9223372036854776000
   */
  hs_company_id?: number | null;
  service_interested_in?:
    | PangeaServiceInterestedInEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  estimated_aum?:
    | PangeaEstimatedAumEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  account_owner?: number | null;
  recipients?: number[];
}

export interface PangeaCompanyContactOrder {
  id: number;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  sort_order?: number;
  company: number;
  user: number;
}

export interface PangeaCompanyContactOrderRequest {
  user_sort_order: number[];
}

export interface PangeaCompanyDirectors {
  full_name: string;
  job_title: string;
  occupation: string;
}

export interface PangeaCompanyFXBalanceAccountHistory {
  id: number;
  /** @maxLength 60 */
  account_number: string;
  /** @format date */
  date: string;
  /** @maxLength 60 */
  order_number: string;
  /** @format double */
  amount: number;
  /** @format double */
  debit_amount: number;
  /** @format double */
  credit_amount: number;
  is_posted: boolean;
  /** @format double */
  balance: number;
  currency: string;
  details: PangeaCompanyFXBalanceAccountHistoryDetail[];
}

export interface PangeaCompanyFXBalanceAccountHistoryDetail {
  /**
   * @min -2147483648
   * @max 2147483647
   */
  transaction_id: number;
  /** @maxLength 60 */
  order_number: string;
  /** @maxLength 60 */
  identifier: string;
  /** @maxLength 60 */
  name: string;
  currency: string;
  /** @format double */
  amount: number;
  /** @format date */
  date: string;
}

export interface PangeaCompanyJoinRequest {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /**
   * * `pending` - Pending
   * * `approved` - Approved
   * * `rejected` - Rejected
   */
  status: PangeaCompanyJoinRequestStatusEnum;
  company: number;
  requester: number;
  approver: number;
}

/**
 * * `pending` - Pending
 * * `approved` - Approved
 * * `rejected` - Rejected
 */
export enum PangeaCompanyJoinRequestStatusEnum {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface PangeaCompanyRep {
  /** @maxLength 150 */
  first_name?: string;
  /** @maxLength 150 */
  last_name?: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
}

export interface PangeaCompanySettings {
  corpay: PangeaCorPayCompanySettings;
  ibkr: PangeaIbkrCompanySettings;
  payment: PangeaPaymentCompanySettings;
}

export interface PangeaCorPayBeneficiary {
  /** @format uuid */
  id: string;
  /** @format uuid */
  persistent_id: string;
  beneficiary_contact_name: string;
  beneficiary_identifier: string;
  destination_country: string;
  bank_currency: string;
  beneficiary_classification: string;
  beneficiary_country: string;
  beneficiary_region: string;
  beneficiary_address1: string;
  beneficiary_address2?: string;
  beneficiary_city: string;
  beneficiary_postal: string;
  beneficiary_phone_number?: string;
  /** @format email */
  beneficiary_email?: string;
  send_pay_tracker: boolean;
  bank_name: string;
  swift_bic_code: string;
  bank_country: string;
  bank_region: string;
  bank_city: string;
  purpose_of_payment?: string;
  bank_address_line1: string;
  bank_address_line2?: string;
  bank_postal: string;
  payment_reference: string | null;
  internal_payment_alert?: string;
  external_payment_alert?: string;
  method_of_delivery?: string;
  mailing_instructions?: string;
  regulatory_fields?: string;
  /** @format date-time */
  last_update: string;
  status: string;
  entry_by: number;
  b_bank_id: string;
  b_bank_address3: string;
  b_bank_address4: string;
  b_bank_location: string;
  i_bank_swift_bic: string;
  i_bank_id: string;
  i_bank_name: string;
  i_bank_address1: string;
  i_bank_address2: string;
  i_bank_address3: string;
  i_bank_address4: string;
  i_bank_city: string;
  i_bank_province: string;
  i_bank_postal_code: string;
  i_bank_country_iso: string;
  i_bank_location: string;
  default_internal_comment: string;
  comment: string;
  sender_to_receiver: string;
  deal_comment: string;
  has_docs: boolean;
  send202: boolean;
  beneficiary_owes: boolean;
  notify_bank: boolean;
  client_code: number;
  to_client: boolean;
  default_remitter_id?: number;
  account_number: string;
  routing_code: string;
  routing_code2?: string;
  methods: PangeaBeneMethod[];
  payment_methods: string;
  settlement_methods: string;
  preferred_method: string;
  iban: string;
  beneficiary_country_name: string;
  account_holder_country_name: string;
  bank_country_name: string;
  regulatory: Record<string, any>[];
  bank_currency_desc: string;
}

export interface PangeaCorPayCompanySettings {
  wallet: boolean;
  forwards: boolean;
  max_horizon: number;
}

export interface PangeaCorPayFxForward {
  id: number;
  pair: string;
  /** @format date-time */
  date: string;
  /** @maxLength 4 */
  tenor: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  tenor_days: number;
  /** @format double */
  rate?: number | null;
  /** @format double */
  rate_bid?: number | null;
  /** @format double */
  rate_ask?: number | null;
  /** @format double */
  fwd_points?: number | null;
  /** @format double */
  fwd_points_bid?: number | null;
  /** @format double */
  fwd_points_ask?: number | null;
  data_cut: number;
}

export interface PangeaCorPayFxSpot {
  id: number;
  pair: string;
  /** @format date-time */
  date: string;
  /** @format double */
  rate?: number | null;
  /** @format double */
  rate_bid?: number | null;
  /** @format double */
  rate_ask?: number | null;
  data_cut: number;
}

/**
 * * `Payment` - PAYMENT
 * * `Settlement` - SETTLEMENT
 */
export enum PangeaCorpayLockSideEnum {
  Payment = 'Payment',
  Settlement = 'Settlement',
}

export interface PangeaCostAum {
  /** @format double */
  annualized_rate: number;
  /** @format double */
  minimum_rate: number;
}

export interface PangeaCostResponse {
  transactions: PangeaCostTransaction[];
  aum: PangeaCostAum;
}

export interface PangeaCostTransaction {
  /** @format double */
  transaction_low: number;
  /** @format double */
  transaction_high: number;
  /** @format double */
  p10: number;
  /** @format double */
  other: number;
  wire: string;
}

export interface PangeaCountry {
  /** @maxLength 255 */
  name: string;
  /** @maxLength 4 */
  code: string;
  currency_code?: string | null;
  use_in_average?: boolean;
  use_in_explore?: boolean;
  /**
   * * `strict_gate` - Strict Gate
   * * `soft_gate` - Soft Gate
   * * `persuasive` - Persuasive
   * * `open` - Open
   */
  strictness_of_capital_controls?: PangeaStrictnessOfCapitalControlsEnum;
  /** Description for Strictness of Capital Controls */
  strictness_of_capital_controls_description?: string | null;
}

/**
 * * `AF` - Afghanistan
 * * `AX` - Åland Islands
 * * `AL` - Albania
 * * `DZ` - Algeria
 * * `AS` - American Samoa
 * * `AD` - Andorra
 * * `AO` - Angola
 * * `AI` - Anguilla
 * * `AQ` - Antarctica
 * * `AG` - Antigua and Barbuda
 * * `AR` - Argentina
 * * `AM` - Armenia
 * * `AW` - Aruba
 * * `AU` - Australia
 * * `AT` - Austria
 * * `AZ` - Azerbaijan
 * * `BS` - Bahamas
 * * `BH` - Bahrain
 * * `BD` - Bangladesh
 * * `BB` - Barbados
 * * `BY` - Belarus
 * * `BE` - Belgium
 * * `BZ` - Belize
 * * `BJ` - Benin
 * * `BM` - Bermuda
 * * `BT` - Bhutan
 * * `BO` - Bolivia
 * * `BQ` - Bonaire, Sint Eustatius and Saba
 * * `BA` - Bosnia and Herzegovina
 * * `BW` - Botswana
 * * `BV` - Bouvet Island
 * * `BR` - Brazil
 * * `IO` - British Indian Ocean Territory
 * * `BN` - Brunei
 * * `BG` - Bulgaria
 * * `BF` - Burkina Faso
 * * `BI` - Burundi
 * * `CV` - Cabo Verde
 * * `KH` - Cambodia
 * * `CM` - Cameroon
 * * `CA` - Canada
 * * `KY` - Cayman Islands
 * * `CF` - Central African Republic
 * * `TD` - Chad
 * * `CL` - Chile
 * * `CN` - China
 * * `CX` - Christmas Island
 * * `CC` - Cocos (Keeling) Islands
 * * `CO` - Colombia
 * * `KM` - Comoros
 * * `CG` - Congo
 * * `CD` - Congo (the Democratic Republic of the)
 * * `CK` - Cook Islands
 * * `CR` - Costa Rica
 * * `CI` - Côte d'Ivoire
 * * `HR` - Croatia
 * * `CU` - Cuba
 * * `CW` - Curaçao
 * * `CY` - Cyprus
 * * `CZ` - Czechia
 * * `DK` - Denmark
 * * `DJ` - Djibouti
 * * `DM` - Dominica
 * * `DO` - Dominican Republic
 * * `EC` - Ecuador
 * * `EG` - Egypt
 * * `SV` - El Salvador
 * * `GQ` - Equatorial Guinea
 * * `ER` - Eritrea
 * * `EE` - Estonia
 * * `SZ` - Eswatini
 * * `ET` - Ethiopia
 * * `FK` - Falkland Islands (Malvinas)
 * * `FO` - Faroe Islands
 * * `FJ` - Fiji
 * * `FI` - Finland
 * * `FR` - France
 * * `GF` - French Guiana
 * * `PF` - French Polynesia
 * * `TF` - French Southern Territories
 * * `GA` - Gabon
 * * `GM` - Gambia
 * * `GE` - Georgia
 * * `DE` - Germany
 * * `GH` - Ghana
 * * `GI` - Gibraltar
 * * `GR` - Greece
 * * `GL` - Greenland
 * * `GD` - Grenada
 * * `GP` - Guadeloupe
 * * `GU` - Guam
 * * `GT` - Guatemala
 * * `GG` - Guernsey
 * * `GN` - Guinea
 * * `GW` - Guinea-Bissau
 * * `GY` - Guyana
 * * `HT` - Haiti
 * * `HM` - Heard Island and McDonald Islands
 * * `VA` - Holy See
 * * `HN` - Honduras
 * * `HK` - Hong Kong
 * * `HU` - Hungary
 * * `IS` - Iceland
 * * `IN` - India
 * * `ID` - Indonesia
 * * `IR` - Iran
 * * `IQ` - Iraq
 * * `IE` - Ireland
 * * `IM` - Isle of Man
 * * `IL` - Israel
 * * `IT` - Italy
 * * `JM` - Jamaica
 * * `JP` - Japan
 * * `JE` - Jersey
 * * `JO` - Jordan
 * * `KZ` - Kazakhstan
 * * `KE` - Kenya
 * * `KI` - Kiribati
 * * `KW` - Kuwait
 * * `KG` - Kyrgyzstan
 * * `LA` - Laos
 * * `LV` - Latvia
 * * `LB` - Lebanon
 * * `LS` - Lesotho
 * * `LR` - Liberia
 * * `LY` - Libya
 * * `LI` - Liechtenstein
 * * `LT` - Lithuania
 * * `LU` - Luxembourg
 * * `MO` - Macao
 * * `MG` - Madagascar
 * * `MW` - Malawi
 * * `MY` - Malaysia
 * * `MV` - Maldives
 * * `ML` - Mali
 * * `MT` - Malta
 * * `MH` - Marshall Islands
 * * `MQ` - Martinique
 * * `MR` - Mauritania
 * * `MU` - Mauritius
 * * `YT` - Mayotte
 * * `MX` - Mexico
 * * `FM` - Micronesia
 * * `MD` - Moldova
 * * `MC` - Monaco
 * * `MN` - Mongolia
 * * `ME` - Montenegro
 * * `MS` - Montserrat
 * * `MA` - Morocco
 * * `MZ` - Mozambique
 * * `MM` - Myanmar
 * * `NA` - Namibia
 * * `NR` - Nauru
 * * `NP` - Nepal
 * * `NL` - Netherlands
 * * `NC` - New Caledonia
 * * `NZ` - New Zealand
 * * `NI` - Nicaragua
 * * `NE` - Niger
 * * `NG` - Nigeria
 * * `NU` - Niue
 * * `NF` - Norfolk Island
 * * `KP` - North Korea
 * * `MK` - North Macedonia
 * * `MP` - Northern Mariana Islands
 * * `NO` - Norway
 * * `OM` - Oman
 * * `PK` - Pakistan
 * * `PW` - Palau
 * * `PS` - Palestine, State of
 * * `PA` - Panama
 * * `PG` - Papua New Guinea
 * * `PY` - Paraguay
 * * `PE` - Peru
 * * `PH` - Philippines
 * * `PN` - Pitcairn
 * * `PL` - Poland
 * * `PT` - Portugal
 * * `PR` - Puerto Rico
 * * `QA` - Qatar
 * * `RE` - Réunion
 * * `RO` - Romania
 * * `RU` - Russia
 * * `RW` - Rwanda
 * * `BL` - Saint Barthélemy
 * * `SH` - Saint Helena, Ascension and Tristan da Cunha
 * * `KN` - Saint Kitts and Nevis
 * * `LC` - Saint Lucia
 * * `MF` - Saint Martin (French part)
 * * `PM` - Saint Pierre and Miquelon
 * * `VC` - Saint Vincent and the Grenadines
 * * `WS` - Samoa
 * * `SM` - San Marino
 * * `ST` - Sao Tome and Principe
 * * `SA` - Saudi Arabia
 * * `SN` - Senegal
 * * `RS` - Serbia
 * * `SC` - Seychelles
 * * `SL` - Sierra Leone
 * * `SG` - Singapore
 * * `SX` - Sint Maarten (Dutch part)
 * * `SK` - Slovakia
 * * `SI` - Slovenia
 * * `SB` - Solomon Islands
 * * `SO` - Somalia
 * * `ZA` - South Africa
 * * `GS` - South Georgia and the South Sandwich Islands
 * * `KR` - South Korea
 * * `SS` - South Sudan
 * * `ES` - Spain
 * * `LK` - Sri Lanka
 * * `SD` - Sudan
 * * `SR` - Suriname
 * * `SJ` - Svalbard and Jan Mayen
 * * `SE` - Sweden
 * * `CH` - Switzerland
 * * `SY` - Syria
 * * `TW` - Taiwan
 * * `TJ` - Tajikistan
 * * `TZ` - Tanzania
 * * `TH` - Thailand
 * * `TL` - Timor-Leste
 * * `TG` - Togo
 * * `TK` - Tokelau
 * * `TO` - Tonga
 * * `TT` - Trinidad and Tobago
 * * `TN` - Tunisia
 * * `TR` - Türkiye
 * * `TM` - Turkmenistan
 * * `TC` - Turks and Caicos Islands
 * * `TV` - Tuvalu
 * * `UG` - Uganda
 * * `UA` - Ukraine
 * * `AE` - United Arab Emirates
 * * `GB` - United Kingdom
 * * `UM` - United States Minor Outlying Islands
 * * `US` - United States of America
 * * `UY` - Uruguay
 * * `UZ` - Uzbekistan
 * * `VU` - Vanuatu
 * * `VE` - Venezuela
 * * `VN` - Vietnam
 * * `VG` - Virgin Islands (British)
 * * `VI` - Virgin Islands (U.S.)
 * * `WF` - Wallis and Futuna
 * * `EH` - Western Sahara
 * * `YE` - Yemen
 * * `ZM` - Zambia
 * * `ZW` - Zimbabwe
 */
export enum PangeaCountryEnum {
  AF = 'AF',
  AX = 'AX',
  AL = 'AL',
  DZ = 'DZ',
  AS = 'AS',
  AD = 'AD',
  AO = 'AO',
  AI = 'AI',
  AQ = 'AQ',
  AG = 'AG',
  AR = 'AR',
  AM = 'AM',
  AW = 'AW',
  AU = 'AU',
  AT = 'AT',
  AZ = 'AZ',
  BS = 'BS',
  BH = 'BH',
  BD = 'BD',
  BB = 'BB',
  BY = 'BY',
  BE = 'BE',
  BZ = 'BZ',
  BJ = 'BJ',
  BM = 'BM',
  BT = 'BT',
  BO = 'BO',
  BQ = 'BQ',
  BA = 'BA',
  BW = 'BW',
  BV = 'BV',
  BR = 'BR',
  IO = 'IO',
  BN = 'BN',
  BG = 'BG',
  BF = 'BF',
  BI = 'BI',
  CV = 'CV',
  KH = 'KH',
  CM = 'CM',
  CA = 'CA',
  KY = 'KY',
  CF = 'CF',
  TD = 'TD',
  CL = 'CL',
  CN = 'CN',
  CX = 'CX',
  CC = 'CC',
  CO = 'CO',
  KM = 'KM',
  CG = 'CG',
  CD = 'CD',
  CK = 'CK',
  CR = 'CR',
  CI = 'CI',
  HR = 'HR',
  CU = 'CU',
  CW = 'CW',
  CY = 'CY',
  CZ = 'CZ',
  DK = 'DK',
  DJ = 'DJ',
  DM = 'DM',
  DO = 'DO',
  EC = 'EC',
  EG = 'EG',
  SV = 'SV',
  GQ = 'GQ',
  ER = 'ER',
  EE = 'EE',
  SZ = 'SZ',
  ET = 'ET',
  FK = 'FK',
  FO = 'FO',
  FJ = 'FJ',
  FI = 'FI',
  FR = 'FR',
  GF = 'GF',
  PF = 'PF',
  TF = 'TF',
  GA = 'GA',
  GM = 'GM',
  GE = 'GE',
  DE = 'DE',
  GH = 'GH',
  GI = 'GI',
  GR = 'GR',
  GL = 'GL',
  GD = 'GD',
  GP = 'GP',
  GU = 'GU',
  GT = 'GT',
  GG = 'GG',
  GN = 'GN',
  GW = 'GW',
  GY = 'GY',
  HT = 'HT',
  HM = 'HM',
  VA = 'VA',
  HN = 'HN',
  HK = 'HK',
  HU = 'HU',
  IS = 'IS',
  IN = 'IN',
  ID = 'ID',
  IR = 'IR',
  IQ = 'IQ',
  IE = 'IE',
  IM = 'IM',
  IL = 'IL',
  IT = 'IT',
  JM = 'JM',
  JP = 'JP',
  JE = 'JE',
  JO = 'JO',
  KZ = 'KZ',
  KE = 'KE',
  KI = 'KI',
  KW = 'KW',
  KG = 'KG',
  LA = 'LA',
  LV = 'LV',
  LB = 'LB',
  LS = 'LS',
  LR = 'LR',
  LY = 'LY',
  LI = 'LI',
  LT = 'LT',
  LU = 'LU',
  MO = 'MO',
  MG = 'MG',
  MW = 'MW',
  MY = 'MY',
  MV = 'MV',
  ML = 'ML',
  MT = 'MT',
  MH = 'MH',
  MQ = 'MQ',
  MR = 'MR',
  MU = 'MU',
  YT = 'YT',
  MX = 'MX',
  FM = 'FM',
  MD = 'MD',
  MC = 'MC',
  MN = 'MN',
  ME = 'ME',
  MS = 'MS',
  MA = 'MA',
  MZ = 'MZ',
  MM = 'MM',
  NA = 'NA',
  NR = 'NR',
  NP = 'NP',
  NL = 'NL',
  NC = 'NC',
  NZ = 'NZ',
  NI = 'NI',
  NE = 'NE',
  NG = 'NG',
  NU = 'NU',
  NF = 'NF',
  KP = 'KP',
  MK = 'MK',
  MP = 'MP',
  NO = 'NO',
  OM = 'OM',
  PK = 'PK',
  PW = 'PW',
  PS = 'PS',
  PA = 'PA',
  PG = 'PG',
  PY = 'PY',
  PE = 'PE',
  PH = 'PH',
  PN = 'PN',
  PL = 'PL',
  PT = 'PT',
  PR = 'PR',
  QA = 'QA',
  RE = 'RE',
  RO = 'RO',
  RU = 'RU',
  RW = 'RW',
  BL = 'BL',
  SH = 'SH',
  KN = 'KN',
  LC = 'LC',
  MF = 'MF',
  PM = 'PM',
  VC = 'VC',
  WS = 'WS',
  SM = 'SM',
  ST = 'ST',
  SA = 'SA',
  SN = 'SN',
  RS = 'RS',
  SC = 'SC',
  SL = 'SL',
  SG = 'SG',
  SX = 'SX',
  SK = 'SK',
  SI = 'SI',
  SB = 'SB',
  SO = 'SO',
  ZA = 'ZA',
  GS = 'GS',
  KR = 'KR',
  SS = 'SS',
  ES = 'ES',
  LK = 'LK',
  SD = 'SD',
  SR = 'SR',
  SJ = 'SJ',
  SE = 'SE',
  CH = 'CH',
  SY = 'SY',
  TW = 'TW',
  TJ = 'TJ',
  TZ = 'TZ',
  TH = 'TH',
  TL = 'TL',
  TG = 'TG',
  TK = 'TK',
  TO = 'TO',
  TT = 'TT',
  TN = 'TN',
  TR = 'TR',
  TM = 'TM',
  TC = 'TC',
  TV = 'TV',
  UG = 'UG',
  UA = 'UA',
  AE = 'AE',
  GB = 'GB',
  UM = 'UM',
  US = 'US',
  UY = 'UY',
  UZ = 'UZ',
  VU = 'VU',
  VE = 'VE',
  VN = 'VN',
  VG = 'VG',
  VI = 'VI',
  WF = 'WF',
  EH = 'EH',
  YE = 'YE',
  ZM = 'ZM',
  ZW = 'ZW',
}

export interface PangeaCreateAccountForCompanyView {
  account_name: string;
  currencies?: string[];
  account_type?: string;
  is_active?: boolean | null;
}

export interface PangeaCreateCompany {
  currency: string;
  name: string;
}

export interface PangeaCreateCompanyJoinRequest {
  company_id: number;
}

export interface PangeaCreateECASSO {
  credential: string;
  ip: string;
  /**
   * * `transfer_funds` - TransferFunds
   * * `wire_withdrawal` - WireWithdrawals
   * * `ach_withdrawal` - ACHWithdrawals
   * * `ach_deposit` - ACHDeposits
   * * `transfer_position` - TransferPositions
   * * `transaction_history` - TransferHistory
   * * `statement` - Statement
   */
  action?: PangeaCreateECASSOActionEnum;
}

/**
 * * `transfer_funds` - TransferFunds
 * * `wire_withdrawal` - WireWithdrawals
 * * `ach_withdrawal` - ACHWithdrawals
 * * `ach_deposit` - ACHDeposits
 * * `transfer_position` - TransferPositions
 * * `transaction_history` - TransferHistory
 * * `statement` - Statement
 */
export enum PangeaCreateECASSOActionEnum {
  TransferFunds = 'transfer_funds',
  WireWithdrawal = 'wire_withdrawal',
  AchWithdrawal = 'ach_withdrawal',
  AchDeposit = 'ach_deposit',
  TransferPosition = 'transfer_position',
  TransactionHistory = 'transaction_history',
  Statement = 'statement',
}

export interface PangeaCreateECASSOResponse {
  url: string;
}

export interface PangeaCreateQuoteRequest {
  from_currency: string;
  to_currency: string;
}

export interface PangeaCreditUsageResponse {
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  available: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  required: string;
}

export interface PangeaCreditUtilization {
  /** @format double */
  credit_utilization: number;
  /** @format double */
  credit_limit: number;
  /** @format double */
  forward_pnl: number;
}

export interface PangeaCreditUtilizationResponse {
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  credit_limit: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  credit_used: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  pnl: string;
}

export interface PangeaCurrency {
  id: number;
  /** @maxLength 10 */
  symbol?: string | null;
  /** @maxLength 3 */
  mnemonic: string;
  /** @maxLength 255 */
  name?: string | null;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  unit?: number | null;
  /** @maxLength 255 */
  numeric_code?: string | null;
  /** @maxLength 255 */
  country?: string | null;
  /** @format uri */
  image_thumbnail?: string | null;
  /** @format uri */
  image_banner?: string | null;
}

export interface PangeaCurrencyAmount {
  currency: string;
  /** @format double */
  amount: number;
  /** @format double */
  amount_domestic?: number;
}

export interface PangeaCurrencyDefinition {
  currency: PangeaCurrency;
  p10?: boolean;
  wallet?: boolean;
  wallet_api?: boolean;
  ndf?: boolean;
  fwd_delivery_buying?: boolean;
  fwd_delivery_selling?: boolean;
  incoming_payments?: boolean;
  outgoing_payments?: boolean;
}

export interface PangeaCurrencyDelivery {
  id: number;
  currency: PangeaCurrency;
  country: PangeaCountry;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /**
   * * `W` - Wire
   * * `E` - iACH
   * * `C` - FXBalance
   */
  delivery_method: PangeaInstructDealRequestDeliveryMethodEnum;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  delivery_sla: number;
  /** @format time */
  deadline: string;
}

/**
 * * `USD` - USD
 * * `HUF` - HUF
 * * `EUR` - EUR
 * * `CZK` - CZK
 * * `GBP` - GBP
 * * `CNH` - CNH
 * * `CAD` - CAD
 * * `DKK` - DKK
 * * `JPY` - JPY
 * * `RUB` - RUB
 * * `HKD` - HKD
 * * `ILS` - ILS
 * * `AUD` - AUD
 * * `NOK` - NOK
 * * `CHF` - CHF
 * * `SGD` - SGD
 * * `MXN` - MXN
 * * `PLN` - PLN
 * * `SEK` - SEK
 * * `ZAR` - ZAR
 * * `NZD` - NZD
 */
export enum PangeaCurrencyEnum {
  USD = 'USD',
  HUF = 'HUF',
  EUR = 'EUR',
  CZK = 'CZK',
  GBP = 'GBP',
  CNH = 'CNH',
  CAD = 'CAD',
  DKK = 'DKK',
  JPY = 'JPY',
  RUB = 'RUB',
  HKD = 'HKD',
  ILS = 'ILS',
  AUD = 'AUD',
  NOK = 'NOK',
  CHF = 'CHF',
  SGD = 'SGD',
  MXN = 'MXN',
  PLN = 'PLN',
  SEK = 'SEK',
  ZAR = 'ZAR',
  NZD = 'NZD',
}

export interface PangeaCurrencyResponse {
  id: number;
  symbol: string;
  symbol_location: string;
  mnemonic: string;
  name: string;
  unit: number;
  numeric_code: string;
  country: string;
  image_thumbnail: string;
  image_banner: string;
  category: string;
  currency: string;
  active: boolean;
  available: boolean;
}

export interface PangeaDateRange {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /** @format date */
  start_date: string;
  /** @format date */
  end_date: string;
}

/**
 * * `3m` - 3 Months
 * * `1y` - 1 Year
 * * `5y` - 5 Years
 */
export enum PangeaDateRangeEnum {
  Value3M = '3m',
  Value1Y = '1y',
  Value5Y = '5y',
}

/**
 * * `EXPEDITED` - Expedited
 * * `SPOT` - Spot
 * * `MAX_DATE` - Max Date
 * * `FORWARD` - Forward
 * * `TRADE_DATE` - Trade Date
 */
export enum PangeaDateTypeEnum {
  EXPEDITED = 'EXPEDITED',
  SPOT = 'SPOT',
  MAX_DATE = 'MAX_DATE',
  FORWARD = 'FORWARD',
  TRADE_DATE = 'TRADE_DATE',
}

/**
 * * `1` - Intercompany Payment
 * * `2` - Purchase/Sale of Goods
 * * `3` - Purchase/Sale of Services
 * * `4` - Personnel Payment
 * * `5` - Financial Transaction
 * * `6` - Other
 */
export enum PangeaDefaultPurposeEnum {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
}

export interface PangeaDeleteBeneficiaryResponse {
  advanced?: Record<string, any>;
}

export interface PangeaDemoFormRequest {
  name: string;
  /** @format email */
  email: string;
  company: string;
  company_url: string;
  jobtitle: string;
  friend_referral: string;
  /** Do you have employees living working internationally  */
  do_you_have_employees_living_working_internationally_: string;
  annual_international_transaction_volume: string;
  currencies: string;
}

export interface PangeaDemoResponse {
  /** @default true */
  success?: boolean;
  contact_id: string;
  company_id: string;
}

export interface PangeaDeposit {
  date: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  amount: string;
  currency: string;
}

export interface PangeaDepositRequest {
  /** @format double */
  amount: number;
  broker_account_id: number;
  /**
   * * `USD` - USD
   * * `HUF` - HUF
   * * `EUR` - EUR
   * * `CZK` - CZK
   * * `GBP` - GBP
   * * `CNH` - CNH
   * * `CAD` - CAD
   * * `DKK` - DKK
   * * `JPY` - JPY
   * * `RUB` - RUB
   * * `HKD` - HKD
   * * `ILS` - ILS
   * * `AUD` - AUD
   * * `NOK` - NOK
   * * `CHF` - CHF
   * * `SGD` - SGD
   * * `MXN` - MXN
   * * `PLN` - PLN
   * * `SEK` - SEK
   * * `ZAR` - ZAR
   * * `NZD` - NZD
   */
  currency: PangeaCurrencyEnum;
  /** @default "WIRE" */
  method?: PangeaWithdrawRequestMethodEnum;
  saved_instruction_name?: string;
}

export interface PangeaDepositResult {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  ib_instr_id?: number | null;
  /**
   * * `pending` - Pending
   * * `processed` - Processed
   * * `rejected` - Rejected
   */
  status?: PangeaFundingRequestStatusEnum;
  /** @maxLength 255 */
  code?: string | null;
  description?: string | null;
  /** @format double */
  amount?: number | null;
  /** @maxLength 10 */
  method?: string | null;
  /** @maxLength 60 */
  saved_instruction_name?: string | null;
  currency: number;
  funding_request: number;
}

export interface PangeaDetailedPaymentRfqResponse {
  success: PangeaPaymentRfq[];
  failed?: PangeaFailedPaymentRfq[];
}

/**
 * A serializer for the DraftCashFlow model.
 *
 * Note that date fields should be be in the format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
 */
export interface PangeaDraftCashflow {
  id: number;
  /** @format date-time */
  date: string;
  /** @format date-time */
  end_date?: string | null;
  currency: string;
  /** @format double */
  amount: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /** @maxLength 60 */
  name?: string | null;
  description?: string | null;
  periodicity?: string | null;
  calendar?: PangeaCalendarEnum | PangeaBlankEnum | PangeaNullEnum | null;
  roll_convention?:
    | PangeaRollConventionEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  installment_id?: number | null;
  /**
   * Returns the id of the cashflow this draft is associated with.
   * :param draft: The draft object.
   * :return: The id of the cashflow this draft is associated with if this cashflow is associated with one.
   */
  cashflow_id: number | null;
  account_id?: number | null;
  /**
   * * `CREATE` - CREATE
   * * `UPDATE` - UPDATE
   * * `DELETE` - DELETE
   */
  action: PangeaDraftCashflowActionEnum;
  /** @default false */
  is_forward?: boolean;
  draft_fx_forward_id: number | null;
  /** @format double */
  indicative_rate?: number | null;
  /** @format double */
  indicative_base_amount?: number | null;
  /** @format double */
  indicative_cntr_amount?: number | null;
  /** @format double */
  booked_rate: number;
  /** @format double */
  booked_base_amount: number;
  /** @format double */
  booked_cntr_amount: number;
}

/**
 * * `CREATE` - CREATE
 * * `UPDATE` - UPDATE
 * * `DELETE` - DELETE
 */
export enum PangeaDraftCashflowActionEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface PangeaDraftFxForward {
  id?: number;
  status: string;
  /** @format double */
  risk_reduction: number;
  fxpair: string;
  draft_cashflow?: number | null;
  cashflow?: number | null;
  installment?: number | null;
  origin_account?: string | null;
  destination_account?: string | null;
  destination_account_type?:
    | PangeaInstructDealRequestDeliveryMethodEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  cash_settle_account?: string | null;
  funding_account?: string | null;
  /** @default false */
  is_cash_settle?: boolean;
  purpose_of_payment?: string | null;
  /** @format double */
  estimated_fx_forward_price: number;
  company?: number;
}

export interface PangeaEmail {
  /** @format email */
  email: string;
}

export interface PangeaError {
  status: string;
  message: string;
  code: number;
  data: any;
}

/**
 * * `0_10m` - 0-$10,000,000
 * * `10m_100m` - $10,000,000 - $100,000,000
 * * `100m_1b` - $100,000,000 - $1000,000,000
 * * `1b+` - $1000,000,000+
 */
export enum PangeaEstimatedAumEnum {
  Value010M = '0_10m',
  Value10M100M = '10m_100m',
  Value100M1B = '100m_1b',
  Value1B = '1b+',
}

export interface PangeaEvent {
  /**
   * The name of the event.
   * @maxLength 100
   */
  name: string;
  /**
   * The unique type of the event.
   * @maxLength 32
   */
  type: string;
}

export interface PangeaEventGroup {
  /**
   * The name of the event group.
   * @maxLength 50
   */
  name: string;
  /**
   * The slug for the event group.
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string;
  events: PangeaEvent[];
}

export interface PangeaExecute {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code used to indicate which amount you are defining the value of. The non-lock_side amount will be calculated. */
  lock_side: string;
  /**
   * The amount of lock_side currency
   * @format double
   * @min 0.01
   */
  amount: number;
  /** The date when the transaction will settle. Defaults to the following business day if settlement cannot occur on the provided value_date. */
  value_date: string;
  /** @default "market" */
  execution_strategy?: PangeaExecutionStrategy183Enum;
  /** Client-provided funding identifier. Will use default if configured. Otherwise, post-funded. */
  settle_account_id?: string | null;
  /** Client-provided beneficiary identifier. */
  beneficiary_id?: string | null;
  /** Identifier for the customer associated with the company for the transaction. */
  customer_id?: string | null;
  /** Unique identifier for the cashflow. If cashflow_id is provided, required fields are not necessary as they will be filled in appropriately from the cashflow. */
  cashflow_id?: string | null;
  /** Client-provided unique identifier for the transaction. */
  transaction_id?: string | null;
  /** Client-supplied identifier to provide transaction grouping. */
  transaction_group?: string | null;
  /** Internal free-form payment memo. */
  payment_memo?: string | null;
  /**
   * Execution begins when client price goes above this threshold.
   * @format double
   */
  upper_trigger?: number | null;
  /**
   * Execution begins when client price goes below this threshold.
   * @format double
   */
  lower_trigger?: number | null;
}

export interface PangeaExecuteRfq {
  /** @format uuid */
  ticket_id: string;
  /**
   * The amount of lock_side currency
   * @format double
   * @min 0.01
   */
  amount?: number;
  /** Client-provided funding identifier. Will use default if configured. Otherwise, post-funded. */
  settle_account_id?: string | null;
  /** Client-provided beneficiary identifier. */
  beneficiary_id?: string | null;
  /** Internal free-form payment memo. */
  payment_memo?: string | null;
}

export interface PangeaExecutingBroker {
  id: number;
  /** @maxLength 255 */
  name: string;
  broker_provider?: PangeaFwdBrokerEnum | PangeaBlankEnum;
}

/**
 * * `market` - Market - execute at the best available market rate
 * * `bestx` - BestX - execute when Pangea expects optimal market conditions
 */
export enum PangeaExecutionStrategy183Enum {
  Market = 'market',
  Bestx = 'bestx',
}

/**
 * * `immediate_spot` - Immediate Spot
 * * `immediate_forward` - Immediate Forward
 * * `immediate_ndf` - Immediate NDF
 * * `strategic_spot` - Strategic Spot
 * * `strategic_forward` - Strategic Forward
 * * `strategic_ndf` - Strategic Execution NDF
 * * `scheduled_spot` - Scheduled Spot
 */
export enum PangeaExecutionTimingEnum {
  ImmediateSpot = 'immediate_spot',
  ImmediateForward = 'immediate_forward',
  ImmediateNdf = 'immediate_ndf',
  StrategicSpot = 'strategic_spot',
  StrategicForward = 'strategic_forward',
  StrategicNdf = 'strategic_ndf',
  ScheduledSpot = 'scheduled_spot',
}

export interface PangeaExtendInvite {
  /** @format email */
  email: string;
  /** @default "customer_viewer" */
  group?: PangeaGroupEnum;
}

export interface PangeaExternalMtm {
  /** @format uuid */
  ticket_id: string;
  /** Related company associated with the transaction. */
  company: number | null;
  /** Identifier for the customer associated with the company for the transaction. */
  customer_id?: string | null;
  /** The currency being transferred from. */
  sell_currency?: number | null;
  /** The currency being transferred to. */
  buy_currency?: number | null;
  /**
   * The amount of lock_side currency being transferred in the transaction.
   * @format double
   */
  amount: number;
  /** ISO 4217 Standard 3-Letter Currency Code used to indicate which amount you are defining the value of. The non-lock_side amount will be calculated. */
  lock_side?: number | null;
  /**
   * The date when the transaction will settle. Defaults to the following business day if settlement cannot occur on the provided value_date.
   * @format date
   */
  value_date: string;
  /** Client-supplied unique identifier for the transaction. */
  transaction_id: string | null;
  /** Client-supplied identifier to provide transaction grouping. */
  transaction_group?: string | null;
  /** @format double */
  mark_to_market?: number | null;
  /** @format date-time */
  last_mark_time?: string | null;
  mtm_info?: any;
}

export interface PangeaFXBalanceAccountHistoryDetail {
  /**
   * @min -2147483648
   * @max 2147483647
   */
  transaction_id: number;
  /** @maxLength 60 */
  identifier: string;
  /** @maxLength 60 */
  name: string;
  currency: number;
  /** @format double */
  amount: number;
  /** @format date */
  date: string;
}

export interface PangeaFXBalanceAccountHistoryRow {
  id: number;
  /** @maxLength 60 */
  order_number: string;
  /** @format date */
  date: string;
  /** @format double */
  amount: number;
  is_posted: boolean;
  /** @format double */
  balance: number;
  details: PangeaFXBalanceAccountHistoryDetail[];
}

export interface PangeaFXBalanceAccountsResponse {
  data: PangeaFXBalanceAccountsResponseData;
  items: PangeaFXBalanceAccountsResponseItem[];
}

export interface PangeaFXBalanceAccountsResponseData {
  rows: PangeaFXBalanceAccountsResponseDataRow[];
}

export interface PangeaFXBalanceAccountsResponseDataRow {
  account: string;
  currency: string;
  /** @format double */
  ledger_balance: number;
  /** @format double */
  balance_held: number;
  /** @format double */
  available_balance: number;
  /** @format double */
  ledger_balance_domestic?: number;
  /** @format double */
  balance_held_domestic?: number;
  /** @format double */
  available_balance_domestic?: number;
  account_number: string;
  client_code: number;
  client_division_id: number;
  links: PangeaLink[];
}

export interface PangeaFXBalanceAccountsResponseItem {
  id: string;
  text: string;
  curr: string;
  curr_text: string;
  account: string;
  /** @format double */
  ledger_balance: number;
  /** @format double */
  balance_held: number;
  /** @format double */
  available_balance: number;
  /** @format double */
  allowed_payment: number;
  client: string;
  branch_id: number;
  account_name: string;
  links: PangeaLink[];
}

export interface PangeaFacet {
  id: string;
  text?: string;
  count: number;
}

export interface PangeaFailedPaymentRfq {
  cashflow_id?: string;
  ticket_id?: string;
  status: string;
  message: string;
  code: number;
  data?: Record<string, string | null>;
}

export interface PangeaFee {
  name: string;
  /** @format double */
  amount: number;
  /** @format double */
  rate: number;
}

/**
 * Fee detail serializer.
 *
 * This is the fee detail with the cost of hedging a specific cashflow.
 */
export interface PangeaFeeDetail {
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  update_fee_amount: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  update_fee_percentage: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  hold_fee_amount: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  hold_fee_percentage: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  cashflow_update_fee_at_close_amount: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  cashflow_update_fee_at_close_percent: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  max_hedge_cost: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  roll_cost_amount: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  roll_cost_percentage: string;
}

export interface PangeaFeeDetails {
  totals: PangeaFeeTotal;
  fee_groups: PangeaFeeGroups[];
}

export interface PangeaFeeGroups {
  name: string;
  fees: PangeaFee[];
}

export interface PangeaFeeResponse {
  fee_type: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,16}(?:\.\d{0,4})?$
   */
  percentage: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,16}(?:\.\d{0,4})?$
   */
  bps: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,16}(?:\.\d{0,4})?$
   */
  cost: string;
}

export interface PangeaFeeTotal {
  name: string;
  /** @format double */
  amount: number;
  /** @format double */
  rate: number;
}

export interface PangeaFeesPayments {
  description: string;
  /** @format double */
  amount: number;
  /** @format date-time */
  incurred: string;
  cashflow_id: string;
  /** @format date-time */
  recorded: string;
  /** @format date-time */
  due: string;
  /** @format date-time */
  settled: string;
}

export interface PangeaFinancialInstitution {
  /** @maxLength 60 */
  name: string;
  /** @maxLength 60 */
  identifier: string;
  /** * `IFSC` - IFSC */
  identifier_type: PangeaIdentifierTypeEnum;
}

/**
 * * `AF` - Afghanistan
 * * `AX` - Åland Islands
 * * `AL` - Albania
 * * `DZ` - Algeria
 * * `AS` - American Samoa
 * * `AD` - Andorra
 * * `AO` - Angola
 * * `AI` - Anguilla
 * * `AQ` - Antarctica
 * * `AG` - Antigua and Barbuda
 * * `AR` - Argentina
 * * `AM` - Armenia
 * * `AW` - Aruba
 * * `AU` - Australia
 * * `AT` - Austria
 * * `AZ` - Azerbaijan
 * * `BS` - Bahamas
 * * `BH` - Bahrain
 * * `BD` - Bangladesh
 * * `BB` - Barbados
 * * `BY` - Belarus
 * * `BE` - Belgium
 * * `BZ` - Belize
 * * `BJ` - Benin
 * * `BM` - Bermuda
 * * `BT` - Bhutan
 * * `BO` - Bolivia
 * * `BQ` - Bonaire, Sint Eustatius and Saba
 * * `BA` - Bosnia and Herzegovina
 * * `BW` - Botswana
 * * `BV` - Bouvet Island
 * * `BR` - Brazil
 * * `IO` - British Indian Ocean Territory
 * * `BN` - Brunei
 * * `BG` - Bulgaria
 * * `BF` - Burkina Faso
 * * `BI` - Burundi
 * * `CV` - Cabo Verde
 * * `KH` - Cambodia
 * * `CM` - Cameroon
 * * `CA` - Canada
 * * `KY` - Cayman Islands
 * * `CF` - Central African Republic
 * * `TD` - Chad
 * * `CL` - Chile
 * * `CN` - China
 * * `CX` - Christmas Island
 * * `CC` - Cocos (Keeling) Islands
 * * `CO` - Colombia
 * * `KM` - Comoros
 * * `CG` - Congo
 * * `CD` - Congo (the Democratic Republic of the)
 * * `CK` - Cook Islands
 * * `CR` - Costa Rica
 * * `CI` - Côte d'Ivoire
 * * `HR` - Croatia
 * * `CU` - Cuba
 * * `CW` - Curaçao
 * * `CY` - Cyprus
 * * `CZ` - Czechia
 * * `DK` - Denmark
 * * `DJ` - Djibouti
 * * `DM` - Dominica
 * * `DO` - Dominican Republic
 * * `EC` - Ecuador
 * * `EG` - Egypt
 * * `SV` - El Salvador
 * * `GQ` - Equatorial Guinea
 * * `ER` - Eritrea
 * * `EE` - Estonia
 * * `SZ` - Eswatini
 * * `ET` - Ethiopia
 * * `FK` - Falkland Islands (Malvinas)
 * * `FO` - Faroe Islands
 * * `FJ` - Fiji
 * * `FI` - Finland
 * * `FR` - France
 * * `GF` - French Guiana
 * * `PF` - French Polynesia
 * * `TF` - French Southern Territories
 * * `GA` - Gabon
 * * `GM` - Gambia
 * * `GE` - Georgia
 * * `DE` - Germany
 * * `GH` - Ghana
 * * `GI` - Gibraltar
 * * `GR` - Greece
 * * `GL` - Greenland
 * * `GD` - Grenada
 * * `GP` - Guadeloupe
 * * `GU` - Guam
 * * `GT` - Guatemala
 * * `GG` - Guernsey
 * * `GN` - Guinea
 * * `GW` - Guinea-Bissau
 * * `GY` - Guyana
 * * `HT` - Haiti
 * * `HM` - Heard Island and McDonald Islands
 * * `VA` - Holy See
 * * `HN` - Honduras
 * * `HK` - Hong Kong
 * * `HU` - Hungary
 * * `IS` - Iceland
 * * `IN` - India
 * * `ID` - Indonesia
 * * `IR` - Iran
 * * `IQ` - Iraq
 * * `IE` - Ireland
 * * `IM` - Isle of Man
 * * `IL` - Israel
 * * `IT` - Italy
 * * `JM` - Jamaica
 * * `JP` - Japan
 * * `JE` - Jersey
 * * `JO` - Jordan
 * * `KZ` - Kazakhstan
 * * `KE` - Kenya
 * * `KI` - Kiribati
 * * `KW` - Kuwait
 * * `KG` - Kyrgyzstan
 * * `LA` - Laos
 * * `LV` - Latvia
 * * `LB` - Lebanon
 * * `LS` - Lesotho
 * * `LR` - Liberia
 * * `LY` - Libya
 * * `LI` - Liechtenstein
 * * `LT` - Lithuania
 * * `LU` - Luxembourg
 * * `MO` - Macao
 * * `MG` - Madagascar
 * * `MW` - Malawi
 * * `MY` - Malaysia
 * * `MV` - Maldives
 * * `ML` - Mali
 * * `MT` - Malta
 * * `MH` - Marshall Islands
 * * `MQ` - Martinique
 * * `MR` - Mauritania
 * * `MU` - Mauritius
 * * `YT` - Mayotte
 * * `MX` - Mexico
 * * `FM` - Micronesia
 * * `MD` - Moldova
 * * `MC` - Monaco
 * * `MN` - Mongolia
 * * `ME` - Montenegro
 * * `MS` - Montserrat
 * * `MA` - Morocco
 * * `MZ` - Mozambique
 * * `MM` - Myanmar
 * * `NA` - Namibia
 * * `NR` - Nauru
 * * `NP` - Nepal
 * * `NL` - Netherlands
 * * `NC` - New Caledonia
 * * `NZ` - New Zealand
 * * `NI` - Nicaragua
 * * `NE` - Niger
 * * `NG` - Nigeria
 * * `NU` - Niue
 * * `NF` - Norfolk Island
 * * `KP` - North Korea
 * * `MK` - North Macedonia
 * * `MP` - Northern Mariana Islands
 * * `NO` - Norway
 * * `OM` - Oman
 * * `PK` - Pakistan
 * * `PW` - Palau
 * * `PS` - Palestine, State of
 * * `PA` - Panama
 * * `PG` - Papua New Guinea
 * * `PY` - Paraguay
 * * `PE` - Peru
 * * `PH` - Philippines
 * * `PN` - Pitcairn
 * * `PL` - Poland
 * * `PT` - Portugal
 * * `PR` - Puerto Rico
 * * `QA` - Qatar
 * * `RE` - Réunion
 * * `RO` - Romania
 * * `RU` - Russia
 * * `RW` - Rwanda
 * * `BL` - Saint Barthélemy
 * * `SH` - Saint Helena, Ascension and Tristan da Cunha
 * * `KN` - Saint Kitts and Nevis
 * * `LC` - Saint Lucia
 * * `MF` - Saint Martin (French part)
 * * `PM` - Saint Pierre and Miquelon
 * * `VC` - Saint Vincent and the Grenadines
 * * `WS` - Samoa
 * * `SM` - San Marino
 * * `ST` - Sao Tome and Principe
 * * `SA` - Saudi Arabia
 * * `SN` - Senegal
 * * `RS` - Serbia
 * * `SC` - Seychelles
 * * `SL` - Sierra Leone
 * * `SG` - Singapore
 * * `SX` - Sint Maarten (Dutch part)
 * * `SK` - Slovakia
 * * `SI` - Slovenia
 * * `SB` - Solomon Islands
 * * `SO` - Somalia
 * * `ZA` - South Africa
 * * `GS` - South Georgia and the South Sandwich Islands
 * * `KR` - South Korea
 * * `SS` - South Sudan
 * * `ES` - Spain
 * * `LK` - Sri Lanka
 * * `SD` - Sudan
 * * `SR` - Suriname
 * * `SJ` - Svalbard and Jan Mayen
 * * `SE` - Sweden
 * * `CH` - Switzerland
 * * `SY` - Syria
 * * `TW` - Taiwan
 * * `TJ` - Tajikistan
 * * `TZ` - Tanzania
 * * `TH` - Thailand
 * * `TL` - Timor-Leste
 * * `TG` - Togo
 * * `TK` - Tokelau
 * * `TO` - Tonga
 * * `TT` - Trinidad and Tobago
 * * `TN` - Tunisia
 * * `TR` - Türkiye
 * * `TM` - Turkmenistan
 * * `TC` - Turks and Caicos Islands
 * * `TV` - Tuvalu
 * * `UG` - Uganda
 * * `UA` - Ukraine
 * * `AE` - United Arab Emirates
 * * `GB` - United Kingdom
 * * `UM` - United States Minor Outlying Islands
 * * `US` - United States of America
 * * `UY` - Uruguay
 * * `UZ` - Uzbekistan
 * * `VU` - Vanuatu
 * * `VE` - Venezuela
 * * `VN` - Vietnam
 * * `VG` - Virgin Islands (British)
 * * `VI` - Virgin Islands (U.S.)
 * * `WF` - Wallis and Futuna
 * * `EH` - Western Sahara
 * * `YE` - Yemen
 * * `ZM` - Zambia
 * * `ZW` - Zimbabwe
 */
export enum PangeaFormationCountryEnum {
  AF = 'AF',
  AX = 'AX',
  AL = 'AL',
  DZ = 'DZ',
  AS = 'AS',
  AD = 'AD',
  AO = 'AO',
  AI = 'AI',
  AQ = 'AQ',
  AG = 'AG',
  AR = 'AR',
  AM = 'AM',
  AW = 'AW',
  AU = 'AU',
  AT = 'AT',
  AZ = 'AZ',
  BS = 'BS',
  BH = 'BH',
  BD = 'BD',
  BB = 'BB',
  BY = 'BY',
  BE = 'BE',
  BZ = 'BZ',
  BJ = 'BJ',
  BM = 'BM',
  BT = 'BT',
  BO = 'BO',
  BQ = 'BQ',
  BA = 'BA',
  BW = 'BW',
  BV = 'BV',
  BR = 'BR',
  IO = 'IO',
  BN = 'BN',
  BG = 'BG',
  BF = 'BF',
  BI = 'BI',
  CV = 'CV',
  KH = 'KH',
  CM = 'CM',
  CA = 'CA',
  KY = 'KY',
  CF = 'CF',
  TD = 'TD',
  CL = 'CL',
  CN = 'CN',
  CX = 'CX',
  CC = 'CC',
  CO = 'CO',
  KM = 'KM',
  CG = 'CG',
  CD = 'CD',
  CK = 'CK',
  CR = 'CR',
  CI = 'CI',
  HR = 'HR',
  CU = 'CU',
  CW = 'CW',
  CY = 'CY',
  CZ = 'CZ',
  DK = 'DK',
  DJ = 'DJ',
  DM = 'DM',
  DO = 'DO',
  EC = 'EC',
  EG = 'EG',
  SV = 'SV',
  GQ = 'GQ',
  ER = 'ER',
  EE = 'EE',
  SZ = 'SZ',
  ET = 'ET',
  FK = 'FK',
  FO = 'FO',
  FJ = 'FJ',
  FI = 'FI',
  FR = 'FR',
  GF = 'GF',
  PF = 'PF',
  TF = 'TF',
  GA = 'GA',
  GM = 'GM',
  GE = 'GE',
  DE = 'DE',
  GH = 'GH',
  GI = 'GI',
  GR = 'GR',
  GL = 'GL',
  GD = 'GD',
  GP = 'GP',
  GU = 'GU',
  GT = 'GT',
  GG = 'GG',
  GN = 'GN',
  GW = 'GW',
  GY = 'GY',
  HT = 'HT',
  HM = 'HM',
  VA = 'VA',
  HN = 'HN',
  HK = 'HK',
  HU = 'HU',
  IS = 'IS',
  IN = 'IN',
  ID = 'ID',
  IR = 'IR',
  IQ = 'IQ',
  IE = 'IE',
  IM = 'IM',
  IL = 'IL',
  IT = 'IT',
  JM = 'JM',
  JP = 'JP',
  JE = 'JE',
  JO = 'JO',
  KZ = 'KZ',
  KE = 'KE',
  KI = 'KI',
  KW = 'KW',
  KG = 'KG',
  LA = 'LA',
  LV = 'LV',
  LB = 'LB',
  LS = 'LS',
  LR = 'LR',
  LY = 'LY',
  LI = 'LI',
  LT = 'LT',
  LU = 'LU',
  MO = 'MO',
  MG = 'MG',
  MW = 'MW',
  MY = 'MY',
  MV = 'MV',
  ML = 'ML',
  MT = 'MT',
  MH = 'MH',
  MQ = 'MQ',
  MR = 'MR',
  MU = 'MU',
  YT = 'YT',
  MX = 'MX',
  FM = 'FM',
  MD = 'MD',
  MC = 'MC',
  MN = 'MN',
  ME = 'ME',
  MS = 'MS',
  MA = 'MA',
  MZ = 'MZ',
  MM = 'MM',
  NA = 'NA',
  NR = 'NR',
  NP = 'NP',
  NL = 'NL',
  NC = 'NC',
  NZ = 'NZ',
  NI = 'NI',
  NE = 'NE',
  NG = 'NG',
  NU = 'NU',
  NF = 'NF',
  KP = 'KP',
  MK = 'MK',
  MP = 'MP',
  NO = 'NO',
  OM = 'OM',
  PK = 'PK',
  PW = 'PW',
  PS = 'PS',
  PA = 'PA',
  PG = 'PG',
  PY = 'PY',
  PE = 'PE',
  PH = 'PH',
  PN = 'PN',
  PL = 'PL',
  PT = 'PT',
  PR = 'PR',
  QA = 'QA',
  RE = 'RE',
  RO = 'RO',
  RU = 'RU',
  RW = 'RW',
  BL = 'BL',
  SH = 'SH',
  KN = 'KN',
  LC = 'LC',
  MF = 'MF',
  PM = 'PM',
  VC = 'VC',
  WS = 'WS',
  SM = 'SM',
  ST = 'ST',
  SA = 'SA',
  SN = 'SN',
  RS = 'RS',
  SC = 'SC',
  SL = 'SL',
  SG = 'SG',
  SX = 'SX',
  SK = 'SK',
  SI = 'SI',
  SB = 'SB',
  SO = 'SO',
  ZA = 'ZA',
  GS = 'GS',
  KR = 'KR',
  SS = 'SS',
  ES = 'ES',
  LK = 'LK',
  SD = 'SD',
  SR = 'SR',
  SJ = 'SJ',
  SE = 'SE',
  CH = 'CH',
  SY = 'SY',
  TW = 'TW',
  TJ = 'TJ',
  TZ = 'TZ',
  TH = 'TH',
  TL = 'TL',
  TG = 'TG',
  TK = 'TK',
  TO = 'TO',
  TT = 'TT',
  TN = 'TN',
  TR = 'TR',
  TM = 'TM',
  TC = 'TC',
  TV = 'TV',
  UG = 'UG',
  UA = 'UA',
  AE = 'AE',
  GB = 'GB',
  UM = 'UM',
  US = 'US',
  UY = 'UY',
  UZ = 'UZ',
  VU = 'VU',
  VE = 'VE',
  VN = 'VN',
  VG = 'VG',
  VI = 'VI',
  WF = 'WF',
  EH = 'EH',
  YE = 'YE',
  ZM = 'ZM',
  ZW = 'ZW',
}

export interface PangeaForwardAmount {
  currency: string;
  /** @format double */
  amount: number;
}

export interface PangeaForwardBookQuoteRequest {
  quote_id: string;
}

export interface PangeaForwardBookQuoteResponse {
  order_number: string;
  token: string;
  forward_id: number;
}

export interface PangeaForwardCompleteOrderRequest {
  forward_id: number;
  settlement_account: string;
  forward_reference?: string;
}

export interface PangeaForwardCompleteOrderResponse {
  forward_id: number;
  order_number: string;
}

export interface PangeaForwardQuoteRequest {
  /** @format double */
  amount: number;
  buy_currency: string;
  /**
   * * `C` - Closed Contract
   * * `O` - Open Contract
   */
  forward_type: PangeaForwardTypeEnum;
  /**
   * * `Payment` - PAYMENT
   * * `Settlement` - SETTLEMENT
   */
  lock_side: PangeaCorpayLockSideEnum;
  /** @format date */
  maturity_date: string;
  /**
   * (required if 'forwardType': 'O') - Applies only to Open Forwards.
   * @format date
   */
  open_date_from?: string | null;
  sell_currency: string;
}

export interface PangeaForwardQuoteResponse {
  rate: PangeaForwardRate;
  quote_id: string;
  payment: PangeaForwardAmount;
  settlement: PangeaForwardAmount;
}

export interface PangeaForwardRate {
  /** @format double */
  value: number;
  /**
   * * `Payment` - PAYMENT
   * * `Settlement` - SETTLEMENT
   */
  lock_side: PangeaCorpayLockSideEnum;
  rate_type: string;
  /**
   * * `Multiply` - Multiply
   * * `Divide` - Divide
   */
  operation: PangeaOperationEnum;
}

/**
 * * `C` - Closed Contract
 * * `O` - Open Contract
 */
export enum PangeaForwardTypeEnum {
  C = 'C',
  O = 'O',
}

/**
 * * `All` - All
 * * `Allocation` - Allocation
 * * `Fee` - Fee
 * * `Spot` - Spot
 * * `Spot_trade` - Spot Trade
 * * `Drawdown` - Drawdown
 */
export enum PangeaFromPurposeEnum {
  All = 'All',
  Allocation = 'Allocation',
  Fee = 'Fee',
  Spot = 'Spot',
  SpotTrade = 'Spot_trade',
  Drawdown = 'Drawdown',
}

export interface PangeaFundTransaction {
  /** @format uuid */
  ticket_id: string;
  /** @default "bank_transfer" */
  funding_type?: PangeaFundingTypeEnum;
  source_id: string;
  /**
   * The amount of currency
   * @format double
   * @min 0.01
   */
  source_amount?: number;
  /** ISO 4217 Standard 3-Letter Currency Code */
  source_ccy: string;
}

export interface PangeaFundingRequest {
  id: number;
  status: PangeaFundingRequestStatus;
  deposit_result?: PangeaDepositResult;
  withdraw_result?: PangeaWithdrawResult;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /** @maxLength 255 */
  method: string;
  request_submitted?: boolean;
  response_data?: any;
  broker_account: number;
}

export interface PangeaFundingRequestStatus {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /** @format date-time */
  timestamp?: string | null;
  request_status?:
    | PangeaRequestStatusEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** @maxLength 255 */
  error_code?: string | null;
  error_message?: string | null;
  funding_request: number;
}

/**
 * * `pending` - Pending
 * * `processed` - Processed
 * * `rejected` - Rejected
 */
export enum PangeaFundingRequestStatusEnum {
  Pending = 'pending',
  Processed = 'processed',
  Rejected = 'rejected',
}

/**
 * * `direct_debit` - direct_debit
 * * `wire` - wire
 * * `bank_transfer` - bank_transfer
 * * `wallet_transfer` - wallet_transfer
 */
export enum PangeaFundingTypeEnum {
  DirectDebit = 'direct_debit',
  Wire = 'wire',
  BankTransfer = 'bank_transfer',
  WalletTransfer = 'wallet_transfer',
}

export interface PangeaFutureContract {
  /** @maxLength 10 */
  base?: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  con_id?: number | null;
  /** @maxLength 5 */
  currency?: string | null;
  /** @maxLength 150 */
  description?: string | null;
  /** @maxLength 5 */
  exchange?: string | null;
  /** @maxLength 50 */
  exchanges?: string | null;
  /** @maxLength 5 */
  fut_base?: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  fut_cont_size?: number;
  /** @maxLength 5 */
  fut_month_symbol?: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  fut_month?: number | null;
  /** @format date */
  fut_start_dt?: string | null;
  /** @maxLength 10 */
  fut_symbol?: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  fut_val_pt?: number;
  /** @maxLength 5 */
  fut_year?: string;
  /** @format date */
  last_dt?: string | null;
  /** @maxLength 10 */
  lcode_long?: string;
  liquid_hours?: string | null;
  /** @maxLength 10 */
  local_symbol?: string | null;
  /** @maxLength 5 */
  market_name?: string | null;
  /** @format double */
  min_tick?: number | null;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  multiplier?: number | null;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  price_magnifier?: number | null;
  /** @format date */
  roll_dt?: string | null;
  /** @maxLength 10 */
  sec_type?: string | null;
  /** @maxLength 5 */
  symbol?: string | null;
  /** @maxLength 50 */
  timezone_id?: string | null;
  trading_hours?: string | null;
}

export interface PangeaFutureIntra {
  /** @maxLength 10 */
  base?: string;
  /** @format date-time */
  date: string;
  /** @format double */
  rate?: number | null;
  /** @format double */
  rate_bid?: number | null;
  /** @format double */
  rate_ask?: number | null;
}

/**
 * * `CORPAY` - CORPAY
 * * `IBKR` - IBKR
 * * `CORPAY_MP` - CORPAY_MP
 * * `VERTO` - VERTO
 * * `NIUM` - NIUM
 * * `AZA` - AZA
 * * `MONEX` - MONEX
 * * `CONVERA` - CONVERA
 * * `OFX` - OFX
 * * `XE` - XE
 * * `OANDA` - OANDA
 * * `AIRWALLEX` - AIRWALLEX
 */
export enum PangeaFwdBrokerEnum {
  CORPAY = 'CORPAY',
  IBKR = 'IBKR',
  CORPAY_MP = 'CORPAY_MP',
  VERTO = 'VERTO',
  NIUM = 'NIUM',
  AZA = 'AZA',
  MONEX = 'MONEX',
  CONVERA = 'CONVERA',
  OFX = 'OFX',
  XE = 'XE',
  OANDA = 'OANDA',
  AIRWALLEX = 'AIRWALLEX',
}

/**
 * * `api` - API
 * * `manual` - MANUAL
 * * `unsupported` - UNSUPPORTED
 * * `indicative` - INDICATIVE
 * * `norfq` - NORFQ
 */
export enum PangeaFwdRfqTypeEnum {
  Api = 'api',
  Manual = 'manual',
  Unsupported = 'unsupported',
  Indicative = 'indicative',
  Norfq = 'norfq',
}

export interface PangeaFxCalculator {
  targetCurrency: string;
  sourceCurrency: string;
  /** @format double */
  sourceAmount: number;
}

export interface PangeaFxCalculatorResponse {
  /**
   * @format decimal
   * @pattern ^-?\d{0,13}(?:\.\d{0,2})?$
   */
  targetAmount: string;
}

export interface PangeaFxForward {
  /** @format date-time */
  date: string;
  pair: number;
  /** @maxLength 4 */
  tenor: string;
  /** @format double */
  rate?: number | null;
  /** @format double */
  rate_bid?: number | null;
  /** @format double */
  rate_ask?: number | null;
  /** @format double */
  fwd_points?: number | null;
  /** @format double */
  fwd_points_ask?: number | null;
  /** @format double */
  depo_base: number;
  /** @format double */
  depo_quote: number;
}

export interface PangeaFxPair {
  id: number;
  base_currency: PangeaCurrency;
  quote_currency: PangeaCurrency;
}

/**
 * * `p20` - P20
 * * `wallet` - Wallet
 * * `other` - Other
 */
export enum PangeaFxPairTypeEnum {
  P20 = 'p20',
  Wallet = 'wallet',
  Other = 'other',
}

export interface PangeaFxSpot {
  /** @format date-time */
  date: string;
  pair: PangeaFxPair;
  /** @format double */
  rate?: number | null;
  /** @format double */
  rate_bid?: number | null;
  /** @format double */
  rate_ask?: number | null;
}

export interface PangeaFxSpotIntra {
  /** @format date-time */
  date: string;
  pair: PangeaFxPair;
  /** @format double */
  rate?: number | null;
  /** @format double */
  rate_bid?: number | null;
  /** @format double */
  rate_ask?: number | null;
}

export interface PangeaGetCashflowRiskCone {
  domestic: string;
  cashflows: any;
  start_date: string;
  end_date: string;
  risk_reductions?: number[];
  max_horizon: number;
  /**
   * @format double
   * @default -1000000
   */
  lower_risk_bound_percent?: number;
  /**
   * @format double
   * @default 1000000
   */
  upper_risk_bound_percent?: number;
  std_dev_levels?: number[];
  do_std_dev_cones: boolean;
}

export interface PangeaGetCashflowRiskConeResponse {
  dates: string[];
  means: number[];
  uppers: number[][];
  lowers: number[][];
  upper_maxs: number[];
  upper_max_percents: number[];
  lower_maxs: number[];
  lower_max_percents: number[];
  /** @format double */
  initial_value: number;
  /** @format double */
  previous_value: number;
  /** @format double */
  update_value: number;
  std_probs: number[];
}

export interface PangeaGetCompanyByEINRequest {
  ein: string;
}

export interface PangeaGroup {
  /**
   * * `admin_customer-success` - Admin - Customer Success
   * * `admin_read-only` - Admin - Read-only
   * * `customer_admin` - Customer - Admin
   * * `customer_creator` - Customer - Creator
   * * `customer_manager` - Customer - Manager
   * * `customer_viewer` - Customer - Viewer
   * * `customer_corpay` - Customer - CorPay
   * * `customer_ibkr` - Customer - IBKR
   * * `admin_group` - Group - Admin
   * * `account_owner_group` - Group - Account Owner
   * * `manager_group` - Group - Manager
   */
  name: PangeaGroupEnum;
  permissions: PangeaPermission[];
}

/**
 * * `admin_customer-success` - Admin - Customer Success
 * * `admin_read-only` - Admin - Read-only
 * * `customer_admin` - Customer - Admin
 * * `customer_creator` - Customer - Creator
 * * `customer_manager` - Customer - Manager
 * * `customer_viewer` - Customer - Viewer
 * * `customer_corpay` - Customer - CorPay
 * * `customer_ibkr` - Customer - IBKR
 * * `admin_group` - Group - Admin
 * * `account_owner_group` - Group - Account Owner
 * * `manager_group` - Group - Manager
 */
export enum PangeaGroupEnum {
  AdminCustomerSuccess = 'admin_customer-success',
  AdminReadOnly = 'admin_read-only',
  CustomerAdmin = 'customer_admin',
  CustomerCreator = 'customer_creator',
  CustomerManager = 'customer_manager',
  CustomerViewer = 'customer_viewer',
  CustomerCorpay = 'customer_corpay',
  CustomerIbkr = 'customer_ibkr',
  AdminGroup = 'admin_group',
  AccountOwnerGroup = 'account_owner_group',
  ManagerGroup = 'manager_group',
}

export interface PangeaHedgePolicyForAccountView {
  /**
   * * `NO_HEDGE` - NO_HEDGE
   * * `PERFECT` - PERFECT
   * * `MIN_VAR` - MIN_VAR
   */
  method: PangeaHedgePolicyForAccountViewMethodEnum;
  /** @format double */
  margin_budget: number;
  max_horizon?: number;
  custom: PangeaHedgeSettingsCustomSettings;
}

/**
 * * `NO_HEDGE` - NO_HEDGE
 * * `PERFECT` - PERFECT
 * * `MIN_VAR` - MIN_VAR
 */
export enum PangeaHedgePolicyForAccountViewMethodEnum {
  NO_HEDGE = 'NO_HEDGE',
  PERFECT = 'PERFECT',
  MIN_VAR = 'MIN_VAR',
}

export interface PangeaHedgeSettings {
  id: number;
  custom: PangeaHedgeSettingsCustomSettings;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  max_horizon_days?: number;
  /** @format double */
  margin_budget: number;
  /** @maxLength 255 */
  method?: string;
  /** @format date-time */
  updated: string;
  account: number;
}

export interface PangeaHedgeSettingsCustomSettings {
  /** @format double */
  vol_target_reduction: number;
  /** @format double */
  var_95_exposure_ratio?: number;
  var_95_exposure_window?: number;
}

export interface PangeaHistoricalRateRequest {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /** @format date-time */
  start_date?: string | null;
  /** @format date-time */
  end_date?: string | null;
  /**
   * Always show prices in market native
   * @default true
   */
  market_native?: boolean;
  date_range?: PangeaDateRangeEnum | PangeaNullEnum | null;
}

export interface PangeaIBAccount {
  /** @default "USD" */
  base_currency?: PangeaBaseCurrencyEnum;
  external_id?: string;
  /** @default "CASH" */
  margin?: PangeaMarginEnum;
  multicurrency: boolean;
  fees: PangeaIBFees;
}

export interface PangeaIBAccountStatusRequest {
  start_date?: string;
  end_date?: string;
  /**
   * A=Abandoned, N=New Account / Not Yet Open, O=Open, C=Closed, P=Pending, R=Rejected
   *
   * * `A` - Abandoned
   * * `N` - New Account/Not Yet Open
   * * `O` - Open
   * * `C` - Closed
   * * `P` - Pending
   * * `R` - Rejected
   */
  status?: PangeaIBAccountStatusRequestStatusEnum;
}

/**
 * * `A` - Abandoned
 * * `N` - New Account/Not Yet Open
 * * `O` - Open
 * * `C` - Closed
 * * `P` - Pending
 * * `R` - Rejected
 */
export enum PangeaIBAccountStatusRequestStatusEnum {
  A = 'A',
  N = 'N',
  O = 'O',
  C = 'C',
  P = 'P',
  R = 'R',
}

export interface PangeaIBAccountStatusResponse {
  /** @format date-time */
  timestamp: string;
  status: PangeaIBAccountStatusSingle[];
}

export interface PangeaIBAccountStatusSingle {
  accountId: string;
  isError: boolean;
  description: string;
  status: string;
}

export interface PangeaIBApplication {
  customers: PangeaIBCustomer[];
  accounts: PangeaIBAccount[];
  users: PangeaIBUser[];
}

export interface PangeaIBApplications {
  application: PangeaIBApplication[];
}

export interface PangeaIBAssociatedEntities {
  associated_individual: PangeaIBAssociatedIndividual[];
}

export interface PangeaIBAssociatedIndividual {
  name: PangeaIBAssociatedIndividualName;
  /** @format date */
  dob: string;
  residence: PangeaIBAssociatedIndividualResidence;
  mailing_address?: PangeaIBAssociatedIndividualMailingAddress;
  /** @format email */
  email: string;
  identification: PangeaIBAssociatedIndividualIdentification;
  tax_residencies: PangeaIBAssociatedIndividualTaxResidency[];
  authorized_person: boolean;
  external_id?: string;
  title: PangeaIBAssociatedIndividualTitle;
}

export interface PangeaIBAssociatedIndividualIdentification {
  /** @default {"code":"US","name":"United States of America"} */
  issuing_country?: PangeaIssuingCountryEnum;
  /** @default {"code":"US","name":"United States of America"} */
  legal_residence_country?: PangeaLegalResidenceCountryEnum;
  /**
   * * `AL` - Alabama
   * * `AK` - Alaska
   * * `AS` - American Samoa
   * * `AZ` - Arizona
   * * `AR` - Arkansas
   * * `AA` - Armed Forces Americas
   * * `AE` - Armed Forces Europe
   * * `AP` - Armed Forces Pacific
   * * `CA` - California
   * * `CO` - Colorado
   * * `CT` - Connecticut
   * * `DE` - Delaware
   * * `DC` - District of Columbia
   * * `FL` - Florida
   * * `GA` - Georgia
   * * `GU` - Guam
   * * `HI` - Hawaii
   * * `ID` - Idaho
   * * `IL` - Illinois
   * * `IN` - Indiana
   * * `IA` - Iowa
   * * `KS` - Kansas
   * * `KY` - Kentucky
   * * `LA` - Louisiana
   * * `ME` - Maine
   * * `MD` - Maryland
   * * `MA` - Massachusetts
   * * `MI` - Michigan
   * * `MN` - Minnesota
   * * `MS` - Mississippi
   * * `MO` - Missouri
   * * `MT` - Montana
   * * `NE` - Nebraska
   * * `NV` - Nevada
   * * `NH` - New Hampshire
   * * `NJ` - New Jersey
   * * `NM` - New Mexico
   * * `NY` - New York
   * * `NC` - North Carolina
   * * `ND` - North Dakota
   * * `MP` - Northern Mariana Islands
   * * `OH` - Ohio
   * * `OK` - Oklahoma
   * * `OR` - Oregon
   * * `PA` - Pennsylvania
   * * `PR` - Puerto Rico
   * * `RI` - Rhode Island
   * * `SC` - South Carolina
   * * `SD` - South Dakota
   * * `TN` - Tennessee
   * * `TX` - Texas
   * * `UT` - Utah
   * * `VT` - Vermont
   * * `VI` - Virgin Islands
   * * `VA` - Virginia
   * * `WA` - Washington
   * * `WV` - West Virginia
   * * `WI` - Wisconsin
   * * `WY` - Wyoming
   */
  legal_residence_state: PangeaLegalResidenceStateEnum;
  ssn: string;
  /** @default {"code":"US","name":"United States of America"} */
  citizenship?: PangeaCitizenshipEnum;
}

export interface PangeaIBAssociatedIndividualMailingAddress {
  /** @default {"code":"US","name":"United States of America"} */
  country?: PangeaCountryEnum;
  /**
   * * `AL` - Alabama
   * * `AK` - Alaska
   * * `AS` - American Samoa
   * * `AZ` - Arizona
   * * `AR` - Arkansas
   * * `AA` - Armed Forces Americas
   * * `AE` - Armed Forces Europe
   * * `AP` - Armed Forces Pacific
   * * `CA` - California
   * * `CO` - Colorado
   * * `CT` - Connecticut
   * * `DE` - Delaware
   * * `DC` - District of Columbia
   * * `FL` - Florida
   * * `GA` - Georgia
   * * `GU` - Guam
   * * `HI` - Hawaii
   * * `ID` - Idaho
   * * `IL` - Illinois
   * * `IN` - Indiana
   * * `IA` - Iowa
   * * `KS` - Kansas
   * * `KY` - Kentucky
   * * `LA` - Louisiana
   * * `ME` - Maine
   * * `MD` - Maryland
   * * `MA` - Massachusetts
   * * `MI` - Michigan
   * * `MN` - Minnesota
   * * `MS` - Mississippi
   * * `MO` - Missouri
   * * `MT` - Montana
   * * `NE` - Nebraska
   * * `NV` - Nevada
   * * `NH` - New Hampshire
   * * `NJ` - New Jersey
   * * `NM` - New Mexico
   * * `NY` - New York
   * * `NC` - North Carolina
   * * `ND` - North Dakota
   * * `MP` - Northern Mariana Islands
   * * `OH` - Ohio
   * * `OK` - Oklahoma
   * * `OR` - Oregon
   * * `PA` - Pennsylvania
   * * `PR` - Puerto Rico
   * * `RI` - Rhode Island
   * * `SC` - South Carolina
   * * `SD` - South Dakota
   * * `TN` - Tennessee
   * * `TX` - Texas
   * * `UT` - Utah
   * * `VT` - Vermont
   * * `VI` - Virgin Islands
   * * `VA` - Virginia
   * * `WA` - Washington
   * * `WV` - West Virginia
   * * `WI` - Wisconsin
   * * `WY` - Wyoming
   */
  state: PangeaStateEnum;
  city: string;
  postal_code: string;
  street_1: string;
  street_2?: string | null;
}

export interface PangeaIBAssociatedIndividualName {
  first: string;
  middle?: string | null;
  last: string;
  /**
   * * `Mr.` - Mr.
   * * `Mrs.` - Mrs.
   * * `Ms.` - Ms.
   * * `Dr.` - Dr.
   * * `Mx.` - Mx.
   * * `Ind.` - Ind.
   */
  salutation: PangeaSalutationEnum;
}

export interface PangeaIBAssociatedIndividualResidence {
  /** @default {"code":"US","name":"United States of America"} */
  country?: PangeaCountryEnum;
  /**
   * * `AL` - Alabama
   * * `AK` - Alaska
   * * `AS` - American Samoa
   * * `AZ` - Arizona
   * * `AR` - Arkansas
   * * `AA` - Armed Forces Americas
   * * `AE` - Armed Forces Europe
   * * `AP` - Armed Forces Pacific
   * * `CA` - California
   * * `CO` - Colorado
   * * `CT` - Connecticut
   * * `DE` - Delaware
   * * `DC` - District of Columbia
   * * `FL` - Florida
   * * `GA` - Georgia
   * * `GU` - Guam
   * * `HI` - Hawaii
   * * `ID` - Idaho
   * * `IL` - Illinois
   * * `IN` - Indiana
   * * `IA` - Iowa
   * * `KS` - Kansas
   * * `KY` - Kentucky
   * * `LA` - Louisiana
   * * `ME` - Maine
   * * `MD` - Maryland
   * * `MA` - Massachusetts
   * * `MI` - Michigan
   * * `MN` - Minnesota
   * * `MS` - Mississippi
   * * `MO` - Missouri
   * * `MT` - Montana
   * * `NE` - Nebraska
   * * `NV` - Nevada
   * * `NH` - New Hampshire
   * * `NJ` - New Jersey
   * * `NM` - New Mexico
   * * `NY` - New York
   * * `NC` - North Carolina
   * * `ND` - North Dakota
   * * `MP` - Northern Mariana Islands
   * * `OH` - Ohio
   * * `OK` - Oklahoma
   * * `OR` - Oregon
   * * `PA` - Pennsylvania
   * * `PR` - Puerto Rico
   * * `RI` - Rhode Island
   * * `SC` - South Carolina
   * * `SD` - South Dakota
   * * `TN` - Tennessee
   * * `TX` - Texas
   * * `UT` - Utah
   * * `VT` - Vermont
   * * `VI` - Virgin Islands
   * * `VA` - Virginia
   * * `WA` - Washington
   * * `WV` - West Virginia
   * * `WI` - Wisconsin
   * * `WY` - Wyoming
   */
  state: PangeaStateEnum;
  city: string;
  postal_code: string;
  street_1: string;
  street_2?: string | null;
}

export interface PangeaIBAssociatedIndividualTaxResidency {
  tin: string;
  /** @default "SSN" */
  tin_type?: PangeaTinTypeEnum;
  /** @default {"code":"US","name":"United States of America"} */
  country?: PangeaCountryEnum;
}

export interface PangeaIBAssociatedIndividualTitle {
  /**
   * * `DIRECTOR` - DIRECTOR
   * * `OTHER OFFICER` - OTHER OFFICER
   * * `SECRETARY` - SECRETARY
   * * `SIGNATORY` - SIGNATORY
   * * `CEO` - CEO
   * * `OWNER` - OWNER
   * * `Grantor` - Grantor
   * * `Trustee` - Trustee
   */
  code: PangeaIBAssociatedIndividualTitleCodeEnum;
}

/**
 * * `DIRECTOR` - DIRECTOR
 * * `OTHER OFFICER` - OTHER OFFICER
 * * `SECRETARY` - SECRETARY
 * * `SIGNATORY` - SIGNATORY
 * * `CEO` - CEO
 * * `OWNER` - OWNER
 * * `Grantor` - Grantor
 * * `Trustee` - Trustee
 */
export enum PangeaIBAssociatedIndividualTitleCodeEnum {
  DIRECTOR = 'DIRECTOR',
  OTHEROFFICER = 'OTHER OFFICER',
  SECRETARY = 'SECRETARY',
  SIGNATORY = 'SIGNATORY',
  CEO = 'CEO',
  OWNER = 'OWNER',
  Grantor = 'Grantor',
  Trustee = 'Trustee',
}

export interface PangeaIBCustomer {
  /** @format email */
  email: string;
  external_id?: string;
  /** @default false */
  md_status_nonpro?: boolean;
  prefix?: string;
  /** @default "ORG" */
  type?: PangeaIBCustomerTypeEnum;
  organization: PangeaIBOrganization;
}

/**
 * * `INDIVIDUAL` - INDIVIDUAL
 * * `JOINT` - JOINT
 * * `TRUST` - TRUST
 * * `ORG` - ORG
 */
export enum PangeaIBCustomerTypeEnum {
  INDIVIDUAL = 'INDIVIDUAL',
  JOINT = 'JOINT',
  TRUST = 'TRUST',
  ORG = 'ORG',
}

export interface PangeaIBFBResponse {
  funding_request: PangeaFundingRequest;
}

export interface PangeaIBFees {
  /** @default "test123" */
  template_name?: string;
}

export interface PangeaIBMailingAddress {
  /** @default {"code":"US","name":"United States of America"} */
  country?: PangeaCountryEnum;
  /**
   * * `AL` - Alabama
   * * `AK` - Alaska
   * * `AS` - American Samoa
   * * `AZ` - Arizona
   * * `AR` - Arkansas
   * * `AA` - Armed Forces Americas
   * * `AE` - Armed Forces Europe
   * * `AP` - Armed Forces Pacific
   * * `CA` - California
   * * `CO` - Colorado
   * * `CT` - Connecticut
   * * `DE` - Delaware
   * * `DC` - District of Columbia
   * * `FL` - Florida
   * * `GA` - Georgia
   * * `GU` - Guam
   * * `HI` - Hawaii
   * * `ID` - Idaho
   * * `IL` - Illinois
   * * `IN` - Indiana
   * * `IA` - Iowa
   * * `KS` - Kansas
   * * `KY` - Kentucky
   * * `LA` - Louisiana
   * * `ME` - Maine
   * * `MD` - Maryland
   * * `MA` - Massachusetts
   * * `MI` - Michigan
   * * `MN` - Minnesota
   * * `MS` - Mississippi
   * * `MO` - Missouri
   * * `MT` - Montana
   * * `NE` - Nebraska
   * * `NV` - Nevada
   * * `NH` - New Hampshire
   * * `NJ` - New Jersey
   * * `NM` - New Mexico
   * * `NY` - New York
   * * `NC` - North Carolina
   * * `ND` - North Dakota
   * * `MP` - Northern Mariana Islands
   * * `OH` - Ohio
   * * `OK` - Oklahoma
   * * `OR` - Oregon
   * * `PA` - Pennsylvania
   * * `PR` - Puerto Rico
   * * `RI` - Rhode Island
   * * `SC` - South Carolina
   * * `SD` - South Dakota
   * * `TN` - Tennessee
   * * `TX` - Texas
   * * `UT` - Utah
   * * `VT` - Vermont
   * * `VI` - Virgin Islands
   * * `VA` - Virginia
   * * `WA` - Washington
   * * `WV` - West Virginia
   * * `WI` - Wisconsin
   * * `WY` - Wyoming
   */
  state: PangeaStateEnum;
  city: string;
  postal_code: string;
  street_1: string;
  street_2?: string | null;
}

export interface PangeaIBOrganization {
  /** @default "C" */
  us_tax_purpose_type?: PangeaUsTaxPurposeTypeEnum;
  /** @default "CORPORATION" */
  type?: PangeaIBOrganizationTypeEnum;
  identification: PangeaIBOrganizationIdentification;
  tax_residencies: PangeaIBOrganizationTaxResidency[];
  associated_entities: PangeaIBAssociatedEntities;
}

export interface PangeaIBOrganizationIdentification {
  /** @default {"code":"US","name":"United States of America"} */
  formation_country?: PangeaFormationCountryEnum;
  /** @default "11122333" */
  identification?: string;
  /** @default {"code":"US","name":"United States of America"} */
  identification_country?: PangeaIdentificationCountryEnum;
  name: string;
  same_mail_address: boolean;
  place_of_business: PangeaIBPlaceOfBusiness;
  mailing_address?: PangeaIBMailingAddress;
}

export interface PangeaIBOrganizationTaxResidency {
  tin: string;
  /** @default {"code":"US","name":"United States of America"} */
  country?: PangeaCountryEnum;
}

/**
 * * `LLC` - LLC
 * * `CORPORATION` - CORPORATION
 * * `PARTNERSHIP` - PARTNERSHIP
 * * `UNINCORPORATED BUSINESS` - UNINCORPORATED BUSINESS
 */
export enum PangeaIBOrganizationTypeEnum {
  LLC = 'LLC',
  CORPORATION = 'CORPORATION',
  PARTNERSHIP = 'PARTNERSHIP',
  UNINCORPORATEDBUSINESS = 'UNINCORPORATED BUSINESS',
}

export interface PangeaIBPlaceOfBusiness {
  /** @default {"code":"US","name":"United States of America"} */
  country?: PangeaCountryEnum;
  /**
   * * `AL` - Alabama
   * * `AK` - Alaska
   * * `AS` - American Samoa
   * * `AZ` - Arizona
   * * `AR` - Arkansas
   * * `AA` - Armed Forces Americas
   * * `AE` - Armed Forces Europe
   * * `AP` - Armed Forces Pacific
   * * `CA` - California
   * * `CO` - Colorado
   * * `CT` - Connecticut
   * * `DE` - Delaware
   * * `DC` - District of Columbia
   * * `FL` - Florida
   * * `GA` - Georgia
   * * `GU` - Guam
   * * `HI` - Hawaii
   * * `ID` - Idaho
   * * `IL` - Illinois
   * * `IN` - Indiana
   * * `IA` - Iowa
   * * `KS` - Kansas
   * * `KY` - Kentucky
   * * `LA` - Louisiana
   * * `ME` - Maine
   * * `MD` - Maryland
   * * `MA` - Massachusetts
   * * `MI` - Michigan
   * * `MN` - Minnesota
   * * `MS` - Mississippi
   * * `MO` - Missouri
   * * `MT` - Montana
   * * `NE` - Nebraska
   * * `NV` - Nevada
   * * `NH` - New Hampshire
   * * `NJ` - New Jersey
   * * `NM` - New Mexico
   * * `NY` - New York
   * * `NC` - North Carolina
   * * `ND` - North Dakota
   * * `MP` - Northern Mariana Islands
   * * `OH` - Ohio
   * * `OK` - Oklahoma
   * * `OR` - Oregon
   * * `PA` - Pennsylvania
   * * `PR` - Puerto Rico
   * * `RI` - Rhode Island
   * * `SC` - South Carolina
   * * `SD` - South Dakota
   * * `TN` - Tennessee
   * * `TX` - Texas
   * * `UT` - Utah
   * * `VT` - Vermont
   * * `VI` - Virgin Islands
   * * `VA` - Virginia
   * * `WA` - Washington
   * * `WV` - West Virginia
   * * `WI` - Wisconsin
   * * `WY` - Wyoming
   */
  state: PangeaStateEnum;
  city: string;
  postal_code: string;
  street_1: string;
  street_2?: string | null;
}

export interface PangeaIBUser {
  external_individual_id?: string;
  external_user_id?: string;
  prefix?: string;
}

export interface PangeaIbanValidationRequest {
  iban: string;
}

export interface PangeaIbanValidationResponse {
  is_valid: boolean;
  is_warning: boolean;
  iban: string;
  branch_code: string;
  routing_number: string;
  account_number: string;
  swift_bic: string;
  bank_name: string;
  branch_name: string;
  bank_address: string;
  postal_code: string;
  country_name: string;
  country: string;
  bank_city: string;
  validation_messages: PangeaMessage[];
  responses: PangeaMessage[];
  recommended_acct: string;
}

export interface PangeaIbkrApplication {
  id: number;
  /** @maxLength 60 */
  external_id: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  user_id: number;
  /** @maxLength 11 */
  username: string;
  /** @maxLength 60 */
  account: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  entity: number;
  company: number;
}

export interface PangeaIbkrCompanySettings {
  spot: boolean;
}

/**
 * * `AF` - Afghanistan
 * * `AX` - Åland Islands
 * * `AL` - Albania
 * * `DZ` - Algeria
 * * `AS` - American Samoa
 * * `AD` - Andorra
 * * `AO` - Angola
 * * `AI` - Anguilla
 * * `AQ` - Antarctica
 * * `AG` - Antigua and Barbuda
 * * `AR` - Argentina
 * * `AM` - Armenia
 * * `AW` - Aruba
 * * `AU` - Australia
 * * `AT` - Austria
 * * `AZ` - Azerbaijan
 * * `BS` - Bahamas
 * * `BH` - Bahrain
 * * `BD` - Bangladesh
 * * `BB` - Barbados
 * * `BY` - Belarus
 * * `BE` - Belgium
 * * `BZ` - Belize
 * * `BJ` - Benin
 * * `BM` - Bermuda
 * * `BT` - Bhutan
 * * `BO` - Bolivia
 * * `BQ` - Bonaire, Sint Eustatius and Saba
 * * `BA` - Bosnia and Herzegovina
 * * `BW` - Botswana
 * * `BV` - Bouvet Island
 * * `BR` - Brazil
 * * `IO` - British Indian Ocean Territory
 * * `BN` - Brunei
 * * `BG` - Bulgaria
 * * `BF` - Burkina Faso
 * * `BI` - Burundi
 * * `CV` - Cabo Verde
 * * `KH` - Cambodia
 * * `CM` - Cameroon
 * * `CA` - Canada
 * * `KY` - Cayman Islands
 * * `CF` - Central African Republic
 * * `TD` - Chad
 * * `CL` - Chile
 * * `CN` - China
 * * `CX` - Christmas Island
 * * `CC` - Cocos (Keeling) Islands
 * * `CO` - Colombia
 * * `KM` - Comoros
 * * `CG` - Congo
 * * `CD` - Congo (the Democratic Republic of the)
 * * `CK` - Cook Islands
 * * `CR` - Costa Rica
 * * `CI` - Côte d'Ivoire
 * * `HR` - Croatia
 * * `CU` - Cuba
 * * `CW` - Curaçao
 * * `CY` - Cyprus
 * * `CZ` - Czechia
 * * `DK` - Denmark
 * * `DJ` - Djibouti
 * * `DM` - Dominica
 * * `DO` - Dominican Republic
 * * `EC` - Ecuador
 * * `EG` - Egypt
 * * `SV` - El Salvador
 * * `GQ` - Equatorial Guinea
 * * `ER` - Eritrea
 * * `EE` - Estonia
 * * `SZ` - Eswatini
 * * `ET` - Ethiopia
 * * `FK` - Falkland Islands (Malvinas)
 * * `FO` - Faroe Islands
 * * `FJ` - Fiji
 * * `FI` - Finland
 * * `FR` - France
 * * `GF` - French Guiana
 * * `PF` - French Polynesia
 * * `TF` - French Southern Territories
 * * `GA` - Gabon
 * * `GM` - Gambia
 * * `GE` - Georgia
 * * `DE` - Germany
 * * `GH` - Ghana
 * * `GI` - Gibraltar
 * * `GR` - Greece
 * * `GL` - Greenland
 * * `GD` - Grenada
 * * `GP` - Guadeloupe
 * * `GU` - Guam
 * * `GT` - Guatemala
 * * `GG` - Guernsey
 * * `GN` - Guinea
 * * `GW` - Guinea-Bissau
 * * `GY` - Guyana
 * * `HT` - Haiti
 * * `HM` - Heard Island and McDonald Islands
 * * `VA` - Holy See
 * * `HN` - Honduras
 * * `HK` - Hong Kong
 * * `HU` - Hungary
 * * `IS` - Iceland
 * * `IN` - India
 * * `ID` - Indonesia
 * * `IR` - Iran
 * * `IQ` - Iraq
 * * `IE` - Ireland
 * * `IM` - Isle of Man
 * * `IL` - Israel
 * * `IT` - Italy
 * * `JM` - Jamaica
 * * `JP` - Japan
 * * `JE` - Jersey
 * * `JO` - Jordan
 * * `KZ` - Kazakhstan
 * * `KE` - Kenya
 * * `KI` - Kiribati
 * * `KW` - Kuwait
 * * `KG` - Kyrgyzstan
 * * `LA` - Laos
 * * `LV` - Latvia
 * * `LB` - Lebanon
 * * `LS` - Lesotho
 * * `LR` - Liberia
 * * `LY` - Libya
 * * `LI` - Liechtenstein
 * * `LT` - Lithuania
 * * `LU` - Luxembourg
 * * `MO` - Macao
 * * `MG` - Madagascar
 * * `MW` - Malawi
 * * `MY` - Malaysia
 * * `MV` - Maldives
 * * `ML` - Mali
 * * `MT` - Malta
 * * `MH` - Marshall Islands
 * * `MQ` - Martinique
 * * `MR` - Mauritania
 * * `MU` - Mauritius
 * * `YT` - Mayotte
 * * `MX` - Mexico
 * * `FM` - Micronesia
 * * `MD` - Moldova
 * * `MC` - Monaco
 * * `MN` - Mongolia
 * * `ME` - Montenegro
 * * `MS` - Montserrat
 * * `MA` - Morocco
 * * `MZ` - Mozambique
 * * `MM` - Myanmar
 * * `NA` - Namibia
 * * `NR` - Nauru
 * * `NP` - Nepal
 * * `NL` - Netherlands
 * * `NC` - New Caledonia
 * * `NZ` - New Zealand
 * * `NI` - Nicaragua
 * * `NE` - Niger
 * * `NG` - Nigeria
 * * `NU` - Niue
 * * `NF` - Norfolk Island
 * * `KP` - North Korea
 * * `MK` - North Macedonia
 * * `MP` - Northern Mariana Islands
 * * `NO` - Norway
 * * `OM` - Oman
 * * `PK` - Pakistan
 * * `PW` - Palau
 * * `PS` - Palestine, State of
 * * `PA` - Panama
 * * `PG` - Papua New Guinea
 * * `PY` - Paraguay
 * * `PE` - Peru
 * * `PH` - Philippines
 * * `PN` - Pitcairn
 * * `PL` - Poland
 * * `PT` - Portugal
 * * `PR` - Puerto Rico
 * * `QA` - Qatar
 * * `RE` - Réunion
 * * `RO` - Romania
 * * `RU` - Russia
 * * `RW` - Rwanda
 * * `BL` - Saint Barthélemy
 * * `SH` - Saint Helena, Ascension and Tristan da Cunha
 * * `KN` - Saint Kitts and Nevis
 * * `LC` - Saint Lucia
 * * `MF` - Saint Martin (French part)
 * * `PM` - Saint Pierre and Miquelon
 * * `VC` - Saint Vincent and the Grenadines
 * * `WS` - Samoa
 * * `SM` - San Marino
 * * `ST` - Sao Tome and Principe
 * * `SA` - Saudi Arabia
 * * `SN` - Senegal
 * * `RS` - Serbia
 * * `SC` - Seychelles
 * * `SL` - Sierra Leone
 * * `SG` - Singapore
 * * `SX` - Sint Maarten (Dutch part)
 * * `SK` - Slovakia
 * * `SI` - Slovenia
 * * `SB` - Solomon Islands
 * * `SO` - Somalia
 * * `ZA` - South Africa
 * * `GS` - South Georgia and the South Sandwich Islands
 * * `KR` - South Korea
 * * `SS` - South Sudan
 * * `ES` - Spain
 * * `LK` - Sri Lanka
 * * `SD` - Sudan
 * * `SR` - Suriname
 * * `SJ` - Svalbard and Jan Mayen
 * * `SE` - Sweden
 * * `CH` - Switzerland
 * * `SY` - Syria
 * * `TW` - Taiwan
 * * `TJ` - Tajikistan
 * * `TZ` - Tanzania
 * * `TH` - Thailand
 * * `TL` - Timor-Leste
 * * `TG` - Togo
 * * `TK` - Tokelau
 * * `TO` - Tonga
 * * `TT` - Trinidad and Tobago
 * * `TN` - Tunisia
 * * `TR` - Türkiye
 * * `TM` - Turkmenistan
 * * `TC` - Turks and Caicos Islands
 * * `TV` - Tuvalu
 * * `UG` - Uganda
 * * `UA` - Ukraine
 * * `AE` - United Arab Emirates
 * * `GB` - United Kingdom
 * * `UM` - United States Minor Outlying Islands
 * * `US` - United States of America
 * * `UY` - Uruguay
 * * `UZ` - Uzbekistan
 * * `VU` - Vanuatu
 * * `VE` - Venezuela
 * * `VN` - Vietnam
 * * `VG` - Virgin Islands (British)
 * * `VI` - Virgin Islands (U.S.)
 * * `WF` - Wallis and Futuna
 * * `EH` - Western Sahara
 * * `YE` - Yemen
 * * `ZM` - Zambia
 * * `ZW` - Zimbabwe
 */
export enum PangeaIdentificationCountryEnum {
  AF = 'AF',
  AX = 'AX',
  AL = 'AL',
  DZ = 'DZ',
  AS = 'AS',
  AD = 'AD',
  AO = 'AO',
  AI = 'AI',
  AQ = 'AQ',
  AG = 'AG',
  AR = 'AR',
  AM = 'AM',
  AW = 'AW',
  AU = 'AU',
  AT = 'AT',
  AZ = 'AZ',
  BS = 'BS',
  BH = 'BH',
  BD = 'BD',
  BB = 'BB',
  BY = 'BY',
  BE = 'BE',
  BZ = 'BZ',
  BJ = 'BJ',
  BM = 'BM',
  BT = 'BT',
  BO = 'BO',
  BQ = 'BQ',
  BA = 'BA',
  BW = 'BW',
  BV = 'BV',
  BR = 'BR',
  IO = 'IO',
  BN = 'BN',
  BG = 'BG',
  BF = 'BF',
  BI = 'BI',
  CV = 'CV',
  KH = 'KH',
  CM = 'CM',
  CA = 'CA',
  KY = 'KY',
  CF = 'CF',
  TD = 'TD',
  CL = 'CL',
  CN = 'CN',
  CX = 'CX',
  CC = 'CC',
  CO = 'CO',
  KM = 'KM',
  CG = 'CG',
  CD = 'CD',
  CK = 'CK',
  CR = 'CR',
  CI = 'CI',
  HR = 'HR',
  CU = 'CU',
  CW = 'CW',
  CY = 'CY',
  CZ = 'CZ',
  DK = 'DK',
  DJ = 'DJ',
  DM = 'DM',
  DO = 'DO',
  EC = 'EC',
  EG = 'EG',
  SV = 'SV',
  GQ = 'GQ',
  ER = 'ER',
  EE = 'EE',
  SZ = 'SZ',
  ET = 'ET',
  FK = 'FK',
  FO = 'FO',
  FJ = 'FJ',
  FI = 'FI',
  FR = 'FR',
  GF = 'GF',
  PF = 'PF',
  TF = 'TF',
  GA = 'GA',
  GM = 'GM',
  GE = 'GE',
  DE = 'DE',
  GH = 'GH',
  GI = 'GI',
  GR = 'GR',
  GL = 'GL',
  GD = 'GD',
  GP = 'GP',
  GU = 'GU',
  GT = 'GT',
  GG = 'GG',
  GN = 'GN',
  GW = 'GW',
  GY = 'GY',
  HT = 'HT',
  HM = 'HM',
  VA = 'VA',
  HN = 'HN',
  HK = 'HK',
  HU = 'HU',
  IS = 'IS',
  IN = 'IN',
  ID = 'ID',
  IR = 'IR',
  IQ = 'IQ',
  IE = 'IE',
  IM = 'IM',
  IL = 'IL',
  IT = 'IT',
  JM = 'JM',
  JP = 'JP',
  JE = 'JE',
  JO = 'JO',
  KZ = 'KZ',
  KE = 'KE',
  KI = 'KI',
  KW = 'KW',
  KG = 'KG',
  LA = 'LA',
  LV = 'LV',
  LB = 'LB',
  LS = 'LS',
  LR = 'LR',
  LY = 'LY',
  LI = 'LI',
  LT = 'LT',
  LU = 'LU',
  MO = 'MO',
  MG = 'MG',
  MW = 'MW',
  MY = 'MY',
  MV = 'MV',
  ML = 'ML',
  MT = 'MT',
  MH = 'MH',
  MQ = 'MQ',
  MR = 'MR',
  MU = 'MU',
  YT = 'YT',
  MX = 'MX',
  FM = 'FM',
  MD = 'MD',
  MC = 'MC',
  MN = 'MN',
  ME = 'ME',
  MS = 'MS',
  MA = 'MA',
  MZ = 'MZ',
  MM = 'MM',
  NA = 'NA',
  NR = 'NR',
  NP = 'NP',
  NL = 'NL',
  NC = 'NC',
  NZ = 'NZ',
  NI = 'NI',
  NE = 'NE',
  NG = 'NG',
  NU = 'NU',
  NF = 'NF',
  KP = 'KP',
  MK = 'MK',
  MP = 'MP',
  NO = 'NO',
  OM = 'OM',
  PK = 'PK',
  PW = 'PW',
  PS = 'PS',
  PA = 'PA',
  PG = 'PG',
  PY = 'PY',
  PE = 'PE',
  PH = 'PH',
  PN = 'PN',
  PL = 'PL',
  PT = 'PT',
  PR = 'PR',
  QA = 'QA',
  RE = 'RE',
  RO = 'RO',
  RU = 'RU',
  RW = 'RW',
  BL = 'BL',
  SH = 'SH',
  KN = 'KN',
  LC = 'LC',
  MF = 'MF',
  PM = 'PM',
  VC = 'VC',
  WS = 'WS',
  SM = 'SM',
  ST = 'ST',
  SA = 'SA',
  SN = 'SN',
  RS = 'RS',
  SC = 'SC',
  SL = 'SL',
  SG = 'SG',
  SX = 'SX',
  SK = 'SK',
  SI = 'SI',
  SB = 'SB',
  SO = 'SO',
  ZA = 'ZA',
  GS = 'GS',
  KR = 'KR',
  SS = 'SS',
  ES = 'ES',
  LK = 'LK',
  SD = 'SD',
  SR = 'SR',
  SJ = 'SJ',
  SE = 'SE',
  CH = 'CH',
  SY = 'SY',
  TW = 'TW',
  TJ = 'TJ',
  TZ = 'TZ',
  TH = 'TH',
  TL = 'TL',
  TG = 'TG',
  TK = 'TK',
  TO = 'TO',
  TT = 'TT',
  TN = 'TN',
  TR = 'TR',
  TM = 'TM',
  TC = 'TC',
  TV = 'TV',
  UG = 'UG',
  UA = 'UA',
  AE = 'AE',
  GB = 'GB',
  UM = 'UM',
  US = 'US',
  UY = 'UY',
  UZ = 'UZ',
  VU = 'VU',
  VE = 'VE',
  VN = 'VN',
  VG = 'VG',
  VI = 'VI',
  WF = 'WF',
  EH = 'EH',
  YE = 'YE',
  ZM = 'ZM',
  ZW = 'ZW',
}

/**
 * * `passport` - Passport
 * * `national_id` - National ID
 * * `driving_license` - Driving License
 * * `others` - Others
 * * `cpf` - CPF
 * * `cnpj` - CNPJ
 */
export enum PangeaIdentificationTypeEnum {
  Passport = 'passport',
  NationalId = 'national_id',
  DrivingLicense = 'driving_license',
  Others = 'others',
  Cpf = 'cpf',
  Cnpj = 'cnpj',
}

/** * `IFSC` - IFSC */
export enum PangeaIdentifierTypeEnum {
  IFSC = 'IFSC',
}

export interface PangeaIndex {
  /** @format date-time */
  date: string;
  index_asset: PangeaIndexAsset;
  /** @format double */
  rate_index?: number | null;
  /** @format double */
  rate_bid_index?: number | null;
  /** @format double */
  rate_ask_index?: number | null;
}

export interface PangeaIndexAsset {
  /** @maxLength 255 */
  name: string;
  /** @maxLength 10 */
  symbol: string;
}

export interface PangeaInitialMarketStateRequest {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /**
   * The date when the transaction will settle. Defaults to the following business day if settlement cannot occur on the provided value_date.
   * @default "SPOT"
   */
  value_date?: string;
  /**
   * Generate and return channel subscription
   * @default true
   */
  subscription?: boolean;
}

export interface PangeaInitialMarketStateResponse {
  market: string;
  rate_rounding: number;
  side: string;
  /** @format date */
  spot_date: string;
  /** @format double */
  spot_rate: number;
  /** @format double */
  rate: number;
  /** @format double */
  fwd_points: number;
  fwd_points_str?: string | null;
  /** @format double */
  implied_yield: number;
  indicative: boolean;
  /** @format date-time */
  cutoff_time: string;
  /** @format date-time */
  as_of: string;
  status: PangeaBestExecution;
  channel_group_name: string;
  /** @format double */
  fee: number;
  /** @format double */
  quote_fee: number;
  /** @format double */
  wire_fee?: number | null;
  pangea_fee: string;
  broker_fee: string;
  is_ndf?: boolean | null;
  fwd_rfq_type?: string | null;
  /** @format double */
  all_in_reference_rate?: number | null;
  executing_broker?: PangeaExecutingBroker | null;
  is_same_currency: boolean;
}

export interface PangeaInitialRateRequest {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
}

export interface PangeaInstallment {
  id?: number;
  /** @maxLength 255 */
  installment_name: string;
}

export interface PangeaInstallmentCashflow {
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  amount: number;
  buy_currency: string;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  cntr_amount?: number;
  lock_side: string;
  sell_currency: string;
  ticket: PangeaTicketRate;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /**
   * The unique ID of the cashflow
   * @format uuid
   */
  cashflow_id: string;
  /**
   * The status of the cashflow
   *
   * * `draft` - DRAFT
   * * `pending` - PENDING
   * * `approved` - APPROVED
   * * `live` - LIVE
   * * `canceled` - CANCELED
   */
  status: PangeaInstallmentCashflowStatusEnum;
  /**
   * The date the cashflow is paid or received
   * @format date-time
   */
  pay_date: string;
  /** A name for the cashflow */
  name: string | null;
  /** A description of the cashflow */
  description: string | null;
  /**
   * the ticket ID associated with this single cashflow
   * @format uuid
   */
  ticket_id?: string | null;
  /**
   * Payment's cashflow transaction date
   * @format date
   */
  transaction_date?: string | null;
}

/**
 * * `draft` - DRAFT
 * * `pending` - PENDING
 * * `approved` - APPROVED
 * * `live` - LIVE
 * * `canceled` - CANCELED
 */
export enum PangeaInstallmentCashflowStatusEnum {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Live = 'live',
  Canceled = 'canceled',
}

export interface PangeaInstructDealRequest {
  orders: PangeaInstructDealRequestOrder[];
  payments: PangeaInstructDealRequestPayment[];
  settlements: PangeaInstructDealRequestSettlement[];
}

/**
 * * `W` - Wire
 * * `E` - iACH
 * * `C` - FXBalance
 */
export enum PangeaInstructDealRequestDeliveryMethodEnum {
  W = 'W',
  E = 'E',
  C = 'C',
}

export interface PangeaInstructDealRequestOrder {
  order_id?: string;
  /** @format double */
  amount: number;
}

export interface PangeaInstructDealRequestPayment {
  beneficiary_id: string;
  /**
   * * `W` - Wire
   * * `E` - iACH
   * * `C` - FXBalance
   */
  delivery_method: PangeaInstructDealRequestDeliveryMethodEnum;
  /** @format double */
  amount: number;
  currency: string;
  purpose_of_payment: string;
  payment_reference?: string;
}

export interface PangeaInstructDealRequestSettlement {
  account_id: string;
  /**
   * * `W` - Wire
   * * `E` - iACH
   * * `C` - FXBalance
   */
  delivery_method: PangeaInstructDealRequestDeliveryMethodEnum;
  currency: string;
  /**
   * * `All` - All
   * * `Allocation` - Allocation
   * * `Fee` - Fee
   * * `Spot` - Spot
   * * `SpotTrade` - SpotTrade
   * * `Drawdown` - Drawdown
   */
  purpose: PangeaPurposeEnum;
}

export interface PangeaInstructDealResponse {
  ord_num: string;
  /** @format date-time */
  value_date: string;
  new_payment_ids: number[];
  payments: PangeaInstructDealResponsePayment[];
  settlements: PangeaInstructDealResponseSettlement[];
  order_detail: PangeaInstructDealResponseOrderDetail;
  enable_approve_trade_button: boolean;
  show_approve_trade_button: boolean;
}

export interface PangeaInstructDealResponseOrderDetail {
  /** @format date-time */
  entry_date: string;
  ord_num: string;
  buy: string;
  /** @format double */
  buy_amount: number;
  sell: string;
  /** @format double */
  sell_amount: number;
  /** @format double */
  exchange: number;
  our_action: string;
  token: string;
}

export interface PangeaInstructDealResponsePayment {
  payment_instruction_id: number;
  /** @format date-time */
  available_date: string;
  order_id: string | null;
  /** @format double */
  amount: number;
  currency: string;
  approval_status: string;
  /** @format double */
  fee_amount: number;
  fee_currency: string;
  /** @format double */
  estimate_cost_amount: number;
  estimate_cost_currency: string;
  bene_id: string;
  reference: string;
  method: string;
  payee_name: string;
  account_type: string;
  payee_account: string | null;
  client_integration_id: string;
  tracker_id: string;
  links: PangeaLink[];
}

export interface PangeaInstructDealResponseSettlement {
  account_id: string;
  method: string;
  method_description: string;
  account_details: string;
  payment_ident: string;
  settlement_id: string;
  is_fee: boolean;
  /** @format double */
  amount: number;
  currency: string;
  account_type: string;
  links: PangeaLink[];
}

/**
 * * `WIRE` - WIRE
 * * `ACH` - ACH
 */
export enum PangeaInstructionTypeEnum {
  WIRE = 'WIRE',
  ACH = 'ACH',
}

/**
 * * `iban` - IBAN
 * * `clabe` - CLABE
 * * `account_number` - Account Number
 */
export enum PangeaInterBankAccountNumberTypeEnum {
  Iban = 'iban',
  Clabe = 'clabe',
  AccountNumber = 'account_number',
}

/**
 * * `current` - Current
 * * `saving` - Saving
 * * `maestra` - Maestra
 * * `checking` - Checking
 */
export enum PangeaInterBankAccountTypeEnum {
  Current = 'current',
  Saving = 'saving',
  Maestra = 'maestra',
  Checking = 'checking',
}

/**
 * * `swift` - SWIFT
 * * `ifsc` - IFSC
 * * `sort_code` - SORT Code
 * * `ach_code` - ACH Code
 * * `branch_code` - Branch Code
 * * `bsb_code` - BSB Code
 * * `bank_code` - Bank Code
 * * `aba_code` - ABA Code
 * * `transit_code` - Transit Code
 * * `generic` - Generic
 * * `wallet` - Wallet
 * * `location_id` - Location ID
 * * `branch_name` - Branch Name
 * * `cnaps` - CNAPS
 * * `fedwire` - Fedwire
 * * `interac` - Interac
 * * `check` - Check
 */
export enum PangeaInterBankRoutingCodeType2Enum {
  Swift = 'swift',
  Ifsc = 'ifsc',
  SortCode = 'sort_code',
  AchCode = 'ach_code',
  BranchCode = 'branch_code',
  BsbCode = 'bsb_code',
  BankCode = 'bank_code',
  AbaCode = 'aba_code',
  TransitCode = 'transit_code',
  Generic = 'generic',
  Wallet = 'wallet',
  LocationId = 'location_id',
  BranchName = 'branch_name',
  Cnaps = 'cnaps',
  Fedwire = 'fedwire',
  Interac = 'interac',
  Check = 'check',
}

export interface PangeaInviteResponse {
  detail: string;
}

export interface PangeaInviteTokenError {
  error: string;
}

export interface PangeaInviteTokenResponse {
  email: string;
}

/**
 * * `AF` - Afghanistan
 * * `AX` - Åland Islands
 * * `AL` - Albania
 * * `DZ` - Algeria
 * * `AS` - American Samoa
 * * `AD` - Andorra
 * * `AO` - Angola
 * * `AI` - Anguilla
 * * `AQ` - Antarctica
 * * `AG` - Antigua and Barbuda
 * * `AR` - Argentina
 * * `AM` - Armenia
 * * `AW` - Aruba
 * * `AU` - Australia
 * * `AT` - Austria
 * * `AZ` - Azerbaijan
 * * `BS` - Bahamas
 * * `BH` - Bahrain
 * * `BD` - Bangladesh
 * * `BB` - Barbados
 * * `BY` - Belarus
 * * `BE` - Belgium
 * * `BZ` - Belize
 * * `BJ` - Benin
 * * `BM` - Bermuda
 * * `BT` - Bhutan
 * * `BO` - Bolivia
 * * `BQ` - Bonaire, Sint Eustatius and Saba
 * * `BA` - Bosnia and Herzegovina
 * * `BW` - Botswana
 * * `BV` - Bouvet Island
 * * `BR` - Brazil
 * * `IO` - British Indian Ocean Territory
 * * `BN` - Brunei
 * * `BG` - Bulgaria
 * * `BF` - Burkina Faso
 * * `BI` - Burundi
 * * `CV` - Cabo Verde
 * * `KH` - Cambodia
 * * `CM` - Cameroon
 * * `CA` - Canada
 * * `KY` - Cayman Islands
 * * `CF` - Central African Republic
 * * `TD` - Chad
 * * `CL` - Chile
 * * `CN` - China
 * * `CX` - Christmas Island
 * * `CC` - Cocos (Keeling) Islands
 * * `CO` - Colombia
 * * `KM` - Comoros
 * * `CG` - Congo
 * * `CD` - Congo (the Democratic Republic of the)
 * * `CK` - Cook Islands
 * * `CR` - Costa Rica
 * * `CI` - Côte d'Ivoire
 * * `HR` - Croatia
 * * `CU` - Cuba
 * * `CW` - Curaçao
 * * `CY` - Cyprus
 * * `CZ` - Czechia
 * * `DK` - Denmark
 * * `DJ` - Djibouti
 * * `DM` - Dominica
 * * `DO` - Dominican Republic
 * * `EC` - Ecuador
 * * `EG` - Egypt
 * * `SV` - El Salvador
 * * `GQ` - Equatorial Guinea
 * * `ER` - Eritrea
 * * `EE` - Estonia
 * * `SZ` - Eswatini
 * * `ET` - Ethiopia
 * * `FK` - Falkland Islands (Malvinas)
 * * `FO` - Faroe Islands
 * * `FJ` - Fiji
 * * `FI` - Finland
 * * `FR` - France
 * * `GF` - French Guiana
 * * `PF` - French Polynesia
 * * `TF` - French Southern Territories
 * * `GA` - Gabon
 * * `GM` - Gambia
 * * `GE` - Georgia
 * * `DE` - Germany
 * * `GH` - Ghana
 * * `GI` - Gibraltar
 * * `GR` - Greece
 * * `GL` - Greenland
 * * `GD` - Grenada
 * * `GP` - Guadeloupe
 * * `GU` - Guam
 * * `GT` - Guatemala
 * * `GG` - Guernsey
 * * `GN` - Guinea
 * * `GW` - Guinea-Bissau
 * * `GY` - Guyana
 * * `HT` - Haiti
 * * `HM` - Heard Island and McDonald Islands
 * * `VA` - Holy See
 * * `HN` - Honduras
 * * `HK` - Hong Kong
 * * `HU` - Hungary
 * * `IS` - Iceland
 * * `IN` - India
 * * `ID` - Indonesia
 * * `IR` - Iran
 * * `IQ` - Iraq
 * * `IE` - Ireland
 * * `IM` - Isle of Man
 * * `IL` - Israel
 * * `IT` - Italy
 * * `JM` - Jamaica
 * * `JP` - Japan
 * * `JE` - Jersey
 * * `JO` - Jordan
 * * `KZ` - Kazakhstan
 * * `KE` - Kenya
 * * `KI` - Kiribati
 * * `KW` - Kuwait
 * * `KG` - Kyrgyzstan
 * * `LA` - Laos
 * * `LV` - Latvia
 * * `LB` - Lebanon
 * * `LS` - Lesotho
 * * `LR` - Liberia
 * * `LY` - Libya
 * * `LI` - Liechtenstein
 * * `LT` - Lithuania
 * * `LU` - Luxembourg
 * * `MO` - Macao
 * * `MG` - Madagascar
 * * `MW` - Malawi
 * * `MY` - Malaysia
 * * `MV` - Maldives
 * * `ML` - Mali
 * * `MT` - Malta
 * * `MH` - Marshall Islands
 * * `MQ` - Martinique
 * * `MR` - Mauritania
 * * `MU` - Mauritius
 * * `YT` - Mayotte
 * * `MX` - Mexico
 * * `FM` - Micronesia
 * * `MD` - Moldova
 * * `MC` - Monaco
 * * `MN` - Mongolia
 * * `ME` - Montenegro
 * * `MS` - Montserrat
 * * `MA` - Morocco
 * * `MZ` - Mozambique
 * * `MM` - Myanmar
 * * `NA` - Namibia
 * * `NR` - Nauru
 * * `NP` - Nepal
 * * `NL` - Netherlands
 * * `NC` - New Caledonia
 * * `NZ` - New Zealand
 * * `NI` - Nicaragua
 * * `NE` - Niger
 * * `NG` - Nigeria
 * * `NU` - Niue
 * * `NF` - Norfolk Island
 * * `KP` - North Korea
 * * `MK` - North Macedonia
 * * `MP` - Northern Mariana Islands
 * * `NO` - Norway
 * * `OM` - Oman
 * * `PK` - Pakistan
 * * `PW` - Palau
 * * `PS` - Palestine, State of
 * * `PA` - Panama
 * * `PG` - Papua New Guinea
 * * `PY` - Paraguay
 * * `PE` - Peru
 * * `PH` - Philippines
 * * `PN` - Pitcairn
 * * `PL` - Poland
 * * `PT` - Portugal
 * * `PR` - Puerto Rico
 * * `QA` - Qatar
 * * `RE` - Réunion
 * * `RO` - Romania
 * * `RU` - Russia
 * * `RW` - Rwanda
 * * `BL` - Saint Barthélemy
 * * `SH` - Saint Helena, Ascension and Tristan da Cunha
 * * `KN` - Saint Kitts and Nevis
 * * `LC` - Saint Lucia
 * * `MF` - Saint Martin (French part)
 * * `PM` - Saint Pierre and Miquelon
 * * `VC` - Saint Vincent and the Grenadines
 * * `WS` - Samoa
 * * `SM` - San Marino
 * * `ST` - Sao Tome and Principe
 * * `SA` - Saudi Arabia
 * * `SN` - Senegal
 * * `RS` - Serbia
 * * `SC` - Seychelles
 * * `SL` - Sierra Leone
 * * `SG` - Singapore
 * * `SX` - Sint Maarten (Dutch part)
 * * `SK` - Slovakia
 * * `SI` - Slovenia
 * * `SB` - Solomon Islands
 * * `SO` - Somalia
 * * `ZA` - South Africa
 * * `GS` - South Georgia and the South Sandwich Islands
 * * `KR` - South Korea
 * * `SS` - South Sudan
 * * `ES` - Spain
 * * `LK` - Sri Lanka
 * * `SD` - Sudan
 * * `SR` - Suriname
 * * `SJ` - Svalbard and Jan Mayen
 * * `SE` - Sweden
 * * `CH` - Switzerland
 * * `SY` - Syria
 * * `TW` - Taiwan
 * * `TJ` - Tajikistan
 * * `TZ` - Tanzania
 * * `TH` - Thailand
 * * `TL` - Timor-Leste
 * * `TG` - Togo
 * * `TK` - Tokelau
 * * `TO` - Tonga
 * * `TT` - Trinidad and Tobago
 * * `TN` - Tunisia
 * * `TR` - Türkiye
 * * `TM` - Turkmenistan
 * * `TC` - Turks and Caicos Islands
 * * `TV` - Tuvalu
 * * `UG` - Uganda
 * * `UA` - Ukraine
 * * `AE` - United Arab Emirates
 * * `GB` - United Kingdom
 * * `UM` - United States Minor Outlying Islands
 * * `US` - United States of America
 * * `UY` - Uruguay
 * * `UZ` - Uzbekistan
 * * `VU` - Vanuatu
 * * `VE` - Venezuela
 * * `VN` - Vietnam
 * * `VG` - Virgin Islands (British)
 * * `VI` - Virgin Islands (U.S.)
 * * `WF` - Wallis and Futuna
 * * `EH` - Western Sahara
 * * `YE` - Yemen
 * * `ZM` - Zambia
 * * `ZW` - Zimbabwe
 */
export enum PangeaIssuingCountryEnum {
  AF = 'AF',
  AX = 'AX',
  AL = 'AL',
  DZ = 'DZ',
  AS = 'AS',
  AD = 'AD',
  AO = 'AO',
  AI = 'AI',
  AQ = 'AQ',
  AG = 'AG',
  AR = 'AR',
  AM = 'AM',
  AW = 'AW',
  AU = 'AU',
  AT = 'AT',
  AZ = 'AZ',
  BS = 'BS',
  BH = 'BH',
  BD = 'BD',
  BB = 'BB',
  BY = 'BY',
  BE = 'BE',
  BZ = 'BZ',
  BJ = 'BJ',
  BM = 'BM',
  BT = 'BT',
  BO = 'BO',
  BQ = 'BQ',
  BA = 'BA',
  BW = 'BW',
  BV = 'BV',
  BR = 'BR',
  IO = 'IO',
  BN = 'BN',
  BG = 'BG',
  BF = 'BF',
  BI = 'BI',
  CV = 'CV',
  KH = 'KH',
  CM = 'CM',
  CA = 'CA',
  KY = 'KY',
  CF = 'CF',
  TD = 'TD',
  CL = 'CL',
  CN = 'CN',
  CX = 'CX',
  CC = 'CC',
  CO = 'CO',
  KM = 'KM',
  CG = 'CG',
  CD = 'CD',
  CK = 'CK',
  CR = 'CR',
  CI = 'CI',
  HR = 'HR',
  CU = 'CU',
  CW = 'CW',
  CY = 'CY',
  CZ = 'CZ',
  DK = 'DK',
  DJ = 'DJ',
  DM = 'DM',
  DO = 'DO',
  EC = 'EC',
  EG = 'EG',
  SV = 'SV',
  GQ = 'GQ',
  ER = 'ER',
  EE = 'EE',
  SZ = 'SZ',
  ET = 'ET',
  FK = 'FK',
  FO = 'FO',
  FJ = 'FJ',
  FI = 'FI',
  FR = 'FR',
  GF = 'GF',
  PF = 'PF',
  TF = 'TF',
  GA = 'GA',
  GM = 'GM',
  GE = 'GE',
  DE = 'DE',
  GH = 'GH',
  GI = 'GI',
  GR = 'GR',
  GL = 'GL',
  GD = 'GD',
  GP = 'GP',
  GU = 'GU',
  GT = 'GT',
  GG = 'GG',
  GN = 'GN',
  GW = 'GW',
  GY = 'GY',
  HT = 'HT',
  HM = 'HM',
  VA = 'VA',
  HN = 'HN',
  HK = 'HK',
  HU = 'HU',
  IS = 'IS',
  IN = 'IN',
  ID = 'ID',
  IR = 'IR',
  IQ = 'IQ',
  IE = 'IE',
  IM = 'IM',
  IL = 'IL',
  IT = 'IT',
  JM = 'JM',
  JP = 'JP',
  JE = 'JE',
  JO = 'JO',
  KZ = 'KZ',
  KE = 'KE',
  KI = 'KI',
  KW = 'KW',
  KG = 'KG',
  LA = 'LA',
  LV = 'LV',
  LB = 'LB',
  LS = 'LS',
  LR = 'LR',
  LY = 'LY',
  LI = 'LI',
  LT = 'LT',
  LU = 'LU',
  MO = 'MO',
  MG = 'MG',
  MW = 'MW',
  MY = 'MY',
  MV = 'MV',
  ML = 'ML',
  MT = 'MT',
  MH = 'MH',
  MQ = 'MQ',
  MR = 'MR',
  MU = 'MU',
  YT = 'YT',
  MX = 'MX',
  FM = 'FM',
  MD = 'MD',
  MC = 'MC',
  MN = 'MN',
  ME = 'ME',
  MS = 'MS',
  MA = 'MA',
  MZ = 'MZ',
  MM = 'MM',
  NA = 'NA',
  NR = 'NR',
  NP = 'NP',
  NL = 'NL',
  NC = 'NC',
  NZ = 'NZ',
  NI = 'NI',
  NE = 'NE',
  NG = 'NG',
  NU = 'NU',
  NF = 'NF',
  KP = 'KP',
  MK = 'MK',
  MP = 'MP',
  NO = 'NO',
  OM = 'OM',
  PK = 'PK',
  PW = 'PW',
  PS = 'PS',
  PA = 'PA',
  PG = 'PG',
  PY = 'PY',
  PE = 'PE',
  PH = 'PH',
  PN = 'PN',
  PL = 'PL',
  PT = 'PT',
  PR = 'PR',
  QA = 'QA',
  RE = 'RE',
  RO = 'RO',
  RU = 'RU',
  RW = 'RW',
  BL = 'BL',
  SH = 'SH',
  KN = 'KN',
  LC = 'LC',
  MF = 'MF',
  PM = 'PM',
  VC = 'VC',
  WS = 'WS',
  SM = 'SM',
  ST = 'ST',
  SA = 'SA',
  SN = 'SN',
  RS = 'RS',
  SC = 'SC',
  SL = 'SL',
  SG = 'SG',
  SX = 'SX',
  SK = 'SK',
  SI = 'SI',
  SB = 'SB',
  SO = 'SO',
  ZA = 'ZA',
  GS = 'GS',
  KR = 'KR',
  SS = 'SS',
  ES = 'ES',
  LK = 'LK',
  SD = 'SD',
  SR = 'SR',
  SJ = 'SJ',
  SE = 'SE',
  CH = 'CH',
  SY = 'SY',
  TW = 'TW',
  TJ = 'TJ',
  TZ = 'TZ',
  TH = 'TH',
  TL = 'TL',
  TG = 'TG',
  TK = 'TK',
  TO = 'TO',
  TT = 'TT',
  TN = 'TN',
  TR = 'TR',
  TM = 'TM',
  TC = 'TC',
  TV = 'TV',
  UG = 'UG',
  UA = 'UA',
  AE = 'AE',
  GB = 'GB',
  UM = 'UM',
  US = 'US',
  UY = 'UY',
  UZ = 'UZ',
  VU = 'VU',
  VE = 'VE',
  VN = 'VN',
  VG = 'VG',
  VI = 'VI',
  WF = 'WF',
  EH = 'EH',
  YE = 'YE',
  ZM = 'ZM',
  ZW = 'ZW',
}

export interface PangeaKeyValue {
  key: string;
  value: string;
}

/**
 * * `AF` - Afghanistan
 * * `AX` - Åland Islands
 * * `AL` - Albania
 * * `DZ` - Algeria
 * * `AS` - American Samoa
 * * `AD` - Andorra
 * * `AO` - Angola
 * * `AI` - Anguilla
 * * `AQ` - Antarctica
 * * `AG` - Antigua and Barbuda
 * * `AR` - Argentina
 * * `AM` - Armenia
 * * `AW` - Aruba
 * * `AU` - Australia
 * * `AT` - Austria
 * * `AZ` - Azerbaijan
 * * `BS` - Bahamas
 * * `BH` - Bahrain
 * * `BD` - Bangladesh
 * * `BB` - Barbados
 * * `BY` - Belarus
 * * `BE` - Belgium
 * * `BZ` - Belize
 * * `BJ` - Benin
 * * `BM` - Bermuda
 * * `BT` - Bhutan
 * * `BO` - Bolivia
 * * `BQ` - Bonaire, Sint Eustatius and Saba
 * * `BA` - Bosnia and Herzegovina
 * * `BW` - Botswana
 * * `BV` - Bouvet Island
 * * `BR` - Brazil
 * * `IO` - British Indian Ocean Territory
 * * `BN` - Brunei
 * * `BG` - Bulgaria
 * * `BF` - Burkina Faso
 * * `BI` - Burundi
 * * `CV` - Cabo Verde
 * * `KH` - Cambodia
 * * `CM` - Cameroon
 * * `CA` - Canada
 * * `KY` - Cayman Islands
 * * `CF` - Central African Republic
 * * `TD` - Chad
 * * `CL` - Chile
 * * `CN` - China
 * * `CX` - Christmas Island
 * * `CC` - Cocos (Keeling) Islands
 * * `CO` - Colombia
 * * `KM` - Comoros
 * * `CG` - Congo
 * * `CD` - Congo (the Democratic Republic of the)
 * * `CK` - Cook Islands
 * * `CR` - Costa Rica
 * * `CI` - Côte d'Ivoire
 * * `HR` - Croatia
 * * `CU` - Cuba
 * * `CW` - Curaçao
 * * `CY` - Cyprus
 * * `CZ` - Czechia
 * * `DK` - Denmark
 * * `DJ` - Djibouti
 * * `DM` - Dominica
 * * `DO` - Dominican Republic
 * * `EC` - Ecuador
 * * `EG` - Egypt
 * * `SV` - El Salvador
 * * `GQ` - Equatorial Guinea
 * * `ER` - Eritrea
 * * `EE` - Estonia
 * * `SZ` - Eswatini
 * * `ET` - Ethiopia
 * * `FK` - Falkland Islands (Malvinas)
 * * `FO` - Faroe Islands
 * * `FJ` - Fiji
 * * `FI` - Finland
 * * `FR` - France
 * * `GF` - French Guiana
 * * `PF` - French Polynesia
 * * `TF` - French Southern Territories
 * * `GA` - Gabon
 * * `GM` - Gambia
 * * `GE` - Georgia
 * * `DE` - Germany
 * * `GH` - Ghana
 * * `GI` - Gibraltar
 * * `GR` - Greece
 * * `GL` - Greenland
 * * `GD` - Grenada
 * * `GP` - Guadeloupe
 * * `GU` - Guam
 * * `GT` - Guatemala
 * * `GG` - Guernsey
 * * `GN` - Guinea
 * * `GW` - Guinea-Bissau
 * * `GY` - Guyana
 * * `HT` - Haiti
 * * `HM` - Heard Island and McDonald Islands
 * * `VA` - Holy See
 * * `HN` - Honduras
 * * `HK` - Hong Kong
 * * `HU` - Hungary
 * * `IS` - Iceland
 * * `IN` - India
 * * `ID` - Indonesia
 * * `IR` - Iran
 * * `IQ` - Iraq
 * * `IE` - Ireland
 * * `IM` - Isle of Man
 * * `IL` - Israel
 * * `IT` - Italy
 * * `JM` - Jamaica
 * * `JP` - Japan
 * * `JE` - Jersey
 * * `JO` - Jordan
 * * `KZ` - Kazakhstan
 * * `KE` - Kenya
 * * `KI` - Kiribati
 * * `KW` - Kuwait
 * * `KG` - Kyrgyzstan
 * * `LA` - Laos
 * * `LV` - Latvia
 * * `LB` - Lebanon
 * * `LS` - Lesotho
 * * `LR` - Liberia
 * * `LY` - Libya
 * * `LI` - Liechtenstein
 * * `LT` - Lithuania
 * * `LU` - Luxembourg
 * * `MO` - Macao
 * * `MG` - Madagascar
 * * `MW` - Malawi
 * * `MY` - Malaysia
 * * `MV` - Maldives
 * * `ML` - Mali
 * * `MT` - Malta
 * * `MH` - Marshall Islands
 * * `MQ` - Martinique
 * * `MR` - Mauritania
 * * `MU` - Mauritius
 * * `YT` - Mayotte
 * * `MX` - Mexico
 * * `FM` - Micronesia
 * * `MD` - Moldova
 * * `MC` - Monaco
 * * `MN` - Mongolia
 * * `ME` - Montenegro
 * * `MS` - Montserrat
 * * `MA` - Morocco
 * * `MZ` - Mozambique
 * * `MM` - Myanmar
 * * `NA` - Namibia
 * * `NR` - Nauru
 * * `NP` - Nepal
 * * `NL` - Netherlands
 * * `NC` - New Caledonia
 * * `NZ` - New Zealand
 * * `NI` - Nicaragua
 * * `NE` - Niger
 * * `NG` - Nigeria
 * * `NU` - Niue
 * * `NF` - Norfolk Island
 * * `KP` - North Korea
 * * `MK` - North Macedonia
 * * `MP` - Northern Mariana Islands
 * * `NO` - Norway
 * * `OM` - Oman
 * * `PK` - Pakistan
 * * `PW` - Palau
 * * `PS` - Palestine, State of
 * * `PA` - Panama
 * * `PG` - Papua New Guinea
 * * `PY` - Paraguay
 * * `PE` - Peru
 * * `PH` - Philippines
 * * `PN` - Pitcairn
 * * `PL` - Poland
 * * `PT` - Portugal
 * * `PR` - Puerto Rico
 * * `QA` - Qatar
 * * `RE` - Réunion
 * * `RO` - Romania
 * * `RU` - Russia
 * * `RW` - Rwanda
 * * `BL` - Saint Barthélemy
 * * `SH` - Saint Helena, Ascension and Tristan da Cunha
 * * `KN` - Saint Kitts and Nevis
 * * `LC` - Saint Lucia
 * * `MF` - Saint Martin (French part)
 * * `PM` - Saint Pierre and Miquelon
 * * `VC` - Saint Vincent and the Grenadines
 * * `WS` - Samoa
 * * `SM` - San Marino
 * * `ST` - Sao Tome and Principe
 * * `SA` - Saudi Arabia
 * * `SN` - Senegal
 * * `RS` - Serbia
 * * `SC` - Seychelles
 * * `SL` - Sierra Leone
 * * `SG` - Singapore
 * * `SX` - Sint Maarten (Dutch part)
 * * `SK` - Slovakia
 * * `SI` - Slovenia
 * * `SB` - Solomon Islands
 * * `SO` - Somalia
 * * `ZA` - South Africa
 * * `GS` - South Georgia and the South Sandwich Islands
 * * `KR` - South Korea
 * * `SS` - South Sudan
 * * `ES` - Spain
 * * `LK` - Sri Lanka
 * * `SD` - Sudan
 * * `SR` - Suriname
 * * `SJ` - Svalbard and Jan Mayen
 * * `SE` - Sweden
 * * `CH` - Switzerland
 * * `SY` - Syria
 * * `TW` - Taiwan
 * * `TJ` - Tajikistan
 * * `TZ` - Tanzania
 * * `TH` - Thailand
 * * `TL` - Timor-Leste
 * * `TG` - Togo
 * * `TK` - Tokelau
 * * `TO` - Tonga
 * * `TT` - Trinidad and Tobago
 * * `TN` - Tunisia
 * * `TR` - Türkiye
 * * `TM` - Turkmenistan
 * * `TC` - Turks and Caicos Islands
 * * `TV` - Tuvalu
 * * `UG` - Uganda
 * * `UA` - Ukraine
 * * `AE` - United Arab Emirates
 * * `GB` - United Kingdom
 * * `UM` - United States Minor Outlying Islands
 * * `US` - United States of America
 * * `UY` - Uruguay
 * * `UZ` - Uzbekistan
 * * `VU` - Vanuatu
 * * `VE` - Venezuela
 * * `VN` - Vietnam
 * * `VG` - Virgin Islands (British)
 * * `VI` - Virgin Islands (U.S.)
 * * `WF` - Wallis and Futuna
 * * `EH` - Western Sahara
 * * `YE` - Yemen
 * * `ZM` - Zambia
 * * `ZW` - Zimbabwe
 */
export enum PangeaLegalResidenceCountryEnum {
  AF = 'AF',
  AX = 'AX',
  AL = 'AL',
  DZ = 'DZ',
  AS = 'AS',
  AD = 'AD',
  AO = 'AO',
  AI = 'AI',
  AQ = 'AQ',
  AG = 'AG',
  AR = 'AR',
  AM = 'AM',
  AW = 'AW',
  AU = 'AU',
  AT = 'AT',
  AZ = 'AZ',
  BS = 'BS',
  BH = 'BH',
  BD = 'BD',
  BB = 'BB',
  BY = 'BY',
  BE = 'BE',
  BZ = 'BZ',
  BJ = 'BJ',
  BM = 'BM',
  BT = 'BT',
  BO = 'BO',
  BQ = 'BQ',
  BA = 'BA',
  BW = 'BW',
  BV = 'BV',
  BR = 'BR',
  IO = 'IO',
  BN = 'BN',
  BG = 'BG',
  BF = 'BF',
  BI = 'BI',
  CV = 'CV',
  KH = 'KH',
  CM = 'CM',
  CA = 'CA',
  KY = 'KY',
  CF = 'CF',
  TD = 'TD',
  CL = 'CL',
  CN = 'CN',
  CX = 'CX',
  CC = 'CC',
  CO = 'CO',
  KM = 'KM',
  CG = 'CG',
  CD = 'CD',
  CK = 'CK',
  CR = 'CR',
  CI = 'CI',
  HR = 'HR',
  CU = 'CU',
  CW = 'CW',
  CY = 'CY',
  CZ = 'CZ',
  DK = 'DK',
  DJ = 'DJ',
  DM = 'DM',
  DO = 'DO',
  EC = 'EC',
  EG = 'EG',
  SV = 'SV',
  GQ = 'GQ',
  ER = 'ER',
  EE = 'EE',
  SZ = 'SZ',
  ET = 'ET',
  FK = 'FK',
  FO = 'FO',
  FJ = 'FJ',
  FI = 'FI',
  FR = 'FR',
  GF = 'GF',
  PF = 'PF',
  TF = 'TF',
  GA = 'GA',
  GM = 'GM',
  GE = 'GE',
  DE = 'DE',
  GH = 'GH',
  GI = 'GI',
  GR = 'GR',
  GL = 'GL',
  GD = 'GD',
  GP = 'GP',
  GU = 'GU',
  GT = 'GT',
  GG = 'GG',
  GN = 'GN',
  GW = 'GW',
  GY = 'GY',
  HT = 'HT',
  HM = 'HM',
  VA = 'VA',
  HN = 'HN',
  HK = 'HK',
  HU = 'HU',
  IS = 'IS',
  IN = 'IN',
  ID = 'ID',
  IR = 'IR',
  IQ = 'IQ',
  IE = 'IE',
  IM = 'IM',
  IL = 'IL',
  IT = 'IT',
  JM = 'JM',
  JP = 'JP',
  JE = 'JE',
  JO = 'JO',
  KZ = 'KZ',
  KE = 'KE',
  KI = 'KI',
  KW = 'KW',
  KG = 'KG',
  LA = 'LA',
  LV = 'LV',
  LB = 'LB',
  LS = 'LS',
  LR = 'LR',
  LY = 'LY',
  LI = 'LI',
  LT = 'LT',
  LU = 'LU',
  MO = 'MO',
  MG = 'MG',
  MW = 'MW',
  MY = 'MY',
  MV = 'MV',
  ML = 'ML',
  MT = 'MT',
  MH = 'MH',
  MQ = 'MQ',
  MR = 'MR',
  MU = 'MU',
  YT = 'YT',
  MX = 'MX',
  FM = 'FM',
  MD = 'MD',
  MC = 'MC',
  MN = 'MN',
  ME = 'ME',
  MS = 'MS',
  MA = 'MA',
  MZ = 'MZ',
  MM = 'MM',
  NA = 'NA',
  NR = 'NR',
  NP = 'NP',
  NL = 'NL',
  NC = 'NC',
  NZ = 'NZ',
  NI = 'NI',
  NE = 'NE',
  NG = 'NG',
  NU = 'NU',
  NF = 'NF',
  KP = 'KP',
  MK = 'MK',
  MP = 'MP',
  NO = 'NO',
  OM = 'OM',
  PK = 'PK',
  PW = 'PW',
  PS = 'PS',
  PA = 'PA',
  PG = 'PG',
  PY = 'PY',
  PE = 'PE',
  PH = 'PH',
  PN = 'PN',
  PL = 'PL',
  PT = 'PT',
  PR = 'PR',
  QA = 'QA',
  RE = 'RE',
  RO = 'RO',
  RU = 'RU',
  RW = 'RW',
  BL = 'BL',
  SH = 'SH',
  KN = 'KN',
  LC = 'LC',
  MF = 'MF',
  PM = 'PM',
  VC = 'VC',
  WS = 'WS',
  SM = 'SM',
  ST = 'ST',
  SA = 'SA',
  SN = 'SN',
  RS = 'RS',
  SC = 'SC',
  SL = 'SL',
  SG = 'SG',
  SX = 'SX',
  SK = 'SK',
  SI = 'SI',
  SB = 'SB',
  SO = 'SO',
  ZA = 'ZA',
  GS = 'GS',
  KR = 'KR',
  SS = 'SS',
  ES = 'ES',
  LK = 'LK',
  SD = 'SD',
  SR = 'SR',
  SJ = 'SJ',
  SE = 'SE',
  CH = 'CH',
  SY = 'SY',
  TW = 'TW',
  TJ = 'TJ',
  TZ = 'TZ',
  TH = 'TH',
  TL = 'TL',
  TG = 'TG',
  TK = 'TK',
  TO = 'TO',
  TT = 'TT',
  TN = 'TN',
  TR = 'TR',
  TM = 'TM',
  TC = 'TC',
  TV = 'TV',
  UG = 'UG',
  UA = 'UA',
  AE = 'AE',
  GB = 'GB',
  UM = 'UM',
  US = 'US',
  UY = 'UY',
  UZ = 'UZ',
  VU = 'VU',
  VE = 'VE',
  VN = 'VN',
  VG = 'VG',
  VI = 'VI',
  WF = 'WF',
  EH = 'EH',
  YE = 'YE',
  ZM = 'ZM',
  ZW = 'ZW',
}

/**
 * * `AL` - Alabama
 * * `AK` - Alaska
 * * `AS` - American Samoa
 * * `AZ` - Arizona
 * * `AR` - Arkansas
 * * `AA` - Armed Forces Americas
 * * `AE` - Armed Forces Europe
 * * `AP` - Armed Forces Pacific
 * * `CA` - California
 * * `CO` - Colorado
 * * `CT` - Connecticut
 * * `DE` - Delaware
 * * `DC` - District of Columbia
 * * `FL` - Florida
 * * `GA` - Georgia
 * * `GU` - Guam
 * * `HI` - Hawaii
 * * `ID` - Idaho
 * * `IL` - Illinois
 * * `IN` - Indiana
 * * `IA` - Iowa
 * * `KS` - Kansas
 * * `KY` - Kentucky
 * * `LA` - Louisiana
 * * `ME` - Maine
 * * `MD` - Maryland
 * * `MA` - Massachusetts
 * * `MI` - Michigan
 * * `MN` - Minnesota
 * * `MS` - Mississippi
 * * `MO` - Missouri
 * * `MT` - Montana
 * * `NE` - Nebraska
 * * `NV` - Nevada
 * * `NH` - New Hampshire
 * * `NJ` - New Jersey
 * * `NM` - New Mexico
 * * `NY` - New York
 * * `NC` - North Carolina
 * * `ND` - North Dakota
 * * `MP` - Northern Mariana Islands
 * * `OH` - Ohio
 * * `OK` - Oklahoma
 * * `OR` - Oregon
 * * `PA` - Pennsylvania
 * * `PR` - Puerto Rico
 * * `RI` - Rhode Island
 * * `SC` - South Carolina
 * * `SD` - South Dakota
 * * `TN` - Tennessee
 * * `TX` - Texas
 * * `UT` - Utah
 * * `VT` - Vermont
 * * `VI` - Virgin Islands
 * * `VA` - Virginia
 * * `WA` - Washington
 * * `WV` - West Virginia
 * * `WI` - Wisconsin
 * * `WY` - Wyoming
 */
export enum PangeaLegalResidenceStateEnum {
  AL = 'AL',
  AK = 'AK',
  AS = 'AS',
  AZ = 'AZ',
  AR = 'AR',
  AA = 'AA',
  AE = 'AE',
  AP = 'AP',
  CA = 'CA',
  CO = 'CO',
  CT = 'CT',
  DE = 'DE',
  DC = 'DC',
  FL = 'FL',
  GA = 'GA',
  GU = 'GU',
  HI = 'HI',
  ID = 'ID',
  IL = 'IL',
  IN = 'IN',
  IA = 'IA',
  KS = 'KS',
  KY = 'KY',
  LA = 'LA',
  ME = 'ME',
  MD = 'MD',
  MA = 'MA',
  MI = 'MI',
  MN = 'MN',
  MS = 'MS',
  MO = 'MO',
  MT = 'MT',
  NE = 'NE',
  NV = 'NV',
  NH = 'NH',
  NJ = 'NJ',
  NM = 'NM',
  NY = 'NY',
  NC = 'NC',
  ND = 'ND',
  MP = 'MP',
  OH = 'OH',
  OK = 'OK',
  OR = 'OR',
  PA = 'PA',
  PR = 'PR',
  RI = 'RI',
  SC = 'SC',
  SD = 'SD',
  TN = 'TN',
  TX = 'TX',
  UT = 'UT',
  VT = 'VT',
  VI = 'VI',
  VA = 'VA',
  WA = 'WA',
  WV = 'WV',
  WI = 'WI',
  WY = 'WY',
}

export interface PangeaLink {
  rel: string;
  /** @format uri */
  uri: string;
  method: string;
}

export interface PangeaLiquidHours {
  id: number;
  /** @format date-time */
  date: string;
  /** @format date-time */
  start_date?: string | null;
  /** @format date-time */
  end_date?: string | null;
  is_closed?: boolean;
  data_cut: number;
  future_contract: number;
}

export interface PangeaLiquidityDetail {
  liquidity_status: string | null;
  /** @format date-time */
  time: string;
  market_status: string;
  /** @format double */
  spread_in_bps?: number | null;
}

export interface PangeaLiquidityInsight {
  liquidity: string;
}

export interface PangeaLiquidityInsightRequest {
  sell_currency: string;
  buy_currency: string;
  /** @format date-time */
  start_date?: string | null;
  /** @format date-time */
  end_date?: string | null;
}

export interface PangeaLiquidityInsightResponse {
  market: string;
  insight_data: PangeaLiquidityDetail[];
  recommended_execution?: PangeaLiquidityDetail | null;
}

export interface PangeaListBankFacet {
  regions: PangeaFacet[];
  cities: PangeaFacet[];
}

export interface PangeaListBankResponse {
  data: PangeaListBankResponseData;
  facets: PangeaListBankFacet;
}

export interface PangeaListBankResponseData {
  pagination: PangeaPagination;
  links: PangeaLink[];
  sorting: PangeaSorting[];
  rows: PangeaListBankRow[];
}

export interface PangeaListBankRow {
  primary_key: string;
  institution_name: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  country: string;
  country_iso: string;
  postal_code: string;
  swift_bic: string;
  national_bank_code: string;
  national_bank_code_type: string;
  office_type: string;
  branch_name: string;
  phone: string;
  fax: string;
}

export interface PangeaListBeneficiaryFacets {
  curr: PangeaFacet[];
  methods: PangeaFacet[];
  countries: PangeaFacet[];
  status: PangeaFacet[];
}

export interface PangeaListBeneficiaryResponse {
  data: PangeaListBeneficiaryResponseData;
  facets: PangeaListBeneficiaryFacets;
  is_beneficiary_approval_required: boolean;
}

export interface PangeaListBeneficiaryResponseData {
  pagination: PangeaPagination;
  links: PangeaLink[];
  sorting: PangeaSorting[];
  rows: PangeaListBeneficiaryRow[];
  withdraw_total?: number;
}

export interface PangeaListBeneficiaryRow {
  bank_city: string;
  bank_country_iso: string;
  bank_name: string;
  payee_city: string;
  payee_country_iso: string;
  payee_country: string;
  /** @format uuid */
  id: string;
  client_code: string;
  client_integration_id: string;
  curr: string;
  /** @format email */
  email?: string;
  methods: PangeaValueSet[];
  payee: string;
  payment_ref: string;
  phone: string;
  /** @format date-time */
  entry_date: string;
  status: PangeaValueSet[];
  links: PangeaLink[];
}

export interface PangeaMFAActiveUserMethod {
  name: string;
  is_primary: boolean;
}

export interface PangeaMFAConfigViewSuccessResponse {
  methods: string[];
  confirm_disable_with_code: boolean;
  confirm_regeneration_with_code: boolean;
  allow_backup_codes_regeneration: boolean;
}

export interface PangeaMFAFirstStepJWTMFAEnabledSuccessResponse {
  ephemeral_token: string;
  method: string;
}

export interface PangeaMFAFirstStepJWTRequest {
  username: string;
  password: string;
}

export type PangeaMFAFirstStepJWTSuccess =
  | PangeaMFAFirstStepJWTMFAEnabledSuccessResponse
  | PangeaMFAJWTAccessRefreshResponse;

export interface PangeaMFAJWTAccessRefreshResponse {
  access: string;
  refresh: string;
}

export interface PangeaMFAMethodActivationErrorResponse {
  error: string;
}

export interface PangeaMFAMethodBackupCodeSuccessResponse {
  backup_codes: string[];
}

export interface PangeaMFAMethodCodeErrorResponse {
  error: string;
}

export interface PangeaMFAMethodCodeRequest {
  code: string;
}

export interface PangeaMFAMethodDetailsResponse {
  details: string;
}

export interface PangeaMFAMethodPrimaryMethodChangeRequest {
  method: string;
  code: string;
}

export interface PangeaMFAMethodRequestCodeRequest {
  method: string;
}

export interface PangeaMFASecondStepJWTRequest {
  ephemeral_token: string;
  code: string;
}

export interface PangeaManualRequest {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /** @format uuid */
  external_id?: string;
  /** @format date-time */
  expiration_time?: string | null;
  /**
   * * `pending` - Pending
   * * `expired` - Expired
   * * `complete` - Complete
   * * `canceled` - Canceled
   */
  status?: PangeaManualRequestStatusEnum;
  market_name?: string | null;
  side?: string | null;
  instrument_type?: string | null;
  action?: string | null;
  exec_broker?: string | null;
  clearing_broker?: string | null;
  /** @format double */
  amount?: number | null;
  on_behalf_of?: string | null;
  /** @format double */
  fee?: number | null;
  /**
   * * `15min` - 15min
   * * `1hour` - 1hour
   * * `day` - day
   * * `gtc` - gtc
   */
  time_in_force?: PangeaManualRequestTimeInForceEnum;
  /** @format date */
  value_date?: string | null;
  /** @format date */
  fixing_date?: string | null;
  /** @format date */
  far_value_date?: string | null;
  /** @format date */
  far_fixing_date?: string | null;
  /** @format double */
  ref_rate?: number | null;
  /** @format double */
  fwd_points?: number | null;
  /** @format double */
  booked_rate?: number | null;
  /** @format double */
  booked_all_in_rate?: number | null;
  /** @format double */
  booked_amount?: number | null;
  /** @format double */
  booked_cntr_amount?: number | null;
  /** @format double */
  booked_premium?: number | null;
  /** @maxLength 256 */
  broker_id?: string | null;
  /** @maxLength 40 */
  exec_user?: string | null;
  /** @maxLength 100 */
  slack_channel?: string | null;
  /** @maxLength 100 */
  slack_ts?: string | null;
  text?: string | null;
  exec_text?: string | null;
  /** @maxLength 100 */
  email_status?: string | null;
  victor_ops_id?: string | null;
  /** @format date-time */
  last_reminder_sent?: string | null;
  slack_form_link?: string | null;
  sell_currency: number;
  buy_currency: number;
  ticket: number;
  lock_side: number;
}

/**
 * * `pending` - Pending
 * * `expired` - Expired
 * * `complete` - Complete
 * * `canceled` - Canceled
 */
export enum PangeaManualRequestStatusEnum {
  Pending = 'pending',
  Expired = 'expired',
  Complete = 'complete',
  Canceled = 'canceled',
}

/**
 * * `15min` - 15min
 * * `1hour` - 1hour
 * * `day` - day
 * * `gtc` - gtc
 */
export enum PangeaManualRequestTimeInForceEnum {
  Value15Min = '15min',
  Value1Hour = '1hour',
  Day = 'day',
  Gtc = 'gtc',
}

/**
 * Margin and fee request object.
 *
 * If the draft is associated with a live cashflow then this is an edit of an existing cashflow and the account id
 * will be ignored.
 *
 * If on the other hand the draft is not associated with a live cashflow then the account id must be specified.
 */
export interface PangeaMarginAndFeeRequest {
  draft_ids?: number[];
  deleted_cashflow_ids?: number[];
  account_id?: number;
  hedge_settings?: PangeaHedgeSettings;
}

/** Margin and fees response object. */
export interface PangeaMarginAndFeesResponse {
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  margin_required: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  margin_available: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  cashflow_total_value: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  last_maturity_days: string;
  num_cashflows: number;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  previous_daily_aum: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  previous_rolling_aum: string;
  /**
   * Fee detail serializer.
   *
   * This is the fee detail with the cost of hedging a specific cashflow.
   */
  fee_detail: PangeaFeeDetail;
  fee_details: PangeaFeeDetails;
}

/**
 * * `CASH` - Cash
 * * `MARGIN` - Margin
 * * `REGT` - RegT
 * * `PORTFOLIOMARGIN` - PortfolioMargin
 */
export enum PangeaMarginEnum {
  CASH = 'CASH',
  MARGIN = 'MARGIN',
  REGT = 'REGT',
  PORTFOLIOMARGIN = 'PORTFOLIOMARGIN',
}

/**
 * A request to calculate the margin health for a company.
 *
 * If the custom_amount us provided, it will be used to calculate the margin health. Otherwise, the margin health will
 *  be calculated for the recommended amount.
 */
export interface PangeaMarginHealthRequest {
  /** @format double */
  custom_amount?: number;
}

/**
 * Margin health response object.
 *
 * It represents the margin health over the next 30 days.
 */
export interface PangeaMarginHealthResponse {
  /** @format double */
  margin_balance: number;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  recommended_deposit?: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  recommended_withdrawl?: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  minimum_deposit?: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  maximum_withdrawl?: string;
  margins: PangeaMarginRequirement[];
  ach_deposit_date: string;
  wire_deposit_date: string;
  deposit_history: PangeaDeposit[];
}

/** An object representing the margin requirement for a given date. */
export interface PangeaMarginRequirement {
  date: string;
  /**
   * The margin amount
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  amount: string;
  /** @format double */
  health_score: number;
  /** @format double */
  health_score_after_deposit: number;
  /** @format double */
  health_score_hypothetical: number;
  /**
   * @format decimal
   * @pattern ^-?\d{0,18}(?:\.\d{0,2})?$
   */
  total_hedging: string;
}

export interface PangeaMarketLiquidityInsight {
  market: string;
  insight_data: PangeaLiquidityDetail[];
  is_ndf: boolean | null;
  fwd_rfq_type: string | null;
}

export interface PangeaMarketName {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
}

export interface PangeaMarketRate {
  /** @format double */
  ask: number;
  /** @format double */
  bid: number;
  /** @format double */
  mid: number;
  date: string;
}

export interface PangeaMarketSpotDate {
  pair: string;
  /** @format date */
  spot_date: string;
  /** @format date-time */
  executable_time: string;
}

export interface PangeaMarketSpotDateRequest {
  pairs: string[];
}

export interface PangeaMarketSpotDates {
  spot_dates: PangeaMarketSpotDate[];
}

export interface PangeaMarketVolatility {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /**
   * The date when the transaction will settle. Defaults to the following business day if settlement cannot occur on the provided value_date.
   * @default "SPOT"
   */
  value_date?: string;
}

export interface PangeaMarketsLiquidityResponse {
  data: PangeaMarketLiquidityInsight[];
}

/**
 * * `ON` - ON
 * * `TN` - TN
 * * `spot` - Spot
 * * `SN` - SN
 * * `SW` - SW
 * * `1W` - 1W
 * * `2W` - 2W
 * * `3W` - 3W
 * * `1M` - 1M
 * * `2M` - 2M
 * * `3M` - 3M
 * * `4M` - 4M
 * * `5M` - 5M
 * * `6M` - 6M
 * * `7M` - 7M
 * * `8M` - 8M
 * * `9M` - 9M
 * * `1Y` - 1Y
 * * `IMM1` - IMM1
 * * `IMM2` - IMM2
 * * `IMM3` - IMM3
 * * `IMM4` - IMM4
 * * `EOM1` - EOM1
 * * `EOM2` - EOM2
 * * `EOM3` - EOM3
 * * `EOM4` - EOM4
 * * `EOM5` - EOM5
 * * `EOM6` - EOM6
 * * `EOM7` - EOM7
 * * `EOM8` - EOM8
 * * `EOM9` - EOM9
 * * `EOM10` - EOM10
 * * `EOM11` - EOM11
 * * `EOM12` - EOM12
 */
export enum PangeaMaxTenorEnum {
  ON = 'ON',
  TN = 'TN',
  Spot = 'spot',
  SN = 'SN',
  SW = 'SW',
  Value1W = '1W',
  Value2W = '2W',
  Value3W = '3W',
  Value1M = '1M',
  Value2M = '2M',
  Value3M = '3M',
  Value4M = '4M',
  Value5M = '5M',
  Value6M = '6M',
  Value7M = '7M',
  Value8M = '8M',
  Value9M = '9M',
  Value1Y = '1Y',
  IMM1 = 'IMM1',
  IMM2 = 'IMM2',
  IMM3 = 'IMM3',
  IMM4 = 'IMM4',
  EOM1 = 'EOM1',
  EOM2 = 'EOM2',
  EOM3 = 'EOM3',
  EOM4 = 'EOM4',
  EOM5 = 'EOM5',
  EOM6 = 'EOM6',
  EOM7 = 'EOM7',
  EOM8 = 'EOM8',
  EOM9 = 'EOM9',
  EOM10 = 'EOM10',
  EOM11 = 'EOM11',
  EOM12 = 'EOM12',
}

export interface PangeaMessage {
  message: string;
}

export interface PangeaMessageResponse {
  message: string;
}

export interface PangeaMethod {
  id: string;
  text: string;
}

export interface PangeaMultiDay {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  dates: string[];
  /** @default "modified_follow" */
  rule?: PangeaRuleEnum;
}

export interface PangeaNotificationEvent {
  id: number;
  type: string;
  /** @maxLength 255 */
  name: string;
  /** @maxLength 255 */
  key: string;
}

export enum PangeaNullEnum {
  null,
}

export interface PangeaOnboardingFileUploadRequest {
  client_onboarding_id: string;
  title?: string | null;
  /** @format uri */
  file: string;
}

export interface PangeaOnboardingFileUploadResponse {
  message: string;
}

export interface PangeaOnboardingPickListItem {
  id: string;
  name: string;
  string_value: string;
}

export interface PangeaOnboardingPickListResponse {
  annual_volume_range_list?: PangeaOnboardingPickListItem[];
  applicant_type_list?: PangeaOnboardingPickListItem[];
  business_type_list?: PangeaOnboardingPickListItem[];
  purpose_of_transaction_list?: PangeaOnboardingPickListItem[];
  trade_volume_range_list?: PangeaOnboardingPickListItem[];
  nature_of_business_list?: PangeaOnboardingPickListItem[];
}

export interface PangeaOnboardingRequest {
  company_name: string;
  company_street_address: string;
  company_city: string;
  company_postal_code: string;
  company_country_code: string;
  business_contact_number: string;
  /** @format email */
  business_confirmation_email: string;
  formation_incorporation_country_code: string;
  business_registration_incorporation_number: string;
  application_type_id: string;
  nature_of_business: string;
  purpose_of_transaction_id: string;
  currency_needed: string[];
  trade_volume: string;
  annual_volume: string;
  fund_destination_countries: string[];
  fund_source_countries: string[];
  /** @default [] */
  company_directors?: PangeaCompanyDirectors[];
  any_individual_own_25_percent_or_more: boolean;
  provide_truthful_information: boolean;
  agree_to_terms_and_condition: boolean;
  consent_to_privacy_notice: boolean;
  authorized_to_bind_client_to_agreement: boolean;
  signer_full_name: string;
  /** @format date */
  signer_date_of_birth: string;
  signer_job_title: string;
  /** @format email */
  signer_email: string;
  signer_complete_residential_address: string;
  is_account_owner: boolean;
  account_owner_first_name?: string | null;
  account_owner_last_name?: string | null;
  /** @format email */
  account_owner_email?: string | null;
  account_owner_phone?: string | null;
  dba_or_registered_tradename?: string | null;
  company_state?: string | null;
  /** @format email */
  business_confirmation_email_2?: string | null;
  is_publicly_traded?: boolean;
  stock_symbol?: string | null;
  formation_incorporation_state?: string | null;
  tax_id_ein_number?: string | null;
  business_type_id?: string | null;
  website_url?: string | null;
  owned_by_other_corporate_entity?: boolean;
  owned_by_public_traded_company?: boolean;
  /** @default [] */
  beneficial_owners?: PangeaBeneficialOwner[];
  second_signer_full_name?: string | null;
  /** @format date */
  second_signer_date_of_birth?: string;
  second_signer_job_title?: string | null;
  second_signer_complete_residential_address?: string | null;
  service_interested_in: PangeaServiceInterestedInEnum[];
}

export interface PangeaOnboardingResponse {
  client_onboarding_id: string;
  message: string;
}

/**
 * * `Multiply` - Multiply
 * * `Divide` - Divide
 */
export enum PangeaOperationEnum {
  Multiply = 'Multiply',
  Divide = 'Divide',
}

export interface PangeaPaginatedActivityList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaActivity[];
}

export interface PangeaPaginatedBankStatementList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaBankStatement[];
}

export interface PangeaPaginatedBeneficiaryList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaBeneficiary[];
}

export interface PangeaPaginatedCashFlowGeneratorList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaCashFlowGenerator[];
}

export interface PangeaPaginatedCashflowList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaCashflow[];
}

export interface PangeaPaginatedCompanyContactOrderList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaCompanyContactOrder[];
}

export interface PangeaPaginatedCompanyFXBalanceAccountHistoryList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaCompanyFXBalanceAccountHistory[];
}

export interface PangeaPaginatedCompanyJoinRequestList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaCompanyJoinRequest[];
}

export interface PangeaPaginatedCorPayFxForwardList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaCorPayFxForward[];
}

export interface PangeaPaginatedCorPayFxSpotList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaCorPayFxSpot[];
}

export interface PangeaPaginatedCurrencyDefinitionList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaCurrencyDefinition[];
}

export interface PangeaPaginatedCurrencyDeliveryList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaCurrencyDelivery[];
}

export interface PangeaPaginatedDraftCashflowList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaDraftCashflow[];
}

export interface PangeaPaginatedDraftFxForwardList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaDraftFxForward[];
}

export interface PangeaPaginatedEventGroupList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaEventGroup[];
}

export interface PangeaPaginatedEventList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaEvent[];
}

export interface PangeaPaginatedFXBalanceAccountHistoryRowList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaFXBalanceAccountHistoryRow[];
}

export interface PangeaPaginatedFeesPaymentsList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaFeesPayments[];
}

export interface PangeaPaginatedFundingRequestList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaFundingRequest[];
}

export interface PangeaPaginatedFxForwardList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaFxForward[];
}

export interface PangeaPaginatedFxPairList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaFxPair[];
}

export interface PangeaPaginatedFxSpotIntraList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaFxSpotIntra[];
}

export interface PangeaPaginatedFxSpotList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaFxSpot[];
}

export interface PangeaPaginatedIndexList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaIndex[];
}

export interface PangeaPaginatedInstallmentList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaInstallment[];
}

export interface PangeaPaginatedLiquidHoursList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaLiquidHours[];
}

export interface PangeaPaginatedNotificationEventList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaNotificationEvent[];
}

export interface PangeaPaginatedPaymentList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaPayment[];
}

export interface PangeaPaginatedSupportedFxPairsList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaSupportedFxPairs[];
}

export interface PangeaPaginatedTicketList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaTicket[];
}

export interface PangeaPaginatedTradeList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaTrade[];
}

export interface PangeaPaginatedTradingCalendarList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaTradingCalendar[];
}

export interface PangeaPaginatedTradingHoursList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaTradingHours[];
}

export interface PangeaPaginatedUserNotificationList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaUserNotification[];
}

export interface PangeaPaginatedWalletList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaWallet[];
}

export interface PangeaPaginatedWebhookList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaWebhook[];
}

export interface PangeaPaginatedWireInstructionList {
  /** @example 123 */
  count: number;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null;
  results: PangeaWireInstruction[];
}

export interface PangeaPagination {
  total: number;
  skip: number;
  take: number;
}

export interface PangeaParachuteData {
  id: number;
  account: number;
  /** @format double */
  lower_limit: number;
  /**
   * @format double
   * @default 0.97
   */
  lower_p?: number;
  /**
   * @format double
   * @default 0.97
   */
  upper_p?: number;
  /** @default false */
  lock_lower_limit?: boolean;
  /** @format double */
  floating_pnl_fraction?: number;
  /** @default false */
  safeguard?: boolean;
}

export interface PangeaParachuteDataRequest {
  /** @format double */
  lower_limit: number;
  /**
   * @format double
   * @default 0.97
   */
  lower_p?: number;
  /**
   * @format double
   * @default 0.97
   */
  upper_p?: number;
  /** @default false */
  lock_lower_limit?: boolean;
  /** @format double */
  floating_pnl_fraction?: number;
  /** @default false */
  safeguard?: boolean;
}

export interface PangeaParachuteHedgeMetricResponse {
  /** @format double */
  potential_loss_mitigated: number;
  /** @format double */
  return_risk_ratio?: number | null;
  /** @format double */
  hedge_efficiency_ratio: number;
}

export interface PangeaParachuteWhatIfResponse {
  credit_usage: PangeaCreditUsageResponse;
  rate: PangeaRateResponse;
  fee: PangeaFeeResponse[];
  hedge_metric: PangeaParachuteHedgeMetricResponse;
}

export interface PangeaPasswordToken {
  password: string;
  token: string;
}

export interface PangeaPatchedAutopilotData {
  id?: number;
  account?: number;
  /** @format double */
  upper_limit?: number;
  /** @format double */
  lower_limit?: number;
}

export interface PangeaPatchedBeneficiary {
  /**
   * Unique identifier of the beneficiary
   * @format uuid
   */
  beneficiary_id?: string;
  /**
   * Beneficiary account type
   *
   * * `individual` - Individual
   * * `corporate` - Corporate
   */
  beneficiary_account_type?: PangeaBeneficiaryAccountTypeEnum;
  /**
   * This field accepts the <a href="https://docs.pangea.io/reference/currency-and-country-codes"> ISO-2 country code</a>
   * @maxLength 2
   */
  destination_country?: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  destination_currency?: string;
  /** Payment methods */
  payment_methods?: PangeaPaymentDeliveryMethodEnum[];
  /** Settlement methods */
  settlement_methods?: PangeaPaymentDeliveryMethodEnum[];
  /**
   * Preferred payment method
   *
   * * `local` - Local
   * * `swift` - Swift
   * * `wallet` - Wallet
   * * `card` - Card
   * * `proxy` - Proxy
   */
  preferred_method?:
    | PangeaPaymentDeliveryMethodEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Payment reference */
  payment_reference?: string | null;
  /** Full name of the account holder. Maximum 100 characters. */
  beneficiary_name?: string;
  /** Beneficiary alias */
  beneficiary_alias?: string | null;
  /** Ex: 123 Main St. */
  beneficiary_address_1?: string | null;
  /** Ex: Apt. #4 */
  beneficiary_address_2?: string | null;
  /**
   * The beneficiary's country. This field accepts the <a href="https://docs.pangea.io/reference/currency-and-country-codes"> ISO-2 country code</a>
   * @maxLength 2
   */
  beneficiary_country?: string;
  /** State, Province, etc. */
  beneficiary_region?: string;
  /** Postal code */
  beneficiary_postal?: string;
  /** City */
  beneficiary_city?: string;
  /** Phone number with country code, eg. +1-415-333-4444 */
  beneficiary_phone?: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  beneficiary_email?: string | null;
  /**
   * Classification of the beneficiary
   *
   * * `individual` - Individual
   * * `business` - Business
   * * `aerospace_defense` - Aerospace and defense
   * * `agriculture_agrifood` - Agriculture and agric-food
   * * `apparel_clothing` - Apparel / Clothing
   * * `automotive_trucking` - Automotive / Trucking
   * * `books_magazines` - Books / Magazines
   * * `broadcasting` - Broadcasting
   * * `building_products` - Building products
   * * `chemicals` - Chemicals
   * * `dairy` - Dairy
   * * `e_business` - E-business
   * * `educational_institute` - Educational Institutes
   * * `environment` - Environment
   * * `explosives` - Explosives
   * * `fisheries_oceans` - Fisheries and oceans
   * * `food_beverage_distribution` - Food / Beverage distribution
   * * `footwear` - Footwear
   * * `forest_industries` - Forest industries
   * * `furniture` - Furniture
   * * `giftware_crafts` - Giftware and crafts
   * * `horticulture` - Horticulture
   * * `hydroelectric_energy` - Hydroelectric energy
   * * `ict` - Information and communication technologies
   * * `intelligent_systems` - Intelligent systems
   * * `livestock` - Livestock
   * * `medical_devices` - Medical devices
   * * `medical_treatment` - Medical treatment
   * * `minerals_metals_mining` - Minerals, metals and mining
   * * `oil_gas` - Oil and gas
   * * `pharmaceuticals_biopharmaceuticals` - Pharmaceuticals and biopharmaceuticals
   * * `plastics` - Plastics
   * * `poultry_eggs` - Poultry and eggs
   * * `printing_publishing` - Printing / Publishing
   * * `product_design_development` - Product design and development
   * * `railway` - Railway
   * * `retail` - Retail
   * * `shipping_industrial_marine` - Shipping and industrial marine
   * * `soil` - Soil
   * * `sound_recording` - Sound recording
   * * `sporting_goods` - Sporting goods
   * * `telecommunications_equipment` - Telecommunications equipment
   * * `television` - Television
   * * `textiles` - Textiles
   * * `tourism` - Tourism
   * * `trademakrs_law` - Trademarks / Law
   * * `water_supply` - Water supply
   * * `wholesale` - Wholesale
   */
  classification?: PangeaClassificationEnum;
  /**
   * Date of birth
   * @format date
   */
  date_of_birth?: string | null;
  /**
   * Type of identification document
   *
   * * `passport` - Passport
   * * `national_id` - National ID
   * * `driving_license` - Driving License
   * * `others` - Others
   * * `cpf` - CPF
   * * `cnpj` - CNPJ
   */
  identification_type?: PangeaIdentificationTypeEnum | PangeaBlankEnum;
  /**
   * Identification document number
   * @maxLength 50
   */
  identification_value?: string;
  /**
   * Bank account type
   *
   * * `current` - Current
   * * `saving` - Saving
   * * `maestra` - Maestra
   * * `checking` - Checking
   */
  bank_account_type?:
    | PangeaBankAccountTypeEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Bank code */
  bank_code?: string | null;
  /** Bank account number, IBAN, etc. */
  bank_account_number?: string;
  /**
   * Bank account number type
   *
   * * `iban` - IBAN
   * * `clabe` - CLABE
   * * `account_number` - Account Number
   */
  bank_account_number_type?: PangeaBankAccountNumberTypeEnum;
  /** Bank name */
  bank_name?: string;
  /**
   * This field accepts the <a href="https://docs.pangea.io/reference/currency-and-country-codes"> ISO-2 country code</a>
   * @maxLength 2
   */
  bank_country?: string;
  /** State, Province, etc. */
  bank_region?: string | null;
  /** Bank city */
  bank_city?: string;
  /** Bank postal code */
  bank_postal?: string | null;
  /** Bank address line 1 */
  bank_address_1?: string;
  /** Bank address line 2 */
  bank_address_2?: string | null;
  /** Bank Branch Name */
  bank_branch_name?: string | null;
  /** Wiring instruction */
  bank_instruction?: string | null;
  /** Bank routing code 1 */
  bank_routing_code_value_1?: string | null;
  /**
   * Bank Routing Code 1 Type
   *
   * * `swift` - SWIFT
   * * `ifsc` - IFSC
   * * `sort_code` - SORT Code
   * * `ach_code` - ACH Code
   * * `branch_code` - Branch Code
   * * `bsb_code` - BSB Code
   * * `bank_code` - Bank Code
   * * `aba_code` - ABA Code
   * * `transit_code` - Transit Code
   * * `generic` - Generic
   * * `wallet` - Wallet
   * * `location_id` - Location ID
   * * `branch_name` - Branch Name
   * * `cnaps` - CNAPS
   * * `fedwire` - Fedwire
   * * `interac` - Interac
   * * `check` - Check
   */
  bank_routing_code_type_1?:
    | PangeaInterBankRoutingCodeType2Enum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Bank routing code 2 */
  bank_routing_code_value_2?: string | null;
  /**
   * Bank Routing Code 2 Type
   *
   * * `swift` - SWIFT
   * * `ifsc` - IFSC
   * * `sort_code` - SORT Code
   * * `ach_code` - ACH Code
   * * `branch_code` - Branch Code
   * * `bsb_code` - BSB Code
   * * `bank_code` - Bank Code
   * * `aba_code` - ABA Code
   * * `transit_code` - Transit Code
   * * `generic` - Generic
   * * `wallet` - Wallet
   * * `location_id` - Location ID
   * * `branch_name` - Branch Name
   * * `cnaps` - CNAPS
   * * `fedwire` - Fedwire
   * * `interac` - Interac
   * * `check` - Check
   */
  bank_routing_code_type_2?:
    | PangeaInterBankRoutingCodeType2Enum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Bank routing code 3 */
  bank_routing_code_value_3?: string | null;
  /**
   * Bank Routing Code 3 Type
   *
   * * `swift` - SWIFT
   * * `ifsc` - IFSC
   * * `sort_code` - SORT Code
   * * `ach_code` - ACH Code
   * * `branch_code` - Branch Code
   * * `bsb_code` - BSB Code
   * * `bank_code` - Bank Code
   * * `aba_code` - ABA Code
   * * `transit_code` - Transit Code
   * * `generic` - Generic
   * * `wallet` - Wallet
   * * `location_id` - Location ID
   * * `branch_name` - Branch Name
   * * `cnaps` - CNAPS
   * * `fedwire` - Fedwire
   * * `interac` - Interac
   * * `check` - Check
   */
  bank_routing_code_type_3?:
    | PangeaInterBankRoutingCodeType2Enum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /**
   * Bank account type
   *
   * * `current` - Current
   * * `saving` - Saving
   * * `maestra` - Maestra
   * * `checking` - Checking
   */
  inter_bank_account_type?:
    | PangeaInterBankAccountTypeEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Intermediary bank code */
  inter_bank_code?: string | null;
  /** Intermediary bank account number */
  inter_bank_account_number?: string | null;
  /**
   * Intermediary bank account number type
   *
   * * `iban` - IBAN
   * * `clabe` - CLABE
   * * `account_number` - Account Number
   */
  inter_bank_account_number_type?:
    | PangeaInterBankAccountNumberTypeEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Intermediary Bank name */
  inter_bank_name?: string | null;
  /** Intermediary Bank country */
  inter_bank_country?: string | null;
  /** Intermediary Bank region */
  inter_bank_region?: string | null;
  /** Intermediary Bank city */
  inter_bank_city?: string | null;
  /** Intermediary Bank postal code */
  inter_bank_postal?: string | null;
  /** Intermediary Bank address line 1 */
  inter_bank_address_1?: string | null;
  /** Intermediary Bank address line 2 */
  inter_bank_address_2?: string | null;
  /** Intermediary Bank Branch Name */
  inter_bank_branch_name?: string | null;
  /** Intermediary Bank instruction */
  inter_bank_instruction?: string | null;
  /** Intermediary bank Routing Code 1 */
  inter_bank_routing_code_value_1?: string | null;
  /**
   * Intermediary bank Routing Code 1 Type
   *
   * * `swift` - SWIFT
   * * `ifsc` - IFSC
   * * `sort_code` - SORT Code
   * * `ach_code` - ACH Code
   * * `branch_code` - Branch Code
   * * `bsb_code` - BSB Code
   * * `bank_code` - Bank Code
   * * `aba_code` - ABA Code
   * * `transit_code` - Transit Code
   * * `generic` - Generic
   * * `wallet` - Wallet
   * * `location_id` - Location ID
   * * `branch_name` - Branch Name
   * * `cnaps` - CNAPS
   * * `fedwire` - Fedwire
   * * `interac` - Interac
   * * `check` - Check
   */
  inter_bank_routing_code_type_1?:
    | PangeaInterBankRoutingCodeType2Enum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /** Intermediary bank routing code 2 */
  inter_bank_routing_code_value_2?: string | null;
  /**
   * Intermediary bank Routing Code 2 Type
   *
   * * `swift` - SWIFT
   * * `ifsc` - IFSC
   * * `sort_code` - SORT Code
   * * `ach_code` - ACH Code
   * * `branch_code` - Branch Code
   * * `bsb_code` - BSB Code
   * * `bank_code` - Bank Code
   * * `aba_code` - ABA Code
   * * `transit_code` - Transit Code
   * * `generic` - Generic
   * * `wallet` - Wallet
   * * `location_id` - Location ID
   * * `branch_name` - Branch Name
   * * `cnaps` - CNAPS
   * * `fedwire` - Fedwire
   * * `interac` - Interac
   * * `check` - Check
   */
  inter_bank_routing_code_type_2?:
    | PangeaInterBankRoutingCodeType2Enum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /**
   * This field accepts the <a href="https://docs.pangea.io/reference/currency-and-country-codes"> ISO-2 country code</a>
   * @maxLength 2
   */
  client_legal_entity?: string;
  /**
   * Beneficiary default payment purpose
   *
   * * `1` - Intercompany Payment
   * * `2` - Purchase/Sale of Goods
   * * `3` - Purchase/Sale of Services
   * * `4` - Personnel Payment
   * * `5` - Financial Transaction
   * * `6` - Other
   * @min -2147483648
   * @max 2147483647
   */
  default_purpose?: PangeaDefaultPurposeEnum;
  /** Please be specific, eg. “This company is a supplier of leather goods. Each month we pay this company for wallets and belts” */
  default_purpose_description?: string | null;
  /**
   * The proxy type sent in the payment request
   *
   * * `mobile` - Mobile
   * * `uen` - UEN
   * * `nric` - NRIC
   * * `vpa` - VPA
   * * `id` - ID
   * * `email` - Email
   * * `random_key` - Random Key
   * * `abn` - ABN
   * * `organization_id` - Organisation ID
   * * `passport` - Passport
   * * `corporate_registration_number` - Corporate Registration Number
   * * `army_id` - Army ID
   */
  proxy_type?: PangeaProxyTypeEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /** The proxy value such as VPA, UEN, or mobile number etc. */
  proxy_value?: string | null;
  /** Further name */
  further_name?: string | null;
  /** Further account number */
  further_account_number?: string | null;
  /**
   * The status of the beneficiary
   *
   * * `draft` - Draft
   * * `pending` - Pending
   * * `approved` - Approved
   * * `synced` - Synced
   * * `pending_update` - Pending Update
   * * `pending_delete` - Pending Delete
   * * `deleted` - Deleted
   * * `partially_synced` - Partially Synced
   * * `partially_deleted` - Partially Deleted
   */
  status?: PangeaBeneficiaryStatusEnum;
  /** Additional broker-specific fields as key-value pairs */
  additional_fields?: any;
  /** The fields and corresponding values needed to satisfy regulatory requirements for the destination country. */
  regulatory?: any;
  brokers?: PangeaBroker[];
}

/**
 * A serializer for the DraftCashFlow model.
 *
 * Note that date fields should be be in the format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
 */
export interface PangeaPatchedCashFlowGenerator {
  /**
   * The unique ID of the cashflow
   * @format uuid
   */
  cashflow_id?: string;
  status?: string;
  /**
   * A name for the cashflow
   * @maxLength 255
   */
  name?: string | null;
  /** A description of the cashflow */
  description?: string | null;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency?: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency?: string;
  /** ISO 4217 Standard 3-Letter Currency Code used to indicate which amount you are defining the value of. The non-lock_side amount will be calculated. */
  lock_side?: string;
  /**
   * The amount of the cashflow
   * @format double
   */
  amount?: number | null;
  /**
   * The date when the transaction will settle. Defaults to the following business day if settlement cannot occur on the provided value_date.
   * @format date
   */
  value_date?: string | null;
  /** “true” = cashflow is a draft, “false” = cashflow is approved and executable */
  is_draft?: boolean;
  /** @format date-time */
  created?: string;
  /** @format date-time */
  modified?: string;
}

export interface PangeaPatchedCompany {
  id?: number;
  currency?: string;
  status?: string;
  /**
   * * `Africa/Abidjan` - Africa/Abidjan
   * * `Africa/Accra` - Africa/Accra
   * * `Africa/Addis_Ababa` - Africa/Addis_Ababa
   * * `Africa/Algiers` - Africa/Algiers
   * * `Africa/Asmara` - Africa/Asmara
   * * `Africa/Bamako` - Africa/Bamako
   * * `Africa/Bangui` - Africa/Bangui
   * * `Africa/Banjul` - Africa/Banjul
   * * `Africa/Bissau` - Africa/Bissau
   * * `Africa/Blantyre` - Africa/Blantyre
   * * `Africa/Brazzaville` - Africa/Brazzaville
   * * `Africa/Bujumbura` - Africa/Bujumbura
   * * `Africa/Cairo` - Africa/Cairo
   * * `Africa/Casablanca` - Africa/Casablanca
   * * `Africa/Ceuta` - Africa/Ceuta
   * * `Africa/Conakry` - Africa/Conakry
   * * `Africa/Dakar` - Africa/Dakar
   * * `Africa/Dar_es_Salaam` - Africa/Dar_es_Salaam
   * * `Africa/Djibouti` - Africa/Djibouti
   * * `Africa/Douala` - Africa/Douala
   * * `Africa/El_Aaiun` - Africa/El_Aaiun
   * * `Africa/Freetown` - Africa/Freetown
   * * `Africa/Gaborone` - Africa/Gaborone
   * * `Africa/Harare` - Africa/Harare
   * * `Africa/Johannesburg` - Africa/Johannesburg
   * * `Africa/Juba` - Africa/Juba
   * * `Africa/Kampala` - Africa/Kampala
   * * `Africa/Khartoum` - Africa/Khartoum
   * * `Africa/Kigali` - Africa/Kigali
   * * `Africa/Kinshasa` - Africa/Kinshasa
   * * `Africa/Lagos` - Africa/Lagos
   * * `Africa/Libreville` - Africa/Libreville
   * * `Africa/Lome` - Africa/Lome
   * * `Africa/Luanda` - Africa/Luanda
   * * `Africa/Lubumbashi` - Africa/Lubumbashi
   * * `Africa/Lusaka` - Africa/Lusaka
   * * `Africa/Malabo` - Africa/Malabo
   * * `Africa/Maputo` - Africa/Maputo
   * * `Africa/Maseru` - Africa/Maseru
   * * `Africa/Mbabane` - Africa/Mbabane
   * * `Africa/Mogadishu` - Africa/Mogadishu
   * * `Africa/Monrovia` - Africa/Monrovia
   * * `Africa/Nairobi` - Africa/Nairobi
   * * `Africa/Ndjamena` - Africa/Ndjamena
   * * `Africa/Niamey` - Africa/Niamey
   * * `Africa/Nouakchott` - Africa/Nouakchott
   * * `Africa/Ouagadougou` - Africa/Ouagadougou
   * * `Africa/Porto-Novo` - Africa/Porto-Novo
   * * `Africa/Sao_Tome` - Africa/Sao_Tome
   * * `Africa/Tripoli` - Africa/Tripoli
   * * `Africa/Tunis` - Africa/Tunis
   * * `Africa/Windhoek` - Africa/Windhoek
   * * `America/Adak` - America/Adak
   * * `America/Anchorage` - America/Anchorage
   * * `America/Anguilla` - America/Anguilla
   * * `America/Antigua` - America/Antigua
   * * `America/Araguaina` - America/Araguaina
   * * `America/Argentina/Buenos_Aires` - America/Argentina/Buenos_Aires
   * * `America/Argentina/Catamarca` - America/Argentina/Catamarca
   * * `America/Argentina/Cordoba` - America/Argentina/Cordoba
   * * `America/Argentina/Jujuy` - America/Argentina/Jujuy
   * * `America/Argentina/La_Rioja` - America/Argentina/La_Rioja
   * * `America/Argentina/Mendoza` - America/Argentina/Mendoza
   * * `America/Argentina/Rio_Gallegos` - America/Argentina/Rio_Gallegos
   * * `America/Argentina/Salta` - America/Argentina/Salta
   * * `America/Argentina/San_Juan` - America/Argentina/San_Juan
   * * `America/Argentina/San_Luis` - America/Argentina/San_Luis
   * * `America/Argentina/Tucuman` - America/Argentina/Tucuman
   * * `America/Argentina/Ushuaia` - America/Argentina/Ushuaia
   * * `America/Aruba` - America/Aruba
   * * `America/Asuncion` - America/Asuncion
   * * `America/Atikokan` - America/Atikokan
   * * `America/Bahia` - America/Bahia
   * * `America/Bahia_Banderas` - America/Bahia_Banderas
   * * `America/Barbados` - America/Barbados
   * * `America/Belem` - America/Belem
   * * `America/Belize` - America/Belize
   * * `America/Blanc-Sablon` - America/Blanc-Sablon
   * * `America/Boa_Vista` - America/Boa_Vista
   * * `America/Bogota` - America/Bogota
   * * `America/Boise` - America/Boise
   * * `America/Cambridge_Bay` - America/Cambridge_Bay
   * * `America/Campo_Grande` - America/Campo_Grande
   * * `America/Cancun` - America/Cancun
   * * `America/Caracas` - America/Caracas
   * * `America/Cayenne` - America/Cayenne
   * * `America/Cayman` - America/Cayman
   * * `America/Chicago` - America/Chicago
   * * `America/Chihuahua` - America/Chihuahua
   * * `America/Ciudad_Juarez` - America/Ciudad_Juarez
   * * `America/Costa_Rica` - America/Costa_Rica
   * * `America/Creston` - America/Creston
   * * `America/Cuiaba` - America/Cuiaba
   * * `America/Curacao` - America/Curacao
   * * `America/Danmarkshavn` - America/Danmarkshavn
   * * `America/Dawson` - America/Dawson
   * * `America/Dawson_Creek` - America/Dawson_Creek
   * * `America/Denver` - America/Denver
   * * `America/Detroit` - America/Detroit
   * * `America/Dominica` - America/Dominica
   * * `America/Edmonton` - America/Edmonton
   * * `America/Eirunepe` - America/Eirunepe
   * * `America/El_Salvador` - America/El_Salvador
   * * `America/Fort_Nelson` - America/Fort_Nelson
   * * `America/Fortaleza` - America/Fortaleza
   * * `America/Glace_Bay` - America/Glace_Bay
   * * `America/Goose_Bay` - America/Goose_Bay
   * * `America/Grand_Turk` - America/Grand_Turk
   * * `America/Grenada` - America/Grenada
   * * `America/Guadeloupe` - America/Guadeloupe
   * * `America/Guatemala` - America/Guatemala
   * * `America/Guayaquil` - America/Guayaquil
   * * `America/Guyana` - America/Guyana
   * * `America/Halifax` - America/Halifax
   * * `America/Havana` - America/Havana
   * * `America/Hermosillo` - America/Hermosillo
   * * `America/Indiana/Indianapolis` - America/Indiana/Indianapolis
   * * `America/Indiana/Knox` - America/Indiana/Knox
   * * `America/Indiana/Marengo` - America/Indiana/Marengo
   * * `America/Indiana/Petersburg` - America/Indiana/Petersburg
   * * `America/Indiana/Tell_City` - America/Indiana/Tell_City
   * * `America/Indiana/Vevay` - America/Indiana/Vevay
   * * `America/Indiana/Vincennes` - America/Indiana/Vincennes
   * * `America/Indiana/Winamac` - America/Indiana/Winamac
   * * `America/Inuvik` - America/Inuvik
   * * `America/Iqaluit` - America/Iqaluit
   * * `America/Jamaica` - America/Jamaica
   * * `America/Juneau` - America/Juneau
   * * `America/Kentucky/Louisville` - America/Kentucky/Louisville
   * * `America/Kentucky/Monticello` - America/Kentucky/Monticello
   * * `America/Kralendijk` - America/Kralendijk
   * * `America/La_Paz` - America/La_Paz
   * * `America/Lima` - America/Lima
   * * `America/Los_Angeles` - America/Los_Angeles
   * * `America/Lower_Princes` - America/Lower_Princes
   * * `America/Maceio` - America/Maceio
   * * `America/Managua` - America/Managua
   * * `America/Manaus` - America/Manaus
   * * `America/Marigot` - America/Marigot
   * * `America/Martinique` - America/Martinique
   * * `America/Matamoros` - America/Matamoros
   * * `America/Mazatlan` - America/Mazatlan
   * * `America/Menominee` - America/Menominee
   * * `America/Merida` - America/Merida
   * * `America/Metlakatla` - America/Metlakatla
   * * `America/Mexico_City` - America/Mexico_City
   * * `America/Miquelon` - America/Miquelon
   * * `America/Moncton` - America/Moncton
   * * `America/Monterrey` - America/Monterrey
   * * `America/Montevideo` - America/Montevideo
   * * `America/Montserrat` - America/Montserrat
   * * `America/Nassau` - America/Nassau
   * * `America/New_York` - America/New_York
   * * `America/Nome` - America/Nome
   * * `America/Noronha` - America/Noronha
   * * `America/North_Dakota/Beulah` - America/North_Dakota/Beulah
   * * `America/North_Dakota/Center` - America/North_Dakota/Center
   * * `America/North_Dakota/New_Salem` - America/North_Dakota/New_Salem
   * * `America/Nuuk` - America/Nuuk
   * * `America/Ojinaga` - America/Ojinaga
   * * `America/Panama` - America/Panama
   * * `America/Paramaribo` - America/Paramaribo
   * * `America/Phoenix` - America/Phoenix
   * * `America/Port-au-Prince` - America/Port-au-Prince
   * * `America/Port_of_Spain` - America/Port_of_Spain
   * * `America/Porto_Velho` - America/Porto_Velho
   * * `America/Puerto_Rico` - America/Puerto_Rico
   * * `America/Punta_Arenas` - America/Punta_Arenas
   * * `America/Rankin_Inlet` - America/Rankin_Inlet
   * * `America/Recife` - America/Recife
   * * `America/Regina` - America/Regina
   * * `America/Resolute` - America/Resolute
   * * `America/Rio_Branco` - America/Rio_Branco
   * * `America/Santarem` - America/Santarem
   * * `America/Santiago` - America/Santiago
   * * `America/Santo_Domingo` - America/Santo_Domingo
   * * `America/Sao_Paulo` - America/Sao_Paulo
   * * `America/Scoresbysund` - America/Scoresbysund
   * * `America/Sitka` - America/Sitka
   * * `America/St_Barthelemy` - America/St_Barthelemy
   * * `America/St_Johns` - America/St_Johns
   * * `America/St_Kitts` - America/St_Kitts
   * * `America/St_Lucia` - America/St_Lucia
   * * `America/St_Thomas` - America/St_Thomas
   * * `America/St_Vincent` - America/St_Vincent
   * * `America/Swift_Current` - America/Swift_Current
   * * `America/Tegucigalpa` - America/Tegucigalpa
   * * `America/Thule` - America/Thule
   * * `America/Tijuana` - America/Tijuana
   * * `America/Toronto` - America/Toronto
   * * `America/Tortola` - America/Tortola
   * * `America/Vancouver` - America/Vancouver
   * * `America/Whitehorse` - America/Whitehorse
   * * `America/Winnipeg` - America/Winnipeg
   * * `America/Yakutat` - America/Yakutat
   * * `Antarctica/Casey` - Antarctica/Casey
   * * `Antarctica/Davis` - Antarctica/Davis
   * * `Antarctica/DumontDUrville` - Antarctica/DumontDUrville
   * * `Antarctica/Macquarie` - Antarctica/Macquarie
   * * `Antarctica/Mawson` - Antarctica/Mawson
   * * `Antarctica/McMurdo` - Antarctica/McMurdo
   * * `Antarctica/Palmer` - Antarctica/Palmer
   * * `Antarctica/Rothera` - Antarctica/Rothera
   * * `Antarctica/Syowa` - Antarctica/Syowa
   * * `Antarctica/Troll` - Antarctica/Troll
   * * `Antarctica/Vostok` - Antarctica/Vostok
   * * `Arctic/Longyearbyen` - Arctic/Longyearbyen
   * * `Asia/Aden` - Asia/Aden
   * * `Asia/Almaty` - Asia/Almaty
   * * `Asia/Amman` - Asia/Amman
   * * `Asia/Anadyr` - Asia/Anadyr
   * * `Asia/Aqtau` - Asia/Aqtau
   * * `Asia/Aqtobe` - Asia/Aqtobe
   * * `Asia/Ashgabat` - Asia/Ashgabat
   * * `Asia/Atyrau` - Asia/Atyrau
   * * `Asia/Baghdad` - Asia/Baghdad
   * * `Asia/Bahrain` - Asia/Bahrain
   * * `Asia/Baku` - Asia/Baku
   * * `Asia/Bangkok` - Asia/Bangkok
   * * `Asia/Barnaul` - Asia/Barnaul
   * * `Asia/Beirut` - Asia/Beirut
   * * `Asia/Bishkek` - Asia/Bishkek
   * * `Asia/Brunei` - Asia/Brunei
   * * `Asia/Chita` - Asia/Chita
   * * `Asia/Colombo` - Asia/Colombo
   * * `Asia/Damascus` - Asia/Damascus
   * * `Asia/Dhaka` - Asia/Dhaka
   * * `Asia/Dili` - Asia/Dili
   * * `Asia/Dubai` - Asia/Dubai
   * * `Asia/Dushanbe` - Asia/Dushanbe
   * * `Asia/Famagusta` - Asia/Famagusta
   * * `Asia/Gaza` - Asia/Gaza
   * * `Asia/Hebron` - Asia/Hebron
   * * `Asia/Ho_Chi_Minh` - Asia/Ho_Chi_Minh
   * * `Asia/Hong_Kong` - Asia/Hong_Kong
   * * `Asia/Hovd` - Asia/Hovd
   * * `Asia/Irkutsk` - Asia/Irkutsk
   * * `Asia/Jakarta` - Asia/Jakarta
   * * `Asia/Jayapura` - Asia/Jayapura
   * * `Asia/Jerusalem` - Asia/Jerusalem
   * * `Asia/Kabul` - Asia/Kabul
   * * `Asia/Kamchatka` - Asia/Kamchatka
   * * `Asia/Karachi` - Asia/Karachi
   * * `Asia/Kathmandu` - Asia/Kathmandu
   * * `Asia/Khandyga` - Asia/Khandyga
   * * `Asia/Kolkata` - Asia/Kolkata
   * * `Asia/Krasnoyarsk` - Asia/Krasnoyarsk
   * * `Asia/Kuala_Lumpur` - Asia/Kuala_Lumpur
   * * `Asia/Kuching` - Asia/Kuching
   * * `Asia/Kuwait` - Asia/Kuwait
   * * `Asia/Macau` - Asia/Macau
   * * `Asia/Magadan` - Asia/Magadan
   * * `Asia/Makassar` - Asia/Makassar
   * * `Asia/Manila` - Asia/Manila
   * * `Asia/Muscat` - Asia/Muscat
   * * `Asia/Nicosia` - Asia/Nicosia
   * * `Asia/Novokuznetsk` - Asia/Novokuznetsk
   * * `Asia/Novosibirsk` - Asia/Novosibirsk
   * * `Asia/Omsk` - Asia/Omsk
   * * `Asia/Oral` - Asia/Oral
   * * `Asia/Phnom_Penh` - Asia/Phnom_Penh
   * * `Asia/Pontianak` - Asia/Pontianak
   * * `Asia/Pyongyang` - Asia/Pyongyang
   * * `Asia/Qatar` - Asia/Qatar
   * * `Asia/Qostanay` - Asia/Qostanay
   * * `Asia/Qyzylorda` - Asia/Qyzylorda
   * * `Asia/Riyadh` - Asia/Riyadh
   * * `Asia/Sakhalin` - Asia/Sakhalin
   * * `Asia/Samarkand` - Asia/Samarkand
   * * `Asia/Seoul` - Asia/Seoul
   * * `Asia/Shanghai` - Asia/Shanghai
   * * `Asia/Singapore` - Asia/Singapore
   * * `Asia/Srednekolymsk` - Asia/Srednekolymsk
   * * `Asia/Taipei` - Asia/Taipei
   * * `Asia/Tashkent` - Asia/Tashkent
   * * `Asia/Tbilisi` - Asia/Tbilisi
   * * `Asia/Tehran` - Asia/Tehran
   * * `Asia/Thimphu` - Asia/Thimphu
   * * `Asia/Tokyo` - Asia/Tokyo
   * * `Asia/Tomsk` - Asia/Tomsk
   * * `Asia/Ulaanbaatar` - Asia/Ulaanbaatar
   * * `Asia/Urumqi` - Asia/Urumqi
   * * `Asia/Ust-Nera` - Asia/Ust-Nera
   * * `Asia/Vientiane` - Asia/Vientiane
   * * `Asia/Vladivostok` - Asia/Vladivostok
   * * `Asia/Yakutsk` - Asia/Yakutsk
   * * `Asia/Yangon` - Asia/Yangon
   * * `Asia/Yekaterinburg` - Asia/Yekaterinburg
   * * `Asia/Yerevan` - Asia/Yerevan
   * * `Atlantic/Azores` - Atlantic/Azores
   * * `Atlantic/Bermuda` - Atlantic/Bermuda
   * * `Atlantic/Canary` - Atlantic/Canary
   * * `Atlantic/Cape_Verde` - Atlantic/Cape_Verde
   * * `Atlantic/Faroe` - Atlantic/Faroe
   * * `Atlantic/Madeira` - Atlantic/Madeira
   * * `Atlantic/Reykjavik` - Atlantic/Reykjavik
   * * `Atlantic/South_Georgia` - Atlantic/South_Georgia
   * * `Atlantic/St_Helena` - Atlantic/St_Helena
   * * `Atlantic/Stanley` - Atlantic/Stanley
   * * `Australia/Adelaide` - Australia/Adelaide
   * * `Australia/Brisbane` - Australia/Brisbane
   * * `Australia/Broken_Hill` - Australia/Broken_Hill
   * * `Australia/Darwin` - Australia/Darwin
   * * `Australia/Eucla` - Australia/Eucla
   * * `Australia/Hobart` - Australia/Hobart
   * * `Australia/Lindeman` - Australia/Lindeman
   * * `Australia/Lord_Howe` - Australia/Lord_Howe
   * * `Australia/Melbourne` - Australia/Melbourne
   * * `Australia/Perth` - Australia/Perth
   * * `Australia/Sydney` - Australia/Sydney
   * * `Canada/Atlantic` - Canada/Atlantic
   * * `Canada/Central` - Canada/Central
   * * `Canada/Eastern` - Canada/Eastern
   * * `Canada/Mountain` - Canada/Mountain
   * * `Canada/Newfoundland` - Canada/Newfoundland
   * * `Canada/Pacific` - Canada/Pacific
   * * `Europe/Amsterdam` - Europe/Amsterdam
   * * `Europe/Andorra` - Europe/Andorra
   * * `Europe/Astrakhan` - Europe/Astrakhan
   * * `Europe/Athens` - Europe/Athens
   * * `Europe/Belgrade` - Europe/Belgrade
   * * `Europe/Berlin` - Europe/Berlin
   * * `Europe/Bratislava` - Europe/Bratislava
   * * `Europe/Brussels` - Europe/Brussels
   * * `Europe/Bucharest` - Europe/Bucharest
   * * `Europe/Budapest` - Europe/Budapest
   * * `Europe/Busingen` - Europe/Busingen
   * * `Europe/Chisinau` - Europe/Chisinau
   * * `Europe/Copenhagen` - Europe/Copenhagen
   * * `Europe/Dublin` - Europe/Dublin
   * * `Europe/Gibraltar` - Europe/Gibraltar
   * * `Europe/Guernsey` - Europe/Guernsey
   * * `Europe/Helsinki` - Europe/Helsinki
   * * `Europe/Isle_of_Man` - Europe/Isle_of_Man
   * * `Europe/Istanbul` - Europe/Istanbul
   * * `Europe/Jersey` - Europe/Jersey
   * * `Europe/Kaliningrad` - Europe/Kaliningrad
   * * `Europe/Kirov` - Europe/Kirov
   * * `Europe/Kyiv` - Europe/Kyiv
   * * `Europe/Lisbon` - Europe/Lisbon
   * * `Europe/Ljubljana` - Europe/Ljubljana
   * * `Europe/London` - Europe/London
   * * `Europe/Luxembourg` - Europe/Luxembourg
   * * `Europe/Madrid` - Europe/Madrid
   * * `Europe/Malta` - Europe/Malta
   * * `Europe/Mariehamn` - Europe/Mariehamn
   * * `Europe/Minsk` - Europe/Minsk
   * * `Europe/Monaco` - Europe/Monaco
   * * `Europe/Moscow` - Europe/Moscow
   * * `Europe/Oslo` - Europe/Oslo
   * * `Europe/Paris` - Europe/Paris
   * * `Europe/Podgorica` - Europe/Podgorica
   * * `Europe/Prague` - Europe/Prague
   * * `Europe/Riga` - Europe/Riga
   * * `Europe/Rome` - Europe/Rome
   * * `Europe/Samara` - Europe/Samara
   * * `Europe/San_Marino` - Europe/San_Marino
   * * `Europe/Sarajevo` - Europe/Sarajevo
   * * `Europe/Saratov` - Europe/Saratov
   * * `Europe/Simferopol` - Europe/Simferopol
   * * `Europe/Skopje` - Europe/Skopje
   * * `Europe/Sofia` - Europe/Sofia
   * * `Europe/Stockholm` - Europe/Stockholm
   * * `Europe/Tallinn` - Europe/Tallinn
   * * `Europe/Tirane` - Europe/Tirane
   * * `Europe/Ulyanovsk` - Europe/Ulyanovsk
   * * `Europe/Vaduz` - Europe/Vaduz
   * * `Europe/Vatican` - Europe/Vatican
   * * `Europe/Vienna` - Europe/Vienna
   * * `Europe/Vilnius` - Europe/Vilnius
   * * `Europe/Volgograd` - Europe/Volgograd
   * * `Europe/Warsaw` - Europe/Warsaw
   * * `Europe/Zagreb` - Europe/Zagreb
   * * `Europe/Zurich` - Europe/Zurich
   * * `GMT` - GMT
   * * `Indian/Antananarivo` - Indian/Antananarivo
   * * `Indian/Chagos` - Indian/Chagos
   * * `Indian/Christmas` - Indian/Christmas
   * * `Indian/Cocos` - Indian/Cocos
   * * `Indian/Comoro` - Indian/Comoro
   * * `Indian/Kerguelen` - Indian/Kerguelen
   * * `Indian/Mahe` - Indian/Mahe
   * * `Indian/Maldives` - Indian/Maldives
   * * `Indian/Mauritius` - Indian/Mauritius
   * * `Indian/Mayotte` - Indian/Mayotte
   * * `Indian/Reunion` - Indian/Reunion
   * * `Pacific/Apia` - Pacific/Apia
   * * `Pacific/Auckland` - Pacific/Auckland
   * * `Pacific/Bougainville` - Pacific/Bougainville
   * * `Pacific/Chatham` - Pacific/Chatham
   * * `Pacific/Chuuk` - Pacific/Chuuk
   * * `Pacific/Easter` - Pacific/Easter
   * * `Pacific/Efate` - Pacific/Efate
   * * `Pacific/Fakaofo` - Pacific/Fakaofo
   * * `Pacific/Fiji` - Pacific/Fiji
   * * `Pacific/Funafuti` - Pacific/Funafuti
   * * `Pacific/Galapagos` - Pacific/Galapagos
   * * `Pacific/Gambier` - Pacific/Gambier
   * * `Pacific/Guadalcanal` - Pacific/Guadalcanal
   * * `Pacific/Guam` - Pacific/Guam
   * * `Pacific/Honolulu` - Pacific/Honolulu
   * * `Pacific/Kanton` - Pacific/Kanton
   * * `Pacific/Kiritimati` - Pacific/Kiritimati
   * * `Pacific/Kosrae` - Pacific/Kosrae
   * * `Pacific/Kwajalein` - Pacific/Kwajalein
   * * `Pacific/Majuro` - Pacific/Majuro
   * * `Pacific/Marquesas` - Pacific/Marquesas
   * * `Pacific/Midway` - Pacific/Midway
   * * `Pacific/Nauru` - Pacific/Nauru
   * * `Pacific/Niue` - Pacific/Niue
   * * `Pacific/Norfolk` - Pacific/Norfolk
   * * `Pacific/Noumea` - Pacific/Noumea
   * * `Pacific/Pago_Pago` - Pacific/Pago_Pago
   * * `Pacific/Palau` - Pacific/Palau
   * * `Pacific/Pitcairn` - Pacific/Pitcairn
   * * `Pacific/Pohnpei` - Pacific/Pohnpei
   * * `Pacific/Port_Moresby` - Pacific/Port_Moresby
   * * `Pacific/Rarotonga` - Pacific/Rarotonga
   * * `Pacific/Saipan` - Pacific/Saipan
   * * `Pacific/Tahiti` - Pacific/Tahiti
   * * `Pacific/Tarawa` - Pacific/Tarawa
   * * `Pacific/Tongatapu` - Pacific/Tongatapu
   * * `Pacific/Wake` - Pacific/Wake
   * * `Pacific/Wallis` - Pacific/Wallis
   * * `US/Alaska` - US/Alaska
   * * `US/Arizona` - US/Arizona
   * * `US/Central` - US/Central
   * * `US/Eastern` - US/Eastern
   * * `US/Hawaii` - US/Hawaii
   * * `US/Mountain` - US/Mountain
   * * `US/Pacific` - US/Pacific
   * * `UTC` - UTC
   */
  timezone?: PangeaTimezoneEnum;
  broker_accounts?: PangeaBrokerAccount[];
  acct_company?: PangeaAccountCompany[];
  ibkr_application?: PangeaIbkrApplication[];
  rep?: PangeaCompanyRep;
  show_pnl_graph?: boolean;
  settings?: PangeaCompanySettings;
  /** @maxLength 255 */
  name?: string;
  /** @maxLength 255 */
  legal_name?: string | null;
  /** @maxLength 128 */
  phone?: string | null;
  /** @maxLength 255 */
  address_1?: string | null;
  /** @maxLength 255 */
  address_2?: string | null;
  /** @maxLength 255 */
  city?: string | null;
  state?: PangeaStateEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /** @maxLength 10 */
  zip_code?: string | null;
  /** @maxLength 255 */
  region?: string | null;
  /** @maxLength 255 */
  postal?: string | null;
  country?: PangeaCountryEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /** @maxLength 255 */
  ein?: string | null;
  /** @maxLength 255 */
  domain?: string | null;
  nonprofit?: boolean;
  /** Client Services Agreement Signed */
  onboarded?: boolean;
  /** @format date-time */
  created?: string;
  /** @maxLength 255 */
  stripe_customer_id?: string | null;
  /** @maxLength 255 */
  stripe_setup_intent_id?: string | null;
  /**
   * @format int64
   * @min -9223372036854776000
   * @max 9223372036854776000
   */
  hs_company_id?: number | null;
  service_interested_in?:
    | PangeaServiceInterestedInEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  estimated_aum?:
    | PangeaEstimatedAumEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  account_owner?: number | null;
  recipients?: number[];
}

/**
 * A serializer for the DraftCashFlow model.
 *
 * Note that date fields should be be in the format YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
 */
export interface PangeaPatchedDraftCashflow {
  id?: number;
  /** @format date-time */
  date?: string;
  /** @format date-time */
  end_date?: string | null;
  currency?: string;
  /** @format double */
  amount?: number;
  /** @format date-time */
  created?: string;
  /** @format date-time */
  modified?: string;
  /** @maxLength 60 */
  name?: string | null;
  description?: string | null;
  periodicity?: string | null;
  calendar?: PangeaCalendarEnum | PangeaBlankEnum | PangeaNullEnum | null;
  roll_convention?:
    | PangeaRollConventionEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  installment_id?: number | null;
  /**
   * Returns the id of the cashflow this draft is associated with.
   * :param draft: The draft object.
   * :return: The id of the cashflow this draft is associated with if this cashflow is associated with one.
   */
  cashflow_id?: number | null;
  account_id?: number | null;
  /**
   * * `CREATE` - CREATE
   * * `UPDATE` - UPDATE
   * * `DELETE` - DELETE
   */
  action?: PangeaDraftCashflowActionEnum;
  /** @default false */
  is_forward?: boolean;
  draft_fx_forward_id?: number | null;
  /** @format double */
  indicative_rate?: number | null;
  /** @format double */
  indicative_base_amount?: number | null;
  /** @format double */
  indicative_cntr_amount?: number | null;
  /** @format double */
  booked_rate?: number;
  /** @format double */
  booked_base_amount?: number;
  /** @format double */
  booked_cntr_amount?: number;
}

export interface PangeaPatchedDraftFxForward {
  id?: number;
  status?: string;
  /** @format double */
  risk_reduction?: number;
  fxpair?: string;
  draft_cashflow?: number | null;
  cashflow?: number | null;
  installment?: number | null;
  origin_account?: string | null;
  destination_account?: string | null;
  destination_account_type?:
    | PangeaInstructDealRequestDeliveryMethodEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  cash_settle_account?: string | null;
  funding_account?: string | null;
  /** @default false */
  is_cash_settle?: boolean;
  purpose_of_payment?: string | null;
  /** @format double */
  estimated_fx_forward_price?: number;
  company?: number;
}

export interface PangeaPatchedManualRequest {
  id?: number;
  /** @format date-time */
  created?: string;
  /** @format date-time */
  modified?: string;
  /** @format uuid */
  external_id?: string;
  /** @format date-time */
  expiration_time?: string | null;
  /**
   * * `pending` - Pending
   * * `expired` - Expired
   * * `complete` - Complete
   * * `canceled` - Canceled
   */
  status?: PangeaManualRequestStatusEnum;
  market_name?: string | null;
  side?: string | null;
  instrument_type?: string | null;
  action?: string | null;
  exec_broker?: string | null;
  clearing_broker?: string | null;
  /** @format double */
  amount?: number | null;
  on_behalf_of?: string | null;
  /** @format double */
  fee?: number | null;
  /**
   * * `15min` - 15min
   * * `1hour` - 1hour
   * * `day` - day
   * * `gtc` - gtc
   */
  time_in_force?: PangeaManualRequestTimeInForceEnum;
  /** @format date */
  value_date?: string | null;
  /** @format date */
  fixing_date?: string | null;
  /** @format date */
  far_value_date?: string | null;
  /** @format date */
  far_fixing_date?: string | null;
  /** @format double */
  ref_rate?: number | null;
  /** @format double */
  fwd_points?: number | null;
  /** @format double */
  booked_rate?: number | null;
  /** @format double */
  booked_all_in_rate?: number | null;
  /** @format double */
  booked_amount?: number | null;
  /** @format double */
  booked_cntr_amount?: number | null;
  /** @format double */
  booked_premium?: number | null;
  /** @maxLength 256 */
  broker_id?: string | null;
  /** @maxLength 40 */
  exec_user?: string | null;
  /** @maxLength 100 */
  slack_channel?: string | null;
  /** @maxLength 100 */
  slack_ts?: string | null;
  text?: string | null;
  exec_text?: string | null;
  /** @maxLength 100 */
  email_status?: string | null;
  victor_ops_id?: string | null;
  /** @format date-time */
  last_reminder_sent?: string | null;
  slack_form_link?: string | null;
  sell_currency?: number;
  buy_currency?: number;
  ticket?: number;
  lock_side?: number;
}

export interface PangeaPatchedParachuteData {
  id?: number;
  account?: number;
  /** @format double */
  lower_limit?: number;
  /**
   * @format double
   * @default 0.97
   */
  lower_p?: number;
  /**
   * @format double
   * @default 0.97
   */
  upper_p?: number;
  /** @default false */
  lock_lower_limit?: boolean;
  /** @format double */
  floating_pnl_fraction?: number;
  /** @default false */
  safeguard?: boolean;
}

export interface PangeaPatchedUpdateUserPermissionGroup {
  /** @default "customer_viewer" */
  group?: PangeaGroupEnum;
}

export interface PangeaPatchedUserNotification {
  id?: number;
  email?: boolean;
  sms?: boolean;
  phone?: boolean;
  user?: number;
  event?: number;
}

export interface PangeaPatchedUserUpdate {
  /** @format email */
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  /** @default "UTC" */
  timezone?: PangeaTimezoneEnum | PangeaBlankEnum;
}

export interface PangeaPatchedWallet {
  /**
   * Unique identifier of the wallet
   * @format uuid
   */
  wallet_id?: string;
  /** The company the wallet belongs to */
  company?: number;
  broker?: PangeaBroker;
  /** The external wallet identifier */
  external_id?: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  currency?: string;
  /**
   * The name of the wallet
   * @maxLength 100
   */
  name?: string | null;
  /** A description of the wallet */
  description?: string | null;
  /**
   * The account number associated with the wallet
   * @maxLength 100
   */
  account_number?: string | null;
  /**
   * The name of the bank associated with the wallet
   * @maxLength 200
   */
  bank_name?: string | null;
  /**
   * The status of the wallet
   *
   * * `active` - Active
   * * `inactive` - Inactive
   * * `suspended` - Suspended
   * * `closed` - Closed
   * * `pending` - Pending
   */
  status?: PangeaWalletStatusEnum;
  /**
   * The type of the wallet
   *
   * * `settlement` - Settlement
   * * `wallet` - Wallet
   * * `virtual_account` - Virtual Account
   * * `managed` - Managed
   */
  type?: PangeaWalletTypeEnum;
  method?: PangeaWalletMethodEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /** @format double */
  latest_balance?: number;
  /**
   * Wallet nickname
   * @maxLength 100
   */
  nickname?: string | null;
  /** Set wallet as default funding account */
  default?: boolean;
}

export interface PangeaPatchedWebhook {
  /**
   * The unique identifier for the webhook.
   * @format uuid
   */
  webhook_id?: string;
  created_by?: string;
  /**
   * The URL where the webhook will send events.
   * @format uri
   * @maxLength 200
   */
  url?: string;
  events?: string[];
  groups?: string[];
  /** @format date-time */
  created?: string;
  /** @format date-time */
  modified?: string;
}

export interface PangeaPayment {
  /**
   * @format double
   * @min 0
   * @max 1000000000000000
   * @exclusiveMax true
   */
  amount?: number;
  /**
   * @format double
   * @min 0
   * @max 1000000000000000
   * @exclusiveMax true
   */
  cntr_amount?: number;
  buy_currency?: string;
  cashflows: PangeaSingleCashflow[];
  /** @format date-time */
  created: string;
  /** @format date */
  delivery_date?: string | null;
  /** @maxLength 50 */
  destination_account_id?: string | null;
  destination_account_method?:
    | PangeaPaymentDeliveryMethodEnum
    | PangeaNullEnum
    | null;
  execution_timing?:
    | PangeaExecutionTimingEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  fee_in_bps?: number | null;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  fee?: number;
  id: number;
  installment: boolean;
  installments?: PangeaPaymentInstallment[] | null;
  lock_side?: string;
  /** @format date-time */
  modified: string;
  name: string;
  /** @maxLength 50 */
  origin_account_id?: string | null;
  origin_account_method?:
    | PangeaPaymentDeliveryMethodEnum
    | PangeaNullEnum
    | null;
  payment_status: PangeaPaymentStatusEnum;
  /** @format date */
  periodicity_end_date?: string | null;
  /** @format date */
  periodicity_start_date?: string | null;
  periodicity?: string | null;
  purpose_of_payment?:
    | PangeaPurposeOfPaymentEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  recurring: boolean;
  sell_currency?: string;
  /** @format uuid */
  payment_id: string;
  payment_group: string | null;
  approvers?: PangeaApprover[] | null;
  min_approvers?: number | null;
  assigned_approvers?: PangeaApprover[] | null;
}

export interface PangeaPaymentCompanySettings {
  stripe: boolean;
}

/**
 * * `local` - Local
 * * `swift` - Swift
 * * `wallet` - Wallet
 * * `card` - Card
 * * `proxy` - Proxy
 */
export enum PangeaPaymentDeliveryMethodEnum {
  Local = 'local',
  Swift = 'swift',
  Wallet = 'wallet',
  Card = 'card',
  Proxy = 'proxy',
}

export interface PangeaPaymentError {
  error: string;
  traceback?: string;
}

export interface PangeaPaymentExecutionError {
  cashflow_id?: string;
  ticket_id?: string;
  status: string;
  message: string;
  code: number;
  data?: Record<string, string | null>;
}

export interface PangeaPaymentExecutionResponse {
  success: PangeaPaymentExecutionSuccess[];
  error: PangeaPaymentExecutionError[];
}

export interface PangeaPaymentExecutionSuccess {
  ticket_id: string;
  status?: string;
  action: string;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  spot_rate?: number;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  fwd_points?: number;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  all_in_rate?: number;
  /** @format date */
  value_date: string;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  delivery_fee?: number;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  payment_amount?: number;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  total_cost?: number;
}

export interface PangeaPaymentInstallment {
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  amount: number;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  cntr_amount?: number;
  buy_currency: string;
  /** @format date */
  date: string;
  cashflow_id?: string;
  lock_side: string;
  sell_currency: string;
}

/**
 * * `Wire` - Wire
 * * `EFT` - EFT
 * * `StoredValue` - FX Balance
 */
export enum PangeaPaymentMethod1AfEnum {
  Wire = 'Wire',
  EFT = 'EFT',
  StoredValue = 'StoredValue',
}

export interface PangeaPaymentRfq {
  /**
   * The amount of lock_side currency being transferred in the transaction.
   * @format double
   */
  amount: number;
  buy_currency: string;
  /** Unique identifier for the cashflow. If cashflow_id is provided, required fields are not necessary as they will be filled in appropriately from the cashflow. */
  cashflow_id?: string | null;
  /** @format date-time */
  external_quote_expiry?: string | null;
  /** @format double */
  external_quote?: number | null;
  /** @format double */
  fee?: number | null;
  /** @format double */
  fwd_points?: number | null;
  lock_side: string;
  /** @format double */
  quote_fee?: number | null;
  sell_currency: string;
  /** @format double */
  spot_rate?: number | null;
  /** @format uuid */
  ticket_id: string;
  /**
   * The date when the transaction will settle. Defaults to the following business day if settlement cannot occur on the provided value_date.
   * @format date
   */
  value_date: string;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  transaction_amount: number;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  delivery_fee: number;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  total_cost: number;
  indicative: boolean;
  pangea_fee?: string;
  broker_fee?: string;
  forward_points_str?: string;
}

/**
 * * `awaiting_funds` - Awaiting Funds
 * * `booked` - Booked
 * * `delivered` - Delivered
 * * `drafting` - Drafting
 * * `in_transit` - In Transit
 * * `scheduled` - Scheduled
 * * `working` - Working
 * * `canceled` - Canceled
 * * `failed` - Failed
 * * `settlement_issue` - Settlement Issue
 * * `pend_auth` - Pending Authorization
 * * `strategic_execution` - Strategic Ex
 * * `expired` - Expired
 * * `pending_approval` - Pending Approval
 * * `trade_desk` - Trade Desk
 * * `pending_beneficiary` - Pending Beneficiary
 * * `payment_issue` - Payment Issue
 * * `settled` - Settled
 * * `approved` - Approved
 */
export enum PangeaPaymentStatusEnum {
  AwaitingFunds = 'awaiting_funds',
  Booked = 'booked',
  Delivered = 'delivered',
  Drafting = 'drafting',
  InTransit = 'in_transit',
  Scheduled = 'scheduled',
  Working = 'working',
  Canceled = 'canceled',
  Failed = 'failed',
  SettlementIssue = 'settlement_issue',
  PendAuth = 'pend_auth',
  StrategicExecution = 'strategic_execution',
  Expired = 'expired',
  PendingApproval = 'pending_approval',
  TradeDesk = 'trade_desk',
  PendingBeneficiary = 'pending_beneficiary',
  PaymentIssue = 'payment_issue',
  Settled = 'settled',
  Approved = 'approved',
}

export interface PangeaPaymentSummary {
  payment_currency: string;
  /** @format double */
  amount_total: number;
  settlement_currency: string;
  /** @format double */
  settlement_amount: number;
  /** @format double */
  rate: number;
  lock_side: string;
  rate_type: string;
}

export interface PangeaPaymentTracker {
  payment_id: string;
  tracker_id: string;
}

export interface PangeaPaymentValidationError {
  traceback?: string;
  validation_errors: PangeaPaymentValidationErrorDetail[];
}

export interface PangeaPaymentValidationErrorDetail {
  field?: string;
  detail?: string;
}

export interface PangeaPendingTask {
  isRequiredForTrading: boolean;
  isOnlineTask: boolean;
  formNumber: string;
  formName: string;
  action: string;
  isRequiredForApproval: boolean;
  taskNumber: number;
}

export interface PangeaPendingTasksResponse {
  pendingTasks?: PangeaPendingTask[];
  isError: boolean;
  isPendingTaskPresent: boolean;
  acctId: string;
  description: string;
  status: string;
  error?: string;
}

/** An object representing a request to get the portfolio performance. */
export interface PangeaPerformanceRequest {
  start_date: string;
  end_date: string;
  account_id?: number;
  /** @default true */
  is_live?: boolean;
}

export interface PangeaPerformanceResponse {
  times: string[];
  unhedged: number[];
  hedged: number[];
  pnl: number[];
  num_cashflows: number[];
}

export interface PangeaPermission {
  /** @maxLength 255 */
  name: string;
  content_type: number;
  /** @maxLength 100 */
  codename: string;
}

export interface PangeaPredefinedDestinationInstructionRequest {
  broker_account_id: number;
  /** @maxLength 60 */
  instruction_name: string;
  /**
   * * `WIRE` - WIRE
   * * `ACH` - ACH
   */
  instruction_type: PangeaInstructionTypeEnum;
  financial_institution: PangeaFinancialInstitution;
  /** @maxLength 250 */
  financial_institution_client_acct_id: string;
  /**
   * * `USD` - USD
   * * `HUF` - HUF
   * * `EUR` - EUR
   * * `CZK` - CZK
   * * `GBP` - GBP
   * * `CNH` - CNH
   * * `CAD` - CAD
   * * `DKK` - DKK
   * * `JPY` - JPY
   * * `RUB` - RUB
   * * `HKD` - HKD
   * * `ILS` - ILS
   * * `AUD` - AUD
   * * `NOK` - NOK
   * * `CHF` - CHF
   * * `SGD` - SGD
   * * `MXN` - MXN
   * * `PLN` - PLN
   * * `SEK` - SEK
   * * `ZAR` - ZAR
   * * `NZD` - NZD
   */
  currency: PangeaCurrencyEnum;
}

export interface PangeaProfileParallelOptionResponse {
  field: string;
  ids: number[];
}

export interface PangeaProxyCountry {
  name: string;
  country: string;
  default_currency: string;
}

export interface PangeaProxyCountryResponse {
  countries: PangeaProxyCountry[];
  value_set: PangeaValueSet[];
}

export interface PangeaProxyCurrency {
  curr: string;
  desc: string;
}

export interface PangeaProxyCurrencyResponse {
  common: string[];
  all: PangeaProxyCurrency[];
  value_set: PangeaValueSet[];
}

export interface PangeaProxyRegion {
  id: string;
  country: string;
  country_name: string;
  name: string;
}

export interface PangeaProxyRegionResponse {
  regions: PangeaProxyRegion[];
  is_complete_list: boolean;
  value_set: PangeaValueSet[];
}

export interface PangeaProxyRequest {
  /** @format uri */
  uri: string;
  /**
   * * `GET` - GET
   * * `POST` - POST
   * * `PATCH` - PATCH
   * * `PUT` - PUT
   * * `DELETE` - DELETE
   */
  method: PangeaProxyRequestMethodEnum;
}

/**
 * * `GET` - GET
 * * `POST` - POST
 * * `PATCH` - PATCH
 * * `PUT` - PUT
 * * `DELETE` - DELETE
 */
export enum PangeaProxyRequestMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * * `mobile` - Mobile
 * * `uen` - UEN
 * * `nric` - NRIC
 * * `vpa` - VPA
 * * `id` - ID
 * * `email` - Email
 * * `random_key` - Random Key
 * * `abn` - ABN
 * * `organization_id` - Organisation ID
 * * `passport` - Passport
 * * `corporate_registration_number` - Corporate Registration Number
 * * `army_id` - Army ID
 */
export enum PangeaProxyTypeEnum {
  Mobile = 'mobile',
  Uen = 'uen',
  Nric = 'nric',
  Vpa = 'vpa',
  Id = 'id',
  Email = 'email',
  RandomKey = 'random_key',
  Abn = 'abn',
  OrganizationId = 'organization_id',
  Passport = 'passport',
  CorporateRegistrationNumber = 'corporate_registration_number',
  ArmyId = 'army_id',
}

/**
 * * `All` - All
 * * `Allocation` - Allocation
 * * `Fee` - Fee
 * * `Spot` - Spot
 * * `SpotTrade` - SpotTrade
 * * `Drawdown` - Drawdown
 */
export enum PangeaPurposeEnum {
  All = 'All',
  Allocation = 'Allocation',
  Fee = 'Fee',
  Spot = 'Spot',
  SpotTrade = 'SpotTrade',
  Drawdown = 'Drawdown',
}

/**
 * * `1` - 1
 * * `2` - 2
 * * `3` - 3
 * * `4` - 4
 * * `5` - 5
 * * `6` - 6
 */
export enum PangeaPurposeOfPaymentEnum {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
}

export interface PangeaPurposeOfPaymentItem {
  id: string;
  text: string;
  search_text: string;
}

export interface PangeaPurposeOfPaymentResponse {
  items: PangeaPurposeOfPaymentItem[];
}

export interface PangeaQuotePayment {
  beneficiary_id: string;
  /**
   * * `Wire` - Wire
   * * `EFT` - EFT
   * * `StoredValue` - FX Balance
   */
  payment_method: PangeaPaymentMethod1AfEnum;
  /** @format double */
  amount: number;
  /**
   * * `Payment` - PAYMENT
   * * `Settlement` - SETTLEMENT
   */
  lock_side: PangeaCorpayLockSideEnum;
  payment_currency: string;
  settlement_currency: string;
  /**
   * * `Wire` - Wire
   * * `EFT` - EFT
   * * `StoredValue` - FX Balance
   */
  settlement_method: PangeaSettlementMethodEnum;
  settlement_account_id: string;
  payment_reference?: string;
  purpose_of_payment: string;
  remitter_id?: string;
  /** @format date */
  delivery_date?: string;
  payment_id?: string;
}

export interface PangeaQuotePaymentResponse {
  rate: PangeaSpotRateResponseRate;
  payment: PangeaCurrencyAmount;
  settlement: PangeaCurrencyAmount;
  quote: PangeaQuotePaymentsResponse;
}

export interface PangeaQuotePaymentsRequest {
  payments: PangeaQuotePayment[];
}

export interface PangeaQuotePaymentsResponse {
  expiry: number;
  payment_summary: PangeaPaymentSummary[];
  fees: PangeaCurrencyAmount[];
  payment_trackers: PangeaPaymentTracker[];
  quote_id: string;
  session_id: string;
}

export interface PangeaQuoteResponse {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  company: number;
  pair?: number | null;
  user?: number | null;
  from_currency?: number | null;
  to_currency?: number | null;
}

export interface PangeaQuoteToTicketRequest {
  quote_id: number;
  wait_condition_id?: number;
  payment_id?: number;
  cashflow_id?: number;
}

export interface PangeaRateMovingAverage {
  /** @format date */
  date: string;
  /** @format double */
  rate: number;
  /** @format double */
  rate_ma: number;
}

export interface PangeaRateResponse {
  /**
   * @format decimal
   * @pattern ^-?\d{0,14}(?:\.\d{0,6})?$
   */
  fwd_rate: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,14}(?:\.\d{0,6})?$
   */
  spot_rate: string;
  /**
   * @format decimal
   * @pattern ^-?\d{0,14}(?:\.\d{0,6})?$
   */
  fwd_points: string;
}

export interface PangeaRealizedVolatilityRequest {
  start_date: string;
  end_date: string;
  account_id?: number;
  is_live?: boolean;
}

export interface PangeaRealizedVolatilityResponse {
  times: string[];
  unhedged_realized_vol: number[];
  hedged_realized_vol: number[];
}

export interface PangeaRecentRateResponse {
  spot_rate: PangeaMarketRate;
  fwd_points: PangeaMarketRate;
  channel_group_name: string;
}

export interface PangeaRecentVolResponseSerialier {
  /** @format date */
  value_date: string;
  /** @format double */
  annual_volatility: number;
  /** @format double */
  monthly_volatility: number;
  /** @format double */
  daily_volatility: number;
  /** @format double */
  volatility_at_t: number;
  unit: string;
}

export interface PangeaRegistrationTask {
  /** @format date-time */
  dateComplete?: string;
  formNumber: string;
  formName: string;
  action: string;
  isRequiredForApproval: boolean;
  state?: string;
  isComplete: boolean;
}

export interface PangeaRegistrationTasksResponse {
  registrationTasks?: PangeaRegistrationTask[];
  isError: boolean;
  dateStarted: string;
  isRegistrationTaskPresent: boolean;
  acctId: string;
  description: string;
  status: string;
  error?: string;
}

export interface PangeaRejectCompanyJoinRequest {
  company_join_request_id: number;
}

export interface PangeaReqBasicExecAction {
  /** @format uuid */
  ticket_id: string;
}

export interface PangeaRequestApproval {
  payment_id: number;
  approver_user_ids: number[];
}

/**
 * * `error` - Error
 * * `unknown` - Unknown
 * * `request_rejected` - Request Rejected
 * * `request_accepted_for_processing` - Request Accepted for Processing
 */
export enum PangeaRequestStatusEnum {
  Error = 'error',
  Unknown = 'unknown',
  RequestRejected = 'request_rejected',
  RequestAcceptedForProcessing = 'request_accepted_for_processing',
}

export interface PangeaResendNotificationRequest {
  /**
   * * `reset_password` - reset_password
   * * `user_activation` - user_activation
   * * `invitation_token` - invitation_token
   */
  template: PangeaTemplateEnum;
  /** @format email */
  email: string;
}

export interface PangeaResendNotificationResponse {
  details: string;
}

export interface PangeaResetToken {
  token: string;
}

export interface PangeaResourceAlreadyExists {
  field?: string;
  message?: string;
}

export interface PangeaResponse {
  buy_currency: PangeaCurrencyResponse[];
  sell_currency: PangeaCurrencyResponse[];
}

export interface PangeaRetrieveBeneficiaryResponse {
  beneficiary: PangeaCorPayBeneficiary;
}

export interface PangeaRfq {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code used to indicate which amount you are defining the value of. The non-lock_side amount will be calculated. */
  lock_side: string;
  /** The date when the transaction will settle. Defaults to the following business day if settlement cannot occur on the provided value_date. */
  value_date: string;
  /**
   * The amount of lock_side currency
   * @format double
   * @min 0.01
   */
  amount?: number;
  /** @default "market" */
  execution_strategy?: PangeaExecutionStrategy183Enum;
  /**
   * If you provide an existing ticket_id, the API will try to refresh your quote. If the ticket_id does not exist, using this parameter will result in an error.
   * @format uuid
   */
  ticket_id?: string;
  /** Client-provided funding identifier. Will use default if configured. Otherwise, post-funded. */
  settle_account_id?: string | null;
  /** Client-provided beneficiary identifier. */
  beneficiary_id?: string | null;
  /** Identifier for the customer associated with the company for the transaction. */
  customer_id?: string | null;
  /** Unique identifier for the cashflow. If cashflow_id is provided, required fields are not necessary as they will be filled in appropriately from the cashflow. */
  cashflow_id?: string | null;
  /** Client-provided unique identifier for the transaction. */
  transaction_id?: string | null;
  /** Client-supplied identifier to provide transaction grouping. */
  transaction_group?: string | null;
  /** Internal free-form payment memo. */
  payment_memo?: string | null;
}

/**
 * * `UNADJUSTED` - Unadjusted
 * * `FOLLOWING` - Following
 * * `MODIFIED_FOLLOWING` - Modified Following
 * * `HALF_MONTH_MODIFIED_FOLLOWING` - Half Month Modified Following
 * * `PRECEDING` - Preceding
 * * `MODIFIED_PRECEDING` - Modified Preceding
 * * `NEAREST` - Nearest
 */
export enum PangeaRollConventionEnum {
  UNADJUSTED = 'UNADJUSTED',
  FOLLOWING = 'FOLLOWING',
  MODIFIED_FOLLOWING = 'MODIFIED_FOLLOWING',
  HALF_MONTH_MODIFIED_FOLLOWING = 'HALF_MONTH_MODIFIED_FOLLOWING',
  PRECEDING = 'PRECEDING',
  MODIFIED_PRECEDING = 'MODIFIED_PRECEDING',
  NEAREST = 'NEAREST',
}

/**
 * * `modified_follow` - Modified Follow
 * * `reject` - Reject
 * * `next` - Next
 * * `previous` - Previous
 */
export enum PangeaRuleEnum {
  ModifiedFollow = 'modified_follow',
  Reject = 'reject',
  Next = 'next',
  Previous = 'previous',
}

export interface Pangea_SGE {
  /** @format date */
  date: string;
  /** @maxLength 50 */
  value_type: string;
  /** @format double */
  value?: number | null;
  currency_id: string;
  /** @maxLength 250 */
  country_codes: string;
}

/**
 * * `Mr.` - Mr.
 * * `Mrs.` - Mrs.
 * * `Ms.` - Ms.
 * * `Dr.` - Dr.
 * * `Mx.` - Mx.
 * * `Ind.` - Ind.
 */
export enum PangeaSalutationEnum {
  Mr = 'Mr.',
  Mrs = 'Mrs.',
  Ms = 'Ms.',
  Dr = 'Dr.',
  Mx = 'Mx.',
  Ind = 'Ind.',
}

export interface PangeaSaveInstructRequest {
  quote_id?: number;
  instruct_request: PangeaInstructDealRequest;
}

export interface PangeaSaveInstructRequestResponse {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /** @format double */
  amount: number;
  /** @maxLength 50 */
  from_account_id?: string | null;
  /** @maxLength 50 */
  to_account_id?: string | null;
  /** @maxLength 100 */
  beneficiary_id?: string | null;
  /** @maxLength 50 */
  order_id?: string | null;
  /** @maxLength 255 */
  purpose_of_payment?: string | null;
  /** @maxLength 255 */
  payment_reference?: string | null;
  from_purpose?: PangeaFromPurposeEnum | PangeaNullEnum | null;
  to_purpose?: PangeaToPurposeEnum | PangeaNullEnum | null;
  delivery_method?:
    | PangeaInstructDealRequestDeliveryMethodEnum
    | PangeaNullEnum
    | null;
  from_delivery_method?:
    | PangeaInstructDealRequestDeliveryMethodEnum
    | PangeaNullEnum
    | null;
  to_delivery_method?:
    | PangeaInstructDealRequestDeliveryMethodEnum
    | PangeaNullEnum
    | null;
  same_settlement_currency?: boolean;
  from_currency: number;
  to_currency: number;
  quote?: number | null;
}

export interface PangeaSendAuthenticatedSupportMessage {
  subject: string | null;
  message: string;
}

export interface PangeaSendGeneralSupportMessage {
  firstname: string;
  lastname: string;
  subject: string;
  message: string;
  /** @format email */
  email: string;
  phone: string;
}

/**
 * * `fx_hedging` - FX Hedging
 * * `wallet` - Wallet
 * * `payment` - Payment & Transfer
 */
export enum PangeaServiceInterestedInEnum {
  FxHedging = 'fx_hedging',
  Wallet = 'wallet',
  Payment = 'payment',
}

export interface PangeaSetUserPassword {
  password: string;
  /** Password */
  confirm_password: string;
  invitation_token: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface PangeaSettlementAccount {
  ordnum: number;
  text: string;
  children: PangeaSettlementAccountChildren[];
}

export interface PangeaSettlementAccountChildren {
  id: string;
  method: PangeaMethod;
  currency: string;
  text: string;
  payment_ident: string;
  bank_name: string;
  bank_account: string;
  preferred: boolean;
  selected: boolean;
  links: PangeaLink[];
  /**
   * * `W` - Wire
   * * `E` - iACH
   */
  delivery_method: PangeaSettlementAccountDeliveryMethodEnum;
}

/**
 * * `W` - Wire
 * * `E` - iACH
 */
export enum PangeaSettlementAccountDeliveryMethodEnum {
  W = 'W',
  E = 'E',
}

export interface PangeaSettlementAccountsResponse {
  items: PangeaSettlementAccount[];
}

/**
 * * `Wire` - Wire
 * * `EFT` - EFT
 * * `StoredValue` - FX Balance
 */
export enum PangeaSettlementMethodEnum {
  Wire = 'Wire',
  EFT = 'EFT',
  StoredValue = 'StoredValue',
}

/**
 * * `Buy` - Buy
 * * `Sell` - Sell
 * * `BuySell` - BuySell
 * * `SellBuy` - SellBuy
 * * `Transfer` - Transfer
 */
export enum PangeaSideEnum {
  Buy = 'Buy',
  Sell = 'Sell',
  BuySell = 'BuySell',
  SellBuy = 'SellBuy',
  Transfer = 'Transfer',
}

export interface PangeaSimplePayment {
  /**
   * @format double
   * @min 1
   */
  amount: number;
  buy_currency: string;
  destination: string;
  lock_side: string;
  description?: string | null;
  origin: string;
  purpose_of_payment?: string | null;
  sell_currency: string;
  /** @format date */
  value_date: string;
}

export interface PangeaSimpleUpdatePayment {
  /**
   * @format double
   * @min 1
   */
  amount: number;
  buy_currency: string;
  destination: string;
  lock_side: string;
  description?: string | null;
  origin: string;
  purpose_of_payment?: string | null;
  sell_currency: string;
  /** @format date */
  value_date: string;
  /** @format uuid */
  payment_id?: string | null;
}

export interface PangeaSingleCashflow {
  /**
   * The unique ID of the cashflow
   * @format uuid
   */
  cashflow_id: string;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  amount: number;
  buy_currency: string;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  cntr_amount?: number;
  /** A description of the cashflow */
  description?: string | null;
  lock_side: string;
  /**
   * A name for the cashflow
   * @maxLength 255
   */
  name?: string | null;
  /**
   * The date the cashflow is paid or received
   * @format date-time
   */
  pay_date: string;
  sell_currency: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  ticket: PangeaTicketRate;
  /**
   * Payment's cashflow transaction date
   * @format date
   */
  transaction_date: string | null;
}

export interface PangeaSingleDateTime {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /** @format date-time */
  date: string;
}

export interface PangeaSingleDay {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /** @format date */
  date: string;
}

export interface PangeaSingleDayTenor {
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /** @format date-time */
  date: string;
  /** @default "SPOT" */
  tenor?: string;
}

export interface PangeaSorting {
  column: string;
  dir: string;
}

export interface PangeaSpotRateRequest {
  payment_currency: string;
  settlement_currency: string;
  /** @format double */
  amount: number;
  /**
   * * `Payment` - PAYMENT
   * * `Settlement` - SETTLEMENT
   */
  lock_side: PangeaCorpayLockSideEnum;
}

export interface PangeaSpotRateResponse {
  rate: PangeaSpotRateResponseRate;
  quote_id: string;
  payment: PangeaCurrencyAmount;
  settlement: PangeaCurrencyAmount;
  cost_in_bps: number;
}

export interface PangeaSpotRateResponseRate {
  /** @format double */
  value: number;
  /**
   * * `Payment` - PAYMENT
   * * `Settlement` - SETTLEMENT
   */
  lock_side: PangeaCorpayLockSideEnum;
  rate_type: string;
  operation: string;
}

/**
 * * `api` - API
 * * `manual` - MANUAL
 * * `unsupported` - UNSUPPORTED
 * * `indicative` - INDICATIVE
 * * `norfq` - NORFQ
 */
export enum PangeaSpotRfqTypeEnum {
  Api = 'api',
  Manual = 'manual',
  Unsupported = 'unsupported',
  Indicative = 'indicative',
  Norfq = 'norfq',
}

export interface PangeaStabilityIndex {
  id: number;
  /** @format date-time */
  date?: string | null;
  parent_index?: number | null;
  /** @maxLength 255 */
  type?: string | null;
  /** @maxLength 255 */
  name?: string | null;
  description?: string | null;
  /** @format double */
  value?: number | null;
  /** @format double */
  average_value?: number | null;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  rank?: number | null;
  currency: PangeaCurrency;
}

/**
 * * `AL` - Alabama
 * * `AK` - Alaska
 * * `AS` - American Samoa
 * * `AZ` - Arizona
 * * `AR` - Arkansas
 * * `AA` - Armed Forces Americas
 * * `AE` - Armed Forces Europe
 * * `AP` - Armed Forces Pacific
 * * `CA` - California
 * * `CO` - Colorado
 * * `CT` - Connecticut
 * * `DE` - Delaware
 * * `DC` - District of Columbia
 * * `FL` - Florida
 * * `GA` - Georgia
 * * `GU` - Guam
 * * `HI` - Hawaii
 * * `ID` - Idaho
 * * `IL` - Illinois
 * * `IN` - Indiana
 * * `IA` - Iowa
 * * `KS` - Kansas
 * * `KY` - Kentucky
 * * `LA` - Louisiana
 * * `ME` - Maine
 * * `MD` - Maryland
 * * `MA` - Massachusetts
 * * `MI` - Michigan
 * * `MN` - Minnesota
 * * `MS` - Mississippi
 * * `MO` - Missouri
 * * `MT` - Montana
 * * `NE` - Nebraska
 * * `NV` - Nevada
 * * `NH` - New Hampshire
 * * `NJ` - New Jersey
 * * `NM` - New Mexico
 * * `NY` - New York
 * * `NC` - North Carolina
 * * `ND` - North Dakota
 * * `MP` - Northern Mariana Islands
 * * `OH` - Ohio
 * * `OK` - Oklahoma
 * * `OR` - Oregon
 * * `PA` - Pennsylvania
 * * `PR` - Puerto Rico
 * * `RI` - Rhode Island
 * * `SC` - South Carolina
 * * `SD` - South Dakota
 * * `TN` - Tennessee
 * * `TX` - Texas
 * * `UT` - Utah
 * * `VT` - Vermont
 * * `VI` - Virgin Islands
 * * `VA` - Virginia
 * * `WA` - Washington
 * * `WV` - West Virginia
 * * `WI` - Wisconsin
 * * `WY` - Wyoming
 */
export enum PangeaStateEnum {
  AL = 'AL',
  AK = 'AK',
  AS = 'AS',
  AZ = 'AZ',
  AR = 'AR',
  AA = 'AA',
  AE = 'AE',
  AP = 'AP',
  CA = 'CA',
  CO = 'CO',
  CT = 'CT',
  DE = 'DE',
  DC = 'DC',
  FL = 'FL',
  GA = 'GA',
  GU = 'GU',
  HI = 'HI',
  ID = 'ID',
  IL = 'IL',
  IN = 'IN',
  IA = 'IA',
  KS = 'KS',
  KY = 'KY',
  LA = 'LA',
  ME = 'ME',
  MD = 'MD',
  MA = 'MA',
  MI = 'MI',
  MN = 'MN',
  MS = 'MS',
  MO = 'MO',
  MT = 'MT',
  NE = 'NE',
  NV = 'NV',
  NH = 'NH',
  NJ = 'NJ',
  NM = 'NM',
  NY = 'NY',
  NC = 'NC',
  ND = 'ND',
  MP = 'MP',
  OH = 'OH',
  OK = 'OK',
  OR = 'OR',
  PA = 'PA',
  PR = 'PR',
  RI = 'RI',
  SC = 'SC',
  SD = 'SD',
  TN = 'TN',
  TX = 'TX',
  UT = 'UT',
  VT = 'VT',
  VI = 'VI',
  VA = 'VA',
  WA = 'WA',
  WV = 'WV',
  WI = 'WI',
  WY = 'WY',
}

export interface PangeaStatusResponse {
  status: boolean;
  error?: string;
}

/**
 * * `0` - Spot Hedging
 * * `1` - Parachute
 * * `2` - Hard Limits
 */
export enum PangeaStrategyEnum {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}

/**
 * * `strict_gate` - Strict Gate
 * * `soft_gate` - Soft Gate
 * * `persuasive` - Persuasive
 * * `open` - Open
 */
export enum PangeaStrictnessOfCapitalControlsEnum {
  StrictGate = 'strict_gate',
  SoftGate = 'soft_gate',
  Persuasive = 'persuasive',
  Open = 'open',
}

export interface PangeaStripePaymentMethodRequest {
  payment_method_id: string;
}

export interface PangeaStripePaymentMethodResponse {
  id: string;
  type: string;
  last4: number;
  brand: string;
}

export interface PangeaStripeSetupIntent {
  client_secret: string;
}

export interface PangeaSupportedFxPairs {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /**
   * * `p20` - P20
   * * `wallet` - Wallet
   * * `other` - Other
   */
  fx_pair_type: PangeaFxPairTypeEnum;
  fx_pair: number;
}

/**
 * * `reset_password` - reset_password
 * * `user_activation` - user_activation
 * * `invitation_token` - invitation_token
 */
export enum PangeaTemplateEnum {
  ResetPassword = 'reset_password',
  UserActivation = 'user_activation',
  InvitationToken = 'invitation_token',
}

/**
 * * `RTP` - RTP
 * * `ON` - ON
 * * `TN` - TN
 * * `spot` - Spot
 * * `SN` - SN
 * * `SW` - SW
 * * `1W` - 1W
 * * `2W` - 2W
 * * `3W` - 3W
 * * `1M` - 1M
 * * `2M` - 2M
 * * `3M` - 3M
 * * `4M` - 4M
 * * `5M` - 5M
 * * `6M` - 6M
 * * `7M` - 7M
 * * `8M` - 8M
 * * `9M` - 9M
 * * `1Y` - 1Y
 * * `fwd` - Fwd
 * * `ndf` - NDF
 */
export enum PangeaTenorEnum {
  RTP = 'RTP',
  ON = 'ON',
  TN = 'TN',
  Spot = 'spot',
  SN = 'SN',
  SW = 'SW',
  Value1W = '1W',
  Value2W = '2W',
  Value3W = '3W',
  Value1M = '1M',
  Value2M = '2M',
  Value3M = '3M',
  Value4M = '4M',
  Value5M = '5M',
  Value6M = '6M',
  Value7M = '7M',
  Value8M = '8M',
  Value9M = '9M',
  Value1Y = '1Y',
  Fwd = 'fwd',
  Ndf = 'ndf',
}

export interface PangeaTicket {
  /** @format uuid */
  ticket_id: string;
  company: number | null;
  /** Identifier for the customer associated with the company for the transaction. */
  customer_id?: string | null;
  /** ISO 4217 Standard 3-Letter Currency Code */
  sell_currency: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  buy_currency: string;
  /**
   * @format double
   * @min 1
   */
  amount: number;
  /** ISO 4217 Standard 3-Letter Currency Code used to indicate which amount you are defining the value of. The non-lock_side amount will be calculated. */
  lock_side: string;
  /**
   * The tenor of the transaction, representing the settlement period.
   *
   * * `RTP` - RTP
   * * `ON` - ON
   * * `TN` - TN
   * * `spot` - Spot
   * * `SN` - SN
   * * `SW` - SW
   * * `1W` - 1W
   * * `2W` - 2W
   * * `3W` - 3W
   * * `1M` - 1M
   * * `2M` - 2M
   * * `3M` - 3M
   * * `4M` - 4M
   * * `5M` - 5M
   * * `6M` - 6M
   * * `7M` - 7M
   * * `8M` - 8M
   * * `9M` - 9M
   * * `1Y` - 1Y
   * * `fwd` - Fwd
   * * `ndf` - NDF
   */
  tenor?: PangeaTenorEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /**
   * The date when the transaction will settle. Defaults to the following business day if settlement cannot occur on the provided value_date.
   * @format date
   */
  value_date: string;
  /** Specifies whether the transaction is in draft stage or not. */
  draft?: boolean;
  /**
   * Specifies the duration for which the transaction is valid.
   *
   * * `10sec` - 10s
   * * `1min` - 1min
   * * `1hr` - 1hr
   * * `gtc` - GTC
   * * `day` - DAY
   * * `indicative` - INDICATIVE
   */
  time_in_force: PangeaTicketTimeInForceEnum;
  /** Client-supplied unique identifier for the transaction. */
  transaction_id: string | null;
  /** Client-supplied identifier to provide transaction grouping. */
  transaction_group?: string | null;
  /**
   * Specifies the type of transaction, whether it's a payment, RFQ, execute, or hedge.
   *
   * * `payment` - Payment
   * * `payment_rfq` - Payment RFQ
   * * `rfq` - RFQ
   * * `execute` - Execute
   * * `hedge` - Hedge
   */
  ticket_type: PangeaTicketTypeEnum;
  action?: PangeaAction8DeEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /** @format date-time */
  start_time?: string | null;
  /** @format date-time */
  end_time?: string | null;
  /**
   * @min 0
   * @max 2147483647
   */
  order_length?: number | null;
  execution_strategy?:
    | PangeaTicketExecutionStrategyEnum
    | PangeaBlankEnum
    | PangeaNullEnum
    | null;
  broker?: string | null;
  /** @maxLength 128 */
  algo?: string | null;
  algo_fields?: any;
  /**
   * Execution begins when client price goes above this threshold.
   * @format double
   */
  upper_trigger?: number | null;
  /**
   * Execution begins when client price goes below this threshold.
   * @format double
   */
  lower_trigger?: number | null;
  trader?: string | null;
}

/**
 * * `market` - Market
 * * `limit` - Limit
 * * `stop` - Stop
 * * `trigger` - Trigger
 * * `strategic_execution` - Strategic Execution
 * * `smart` - SMART
 * * `bestx` - Best Execution
 */
export enum PangeaTicketExecutionStrategyEnum {
  Market = 'market',
  Limit = 'limit',
  Stop = 'stop',
  Trigger = 'trigger',
  StrategicExecution = 'strategic_execution',
  Smart = 'smart',
  Bestx = 'bestx',
}

export interface PangeaTicketRate {
  /** @format uuid */
  ticket_id: string;
  side?: PangeaSideEnum | PangeaBlankEnum | PangeaNullEnum | null;
  action?: PangeaAction8DeEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  external_quote?: number;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  quote_fee?: number;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  fee?: number;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  delivery_fee?: number;
  /** @maxLength 8 */
  delivery_fee_unit?: string | null;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  all_in_done?: number;
  /**
   * @format double
   * @min -1000000000000000
   * @exclusiveMin true
   * @max 1000000000000000
   * @exclusiveMax true
   */
  all_in_cntr_done?: number;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  all_in_rate?: number;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  spot_rate?: number;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  fwd_points?: number;
  /** @format date-time */
  transaction_time?: string | null;
}

/**
 * * `10sec` - 10s
 * * `1min` - 1min
 * * `1hr` - 1hr
 * * `gtc` - GTC
 * * `day` - DAY
 * * `indicative` - INDICATIVE
 */
export enum PangeaTicketTimeInForceEnum {
  Value10Sec = '10sec',
  Value1Min = '1min',
  Value1Hr = '1hr',
  Gtc = 'gtc',
  Day = 'day',
  Indicative = 'indicative',
}

/**
 * * `payment` - Payment
 * * `payment_rfq` - Payment RFQ
 * * `rfq` - RFQ
 * * `execute` - Execute
 * * `hedge` - Hedge
 */
export enum PangeaTicketTypeEnum {
  Payment = 'payment',
  PaymentRfq = 'payment_rfq',
  Rfq = 'rfq',
  Execute = 'execute',
  Hedge = 'hedge',
}

/**
 * * `Africa/Abidjan` - Africa/Abidjan
 * * `Africa/Accra` - Africa/Accra
 * * `Africa/Addis_Ababa` - Africa/Addis_Ababa
 * * `Africa/Algiers` - Africa/Algiers
 * * `Africa/Asmara` - Africa/Asmara
 * * `Africa/Bamako` - Africa/Bamako
 * * `Africa/Bangui` - Africa/Bangui
 * * `Africa/Banjul` - Africa/Banjul
 * * `Africa/Bissau` - Africa/Bissau
 * * `Africa/Blantyre` - Africa/Blantyre
 * * `Africa/Brazzaville` - Africa/Brazzaville
 * * `Africa/Bujumbura` - Africa/Bujumbura
 * * `Africa/Cairo` - Africa/Cairo
 * * `Africa/Casablanca` - Africa/Casablanca
 * * `Africa/Ceuta` - Africa/Ceuta
 * * `Africa/Conakry` - Africa/Conakry
 * * `Africa/Dakar` - Africa/Dakar
 * * `Africa/Dar_es_Salaam` - Africa/Dar_es_Salaam
 * * `Africa/Djibouti` - Africa/Djibouti
 * * `Africa/Douala` - Africa/Douala
 * * `Africa/El_Aaiun` - Africa/El_Aaiun
 * * `Africa/Freetown` - Africa/Freetown
 * * `Africa/Gaborone` - Africa/Gaborone
 * * `Africa/Harare` - Africa/Harare
 * * `Africa/Johannesburg` - Africa/Johannesburg
 * * `Africa/Juba` - Africa/Juba
 * * `Africa/Kampala` - Africa/Kampala
 * * `Africa/Khartoum` - Africa/Khartoum
 * * `Africa/Kigali` - Africa/Kigali
 * * `Africa/Kinshasa` - Africa/Kinshasa
 * * `Africa/Lagos` - Africa/Lagos
 * * `Africa/Libreville` - Africa/Libreville
 * * `Africa/Lome` - Africa/Lome
 * * `Africa/Luanda` - Africa/Luanda
 * * `Africa/Lubumbashi` - Africa/Lubumbashi
 * * `Africa/Lusaka` - Africa/Lusaka
 * * `Africa/Malabo` - Africa/Malabo
 * * `Africa/Maputo` - Africa/Maputo
 * * `Africa/Maseru` - Africa/Maseru
 * * `Africa/Mbabane` - Africa/Mbabane
 * * `Africa/Mogadishu` - Africa/Mogadishu
 * * `Africa/Monrovia` - Africa/Monrovia
 * * `Africa/Nairobi` - Africa/Nairobi
 * * `Africa/Ndjamena` - Africa/Ndjamena
 * * `Africa/Niamey` - Africa/Niamey
 * * `Africa/Nouakchott` - Africa/Nouakchott
 * * `Africa/Ouagadougou` - Africa/Ouagadougou
 * * `Africa/Porto-Novo` - Africa/Porto-Novo
 * * `Africa/Sao_Tome` - Africa/Sao_Tome
 * * `Africa/Tripoli` - Africa/Tripoli
 * * `Africa/Tunis` - Africa/Tunis
 * * `Africa/Windhoek` - Africa/Windhoek
 * * `America/Adak` - America/Adak
 * * `America/Anchorage` - America/Anchorage
 * * `America/Anguilla` - America/Anguilla
 * * `America/Antigua` - America/Antigua
 * * `America/Araguaina` - America/Araguaina
 * * `America/Argentina/Buenos_Aires` - America/Argentina/Buenos_Aires
 * * `America/Argentina/Catamarca` - America/Argentina/Catamarca
 * * `America/Argentina/Cordoba` - America/Argentina/Cordoba
 * * `America/Argentina/Jujuy` - America/Argentina/Jujuy
 * * `America/Argentina/La_Rioja` - America/Argentina/La_Rioja
 * * `America/Argentina/Mendoza` - America/Argentina/Mendoza
 * * `America/Argentina/Rio_Gallegos` - America/Argentina/Rio_Gallegos
 * * `America/Argentina/Salta` - America/Argentina/Salta
 * * `America/Argentina/San_Juan` - America/Argentina/San_Juan
 * * `America/Argentina/San_Luis` - America/Argentina/San_Luis
 * * `America/Argentina/Tucuman` - America/Argentina/Tucuman
 * * `America/Argentina/Ushuaia` - America/Argentina/Ushuaia
 * * `America/Aruba` - America/Aruba
 * * `America/Asuncion` - America/Asuncion
 * * `America/Atikokan` - America/Atikokan
 * * `America/Bahia` - America/Bahia
 * * `America/Bahia_Banderas` - America/Bahia_Banderas
 * * `America/Barbados` - America/Barbados
 * * `America/Belem` - America/Belem
 * * `America/Belize` - America/Belize
 * * `America/Blanc-Sablon` - America/Blanc-Sablon
 * * `America/Boa_Vista` - America/Boa_Vista
 * * `America/Bogota` - America/Bogota
 * * `America/Boise` - America/Boise
 * * `America/Cambridge_Bay` - America/Cambridge_Bay
 * * `America/Campo_Grande` - America/Campo_Grande
 * * `America/Cancun` - America/Cancun
 * * `America/Caracas` - America/Caracas
 * * `America/Cayenne` - America/Cayenne
 * * `America/Cayman` - America/Cayman
 * * `America/Chicago` - America/Chicago
 * * `America/Chihuahua` - America/Chihuahua
 * * `America/Ciudad_Juarez` - America/Ciudad_Juarez
 * * `America/Costa_Rica` - America/Costa_Rica
 * * `America/Creston` - America/Creston
 * * `America/Cuiaba` - America/Cuiaba
 * * `America/Curacao` - America/Curacao
 * * `America/Danmarkshavn` - America/Danmarkshavn
 * * `America/Dawson` - America/Dawson
 * * `America/Dawson_Creek` - America/Dawson_Creek
 * * `America/Denver` - America/Denver
 * * `America/Detroit` - America/Detroit
 * * `America/Dominica` - America/Dominica
 * * `America/Edmonton` - America/Edmonton
 * * `America/Eirunepe` - America/Eirunepe
 * * `America/El_Salvador` - America/El_Salvador
 * * `America/Fort_Nelson` - America/Fort_Nelson
 * * `America/Fortaleza` - America/Fortaleza
 * * `America/Glace_Bay` - America/Glace_Bay
 * * `America/Goose_Bay` - America/Goose_Bay
 * * `America/Grand_Turk` - America/Grand_Turk
 * * `America/Grenada` - America/Grenada
 * * `America/Guadeloupe` - America/Guadeloupe
 * * `America/Guatemala` - America/Guatemala
 * * `America/Guayaquil` - America/Guayaquil
 * * `America/Guyana` - America/Guyana
 * * `America/Halifax` - America/Halifax
 * * `America/Havana` - America/Havana
 * * `America/Hermosillo` - America/Hermosillo
 * * `America/Indiana/Indianapolis` - America/Indiana/Indianapolis
 * * `America/Indiana/Knox` - America/Indiana/Knox
 * * `America/Indiana/Marengo` - America/Indiana/Marengo
 * * `America/Indiana/Petersburg` - America/Indiana/Petersburg
 * * `America/Indiana/Tell_City` - America/Indiana/Tell_City
 * * `America/Indiana/Vevay` - America/Indiana/Vevay
 * * `America/Indiana/Vincennes` - America/Indiana/Vincennes
 * * `America/Indiana/Winamac` - America/Indiana/Winamac
 * * `America/Inuvik` - America/Inuvik
 * * `America/Iqaluit` - America/Iqaluit
 * * `America/Jamaica` - America/Jamaica
 * * `America/Juneau` - America/Juneau
 * * `America/Kentucky/Louisville` - America/Kentucky/Louisville
 * * `America/Kentucky/Monticello` - America/Kentucky/Monticello
 * * `America/Kralendijk` - America/Kralendijk
 * * `America/La_Paz` - America/La_Paz
 * * `America/Lima` - America/Lima
 * * `America/Los_Angeles` - America/Los_Angeles
 * * `America/Lower_Princes` - America/Lower_Princes
 * * `America/Maceio` - America/Maceio
 * * `America/Managua` - America/Managua
 * * `America/Manaus` - America/Manaus
 * * `America/Marigot` - America/Marigot
 * * `America/Martinique` - America/Martinique
 * * `America/Matamoros` - America/Matamoros
 * * `America/Mazatlan` - America/Mazatlan
 * * `America/Menominee` - America/Menominee
 * * `America/Merida` - America/Merida
 * * `America/Metlakatla` - America/Metlakatla
 * * `America/Mexico_City` - America/Mexico_City
 * * `America/Miquelon` - America/Miquelon
 * * `America/Moncton` - America/Moncton
 * * `America/Monterrey` - America/Monterrey
 * * `America/Montevideo` - America/Montevideo
 * * `America/Montserrat` - America/Montserrat
 * * `America/Nassau` - America/Nassau
 * * `America/New_York` - America/New_York
 * * `America/Nome` - America/Nome
 * * `America/Noronha` - America/Noronha
 * * `America/North_Dakota/Beulah` - America/North_Dakota/Beulah
 * * `America/North_Dakota/Center` - America/North_Dakota/Center
 * * `America/North_Dakota/New_Salem` - America/North_Dakota/New_Salem
 * * `America/Nuuk` - America/Nuuk
 * * `America/Ojinaga` - America/Ojinaga
 * * `America/Panama` - America/Panama
 * * `America/Paramaribo` - America/Paramaribo
 * * `America/Phoenix` - America/Phoenix
 * * `America/Port-au-Prince` - America/Port-au-Prince
 * * `America/Port_of_Spain` - America/Port_of_Spain
 * * `America/Porto_Velho` - America/Porto_Velho
 * * `America/Puerto_Rico` - America/Puerto_Rico
 * * `America/Punta_Arenas` - America/Punta_Arenas
 * * `America/Rankin_Inlet` - America/Rankin_Inlet
 * * `America/Recife` - America/Recife
 * * `America/Regina` - America/Regina
 * * `America/Resolute` - America/Resolute
 * * `America/Rio_Branco` - America/Rio_Branco
 * * `America/Santarem` - America/Santarem
 * * `America/Santiago` - America/Santiago
 * * `America/Santo_Domingo` - America/Santo_Domingo
 * * `America/Sao_Paulo` - America/Sao_Paulo
 * * `America/Scoresbysund` - America/Scoresbysund
 * * `America/Sitka` - America/Sitka
 * * `America/St_Barthelemy` - America/St_Barthelemy
 * * `America/St_Johns` - America/St_Johns
 * * `America/St_Kitts` - America/St_Kitts
 * * `America/St_Lucia` - America/St_Lucia
 * * `America/St_Thomas` - America/St_Thomas
 * * `America/St_Vincent` - America/St_Vincent
 * * `America/Swift_Current` - America/Swift_Current
 * * `America/Tegucigalpa` - America/Tegucigalpa
 * * `America/Thule` - America/Thule
 * * `America/Tijuana` - America/Tijuana
 * * `America/Toronto` - America/Toronto
 * * `America/Tortola` - America/Tortola
 * * `America/Vancouver` - America/Vancouver
 * * `America/Whitehorse` - America/Whitehorse
 * * `America/Winnipeg` - America/Winnipeg
 * * `America/Yakutat` - America/Yakutat
 * * `Antarctica/Casey` - Antarctica/Casey
 * * `Antarctica/Davis` - Antarctica/Davis
 * * `Antarctica/DumontDUrville` - Antarctica/DumontDUrville
 * * `Antarctica/Macquarie` - Antarctica/Macquarie
 * * `Antarctica/Mawson` - Antarctica/Mawson
 * * `Antarctica/McMurdo` - Antarctica/McMurdo
 * * `Antarctica/Palmer` - Antarctica/Palmer
 * * `Antarctica/Rothera` - Antarctica/Rothera
 * * `Antarctica/Syowa` - Antarctica/Syowa
 * * `Antarctica/Troll` - Antarctica/Troll
 * * `Antarctica/Vostok` - Antarctica/Vostok
 * * `Arctic/Longyearbyen` - Arctic/Longyearbyen
 * * `Asia/Aden` - Asia/Aden
 * * `Asia/Almaty` - Asia/Almaty
 * * `Asia/Amman` - Asia/Amman
 * * `Asia/Anadyr` - Asia/Anadyr
 * * `Asia/Aqtau` - Asia/Aqtau
 * * `Asia/Aqtobe` - Asia/Aqtobe
 * * `Asia/Ashgabat` - Asia/Ashgabat
 * * `Asia/Atyrau` - Asia/Atyrau
 * * `Asia/Baghdad` - Asia/Baghdad
 * * `Asia/Bahrain` - Asia/Bahrain
 * * `Asia/Baku` - Asia/Baku
 * * `Asia/Bangkok` - Asia/Bangkok
 * * `Asia/Barnaul` - Asia/Barnaul
 * * `Asia/Beirut` - Asia/Beirut
 * * `Asia/Bishkek` - Asia/Bishkek
 * * `Asia/Brunei` - Asia/Brunei
 * * `Asia/Chita` - Asia/Chita
 * * `Asia/Colombo` - Asia/Colombo
 * * `Asia/Damascus` - Asia/Damascus
 * * `Asia/Dhaka` - Asia/Dhaka
 * * `Asia/Dili` - Asia/Dili
 * * `Asia/Dubai` - Asia/Dubai
 * * `Asia/Dushanbe` - Asia/Dushanbe
 * * `Asia/Famagusta` - Asia/Famagusta
 * * `Asia/Gaza` - Asia/Gaza
 * * `Asia/Hebron` - Asia/Hebron
 * * `Asia/Ho_Chi_Minh` - Asia/Ho_Chi_Minh
 * * `Asia/Hong_Kong` - Asia/Hong_Kong
 * * `Asia/Hovd` - Asia/Hovd
 * * `Asia/Irkutsk` - Asia/Irkutsk
 * * `Asia/Jakarta` - Asia/Jakarta
 * * `Asia/Jayapura` - Asia/Jayapura
 * * `Asia/Jerusalem` - Asia/Jerusalem
 * * `Asia/Kabul` - Asia/Kabul
 * * `Asia/Kamchatka` - Asia/Kamchatka
 * * `Asia/Karachi` - Asia/Karachi
 * * `Asia/Kathmandu` - Asia/Kathmandu
 * * `Asia/Khandyga` - Asia/Khandyga
 * * `Asia/Kolkata` - Asia/Kolkata
 * * `Asia/Krasnoyarsk` - Asia/Krasnoyarsk
 * * `Asia/Kuala_Lumpur` - Asia/Kuala_Lumpur
 * * `Asia/Kuching` - Asia/Kuching
 * * `Asia/Kuwait` - Asia/Kuwait
 * * `Asia/Macau` - Asia/Macau
 * * `Asia/Magadan` - Asia/Magadan
 * * `Asia/Makassar` - Asia/Makassar
 * * `Asia/Manila` - Asia/Manila
 * * `Asia/Muscat` - Asia/Muscat
 * * `Asia/Nicosia` - Asia/Nicosia
 * * `Asia/Novokuznetsk` - Asia/Novokuznetsk
 * * `Asia/Novosibirsk` - Asia/Novosibirsk
 * * `Asia/Omsk` - Asia/Omsk
 * * `Asia/Oral` - Asia/Oral
 * * `Asia/Phnom_Penh` - Asia/Phnom_Penh
 * * `Asia/Pontianak` - Asia/Pontianak
 * * `Asia/Pyongyang` - Asia/Pyongyang
 * * `Asia/Qatar` - Asia/Qatar
 * * `Asia/Qostanay` - Asia/Qostanay
 * * `Asia/Qyzylorda` - Asia/Qyzylorda
 * * `Asia/Riyadh` - Asia/Riyadh
 * * `Asia/Sakhalin` - Asia/Sakhalin
 * * `Asia/Samarkand` - Asia/Samarkand
 * * `Asia/Seoul` - Asia/Seoul
 * * `Asia/Shanghai` - Asia/Shanghai
 * * `Asia/Singapore` - Asia/Singapore
 * * `Asia/Srednekolymsk` - Asia/Srednekolymsk
 * * `Asia/Taipei` - Asia/Taipei
 * * `Asia/Tashkent` - Asia/Tashkent
 * * `Asia/Tbilisi` - Asia/Tbilisi
 * * `Asia/Tehran` - Asia/Tehran
 * * `Asia/Thimphu` - Asia/Thimphu
 * * `Asia/Tokyo` - Asia/Tokyo
 * * `Asia/Tomsk` - Asia/Tomsk
 * * `Asia/Ulaanbaatar` - Asia/Ulaanbaatar
 * * `Asia/Urumqi` - Asia/Urumqi
 * * `Asia/Ust-Nera` - Asia/Ust-Nera
 * * `Asia/Vientiane` - Asia/Vientiane
 * * `Asia/Vladivostok` - Asia/Vladivostok
 * * `Asia/Yakutsk` - Asia/Yakutsk
 * * `Asia/Yangon` - Asia/Yangon
 * * `Asia/Yekaterinburg` - Asia/Yekaterinburg
 * * `Asia/Yerevan` - Asia/Yerevan
 * * `Atlantic/Azores` - Atlantic/Azores
 * * `Atlantic/Bermuda` - Atlantic/Bermuda
 * * `Atlantic/Canary` - Atlantic/Canary
 * * `Atlantic/Cape_Verde` - Atlantic/Cape_Verde
 * * `Atlantic/Faroe` - Atlantic/Faroe
 * * `Atlantic/Madeira` - Atlantic/Madeira
 * * `Atlantic/Reykjavik` - Atlantic/Reykjavik
 * * `Atlantic/South_Georgia` - Atlantic/South_Georgia
 * * `Atlantic/St_Helena` - Atlantic/St_Helena
 * * `Atlantic/Stanley` - Atlantic/Stanley
 * * `Australia/Adelaide` - Australia/Adelaide
 * * `Australia/Brisbane` - Australia/Brisbane
 * * `Australia/Broken_Hill` - Australia/Broken_Hill
 * * `Australia/Darwin` - Australia/Darwin
 * * `Australia/Eucla` - Australia/Eucla
 * * `Australia/Hobart` - Australia/Hobart
 * * `Australia/Lindeman` - Australia/Lindeman
 * * `Australia/Lord_Howe` - Australia/Lord_Howe
 * * `Australia/Melbourne` - Australia/Melbourne
 * * `Australia/Perth` - Australia/Perth
 * * `Australia/Sydney` - Australia/Sydney
 * * `Canada/Atlantic` - Canada/Atlantic
 * * `Canada/Central` - Canada/Central
 * * `Canada/Eastern` - Canada/Eastern
 * * `Canada/Mountain` - Canada/Mountain
 * * `Canada/Newfoundland` - Canada/Newfoundland
 * * `Canada/Pacific` - Canada/Pacific
 * * `Europe/Amsterdam` - Europe/Amsterdam
 * * `Europe/Andorra` - Europe/Andorra
 * * `Europe/Astrakhan` - Europe/Astrakhan
 * * `Europe/Athens` - Europe/Athens
 * * `Europe/Belgrade` - Europe/Belgrade
 * * `Europe/Berlin` - Europe/Berlin
 * * `Europe/Bratislava` - Europe/Bratislava
 * * `Europe/Brussels` - Europe/Brussels
 * * `Europe/Bucharest` - Europe/Bucharest
 * * `Europe/Budapest` - Europe/Budapest
 * * `Europe/Busingen` - Europe/Busingen
 * * `Europe/Chisinau` - Europe/Chisinau
 * * `Europe/Copenhagen` - Europe/Copenhagen
 * * `Europe/Dublin` - Europe/Dublin
 * * `Europe/Gibraltar` - Europe/Gibraltar
 * * `Europe/Guernsey` - Europe/Guernsey
 * * `Europe/Helsinki` - Europe/Helsinki
 * * `Europe/Isle_of_Man` - Europe/Isle_of_Man
 * * `Europe/Istanbul` - Europe/Istanbul
 * * `Europe/Jersey` - Europe/Jersey
 * * `Europe/Kaliningrad` - Europe/Kaliningrad
 * * `Europe/Kirov` - Europe/Kirov
 * * `Europe/Kyiv` - Europe/Kyiv
 * * `Europe/Lisbon` - Europe/Lisbon
 * * `Europe/Ljubljana` - Europe/Ljubljana
 * * `Europe/London` - Europe/London
 * * `Europe/Luxembourg` - Europe/Luxembourg
 * * `Europe/Madrid` - Europe/Madrid
 * * `Europe/Malta` - Europe/Malta
 * * `Europe/Mariehamn` - Europe/Mariehamn
 * * `Europe/Minsk` - Europe/Minsk
 * * `Europe/Monaco` - Europe/Monaco
 * * `Europe/Moscow` - Europe/Moscow
 * * `Europe/Oslo` - Europe/Oslo
 * * `Europe/Paris` - Europe/Paris
 * * `Europe/Podgorica` - Europe/Podgorica
 * * `Europe/Prague` - Europe/Prague
 * * `Europe/Riga` - Europe/Riga
 * * `Europe/Rome` - Europe/Rome
 * * `Europe/Samara` - Europe/Samara
 * * `Europe/San_Marino` - Europe/San_Marino
 * * `Europe/Sarajevo` - Europe/Sarajevo
 * * `Europe/Saratov` - Europe/Saratov
 * * `Europe/Simferopol` - Europe/Simferopol
 * * `Europe/Skopje` - Europe/Skopje
 * * `Europe/Sofia` - Europe/Sofia
 * * `Europe/Stockholm` - Europe/Stockholm
 * * `Europe/Tallinn` - Europe/Tallinn
 * * `Europe/Tirane` - Europe/Tirane
 * * `Europe/Ulyanovsk` - Europe/Ulyanovsk
 * * `Europe/Vaduz` - Europe/Vaduz
 * * `Europe/Vatican` - Europe/Vatican
 * * `Europe/Vienna` - Europe/Vienna
 * * `Europe/Vilnius` - Europe/Vilnius
 * * `Europe/Volgograd` - Europe/Volgograd
 * * `Europe/Warsaw` - Europe/Warsaw
 * * `Europe/Zagreb` - Europe/Zagreb
 * * `Europe/Zurich` - Europe/Zurich
 * * `GMT` - GMT
 * * `Indian/Antananarivo` - Indian/Antananarivo
 * * `Indian/Chagos` - Indian/Chagos
 * * `Indian/Christmas` - Indian/Christmas
 * * `Indian/Cocos` - Indian/Cocos
 * * `Indian/Comoro` - Indian/Comoro
 * * `Indian/Kerguelen` - Indian/Kerguelen
 * * `Indian/Mahe` - Indian/Mahe
 * * `Indian/Maldives` - Indian/Maldives
 * * `Indian/Mauritius` - Indian/Mauritius
 * * `Indian/Mayotte` - Indian/Mayotte
 * * `Indian/Reunion` - Indian/Reunion
 * * `Pacific/Apia` - Pacific/Apia
 * * `Pacific/Auckland` - Pacific/Auckland
 * * `Pacific/Bougainville` - Pacific/Bougainville
 * * `Pacific/Chatham` - Pacific/Chatham
 * * `Pacific/Chuuk` - Pacific/Chuuk
 * * `Pacific/Easter` - Pacific/Easter
 * * `Pacific/Efate` - Pacific/Efate
 * * `Pacific/Fakaofo` - Pacific/Fakaofo
 * * `Pacific/Fiji` - Pacific/Fiji
 * * `Pacific/Funafuti` - Pacific/Funafuti
 * * `Pacific/Galapagos` - Pacific/Galapagos
 * * `Pacific/Gambier` - Pacific/Gambier
 * * `Pacific/Guadalcanal` - Pacific/Guadalcanal
 * * `Pacific/Guam` - Pacific/Guam
 * * `Pacific/Honolulu` - Pacific/Honolulu
 * * `Pacific/Kanton` - Pacific/Kanton
 * * `Pacific/Kiritimati` - Pacific/Kiritimati
 * * `Pacific/Kosrae` - Pacific/Kosrae
 * * `Pacific/Kwajalein` - Pacific/Kwajalein
 * * `Pacific/Majuro` - Pacific/Majuro
 * * `Pacific/Marquesas` - Pacific/Marquesas
 * * `Pacific/Midway` - Pacific/Midway
 * * `Pacific/Nauru` - Pacific/Nauru
 * * `Pacific/Niue` - Pacific/Niue
 * * `Pacific/Norfolk` - Pacific/Norfolk
 * * `Pacific/Noumea` - Pacific/Noumea
 * * `Pacific/Pago_Pago` - Pacific/Pago_Pago
 * * `Pacific/Palau` - Pacific/Palau
 * * `Pacific/Pitcairn` - Pacific/Pitcairn
 * * `Pacific/Pohnpei` - Pacific/Pohnpei
 * * `Pacific/Port_Moresby` - Pacific/Port_Moresby
 * * `Pacific/Rarotonga` - Pacific/Rarotonga
 * * `Pacific/Saipan` - Pacific/Saipan
 * * `Pacific/Tahiti` - Pacific/Tahiti
 * * `Pacific/Tarawa` - Pacific/Tarawa
 * * `Pacific/Tongatapu` - Pacific/Tongatapu
 * * `Pacific/Wake` - Pacific/Wake
 * * `Pacific/Wallis` - Pacific/Wallis
 * * `US/Alaska` - US/Alaska
 * * `US/Arizona` - US/Arizona
 * * `US/Central` - US/Central
 * * `US/Eastern` - US/Eastern
 * * `US/Hawaii` - US/Hawaii
 * * `US/Mountain` - US/Mountain
 * * `US/Pacific` - US/Pacific
 * * `UTC` - UTC
 */
export enum PangeaTimezoneEnum {
  AfricaAbidjan = 'Africa/Abidjan',
  AfricaAccra = 'Africa/Accra',
  AfricaAddisAbaba = 'Africa/Addis_Ababa',
  AfricaAlgiers = 'Africa/Algiers',
  AfricaAsmara = 'Africa/Asmara',
  AfricaBamako = 'Africa/Bamako',
  AfricaBangui = 'Africa/Bangui',
  AfricaBanjul = 'Africa/Banjul',
  AfricaBissau = 'Africa/Bissau',
  AfricaBlantyre = 'Africa/Blantyre',
  AfricaBrazzaville = 'Africa/Brazzaville',
  AfricaBujumbura = 'Africa/Bujumbura',
  AfricaCairo = 'Africa/Cairo',
  AfricaCasablanca = 'Africa/Casablanca',
  AfricaCeuta = 'Africa/Ceuta',
  AfricaConakry = 'Africa/Conakry',
  AfricaDakar = 'Africa/Dakar',
  AfricaDarEsSalaam = 'Africa/Dar_es_Salaam',
  AfricaDjibouti = 'Africa/Djibouti',
  AfricaDouala = 'Africa/Douala',
  AfricaElAaiun = 'Africa/El_Aaiun',
  AfricaFreetown = 'Africa/Freetown',
  AfricaGaborone = 'Africa/Gaborone',
  AfricaHarare = 'Africa/Harare',
  AfricaJohannesburg = 'Africa/Johannesburg',
  AfricaJuba = 'Africa/Juba',
  AfricaKampala = 'Africa/Kampala',
  AfricaKhartoum = 'Africa/Khartoum',
  AfricaKigali = 'Africa/Kigali',
  AfricaKinshasa = 'Africa/Kinshasa',
  AfricaLagos = 'Africa/Lagos',
  AfricaLibreville = 'Africa/Libreville',
  AfricaLome = 'Africa/Lome',
  AfricaLuanda = 'Africa/Luanda',
  AfricaLubumbashi = 'Africa/Lubumbashi',
  AfricaLusaka = 'Africa/Lusaka',
  AfricaMalabo = 'Africa/Malabo',
  AfricaMaputo = 'Africa/Maputo',
  AfricaMaseru = 'Africa/Maseru',
  AfricaMbabane = 'Africa/Mbabane',
  AfricaMogadishu = 'Africa/Mogadishu',
  AfricaMonrovia = 'Africa/Monrovia',
  AfricaNairobi = 'Africa/Nairobi',
  AfricaNdjamena = 'Africa/Ndjamena',
  AfricaNiamey = 'Africa/Niamey',
  AfricaNouakchott = 'Africa/Nouakchott',
  AfricaOuagadougou = 'Africa/Ouagadougou',
  AfricaPortoNovo = 'Africa/Porto-Novo',
  AfricaSaoTome = 'Africa/Sao_Tome',
  AfricaTripoli = 'Africa/Tripoli',
  AfricaTunis = 'Africa/Tunis',
  AfricaWindhoek = 'Africa/Windhoek',
  AmericaAdak = 'America/Adak',
  AmericaAnchorage = 'America/Anchorage',
  AmericaAnguilla = 'America/Anguilla',
  AmericaAntigua = 'America/Antigua',
  AmericaAraguaina = 'America/Araguaina',
  AmericaArgentinaBuenosAires = 'America/Argentina/Buenos_Aires',
  AmericaArgentinaCatamarca = 'America/Argentina/Catamarca',
  AmericaArgentinaCordoba = 'America/Argentina/Cordoba',
  AmericaArgentinaJujuy = 'America/Argentina/Jujuy',
  AmericaArgentinaLaRioja = 'America/Argentina/La_Rioja',
  AmericaArgentinaMendoza = 'America/Argentina/Mendoza',
  AmericaArgentinaRioGallegos = 'America/Argentina/Rio_Gallegos',
  AmericaArgentinaSalta = 'America/Argentina/Salta',
  AmericaArgentinaSanJuan = 'America/Argentina/San_Juan',
  AmericaArgentinaSanLuis = 'America/Argentina/San_Luis',
  AmericaArgentinaTucuman = 'America/Argentina/Tucuman',
  AmericaArgentinaUshuaia = 'America/Argentina/Ushuaia',
  AmericaAruba = 'America/Aruba',
  AmericaAsuncion = 'America/Asuncion',
  AmericaAtikokan = 'America/Atikokan',
  AmericaBahia = 'America/Bahia',
  AmericaBahiaBanderas = 'America/Bahia_Banderas',
  AmericaBarbados = 'America/Barbados',
  AmericaBelem = 'America/Belem',
  AmericaBelize = 'America/Belize',
  AmericaBlancSablon = 'America/Blanc-Sablon',
  AmericaBoaVista = 'America/Boa_Vista',
  AmericaBogota = 'America/Bogota',
  AmericaBoise = 'America/Boise',
  AmericaCambridgeBay = 'America/Cambridge_Bay',
  AmericaCampoGrande = 'America/Campo_Grande',
  AmericaCancun = 'America/Cancun',
  AmericaCaracas = 'America/Caracas',
  AmericaCayenne = 'America/Cayenne',
  AmericaCayman = 'America/Cayman',
  AmericaChicago = 'America/Chicago',
  AmericaChihuahua = 'America/Chihuahua',
  AmericaCiudadJuarez = 'America/Ciudad_Juarez',
  AmericaCostaRica = 'America/Costa_Rica',
  AmericaCreston = 'America/Creston',
  AmericaCuiaba = 'America/Cuiaba',
  AmericaCuracao = 'America/Curacao',
  AmericaDanmarkshavn = 'America/Danmarkshavn',
  AmericaDawson = 'America/Dawson',
  AmericaDawsonCreek = 'America/Dawson_Creek',
  AmericaDenver = 'America/Denver',
  AmericaDetroit = 'America/Detroit',
  AmericaDominica = 'America/Dominica',
  AmericaEdmonton = 'America/Edmonton',
  AmericaEirunepe = 'America/Eirunepe',
  AmericaElSalvador = 'America/El_Salvador',
  AmericaFortNelson = 'America/Fort_Nelson',
  AmericaFortaleza = 'America/Fortaleza',
  AmericaGlaceBay = 'America/Glace_Bay',
  AmericaGooseBay = 'America/Goose_Bay',
  AmericaGrandTurk = 'America/Grand_Turk',
  AmericaGrenada = 'America/Grenada',
  AmericaGuadeloupe = 'America/Guadeloupe',
  AmericaGuatemala = 'America/Guatemala',
  AmericaGuayaquil = 'America/Guayaquil',
  AmericaGuyana = 'America/Guyana',
  AmericaHalifax = 'America/Halifax',
  AmericaHavana = 'America/Havana',
  AmericaHermosillo = 'America/Hermosillo',
  AmericaIndianaIndianapolis = 'America/Indiana/Indianapolis',
  AmericaIndianaKnox = 'America/Indiana/Knox',
  AmericaIndianaMarengo = 'America/Indiana/Marengo',
  AmericaIndianaPetersburg = 'America/Indiana/Petersburg',
  AmericaIndianaTellCity = 'America/Indiana/Tell_City',
  AmericaIndianaVevay = 'America/Indiana/Vevay',
  AmericaIndianaVincennes = 'America/Indiana/Vincennes',
  AmericaIndianaWinamac = 'America/Indiana/Winamac',
  AmericaInuvik = 'America/Inuvik',
  AmericaIqaluit = 'America/Iqaluit',
  AmericaJamaica = 'America/Jamaica',
  AmericaJuneau = 'America/Juneau',
  AmericaKentuckyLouisville = 'America/Kentucky/Louisville',
  AmericaKentuckyMonticello = 'America/Kentucky/Monticello',
  AmericaKralendijk = 'America/Kralendijk',
  AmericaLaPaz = 'America/La_Paz',
  AmericaLima = 'America/Lima',
  AmericaLosAngeles = 'America/Los_Angeles',
  AmericaLowerPrinces = 'America/Lower_Princes',
  AmericaMaceio = 'America/Maceio',
  AmericaManagua = 'America/Managua',
  AmericaManaus = 'America/Manaus',
  AmericaMarigot = 'America/Marigot',
  AmericaMartinique = 'America/Martinique',
  AmericaMatamoros = 'America/Matamoros',
  AmericaMazatlan = 'America/Mazatlan',
  AmericaMenominee = 'America/Menominee',
  AmericaMerida = 'America/Merida',
  AmericaMetlakatla = 'America/Metlakatla',
  AmericaMexicoCity = 'America/Mexico_City',
  AmericaMiquelon = 'America/Miquelon',
  AmericaMoncton = 'America/Moncton',
  AmericaMonterrey = 'America/Monterrey',
  AmericaMontevideo = 'America/Montevideo',
  AmericaMontserrat = 'America/Montserrat',
  AmericaNassau = 'America/Nassau',
  AmericaNewYork = 'America/New_York',
  AmericaNome = 'America/Nome',
  AmericaNoronha = 'America/Noronha',
  AmericaNorthDakotaBeulah = 'America/North_Dakota/Beulah',
  AmericaNorthDakotaCenter = 'America/North_Dakota/Center',
  AmericaNorthDakotaNewSalem = 'America/North_Dakota/New_Salem',
  AmericaNuuk = 'America/Nuuk',
  AmericaOjinaga = 'America/Ojinaga',
  AmericaPanama = 'America/Panama',
  AmericaParamaribo = 'America/Paramaribo',
  AmericaPhoenix = 'America/Phoenix',
  AmericaPortAuPrince = 'America/Port-au-Prince',
  AmericaPortOfSpain = 'America/Port_of_Spain',
  AmericaPortoVelho = 'America/Porto_Velho',
  AmericaPuertoRico = 'America/Puerto_Rico',
  AmericaPuntaArenas = 'America/Punta_Arenas',
  AmericaRankinInlet = 'America/Rankin_Inlet',
  AmericaRecife = 'America/Recife',
  AmericaRegina = 'America/Regina',
  AmericaResolute = 'America/Resolute',
  AmericaRioBranco = 'America/Rio_Branco',
  AmericaSantarem = 'America/Santarem',
  AmericaSantiago = 'America/Santiago',
  AmericaSantoDomingo = 'America/Santo_Domingo',
  AmericaSaoPaulo = 'America/Sao_Paulo',
  AmericaScoresbysund = 'America/Scoresbysund',
  AmericaSitka = 'America/Sitka',
  AmericaStBarthelemy = 'America/St_Barthelemy',
  AmericaStJohns = 'America/St_Johns',
  AmericaStKitts = 'America/St_Kitts',
  AmericaStLucia = 'America/St_Lucia',
  AmericaStThomas = 'America/St_Thomas',
  AmericaStVincent = 'America/St_Vincent',
  AmericaSwiftCurrent = 'America/Swift_Current',
  AmericaTegucigalpa = 'America/Tegucigalpa',
  AmericaThule = 'America/Thule',
  AmericaTijuana = 'America/Tijuana',
  AmericaToronto = 'America/Toronto',
  AmericaTortola = 'America/Tortola',
  AmericaVancouver = 'America/Vancouver',
  AmericaWhitehorse = 'America/Whitehorse',
  AmericaWinnipeg = 'America/Winnipeg',
  AmericaYakutat = 'America/Yakutat',
  AntarcticaCasey = 'Antarctica/Casey',
  AntarcticaDavis = 'Antarctica/Davis',
  AntarcticaDumontDUrville = 'Antarctica/DumontDUrville',
  AntarcticaMacquarie = 'Antarctica/Macquarie',
  AntarcticaMawson = 'Antarctica/Mawson',
  AntarcticaMcMurdo = 'Antarctica/McMurdo',
  AntarcticaPalmer = 'Antarctica/Palmer',
  AntarcticaRothera = 'Antarctica/Rothera',
  AntarcticaSyowa = 'Antarctica/Syowa',
  AntarcticaTroll = 'Antarctica/Troll',
  AntarcticaVostok = 'Antarctica/Vostok',
  ArcticLongyearbyen = 'Arctic/Longyearbyen',
  AsiaAden = 'Asia/Aden',
  AsiaAlmaty = 'Asia/Almaty',
  AsiaAmman = 'Asia/Amman',
  AsiaAnadyr = 'Asia/Anadyr',
  AsiaAqtau = 'Asia/Aqtau',
  AsiaAqtobe = 'Asia/Aqtobe',
  AsiaAshgabat = 'Asia/Ashgabat',
  AsiaAtyrau = 'Asia/Atyrau',
  AsiaBaghdad = 'Asia/Baghdad',
  AsiaBahrain = 'Asia/Bahrain',
  AsiaBaku = 'Asia/Baku',
  AsiaBangkok = 'Asia/Bangkok',
  AsiaBarnaul = 'Asia/Barnaul',
  AsiaBeirut = 'Asia/Beirut',
  AsiaBishkek = 'Asia/Bishkek',
  AsiaBrunei = 'Asia/Brunei',
  AsiaChita = 'Asia/Chita',
  AsiaColombo = 'Asia/Colombo',
  AsiaDamascus = 'Asia/Damascus',
  AsiaDhaka = 'Asia/Dhaka',
  AsiaDili = 'Asia/Dili',
  AsiaDubai = 'Asia/Dubai',
  AsiaDushanbe = 'Asia/Dushanbe',
  AsiaFamagusta = 'Asia/Famagusta',
  AsiaGaza = 'Asia/Gaza',
  AsiaHebron = 'Asia/Hebron',
  AsiaHoChiMinh = 'Asia/Ho_Chi_Minh',
  AsiaHongKong = 'Asia/Hong_Kong',
  AsiaHovd = 'Asia/Hovd',
  AsiaIrkutsk = 'Asia/Irkutsk',
  AsiaJakarta = 'Asia/Jakarta',
  AsiaJayapura = 'Asia/Jayapura',
  AsiaJerusalem = 'Asia/Jerusalem',
  AsiaKabul = 'Asia/Kabul',
  AsiaKamchatka = 'Asia/Kamchatka',
  AsiaKarachi = 'Asia/Karachi',
  AsiaKathmandu = 'Asia/Kathmandu',
  AsiaKhandyga = 'Asia/Khandyga',
  AsiaKolkata = 'Asia/Kolkata',
  AsiaKrasnoyarsk = 'Asia/Krasnoyarsk',
  AsiaKualaLumpur = 'Asia/Kuala_Lumpur',
  AsiaKuching = 'Asia/Kuching',
  AsiaKuwait = 'Asia/Kuwait',
  AsiaMacau = 'Asia/Macau',
  AsiaMagadan = 'Asia/Magadan',
  AsiaMakassar = 'Asia/Makassar',
  AsiaManila = 'Asia/Manila',
  AsiaMuscat = 'Asia/Muscat',
  AsiaNicosia = 'Asia/Nicosia',
  AsiaNovokuznetsk = 'Asia/Novokuznetsk',
  AsiaNovosibirsk = 'Asia/Novosibirsk',
  AsiaOmsk = 'Asia/Omsk',
  AsiaOral = 'Asia/Oral',
  AsiaPhnomPenh = 'Asia/Phnom_Penh',
  AsiaPontianak = 'Asia/Pontianak',
  AsiaPyongyang = 'Asia/Pyongyang',
  AsiaQatar = 'Asia/Qatar',
  AsiaQostanay = 'Asia/Qostanay',
  AsiaQyzylorda = 'Asia/Qyzylorda',
  AsiaRiyadh = 'Asia/Riyadh',
  AsiaSakhalin = 'Asia/Sakhalin',
  AsiaSamarkand = 'Asia/Samarkand',
  AsiaSeoul = 'Asia/Seoul',
  AsiaShanghai = 'Asia/Shanghai',
  AsiaSingapore = 'Asia/Singapore',
  AsiaSrednekolymsk = 'Asia/Srednekolymsk',
  AsiaTaipei = 'Asia/Taipei',
  AsiaTashkent = 'Asia/Tashkent',
  AsiaTbilisi = 'Asia/Tbilisi',
  AsiaTehran = 'Asia/Tehran',
  AsiaThimphu = 'Asia/Thimphu',
  AsiaTokyo = 'Asia/Tokyo',
  AsiaTomsk = 'Asia/Tomsk',
  AsiaUlaanbaatar = 'Asia/Ulaanbaatar',
  AsiaUrumqi = 'Asia/Urumqi',
  AsiaUstNera = 'Asia/Ust-Nera',
  AsiaVientiane = 'Asia/Vientiane',
  AsiaVladivostok = 'Asia/Vladivostok',
  AsiaYakutsk = 'Asia/Yakutsk',
  AsiaYangon = 'Asia/Yangon',
  AsiaYekaterinburg = 'Asia/Yekaterinburg',
  AsiaYerevan = 'Asia/Yerevan',
  AtlanticAzores = 'Atlantic/Azores',
  AtlanticBermuda = 'Atlantic/Bermuda',
  AtlanticCanary = 'Atlantic/Canary',
  AtlanticCapeVerde = 'Atlantic/Cape_Verde',
  AtlanticFaroe = 'Atlantic/Faroe',
  AtlanticMadeira = 'Atlantic/Madeira',
  AtlanticReykjavik = 'Atlantic/Reykjavik',
  AtlanticSouthGeorgia = 'Atlantic/South_Georgia',
  AtlanticStHelena = 'Atlantic/St_Helena',
  AtlanticStanley = 'Atlantic/Stanley',
  AustraliaAdelaide = 'Australia/Adelaide',
  AustraliaBrisbane = 'Australia/Brisbane',
  AustraliaBrokenHill = 'Australia/Broken_Hill',
  AustraliaDarwin = 'Australia/Darwin',
  AustraliaEucla = 'Australia/Eucla',
  AustraliaHobart = 'Australia/Hobart',
  AustraliaLindeman = 'Australia/Lindeman',
  AustraliaLordHowe = 'Australia/Lord_Howe',
  AustraliaMelbourne = 'Australia/Melbourne',
  AustraliaPerth = 'Australia/Perth',
  AustraliaSydney = 'Australia/Sydney',
  CanadaAtlantic = 'Canada/Atlantic',
  CanadaCentral = 'Canada/Central',
  CanadaEastern = 'Canada/Eastern',
  CanadaMountain = 'Canada/Mountain',
  CanadaNewfoundland = 'Canada/Newfoundland',
  CanadaPacific = 'Canada/Pacific',
  EuropeAmsterdam = 'Europe/Amsterdam',
  EuropeAndorra = 'Europe/Andorra',
  EuropeAstrakhan = 'Europe/Astrakhan',
  EuropeAthens = 'Europe/Athens',
  EuropeBelgrade = 'Europe/Belgrade',
  EuropeBerlin = 'Europe/Berlin',
  EuropeBratislava = 'Europe/Bratislava',
  EuropeBrussels = 'Europe/Brussels',
  EuropeBucharest = 'Europe/Bucharest',
  EuropeBudapest = 'Europe/Budapest',
  EuropeBusingen = 'Europe/Busingen',
  EuropeChisinau = 'Europe/Chisinau',
  EuropeCopenhagen = 'Europe/Copenhagen',
  EuropeDublin = 'Europe/Dublin',
  EuropeGibraltar = 'Europe/Gibraltar',
  EuropeGuernsey = 'Europe/Guernsey',
  EuropeHelsinki = 'Europe/Helsinki',
  EuropeIsleOfMan = 'Europe/Isle_of_Man',
  EuropeIstanbul = 'Europe/Istanbul',
  EuropeJersey = 'Europe/Jersey',
  EuropeKaliningrad = 'Europe/Kaliningrad',
  EuropeKirov = 'Europe/Kirov',
  EuropeKyiv = 'Europe/Kyiv',
  EuropeLisbon = 'Europe/Lisbon',
  EuropeLjubljana = 'Europe/Ljubljana',
  EuropeLondon = 'Europe/London',
  EuropeLuxembourg = 'Europe/Luxembourg',
  EuropeMadrid = 'Europe/Madrid',
  EuropeMalta = 'Europe/Malta',
  EuropeMariehamn = 'Europe/Mariehamn',
  EuropeMinsk = 'Europe/Minsk',
  EuropeMonaco = 'Europe/Monaco',
  EuropeMoscow = 'Europe/Moscow',
  EuropeOslo = 'Europe/Oslo',
  EuropeParis = 'Europe/Paris',
  EuropePodgorica = 'Europe/Podgorica',
  EuropePrague = 'Europe/Prague',
  EuropeRiga = 'Europe/Riga',
  EuropeRome = 'Europe/Rome',
  EuropeSamara = 'Europe/Samara',
  EuropeSanMarino = 'Europe/San_Marino',
  EuropeSarajevo = 'Europe/Sarajevo',
  EuropeSaratov = 'Europe/Saratov',
  EuropeSimferopol = 'Europe/Simferopol',
  EuropeSkopje = 'Europe/Skopje',
  EuropeSofia = 'Europe/Sofia',
  EuropeStockholm = 'Europe/Stockholm',
  EuropeTallinn = 'Europe/Tallinn',
  EuropeTirane = 'Europe/Tirane',
  EuropeUlyanovsk = 'Europe/Ulyanovsk',
  EuropeVaduz = 'Europe/Vaduz',
  EuropeVatican = 'Europe/Vatican',
  EuropeVienna = 'Europe/Vienna',
  EuropeVilnius = 'Europe/Vilnius',
  EuropeVolgograd = 'Europe/Volgograd',
  EuropeWarsaw = 'Europe/Warsaw',
  EuropeZagreb = 'Europe/Zagreb',
  EuropeZurich = 'Europe/Zurich',
  GMT = 'GMT',
  IndianAntananarivo = 'Indian/Antananarivo',
  IndianChagos = 'Indian/Chagos',
  IndianChristmas = 'Indian/Christmas',
  IndianCocos = 'Indian/Cocos',
  IndianComoro = 'Indian/Comoro',
  IndianKerguelen = 'Indian/Kerguelen',
  IndianMahe = 'Indian/Mahe',
  IndianMaldives = 'Indian/Maldives',
  IndianMauritius = 'Indian/Mauritius',
  IndianMayotte = 'Indian/Mayotte',
  IndianReunion = 'Indian/Reunion',
  PacificApia = 'Pacific/Apia',
  PacificAuckland = 'Pacific/Auckland',
  PacificBougainville = 'Pacific/Bougainville',
  PacificChatham = 'Pacific/Chatham',
  PacificChuuk = 'Pacific/Chuuk',
  PacificEaster = 'Pacific/Easter',
  PacificEfate = 'Pacific/Efate',
  PacificFakaofo = 'Pacific/Fakaofo',
  PacificFiji = 'Pacific/Fiji',
  PacificFunafuti = 'Pacific/Funafuti',
  PacificGalapagos = 'Pacific/Galapagos',
  PacificGambier = 'Pacific/Gambier',
  PacificGuadalcanal = 'Pacific/Guadalcanal',
  PacificGuam = 'Pacific/Guam',
  PacificHonolulu = 'Pacific/Honolulu',
  PacificKanton = 'Pacific/Kanton',
  PacificKiritimati = 'Pacific/Kiritimati',
  PacificKosrae = 'Pacific/Kosrae',
  PacificKwajalein = 'Pacific/Kwajalein',
  PacificMajuro = 'Pacific/Majuro',
  PacificMarquesas = 'Pacific/Marquesas',
  PacificMidway = 'Pacific/Midway',
  PacificNauru = 'Pacific/Nauru',
  PacificNiue = 'Pacific/Niue',
  PacificNorfolk = 'Pacific/Norfolk',
  PacificNoumea = 'Pacific/Noumea',
  PacificPagoPago = 'Pacific/Pago_Pago',
  PacificPalau = 'Pacific/Palau',
  PacificPitcairn = 'Pacific/Pitcairn',
  PacificPohnpei = 'Pacific/Pohnpei',
  PacificPortMoresby = 'Pacific/Port_Moresby',
  PacificRarotonga = 'Pacific/Rarotonga',
  PacificSaipan = 'Pacific/Saipan',
  PacificTahiti = 'Pacific/Tahiti',
  PacificTarawa = 'Pacific/Tarawa',
  PacificTongatapu = 'Pacific/Tongatapu',
  PacificWake = 'Pacific/Wake',
  PacificWallis = 'Pacific/Wallis',
  USAlaska = 'US/Alaska',
  USArizona = 'US/Arizona',
  USCentral = 'US/Central',
  USEastern = 'US/Eastern',
  USHawaii = 'US/Hawaii',
  USMountain = 'US/Mountain',
  USPacific = 'US/Pacific',
  UTC = 'UTC',
}

/**
 * * `SSN` - SSN
 * * `NonUS_NationId` - NonUS_NationId
 * * `EIN` - EIN
 */
export enum PangeaTinTypeEnum {
  SSN = 'SSN',
  NonUSNationId = 'NonUS_NationId',
  EIN = 'EIN',
}

/**
 * * `All` - All
 * * `Allocation` - Allocation
 * * `Fee` - Fee
 * * `Spot` - Spot
 * * `Spot_trade` - Spot Trade
 * * `Drawdown` - Drawdown
 */
export enum PangeaToPurposeEnum {
  All = 'All',
  Allocation = 'Allocation',
  Fee = 'Fee',
  Spot = 'Spot',
  SpotTrade = 'Spot_trade',
  Drawdown = 'Drawdown',
}

export interface PangeaTokenObtainPair {
  email: string;
  password: string;
}

export interface PangeaTokenObtainPairResponse {
  access: string;
  refresh: string;
}

export interface PangeaTokenRefresh {
  access: string;
  refresh: string;
}

export interface PangeaTokenRefreshResponse {
  access: string;
}

export interface PangeaTokenVerify {
  token: string;
}

export interface PangeaTrade {
  fx_pair: string;
  units: string;
  price: string;
  date: string;
}

export interface PangeaTradingCalendar {
  /** @format date-time */
  start_date?: string | null;
  /** @format date-time */
  end_date?: string | null;
  is_closed?: boolean;
  pair_id: number;
}

export interface PangeaTradingHours {
  id: number;
  /** @format date-time */
  date: string;
  /** @format date-time */
  start_date?: string | null;
  /** @format date-time */
  end_date?: string | null;
  is_closed?: boolean;
  data_cut: number;
  future_contract: number;
}

export interface PangeaUpdateNDF {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  request: number;
  pair: number;
  /** @format double */
  amount: number;
  /** @format date */
  delivery_date: string;
}

export interface PangeaUpdateRequest {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /**
   * * `cashflow_details` - Cashflow Details
   * * `risk_details` - Risk Details
   * * `drawdown` - drawdown
   * * `nsf` - Non sellable forward
   * * `ndf` - Non deliverable forward
   */
  type: PangeaUpdateRequestTypeEnum;
  request_details: string;
  status: string;
  company?: number;
  user: number;
}

/**
 * * `cashflow_details` - Cashflow Details
 * * `risk_details` - Risk Details
 * * `drawdown` - drawdown
 * * `nsf` - Non sellable forward
 * * `ndf` - Non deliverable forward
 */
export enum PangeaUpdateRequestTypeEnum {
  CashflowDetails = 'cashflow_details',
  RiskDetails = 'risk_details',
  Drawdown = 'drawdown',
  Nsf = 'nsf',
  Ndf = 'ndf',
}

export interface PangeaUpdateUserPermissionGroup {
  /** @default "customer_viewer" */
  group?: PangeaGroupEnum;
}

/**
 * * `C` - Corporation
 * * `P` - Partnership
 * * `E` - Disregarded Entity
 */
export enum PangeaUsTaxPurposeTypeEnum {
  C = 'C',
  P = 'P',
  E = 'E',
}

export interface PangeaUser {
  id: number;
  first_name: string;
  /** @maxLength 150 */
  last_name?: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Active
   * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
   */
  is_active?: boolean;
  phone?: string;
  phone_confirmed?: boolean;
  company: PangeaCompany;
  /**
   * * `Africa/Abidjan` - Africa/Abidjan
   * * `Africa/Accra` - Africa/Accra
   * * `Africa/Addis_Ababa` - Africa/Addis_Ababa
   * * `Africa/Algiers` - Africa/Algiers
   * * `Africa/Asmara` - Africa/Asmara
   * * `Africa/Bamako` - Africa/Bamako
   * * `Africa/Bangui` - Africa/Bangui
   * * `Africa/Banjul` - Africa/Banjul
   * * `Africa/Bissau` - Africa/Bissau
   * * `Africa/Blantyre` - Africa/Blantyre
   * * `Africa/Brazzaville` - Africa/Brazzaville
   * * `Africa/Bujumbura` - Africa/Bujumbura
   * * `Africa/Cairo` - Africa/Cairo
   * * `Africa/Casablanca` - Africa/Casablanca
   * * `Africa/Ceuta` - Africa/Ceuta
   * * `Africa/Conakry` - Africa/Conakry
   * * `Africa/Dakar` - Africa/Dakar
   * * `Africa/Dar_es_Salaam` - Africa/Dar_es_Salaam
   * * `Africa/Djibouti` - Africa/Djibouti
   * * `Africa/Douala` - Africa/Douala
   * * `Africa/El_Aaiun` - Africa/El_Aaiun
   * * `Africa/Freetown` - Africa/Freetown
   * * `Africa/Gaborone` - Africa/Gaborone
   * * `Africa/Harare` - Africa/Harare
   * * `Africa/Johannesburg` - Africa/Johannesburg
   * * `Africa/Juba` - Africa/Juba
   * * `Africa/Kampala` - Africa/Kampala
   * * `Africa/Khartoum` - Africa/Khartoum
   * * `Africa/Kigali` - Africa/Kigali
   * * `Africa/Kinshasa` - Africa/Kinshasa
   * * `Africa/Lagos` - Africa/Lagos
   * * `Africa/Libreville` - Africa/Libreville
   * * `Africa/Lome` - Africa/Lome
   * * `Africa/Luanda` - Africa/Luanda
   * * `Africa/Lubumbashi` - Africa/Lubumbashi
   * * `Africa/Lusaka` - Africa/Lusaka
   * * `Africa/Malabo` - Africa/Malabo
   * * `Africa/Maputo` - Africa/Maputo
   * * `Africa/Maseru` - Africa/Maseru
   * * `Africa/Mbabane` - Africa/Mbabane
   * * `Africa/Mogadishu` - Africa/Mogadishu
   * * `Africa/Monrovia` - Africa/Monrovia
   * * `Africa/Nairobi` - Africa/Nairobi
   * * `Africa/Ndjamena` - Africa/Ndjamena
   * * `Africa/Niamey` - Africa/Niamey
   * * `Africa/Nouakchott` - Africa/Nouakchott
   * * `Africa/Ouagadougou` - Africa/Ouagadougou
   * * `Africa/Porto-Novo` - Africa/Porto-Novo
   * * `Africa/Sao_Tome` - Africa/Sao_Tome
   * * `Africa/Tripoli` - Africa/Tripoli
   * * `Africa/Tunis` - Africa/Tunis
   * * `Africa/Windhoek` - Africa/Windhoek
   * * `America/Adak` - America/Adak
   * * `America/Anchorage` - America/Anchorage
   * * `America/Anguilla` - America/Anguilla
   * * `America/Antigua` - America/Antigua
   * * `America/Araguaina` - America/Araguaina
   * * `America/Argentina/Buenos_Aires` - America/Argentina/Buenos_Aires
   * * `America/Argentina/Catamarca` - America/Argentina/Catamarca
   * * `America/Argentina/Cordoba` - America/Argentina/Cordoba
   * * `America/Argentina/Jujuy` - America/Argentina/Jujuy
   * * `America/Argentina/La_Rioja` - America/Argentina/La_Rioja
   * * `America/Argentina/Mendoza` - America/Argentina/Mendoza
   * * `America/Argentina/Rio_Gallegos` - America/Argentina/Rio_Gallegos
   * * `America/Argentina/Salta` - America/Argentina/Salta
   * * `America/Argentina/San_Juan` - America/Argentina/San_Juan
   * * `America/Argentina/San_Luis` - America/Argentina/San_Luis
   * * `America/Argentina/Tucuman` - America/Argentina/Tucuman
   * * `America/Argentina/Ushuaia` - America/Argentina/Ushuaia
   * * `America/Aruba` - America/Aruba
   * * `America/Asuncion` - America/Asuncion
   * * `America/Atikokan` - America/Atikokan
   * * `America/Bahia` - America/Bahia
   * * `America/Bahia_Banderas` - America/Bahia_Banderas
   * * `America/Barbados` - America/Barbados
   * * `America/Belem` - America/Belem
   * * `America/Belize` - America/Belize
   * * `America/Blanc-Sablon` - America/Blanc-Sablon
   * * `America/Boa_Vista` - America/Boa_Vista
   * * `America/Bogota` - America/Bogota
   * * `America/Boise` - America/Boise
   * * `America/Cambridge_Bay` - America/Cambridge_Bay
   * * `America/Campo_Grande` - America/Campo_Grande
   * * `America/Cancun` - America/Cancun
   * * `America/Caracas` - America/Caracas
   * * `America/Cayenne` - America/Cayenne
   * * `America/Cayman` - America/Cayman
   * * `America/Chicago` - America/Chicago
   * * `America/Chihuahua` - America/Chihuahua
   * * `America/Ciudad_Juarez` - America/Ciudad_Juarez
   * * `America/Costa_Rica` - America/Costa_Rica
   * * `America/Creston` - America/Creston
   * * `America/Cuiaba` - America/Cuiaba
   * * `America/Curacao` - America/Curacao
   * * `America/Danmarkshavn` - America/Danmarkshavn
   * * `America/Dawson` - America/Dawson
   * * `America/Dawson_Creek` - America/Dawson_Creek
   * * `America/Denver` - America/Denver
   * * `America/Detroit` - America/Detroit
   * * `America/Dominica` - America/Dominica
   * * `America/Edmonton` - America/Edmonton
   * * `America/Eirunepe` - America/Eirunepe
   * * `America/El_Salvador` - America/El_Salvador
   * * `America/Fort_Nelson` - America/Fort_Nelson
   * * `America/Fortaleza` - America/Fortaleza
   * * `America/Glace_Bay` - America/Glace_Bay
   * * `America/Goose_Bay` - America/Goose_Bay
   * * `America/Grand_Turk` - America/Grand_Turk
   * * `America/Grenada` - America/Grenada
   * * `America/Guadeloupe` - America/Guadeloupe
   * * `America/Guatemala` - America/Guatemala
   * * `America/Guayaquil` - America/Guayaquil
   * * `America/Guyana` - America/Guyana
   * * `America/Halifax` - America/Halifax
   * * `America/Havana` - America/Havana
   * * `America/Hermosillo` - America/Hermosillo
   * * `America/Indiana/Indianapolis` - America/Indiana/Indianapolis
   * * `America/Indiana/Knox` - America/Indiana/Knox
   * * `America/Indiana/Marengo` - America/Indiana/Marengo
   * * `America/Indiana/Petersburg` - America/Indiana/Petersburg
   * * `America/Indiana/Tell_City` - America/Indiana/Tell_City
   * * `America/Indiana/Vevay` - America/Indiana/Vevay
   * * `America/Indiana/Vincennes` - America/Indiana/Vincennes
   * * `America/Indiana/Winamac` - America/Indiana/Winamac
   * * `America/Inuvik` - America/Inuvik
   * * `America/Iqaluit` - America/Iqaluit
   * * `America/Jamaica` - America/Jamaica
   * * `America/Juneau` - America/Juneau
   * * `America/Kentucky/Louisville` - America/Kentucky/Louisville
   * * `America/Kentucky/Monticello` - America/Kentucky/Monticello
   * * `America/Kralendijk` - America/Kralendijk
   * * `America/La_Paz` - America/La_Paz
   * * `America/Lima` - America/Lima
   * * `America/Los_Angeles` - America/Los_Angeles
   * * `America/Lower_Princes` - America/Lower_Princes
   * * `America/Maceio` - America/Maceio
   * * `America/Managua` - America/Managua
   * * `America/Manaus` - America/Manaus
   * * `America/Marigot` - America/Marigot
   * * `America/Martinique` - America/Martinique
   * * `America/Matamoros` - America/Matamoros
   * * `America/Mazatlan` - America/Mazatlan
   * * `America/Menominee` - America/Menominee
   * * `America/Merida` - America/Merida
   * * `America/Metlakatla` - America/Metlakatla
   * * `America/Mexico_City` - America/Mexico_City
   * * `America/Miquelon` - America/Miquelon
   * * `America/Moncton` - America/Moncton
   * * `America/Monterrey` - America/Monterrey
   * * `America/Montevideo` - America/Montevideo
   * * `America/Montserrat` - America/Montserrat
   * * `America/Nassau` - America/Nassau
   * * `America/New_York` - America/New_York
   * * `America/Nome` - America/Nome
   * * `America/Noronha` - America/Noronha
   * * `America/North_Dakota/Beulah` - America/North_Dakota/Beulah
   * * `America/North_Dakota/Center` - America/North_Dakota/Center
   * * `America/North_Dakota/New_Salem` - America/North_Dakota/New_Salem
   * * `America/Nuuk` - America/Nuuk
   * * `America/Ojinaga` - America/Ojinaga
   * * `America/Panama` - America/Panama
   * * `America/Paramaribo` - America/Paramaribo
   * * `America/Phoenix` - America/Phoenix
   * * `America/Port-au-Prince` - America/Port-au-Prince
   * * `America/Port_of_Spain` - America/Port_of_Spain
   * * `America/Porto_Velho` - America/Porto_Velho
   * * `America/Puerto_Rico` - America/Puerto_Rico
   * * `America/Punta_Arenas` - America/Punta_Arenas
   * * `America/Rankin_Inlet` - America/Rankin_Inlet
   * * `America/Recife` - America/Recife
   * * `America/Regina` - America/Regina
   * * `America/Resolute` - America/Resolute
   * * `America/Rio_Branco` - America/Rio_Branco
   * * `America/Santarem` - America/Santarem
   * * `America/Santiago` - America/Santiago
   * * `America/Santo_Domingo` - America/Santo_Domingo
   * * `America/Sao_Paulo` - America/Sao_Paulo
   * * `America/Scoresbysund` - America/Scoresbysund
   * * `America/Sitka` - America/Sitka
   * * `America/St_Barthelemy` - America/St_Barthelemy
   * * `America/St_Johns` - America/St_Johns
   * * `America/St_Kitts` - America/St_Kitts
   * * `America/St_Lucia` - America/St_Lucia
   * * `America/St_Thomas` - America/St_Thomas
   * * `America/St_Vincent` - America/St_Vincent
   * * `America/Swift_Current` - America/Swift_Current
   * * `America/Tegucigalpa` - America/Tegucigalpa
   * * `America/Thule` - America/Thule
   * * `America/Tijuana` - America/Tijuana
   * * `America/Toronto` - America/Toronto
   * * `America/Tortola` - America/Tortola
   * * `America/Vancouver` - America/Vancouver
   * * `America/Whitehorse` - America/Whitehorse
   * * `America/Winnipeg` - America/Winnipeg
   * * `America/Yakutat` - America/Yakutat
   * * `Antarctica/Casey` - Antarctica/Casey
   * * `Antarctica/Davis` - Antarctica/Davis
   * * `Antarctica/DumontDUrville` - Antarctica/DumontDUrville
   * * `Antarctica/Macquarie` - Antarctica/Macquarie
   * * `Antarctica/Mawson` - Antarctica/Mawson
   * * `Antarctica/McMurdo` - Antarctica/McMurdo
   * * `Antarctica/Palmer` - Antarctica/Palmer
   * * `Antarctica/Rothera` - Antarctica/Rothera
   * * `Antarctica/Syowa` - Antarctica/Syowa
   * * `Antarctica/Troll` - Antarctica/Troll
   * * `Antarctica/Vostok` - Antarctica/Vostok
   * * `Arctic/Longyearbyen` - Arctic/Longyearbyen
   * * `Asia/Aden` - Asia/Aden
   * * `Asia/Almaty` - Asia/Almaty
   * * `Asia/Amman` - Asia/Amman
   * * `Asia/Anadyr` - Asia/Anadyr
   * * `Asia/Aqtau` - Asia/Aqtau
   * * `Asia/Aqtobe` - Asia/Aqtobe
   * * `Asia/Ashgabat` - Asia/Ashgabat
   * * `Asia/Atyrau` - Asia/Atyrau
   * * `Asia/Baghdad` - Asia/Baghdad
   * * `Asia/Bahrain` - Asia/Bahrain
   * * `Asia/Baku` - Asia/Baku
   * * `Asia/Bangkok` - Asia/Bangkok
   * * `Asia/Barnaul` - Asia/Barnaul
   * * `Asia/Beirut` - Asia/Beirut
   * * `Asia/Bishkek` - Asia/Bishkek
   * * `Asia/Brunei` - Asia/Brunei
   * * `Asia/Chita` - Asia/Chita
   * * `Asia/Colombo` - Asia/Colombo
   * * `Asia/Damascus` - Asia/Damascus
   * * `Asia/Dhaka` - Asia/Dhaka
   * * `Asia/Dili` - Asia/Dili
   * * `Asia/Dubai` - Asia/Dubai
   * * `Asia/Dushanbe` - Asia/Dushanbe
   * * `Asia/Famagusta` - Asia/Famagusta
   * * `Asia/Gaza` - Asia/Gaza
   * * `Asia/Hebron` - Asia/Hebron
   * * `Asia/Ho_Chi_Minh` - Asia/Ho_Chi_Minh
   * * `Asia/Hong_Kong` - Asia/Hong_Kong
   * * `Asia/Hovd` - Asia/Hovd
   * * `Asia/Irkutsk` - Asia/Irkutsk
   * * `Asia/Jakarta` - Asia/Jakarta
   * * `Asia/Jayapura` - Asia/Jayapura
   * * `Asia/Jerusalem` - Asia/Jerusalem
   * * `Asia/Kabul` - Asia/Kabul
   * * `Asia/Kamchatka` - Asia/Kamchatka
   * * `Asia/Karachi` - Asia/Karachi
   * * `Asia/Kathmandu` - Asia/Kathmandu
   * * `Asia/Khandyga` - Asia/Khandyga
   * * `Asia/Kolkata` - Asia/Kolkata
   * * `Asia/Krasnoyarsk` - Asia/Krasnoyarsk
   * * `Asia/Kuala_Lumpur` - Asia/Kuala_Lumpur
   * * `Asia/Kuching` - Asia/Kuching
   * * `Asia/Kuwait` - Asia/Kuwait
   * * `Asia/Macau` - Asia/Macau
   * * `Asia/Magadan` - Asia/Magadan
   * * `Asia/Makassar` - Asia/Makassar
   * * `Asia/Manila` - Asia/Manila
   * * `Asia/Muscat` - Asia/Muscat
   * * `Asia/Nicosia` - Asia/Nicosia
   * * `Asia/Novokuznetsk` - Asia/Novokuznetsk
   * * `Asia/Novosibirsk` - Asia/Novosibirsk
   * * `Asia/Omsk` - Asia/Omsk
   * * `Asia/Oral` - Asia/Oral
   * * `Asia/Phnom_Penh` - Asia/Phnom_Penh
   * * `Asia/Pontianak` - Asia/Pontianak
   * * `Asia/Pyongyang` - Asia/Pyongyang
   * * `Asia/Qatar` - Asia/Qatar
   * * `Asia/Qostanay` - Asia/Qostanay
   * * `Asia/Qyzylorda` - Asia/Qyzylorda
   * * `Asia/Riyadh` - Asia/Riyadh
   * * `Asia/Sakhalin` - Asia/Sakhalin
   * * `Asia/Samarkand` - Asia/Samarkand
   * * `Asia/Seoul` - Asia/Seoul
   * * `Asia/Shanghai` - Asia/Shanghai
   * * `Asia/Singapore` - Asia/Singapore
   * * `Asia/Srednekolymsk` - Asia/Srednekolymsk
   * * `Asia/Taipei` - Asia/Taipei
   * * `Asia/Tashkent` - Asia/Tashkent
   * * `Asia/Tbilisi` - Asia/Tbilisi
   * * `Asia/Tehran` - Asia/Tehran
   * * `Asia/Thimphu` - Asia/Thimphu
   * * `Asia/Tokyo` - Asia/Tokyo
   * * `Asia/Tomsk` - Asia/Tomsk
   * * `Asia/Ulaanbaatar` - Asia/Ulaanbaatar
   * * `Asia/Urumqi` - Asia/Urumqi
   * * `Asia/Ust-Nera` - Asia/Ust-Nera
   * * `Asia/Vientiane` - Asia/Vientiane
   * * `Asia/Vladivostok` - Asia/Vladivostok
   * * `Asia/Yakutsk` - Asia/Yakutsk
   * * `Asia/Yangon` - Asia/Yangon
   * * `Asia/Yekaterinburg` - Asia/Yekaterinburg
   * * `Asia/Yerevan` - Asia/Yerevan
   * * `Atlantic/Azores` - Atlantic/Azores
   * * `Atlantic/Bermuda` - Atlantic/Bermuda
   * * `Atlantic/Canary` - Atlantic/Canary
   * * `Atlantic/Cape_Verde` - Atlantic/Cape_Verde
   * * `Atlantic/Faroe` - Atlantic/Faroe
   * * `Atlantic/Madeira` - Atlantic/Madeira
   * * `Atlantic/Reykjavik` - Atlantic/Reykjavik
   * * `Atlantic/South_Georgia` - Atlantic/South_Georgia
   * * `Atlantic/St_Helena` - Atlantic/St_Helena
   * * `Atlantic/Stanley` - Atlantic/Stanley
   * * `Australia/Adelaide` - Australia/Adelaide
   * * `Australia/Brisbane` - Australia/Brisbane
   * * `Australia/Broken_Hill` - Australia/Broken_Hill
   * * `Australia/Darwin` - Australia/Darwin
   * * `Australia/Eucla` - Australia/Eucla
   * * `Australia/Hobart` - Australia/Hobart
   * * `Australia/Lindeman` - Australia/Lindeman
   * * `Australia/Lord_Howe` - Australia/Lord_Howe
   * * `Australia/Melbourne` - Australia/Melbourne
   * * `Australia/Perth` - Australia/Perth
   * * `Australia/Sydney` - Australia/Sydney
   * * `Canada/Atlantic` - Canada/Atlantic
   * * `Canada/Central` - Canada/Central
   * * `Canada/Eastern` - Canada/Eastern
   * * `Canada/Mountain` - Canada/Mountain
   * * `Canada/Newfoundland` - Canada/Newfoundland
   * * `Canada/Pacific` - Canada/Pacific
   * * `Europe/Amsterdam` - Europe/Amsterdam
   * * `Europe/Andorra` - Europe/Andorra
   * * `Europe/Astrakhan` - Europe/Astrakhan
   * * `Europe/Athens` - Europe/Athens
   * * `Europe/Belgrade` - Europe/Belgrade
   * * `Europe/Berlin` - Europe/Berlin
   * * `Europe/Bratislava` - Europe/Bratislava
   * * `Europe/Brussels` - Europe/Brussels
   * * `Europe/Bucharest` - Europe/Bucharest
   * * `Europe/Budapest` - Europe/Budapest
   * * `Europe/Busingen` - Europe/Busingen
   * * `Europe/Chisinau` - Europe/Chisinau
   * * `Europe/Copenhagen` - Europe/Copenhagen
   * * `Europe/Dublin` - Europe/Dublin
   * * `Europe/Gibraltar` - Europe/Gibraltar
   * * `Europe/Guernsey` - Europe/Guernsey
   * * `Europe/Helsinki` - Europe/Helsinki
   * * `Europe/Isle_of_Man` - Europe/Isle_of_Man
   * * `Europe/Istanbul` - Europe/Istanbul
   * * `Europe/Jersey` - Europe/Jersey
   * * `Europe/Kaliningrad` - Europe/Kaliningrad
   * * `Europe/Kirov` - Europe/Kirov
   * * `Europe/Kyiv` - Europe/Kyiv
   * * `Europe/Lisbon` - Europe/Lisbon
   * * `Europe/Ljubljana` - Europe/Ljubljana
   * * `Europe/London` - Europe/London
   * * `Europe/Luxembourg` - Europe/Luxembourg
   * * `Europe/Madrid` - Europe/Madrid
   * * `Europe/Malta` - Europe/Malta
   * * `Europe/Mariehamn` - Europe/Mariehamn
   * * `Europe/Minsk` - Europe/Minsk
   * * `Europe/Monaco` - Europe/Monaco
   * * `Europe/Moscow` - Europe/Moscow
   * * `Europe/Oslo` - Europe/Oslo
   * * `Europe/Paris` - Europe/Paris
   * * `Europe/Podgorica` - Europe/Podgorica
   * * `Europe/Prague` - Europe/Prague
   * * `Europe/Riga` - Europe/Riga
   * * `Europe/Rome` - Europe/Rome
   * * `Europe/Samara` - Europe/Samara
   * * `Europe/San_Marino` - Europe/San_Marino
   * * `Europe/Sarajevo` - Europe/Sarajevo
   * * `Europe/Saratov` - Europe/Saratov
   * * `Europe/Simferopol` - Europe/Simferopol
   * * `Europe/Skopje` - Europe/Skopje
   * * `Europe/Sofia` - Europe/Sofia
   * * `Europe/Stockholm` - Europe/Stockholm
   * * `Europe/Tallinn` - Europe/Tallinn
   * * `Europe/Tirane` - Europe/Tirane
   * * `Europe/Ulyanovsk` - Europe/Ulyanovsk
   * * `Europe/Vaduz` - Europe/Vaduz
   * * `Europe/Vatican` - Europe/Vatican
   * * `Europe/Vienna` - Europe/Vienna
   * * `Europe/Vilnius` - Europe/Vilnius
   * * `Europe/Volgograd` - Europe/Volgograd
   * * `Europe/Warsaw` - Europe/Warsaw
   * * `Europe/Zagreb` - Europe/Zagreb
   * * `Europe/Zurich` - Europe/Zurich
   * * `GMT` - GMT
   * * `Indian/Antananarivo` - Indian/Antananarivo
   * * `Indian/Chagos` - Indian/Chagos
   * * `Indian/Christmas` - Indian/Christmas
   * * `Indian/Cocos` - Indian/Cocos
   * * `Indian/Comoro` - Indian/Comoro
   * * `Indian/Kerguelen` - Indian/Kerguelen
   * * `Indian/Mahe` - Indian/Mahe
   * * `Indian/Maldives` - Indian/Maldives
   * * `Indian/Mauritius` - Indian/Mauritius
   * * `Indian/Mayotte` - Indian/Mayotte
   * * `Indian/Reunion` - Indian/Reunion
   * * `Pacific/Apia` - Pacific/Apia
   * * `Pacific/Auckland` - Pacific/Auckland
   * * `Pacific/Bougainville` - Pacific/Bougainville
   * * `Pacific/Chatham` - Pacific/Chatham
   * * `Pacific/Chuuk` - Pacific/Chuuk
   * * `Pacific/Easter` - Pacific/Easter
   * * `Pacific/Efate` - Pacific/Efate
   * * `Pacific/Fakaofo` - Pacific/Fakaofo
   * * `Pacific/Fiji` - Pacific/Fiji
   * * `Pacific/Funafuti` - Pacific/Funafuti
   * * `Pacific/Galapagos` - Pacific/Galapagos
   * * `Pacific/Gambier` - Pacific/Gambier
   * * `Pacific/Guadalcanal` - Pacific/Guadalcanal
   * * `Pacific/Guam` - Pacific/Guam
   * * `Pacific/Honolulu` - Pacific/Honolulu
   * * `Pacific/Kanton` - Pacific/Kanton
   * * `Pacific/Kiritimati` - Pacific/Kiritimati
   * * `Pacific/Kosrae` - Pacific/Kosrae
   * * `Pacific/Kwajalein` - Pacific/Kwajalein
   * * `Pacific/Majuro` - Pacific/Majuro
   * * `Pacific/Marquesas` - Pacific/Marquesas
   * * `Pacific/Midway` - Pacific/Midway
   * * `Pacific/Nauru` - Pacific/Nauru
   * * `Pacific/Niue` - Pacific/Niue
   * * `Pacific/Norfolk` - Pacific/Norfolk
   * * `Pacific/Noumea` - Pacific/Noumea
   * * `Pacific/Pago_Pago` - Pacific/Pago_Pago
   * * `Pacific/Palau` - Pacific/Palau
   * * `Pacific/Pitcairn` - Pacific/Pitcairn
   * * `Pacific/Pohnpei` - Pacific/Pohnpei
   * * `Pacific/Port_Moresby` - Pacific/Port_Moresby
   * * `Pacific/Rarotonga` - Pacific/Rarotonga
   * * `Pacific/Saipan` - Pacific/Saipan
   * * `Pacific/Tahiti` - Pacific/Tahiti
   * * `Pacific/Tarawa` - Pacific/Tarawa
   * * `Pacific/Tongatapu` - Pacific/Tongatapu
   * * `Pacific/Wake` - Pacific/Wake
   * * `Pacific/Wallis` - Pacific/Wallis
   * * `US/Alaska` - US/Alaska
   * * `US/Arizona` - US/Arizona
   * * `US/Central` - US/Central
   * * `US/Eastern` - US/Eastern
   * * `US/Hawaii` - US/Hawaii
   * * `US/Mountain` - US/Mountain
   * * `US/Pacific` - US/Pacific
   * * `UTC` - UTC
   */
  timezone: PangeaTimezoneEnum;
  groups: PangeaGroup[];
  can_bypass_approval?: boolean | null;
}

export interface PangeaUserConfirmPhone {
  phone: string;
}

export interface PangeaUserCreation {
  /** @maxLength 150 */
  first_name?: string;
  /** @maxLength 150 */
  last_name?: string;
  /** @format email */
  email: string;
  phone?: string;
  /**
   * * `Africa/Abidjan` - Africa/Abidjan
   * * `Africa/Accra` - Africa/Accra
   * * `Africa/Addis_Ababa` - Africa/Addis_Ababa
   * * `Africa/Algiers` - Africa/Algiers
   * * `Africa/Asmara` - Africa/Asmara
   * * `Africa/Bamako` - Africa/Bamako
   * * `Africa/Bangui` - Africa/Bangui
   * * `Africa/Banjul` - Africa/Banjul
   * * `Africa/Bissau` - Africa/Bissau
   * * `Africa/Blantyre` - Africa/Blantyre
   * * `Africa/Brazzaville` - Africa/Brazzaville
   * * `Africa/Bujumbura` - Africa/Bujumbura
   * * `Africa/Cairo` - Africa/Cairo
   * * `Africa/Casablanca` - Africa/Casablanca
   * * `Africa/Ceuta` - Africa/Ceuta
   * * `Africa/Conakry` - Africa/Conakry
   * * `Africa/Dakar` - Africa/Dakar
   * * `Africa/Dar_es_Salaam` - Africa/Dar_es_Salaam
   * * `Africa/Djibouti` - Africa/Djibouti
   * * `Africa/Douala` - Africa/Douala
   * * `Africa/El_Aaiun` - Africa/El_Aaiun
   * * `Africa/Freetown` - Africa/Freetown
   * * `Africa/Gaborone` - Africa/Gaborone
   * * `Africa/Harare` - Africa/Harare
   * * `Africa/Johannesburg` - Africa/Johannesburg
   * * `Africa/Juba` - Africa/Juba
   * * `Africa/Kampala` - Africa/Kampala
   * * `Africa/Khartoum` - Africa/Khartoum
   * * `Africa/Kigali` - Africa/Kigali
   * * `Africa/Kinshasa` - Africa/Kinshasa
   * * `Africa/Lagos` - Africa/Lagos
   * * `Africa/Libreville` - Africa/Libreville
   * * `Africa/Lome` - Africa/Lome
   * * `Africa/Luanda` - Africa/Luanda
   * * `Africa/Lubumbashi` - Africa/Lubumbashi
   * * `Africa/Lusaka` - Africa/Lusaka
   * * `Africa/Malabo` - Africa/Malabo
   * * `Africa/Maputo` - Africa/Maputo
   * * `Africa/Maseru` - Africa/Maseru
   * * `Africa/Mbabane` - Africa/Mbabane
   * * `Africa/Mogadishu` - Africa/Mogadishu
   * * `Africa/Monrovia` - Africa/Monrovia
   * * `Africa/Nairobi` - Africa/Nairobi
   * * `Africa/Ndjamena` - Africa/Ndjamena
   * * `Africa/Niamey` - Africa/Niamey
   * * `Africa/Nouakchott` - Africa/Nouakchott
   * * `Africa/Ouagadougou` - Africa/Ouagadougou
   * * `Africa/Porto-Novo` - Africa/Porto-Novo
   * * `Africa/Sao_Tome` - Africa/Sao_Tome
   * * `Africa/Tripoli` - Africa/Tripoli
   * * `Africa/Tunis` - Africa/Tunis
   * * `Africa/Windhoek` - Africa/Windhoek
   * * `America/Adak` - America/Adak
   * * `America/Anchorage` - America/Anchorage
   * * `America/Anguilla` - America/Anguilla
   * * `America/Antigua` - America/Antigua
   * * `America/Araguaina` - America/Araguaina
   * * `America/Argentina/Buenos_Aires` - America/Argentina/Buenos_Aires
   * * `America/Argentina/Catamarca` - America/Argentina/Catamarca
   * * `America/Argentina/Cordoba` - America/Argentina/Cordoba
   * * `America/Argentina/Jujuy` - America/Argentina/Jujuy
   * * `America/Argentina/La_Rioja` - America/Argentina/La_Rioja
   * * `America/Argentina/Mendoza` - America/Argentina/Mendoza
   * * `America/Argentina/Rio_Gallegos` - America/Argentina/Rio_Gallegos
   * * `America/Argentina/Salta` - America/Argentina/Salta
   * * `America/Argentina/San_Juan` - America/Argentina/San_Juan
   * * `America/Argentina/San_Luis` - America/Argentina/San_Luis
   * * `America/Argentina/Tucuman` - America/Argentina/Tucuman
   * * `America/Argentina/Ushuaia` - America/Argentina/Ushuaia
   * * `America/Aruba` - America/Aruba
   * * `America/Asuncion` - America/Asuncion
   * * `America/Atikokan` - America/Atikokan
   * * `America/Bahia` - America/Bahia
   * * `America/Bahia_Banderas` - America/Bahia_Banderas
   * * `America/Barbados` - America/Barbados
   * * `America/Belem` - America/Belem
   * * `America/Belize` - America/Belize
   * * `America/Blanc-Sablon` - America/Blanc-Sablon
   * * `America/Boa_Vista` - America/Boa_Vista
   * * `America/Bogota` - America/Bogota
   * * `America/Boise` - America/Boise
   * * `America/Cambridge_Bay` - America/Cambridge_Bay
   * * `America/Campo_Grande` - America/Campo_Grande
   * * `America/Cancun` - America/Cancun
   * * `America/Caracas` - America/Caracas
   * * `America/Cayenne` - America/Cayenne
   * * `America/Cayman` - America/Cayman
   * * `America/Chicago` - America/Chicago
   * * `America/Chihuahua` - America/Chihuahua
   * * `America/Ciudad_Juarez` - America/Ciudad_Juarez
   * * `America/Costa_Rica` - America/Costa_Rica
   * * `America/Creston` - America/Creston
   * * `America/Cuiaba` - America/Cuiaba
   * * `America/Curacao` - America/Curacao
   * * `America/Danmarkshavn` - America/Danmarkshavn
   * * `America/Dawson` - America/Dawson
   * * `America/Dawson_Creek` - America/Dawson_Creek
   * * `America/Denver` - America/Denver
   * * `America/Detroit` - America/Detroit
   * * `America/Dominica` - America/Dominica
   * * `America/Edmonton` - America/Edmonton
   * * `America/Eirunepe` - America/Eirunepe
   * * `America/El_Salvador` - America/El_Salvador
   * * `America/Fort_Nelson` - America/Fort_Nelson
   * * `America/Fortaleza` - America/Fortaleza
   * * `America/Glace_Bay` - America/Glace_Bay
   * * `America/Goose_Bay` - America/Goose_Bay
   * * `America/Grand_Turk` - America/Grand_Turk
   * * `America/Grenada` - America/Grenada
   * * `America/Guadeloupe` - America/Guadeloupe
   * * `America/Guatemala` - America/Guatemala
   * * `America/Guayaquil` - America/Guayaquil
   * * `America/Guyana` - America/Guyana
   * * `America/Halifax` - America/Halifax
   * * `America/Havana` - America/Havana
   * * `America/Hermosillo` - America/Hermosillo
   * * `America/Indiana/Indianapolis` - America/Indiana/Indianapolis
   * * `America/Indiana/Knox` - America/Indiana/Knox
   * * `America/Indiana/Marengo` - America/Indiana/Marengo
   * * `America/Indiana/Petersburg` - America/Indiana/Petersburg
   * * `America/Indiana/Tell_City` - America/Indiana/Tell_City
   * * `America/Indiana/Vevay` - America/Indiana/Vevay
   * * `America/Indiana/Vincennes` - America/Indiana/Vincennes
   * * `America/Indiana/Winamac` - America/Indiana/Winamac
   * * `America/Inuvik` - America/Inuvik
   * * `America/Iqaluit` - America/Iqaluit
   * * `America/Jamaica` - America/Jamaica
   * * `America/Juneau` - America/Juneau
   * * `America/Kentucky/Louisville` - America/Kentucky/Louisville
   * * `America/Kentucky/Monticello` - America/Kentucky/Monticello
   * * `America/Kralendijk` - America/Kralendijk
   * * `America/La_Paz` - America/La_Paz
   * * `America/Lima` - America/Lima
   * * `America/Los_Angeles` - America/Los_Angeles
   * * `America/Lower_Princes` - America/Lower_Princes
   * * `America/Maceio` - America/Maceio
   * * `America/Managua` - America/Managua
   * * `America/Manaus` - America/Manaus
   * * `America/Marigot` - America/Marigot
   * * `America/Martinique` - America/Martinique
   * * `America/Matamoros` - America/Matamoros
   * * `America/Mazatlan` - America/Mazatlan
   * * `America/Menominee` - America/Menominee
   * * `America/Merida` - America/Merida
   * * `America/Metlakatla` - America/Metlakatla
   * * `America/Mexico_City` - America/Mexico_City
   * * `America/Miquelon` - America/Miquelon
   * * `America/Moncton` - America/Moncton
   * * `America/Monterrey` - America/Monterrey
   * * `America/Montevideo` - America/Montevideo
   * * `America/Montserrat` - America/Montserrat
   * * `America/Nassau` - America/Nassau
   * * `America/New_York` - America/New_York
   * * `America/Nome` - America/Nome
   * * `America/Noronha` - America/Noronha
   * * `America/North_Dakota/Beulah` - America/North_Dakota/Beulah
   * * `America/North_Dakota/Center` - America/North_Dakota/Center
   * * `America/North_Dakota/New_Salem` - America/North_Dakota/New_Salem
   * * `America/Nuuk` - America/Nuuk
   * * `America/Ojinaga` - America/Ojinaga
   * * `America/Panama` - America/Panama
   * * `America/Paramaribo` - America/Paramaribo
   * * `America/Phoenix` - America/Phoenix
   * * `America/Port-au-Prince` - America/Port-au-Prince
   * * `America/Port_of_Spain` - America/Port_of_Spain
   * * `America/Porto_Velho` - America/Porto_Velho
   * * `America/Puerto_Rico` - America/Puerto_Rico
   * * `America/Punta_Arenas` - America/Punta_Arenas
   * * `America/Rankin_Inlet` - America/Rankin_Inlet
   * * `America/Recife` - America/Recife
   * * `America/Regina` - America/Regina
   * * `America/Resolute` - America/Resolute
   * * `America/Rio_Branco` - America/Rio_Branco
   * * `America/Santarem` - America/Santarem
   * * `America/Santiago` - America/Santiago
   * * `America/Santo_Domingo` - America/Santo_Domingo
   * * `America/Sao_Paulo` - America/Sao_Paulo
   * * `America/Scoresbysund` - America/Scoresbysund
   * * `America/Sitka` - America/Sitka
   * * `America/St_Barthelemy` - America/St_Barthelemy
   * * `America/St_Johns` - America/St_Johns
   * * `America/St_Kitts` - America/St_Kitts
   * * `America/St_Lucia` - America/St_Lucia
   * * `America/St_Thomas` - America/St_Thomas
   * * `America/St_Vincent` - America/St_Vincent
   * * `America/Swift_Current` - America/Swift_Current
   * * `America/Tegucigalpa` - America/Tegucigalpa
   * * `America/Thule` - America/Thule
   * * `America/Tijuana` - America/Tijuana
   * * `America/Toronto` - America/Toronto
   * * `America/Tortola` - America/Tortola
   * * `America/Vancouver` - America/Vancouver
   * * `America/Whitehorse` - America/Whitehorse
   * * `America/Winnipeg` - America/Winnipeg
   * * `America/Yakutat` - America/Yakutat
   * * `Antarctica/Casey` - Antarctica/Casey
   * * `Antarctica/Davis` - Antarctica/Davis
   * * `Antarctica/DumontDUrville` - Antarctica/DumontDUrville
   * * `Antarctica/Macquarie` - Antarctica/Macquarie
   * * `Antarctica/Mawson` - Antarctica/Mawson
   * * `Antarctica/McMurdo` - Antarctica/McMurdo
   * * `Antarctica/Palmer` - Antarctica/Palmer
   * * `Antarctica/Rothera` - Antarctica/Rothera
   * * `Antarctica/Syowa` - Antarctica/Syowa
   * * `Antarctica/Troll` - Antarctica/Troll
   * * `Antarctica/Vostok` - Antarctica/Vostok
   * * `Arctic/Longyearbyen` - Arctic/Longyearbyen
   * * `Asia/Aden` - Asia/Aden
   * * `Asia/Almaty` - Asia/Almaty
   * * `Asia/Amman` - Asia/Amman
   * * `Asia/Anadyr` - Asia/Anadyr
   * * `Asia/Aqtau` - Asia/Aqtau
   * * `Asia/Aqtobe` - Asia/Aqtobe
   * * `Asia/Ashgabat` - Asia/Ashgabat
   * * `Asia/Atyrau` - Asia/Atyrau
   * * `Asia/Baghdad` - Asia/Baghdad
   * * `Asia/Bahrain` - Asia/Bahrain
   * * `Asia/Baku` - Asia/Baku
   * * `Asia/Bangkok` - Asia/Bangkok
   * * `Asia/Barnaul` - Asia/Barnaul
   * * `Asia/Beirut` - Asia/Beirut
   * * `Asia/Bishkek` - Asia/Bishkek
   * * `Asia/Brunei` - Asia/Brunei
   * * `Asia/Chita` - Asia/Chita
   * * `Asia/Colombo` - Asia/Colombo
   * * `Asia/Damascus` - Asia/Damascus
   * * `Asia/Dhaka` - Asia/Dhaka
   * * `Asia/Dili` - Asia/Dili
   * * `Asia/Dubai` - Asia/Dubai
   * * `Asia/Dushanbe` - Asia/Dushanbe
   * * `Asia/Famagusta` - Asia/Famagusta
   * * `Asia/Gaza` - Asia/Gaza
   * * `Asia/Hebron` - Asia/Hebron
   * * `Asia/Ho_Chi_Minh` - Asia/Ho_Chi_Minh
   * * `Asia/Hong_Kong` - Asia/Hong_Kong
   * * `Asia/Hovd` - Asia/Hovd
   * * `Asia/Irkutsk` - Asia/Irkutsk
   * * `Asia/Jakarta` - Asia/Jakarta
   * * `Asia/Jayapura` - Asia/Jayapura
   * * `Asia/Jerusalem` - Asia/Jerusalem
   * * `Asia/Kabul` - Asia/Kabul
   * * `Asia/Kamchatka` - Asia/Kamchatka
   * * `Asia/Karachi` - Asia/Karachi
   * * `Asia/Kathmandu` - Asia/Kathmandu
   * * `Asia/Khandyga` - Asia/Khandyga
   * * `Asia/Kolkata` - Asia/Kolkata
   * * `Asia/Krasnoyarsk` - Asia/Krasnoyarsk
   * * `Asia/Kuala_Lumpur` - Asia/Kuala_Lumpur
   * * `Asia/Kuching` - Asia/Kuching
   * * `Asia/Kuwait` - Asia/Kuwait
   * * `Asia/Macau` - Asia/Macau
   * * `Asia/Magadan` - Asia/Magadan
   * * `Asia/Makassar` - Asia/Makassar
   * * `Asia/Manila` - Asia/Manila
   * * `Asia/Muscat` - Asia/Muscat
   * * `Asia/Nicosia` - Asia/Nicosia
   * * `Asia/Novokuznetsk` - Asia/Novokuznetsk
   * * `Asia/Novosibirsk` - Asia/Novosibirsk
   * * `Asia/Omsk` - Asia/Omsk
   * * `Asia/Oral` - Asia/Oral
   * * `Asia/Phnom_Penh` - Asia/Phnom_Penh
   * * `Asia/Pontianak` - Asia/Pontianak
   * * `Asia/Pyongyang` - Asia/Pyongyang
   * * `Asia/Qatar` - Asia/Qatar
   * * `Asia/Qostanay` - Asia/Qostanay
   * * `Asia/Qyzylorda` - Asia/Qyzylorda
   * * `Asia/Riyadh` - Asia/Riyadh
   * * `Asia/Sakhalin` - Asia/Sakhalin
   * * `Asia/Samarkand` - Asia/Samarkand
   * * `Asia/Seoul` - Asia/Seoul
   * * `Asia/Shanghai` - Asia/Shanghai
   * * `Asia/Singapore` - Asia/Singapore
   * * `Asia/Srednekolymsk` - Asia/Srednekolymsk
   * * `Asia/Taipei` - Asia/Taipei
   * * `Asia/Tashkent` - Asia/Tashkent
   * * `Asia/Tbilisi` - Asia/Tbilisi
   * * `Asia/Tehran` - Asia/Tehran
   * * `Asia/Thimphu` - Asia/Thimphu
   * * `Asia/Tokyo` - Asia/Tokyo
   * * `Asia/Tomsk` - Asia/Tomsk
   * * `Asia/Ulaanbaatar` - Asia/Ulaanbaatar
   * * `Asia/Urumqi` - Asia/Urumqi
   * * `Asia/Ust-Nera` - Asia/Ust-Nera
   * * `Asia/Vientiane` - Asia/Vientiane
   * * `Asia/Vladivostok` - Asia/Vladivostok
   * * `Asia/Yakutsk` - Asia/Yakutsk
   * * `Asia/Yangon` - Asia/Yangon
   * * `Asia/Yekaterinburg` - Asia/Yekaterinburg
   * * `Asia/Yerevan` - Asia/Yerevan
   * * `Atlantic/Azores` - Atlantic/Azores
   * * `Atlantic/Bermuda` - Atlantic/Bermuda
   * * `Atlantic/Canary` - Atlantic/Canary
   * * `Atlantic/Cape_Verde` - Atlantic/Cape_Verde
   * * `Atlantic/Faroe` - Atlantic/Faroe
   * * `Atlantic/Madeira` - Atlantic/Madeira
   * * `Atlantic/Reykjavik` - Atlantic/Reykjavik
   * * `Atlantic/South_Georgia` - Atlantic/South_Georgia
   * * `Atlantic/St_Helena` - Atlantic/St_Helena
   * * `Atlantic/Stanley` - Atlantic/Stanley
   * * `Australia/Adelaide` - Australia/Adelaide
   * * `Australia/Brisbane` - Australia/Brisbane
   * * `Australia/Broken_Hill` - Australia/Broken_Hill
   * * `Australia/Darwin` - Australia/Darwin
   * * `Australia/Eucla` - Australia/Eucla
   * * `Australia/Hobart` - Australia/Hobart
   * * `Australia/Lindeman` - Australia/Lindeman
   * * `Australia/Lord_Howe` - Australia/Lord_Howe
   * * `Australia/Melbourne` - Australia/Melbourne
   * * `Australia/Perth` - Australia/Perth
   * * `Australia/Sydney` - Australia/Sydney
   * * `Canada/Atlantic` - Canada/Atlantic
   * * `Canada/Central` - Canada/Central
   * * `Canada/Eastern` - Canada/Eastern
   * * `Canada/Mountain` - Canada/Mountain
   * * `Canada/Newfoundland` - Canada/Newfoundland
   * * `Canada/Pacific` - Canada/Pacific
   * * `Europe/Amsterdam` - Europe/Amsterdam
   * * `Europe/Andorra` - Europe/Andorra
   * * `Europe/Astrakhan` - Europe/Astrakhan
   * * `Europe/Athens` - Europe/Athens
   * * `Europe/Belgrade` - Europe/Belgrade
   * * `Europe/Berlin` - Europe/Berlin
   * * `Europe/Bratislava` - Europe/Bratislava
   * * `Europe/Brussels` - Europe/Brussels
   * * `Europe/Bucharest` - Europe/Bucharest
   * * `Europe/Budapest` - Europe/Budapest
   * * `Europe/Busingen` - Europe/Busingen
   * * `Europe/Chisinau` - Europe/Chisinau
   * * `Europe/Copenhagen` - Europe/Copenhagen
   * * `Europe/Dublin` - Europe/Dublin
   * * `Europe/Gibraltar` - Europe/Gibraltar
   * * `Europe/Guernsey` - Europe/Guernsey
   * * `Europe/Helsinki` - Europe/Helsinki
   * * `Europe/Isle_of_Man` - Europe/Isle_of_Man
   * * `Europe/Istanbul` - Europe/Istanbul
   * * `Europe/Jersey` - Europe/Jersey
   * * `Europe/Kaliningrad` - Europe/Kaliningrad
   * * `Europe/Kirov` - Europe/Kirov
   * * `Europe/Kyiv` - Europe/Kyiv
   * * `Europe/Lisbon` - Europe/Lisbon
   * * `Europe/Ljubljana` - Europe/Ljubljana
   * * `Europe/London` - Europe/London
   * * `Europe/Luxembourg` - Europe/Luxembourg
   * * `Europe/Madrid` - Europe/Madrid
   * * `Europe/Malta` - Europe/Malta
   * * `Europe/Mariehamn` - Europe/Mariehamn
   * * `Europe/Minsk` - Europe/Minsk
   * * `Europe/Monaco` - Europe/Monaco
   * * `Europe/Moscow` - Europe/Moscow
   * * `Europe/Oslo` - Europe/Oslo
   * * `Europe/Paris` - Europe/Paris
   * * `Europe/Podgorica` - Europe/Podgorica
   * * `Europe/Prague` - Europe/Prague
   * * `Europe/Riga` - Europe/Riga
   * * `Europe/Rome` - Europe/Rome
   * * `Europe/Samara` - Europe/Samara
   * * `Europe/San_Marino` - Europe/San_Marino
   * * `Europe/Sarajevo` - Europe/Sarajevo
   * * `Europe/Saratov` - Europe/Saratov
   * * `Europe/Simferopol` - Europe/Simferopol
   * * `Europe/Skopje` - Europe/Skopje
   * * `Europe/Sofia` - Europe/Sofia
   * * `Europe/Stockholm` - Europe/Stockholm
   * * `Europe/Tallinn` - Europe/Tallinn
   * * `Europe/Tirane` - Europe/Tirane
   * * `Europe/Ulyanovsk` - Europe/Ulyanovsk
   * * `Europe/Vaduz` - Europe/Vaduz
   * * `Europe/Vatican` - Europe/Vatican
   * * `Europe/Vienna` - Europe/Vienna
   * * `Europe/Vilnius` - Europe/Vilnius
   * * `Europe/Volgograd` - Europe/Volgograd
   * * `Europe/Warsaw` - Europe/Warsaw
   * * `Europe/Zagreb` - Europe/Zagreb
   * * `Europe/Zurich` - Europe/Zurich
   * * `GMT` - GMT
   * * `Indian/Antananarivo` - Indian/Antananarivo
   * * `Indian/Chagos` - Indian/Chagos
   * * `Indian/Christmas` - Indian/Christmas
   * * `Indian/Cocos` - Indian/Cocos
   * * `Indian/Comoro` - Indian/Comoro
   * * `Indian/Kerguelen` - Indian/Kerguelen
   * * `Indian/Mahe` - Indian/Mahe
   * * `Indian/Maldives` - Indian/Maldives
   * * `Indian/Mauritius` - Indian/Mauritius
   * * `Indian/Mayotte` - Indian/Mayotte
   * * `Indian/Reunion` - Indian/Reunion
   * * `Pacific/Apia` - Pacific/Apia
   * * `Pacific/Auckland` - Pacific/Auckland
   * * `Pacific/Bougainville` - Pacific/Bougainville
   * * `Pacific/Chatham` - Pacific/Chatham
   * * `Pacific/Chuuk` - Pacific/Chuuk
   * * `Pacific/Easter` - Pacific/Easter
   * * `Pacific/Efate` - Pacific/Efate
   * * `Pacific/Fakaofo` - Pacific/Fakaofo
   * * `Pacific/Fiji` - Pacific/Fiji
   * * `Pacific/Funafuti` - Pacific/Funafuti
   * * `Pacific/Galapagos` - Pacific/Galapagos
   * * `Pacific/Gambier` - Pacific/Gambier
   * * `Pacific/Guadalcanal` - Pacific/Guadalcanal
   * * `Pacific/Guam` - Pacific/Guam
   * * `Pacific/Honolulu` - Pacific/Honolulu
   * * `Pacific/Kanton` - Pacific/Kanton
   * * `Pacific/Kiritimati` - Pacific/Kiritimati
   * * `Pacific/Kosrae` - Pacific/Kosrae
   * * `Pacific/Kwajalein` - Pacific/Kwajalein
   * * `Pacific/Majuro` - Pacific/Majuro
   * * `Pacific/Marquesas` - Pacific/Marquesas
   * * `Pacific/Midway` - Pacific/Midway
   * * `Pacific/Nauru` - Pacific/Nauru
   * * `Pacific/Niue` - Pacific/Niue
   * * `Pacific/Norfolk` - Pacific/Norfolk
   * * `Pacific/Noumea` - Pacific/Noumea
   * * `Pacific/Pago_Pago` - Pacific/Pago_Pago
   * * `Pacific/Palau` - Pacific/Palau
   * * `Pacific/Pitcairn` - Pacific/Pitcairn
   * * `Pacific/Pohnpei` - Pacific/Pohnpei
   * * `Pacific/Port_Moresby` - Pacific/Port_Moresby
   * * `Pacific/Rarotonga` - Pacific/Rarotonga
   * * `Pacific/Saipan` - Pacific/Saipan
   * * `Pacific/Tahiti` - Pacific/Tahiti
   * * `Pacific/Tarawa` - Pacific/Tarawa
   * * `Pacific/Tongatapu` - Pacific/Tongatapu
   * * `Pacific/Wake` - Pacific/Wake
   * * `Pacific/Wallis` - Pacific/Wallis
   * * `US/Alaska` - US/Alaska
   * * `US/Arizona` - US/Arizona
   * * `US/Central` - US/Central
   * * `US/Eastern` - US/Eastern
   * * `US/Hawaii` - US/Hawaii
   * * `US/Mountain` - US/Mountain
   * * `US/Pacific` - US/Pacific
   * * `UTC` - UTC
   */
  timezone: PangeaTimezoneEnum;
  password: string;
  confirm_password: string;
}

export interface PangeaUserEmailExistsResponse {
  exists: boolean;
  is_active?: boolean;
}

export interface PangeaUserNotification {
  id: number;
  email?: boolean;
  sms?: boolean;
  phone?: boolean;
  user: number;
  event: number;
}

export interface PangeaUserNotificationBulkCreateUpdate {
  email: boolean;
  sms: boolean;
  phone: boolean;
  user: number;
  event: number;
}

export interface PangeaUserUpdate {
  /** @format email */
  email?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  /** @default "UTC" */
  timezone?: PangeaTimezoneEnum | PangeaBlankEnum;
}

export interface PangeaUserVerifyPhoneOTP {
  /** @maxLength 6 */
  otp_code: string;
}

export interface PangeaValidationSchemaRequest {
  /** This field accepts the <a href="https://docs.pangea.io/reference/currency-and-country-codes"> ISO-2 country code</a> */
  destination_country: string;
  /** This field accepts the <a href="https://docs.pangea.io/reference/currency-and-country-codes"> ISO-2 country code</a> */
  bank_country: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  bank_currency: string;
  /**
   * * `individual` - Individual
   * * `corporate` - Corporate
   */
  beneficiary_account_type: PangeaBeneficiaryAccountTypeEnum;
  /**
   * * `local` - Local
   * * `swift` - Swift
   * * `wallet` - Wallet
   * * `card` - Card
   * * `proxy` - Proxy
   */
  payment_method?: PangeaPaymentDeliveryMethodEnum;
}

export interface PangeaValueDate {
  /** @format date */
  date: string;
  /**
   * * `EXPEDITED` - Expedited
   * * `SPOT` - Spot
   * * `MAX_DATE` - Max Date
   * * `FORWARD` - Forward
   * * `TRADE_DATE` - Trade Date
   */
  date_type: PangeaDateTypeEnum;
  /**
   * @format double
   * @min -10000000000
   * @exclusiveMin true
   * @max 10000000000
   * @exclusiveMax true
   */
  fee: number;
  fee_unit: string;
  tradable: boolean;
  /** @format date-time */
  executable_time?: string | null;
}

export interface PangeaValueDateCalendarRequest {
  pair: string;
  /** @format date */
  start_date: string;
  /** @format date */
  end_date: string;
}

export interface PangeaValueDateCalendarResponse {
  dates: PangeaValueDate[];
}

export interface PangeaValueSet {
  id: string;
  text: string;
}

export interface PangeaWaitCondition {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /** @format double */
  rate?: number | null;
  /** @format double */
  rate_bid?: number | null;
  /** @format double */
  rate_ask?: number | null;
  /** @format double */
  expected_saving?: number | null;
  /** @format double */
  expected_saving_percentage?: number | null;
  /** @format double */
  lower_bound?: number | null;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  regime?: number | null;
  /** @format double */
  upper_bound?: number | null;
  /** @format date-time */
  start_time?: string | null;
  /** @format date-time */
  recommendation_time?: string | null;
  /** @maxLength 256 */
  ai_model?: string | null;
  quote?: number | null;
}

export interface PangeaWallet {
  /**
   * Unique identifier of the wallet
   * @format uuid
   */
  wallet_id: string;
  /** The company the wallet belongs to */
  company: number;
  broker: PangeaBroker;
  /** The external wallet identifier */
  external_id: string;
  /** ISO 4217 Standard 3-Letter Currency Code */
  currency: string;
  /**
   * The name of the wallet
   * @maxLength 100
   */
  name?: string | null;
  /** A description of the wallet */
  description?: string | null;
  /**
   * The account number associated with the wallet
   * @maxLength 100
   */
  account_number?: string | null;
  /**
   * The name of the bank associated with the wallet
   * @maxLength 200
   */
  bank_name?: string | null;
  /**
   * The status of the wallet
   *
   * * `active` - Active
   * * `inactive` - Inactive
   * * `suspended` - Suspended
   * * `closed` - Closed
   * * `pending` - Pending
   */
  status?: PangeaWalletStatusEnum;
  /**
   * The type of the wallet
   *
   * * `settlement` - Settlement
   * * `wallet` - Wallet
   * * `virtual_account` - Virtual Account
   * * `managed` - Managed
   */
  type?: PangeaWalletTypeEnum;
  method?: PangeaWalletMethodEnum | PangeaBlankEnum | PangeaNullEnum | null;
  /** @format double */
  latest_balance: number;
  /**
   * Wallet nickname
   * @maxLength 100
   */
  nickname?: string | null;
  /** Set wallet as default funding account */
  default?: boolean;
}

/**
 * * `rtp` - RTP
 * * `eft` - EFT
 * * `wire` - Wire
 * * `draft` - Draft
 */
export enum PangeaWalletMethodEnum {
  Rtp = 'rtp',
  Eft = 'eft',
  Wire = 'wire',
  Draft = 'draft',
}

/**
 * * `active` - Active
 * * `inactive` - Inactive
 * * `suspended` - Suspended
 * * `closed` - Closed
 * * `pending` - Pending
 */
export enum PangeaWalletStatusEnum {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
  Closed = 'closed',
  Pending = 'pending',
}

/**
 * * `settlement` - Settlement
 * * `wallet` - Wallet
 * * `virtual_account` - Virtual Account
 * * `managed` - Managed
 */
export enum PangeaWalletTypeEnum {
  Settlement = 'settlement',
  Wallet = 'wallet',
  VirtualAccount = 'virtual_account',
  Managed = 'managed',
}

export interface PangeaWalletUpdate {
  /**
   * Wallet nickname
   * @maxLength 100
   */
  nickname?: string | null;
  /** Set wallet as default funding account */
  default?: boolean;
}

export interface PangeaWebhook {
  /**
   * The unique identifier for the webhook.
   * @format uuid
   */
  webhook_id: string;
  created_by: string;
  /**
   * The URL where the webhook will send events.
   * @format uri
   * @maxLength 200
   */
  url: string;
  events: string[];
  groups: string[];
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
}

export type PangeaWhatIf =
  | PangeaAutopilotWhatIfResponse
  | PangeaParachuteWhatIfResponse;

export interface PangeaWireInstruction {
  id: number;
  currency: PangeaCurrency;
  /** @maxLength 60 */
  title: string;
  /** @maxLength 60 */
  bank_name: string;
  bank_address?: string | null;
  /** @maxLength 60 */
  beneficiary_name?: string | null;
  /** @maxLength 60 */
  beneficiary_account_number?: string | null;
  /** @maxLength 60 */
  beneficiary_routing_number?: string | null;
  beneficiary_address?: string | null;
  wire_reference?: string | null;
  /** @maxLength 60 */
  swift_bic_code?: string | null;
  account_info?: string | null;
}

export interface PangeaWithdrawRequest {
  /** @format double */
  amount: number;
  broker_account_id: number;
  /** @default "WIRE" */
  method?: PangeaWithdrawRequestMethodEnum;
  /** @default "USD" */
  currency?: PangeaCurrencyEnum;
  /** @maxLength 250 */
  saved_instruction_name: string;
  /** @format date-time */
  date_time_to_occur: string;
}

/**
 * * `ACH` - ACH
 * * `ACHUS` - ACHUS
 * * `ACHCA` - ACHCA
 * * `WIRE` - WIRE
 */
export enum PangeaWithdrawRequestMethodEnum {
  ACH = 'ACH',
  ACHUS = 'ACHUS',
  ACHCA = 'ACHCA',
  WIRE = 'WIRE',
}

export interface PangeaWithdrawResult {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  modified: string;
  /**
   * @min -2147483648
   * @max 2147483647
   */
  ib_instr_id?: number | null;
  /**
   * * `pending` - Pending
   * * `processed` - Processed
   * * `rejected` - Rejected
   */
  status?: PangeaFundingRequestStatusEnum;
  /** @maxLength 255 */
  code?: string | null;
  description?: string | null;
  /** @format double */
  amount?: number | null;
  /** @maxLength 10 */
  method?: string | null;
  /** @maxLength 60 */
  saved_instruction_name?: string | null;
  currency: number;
  funding_request: number;
}

export type PangeaProxy =
  | PangeaProxyCountryResponse
  | PangeaProxyCurrencyResponse
  | PangeaProxyRegionResponse;

export interface PangeaCashflowListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaSettlementBeneficiaryListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaSettlementWalletListParams {
  currency?: string;
  /** Number of results to return per page. */
  limit?: number;
  /**
   * * `rtp` - RTP
   * * `eft` - EFT
   * * `wire` - Wire
   * * `draft` - Draft
   */
  method?: 'draft' | 'eft' | 'rtp' | 'wire' | null;
  /** The initial index from which to return the results. */
  offset?: number;
  /**
   * The status of the wallet
   *
   * * `active` - Active
   * * `inactive` - Inactive
   * * `suspended` - Suspended
   * * `closed` - Closed
   * * `pending` - Pending
   */
  status?: 'active' | 'closed' | 'inactive' | 'pending' | 'suspended';
  /**
   * The type of the wallet
   *
   * * `settlement` - Settlement
   * * `wallet` - Wallet
   * * `virtual_account` - Virtual Account
   * * `managed` - Managed
   */
  type?: 'managed' | 'settlement' | 'virtual_account' | 'wallet';
}

export interface PangeaOemsCnyExecutionListParams {
  /** Query a specific broker account */
  company: number;
  /** Query a specific market */
  market?: string;
}

export interface PangeaOemsTicketListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaMarketdataSpotListParams {
  /** Data cut type: (eod, intra, benchmark) */
  data_cut_type?: string;
  /** End date in ISO8601 format */
  end_date?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** Comma separated list of FX Pair IDs */
  pair_ids?: number[];
  /** Start date in ISO8601 format */
  start_date?: string;
}

export interface PangeaMarketdataSpotIntraListParams {
  /** End date in ISO8601 format */
  end_date?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** Comma separated list of FX Pair IDs */
  pair_ids?: number[];
  /** Start date in ISO8601 format */
  start_date?: string;
}

export interface PangeaMarketdataSpotCorpayListParams {
  base_currency?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  quote_currency?: string;
}

export interface PangeaMarketdataForwardsListParams {
  /** Data cut type: (eod, intra, benchmark) */
  data_cut_type?: string;
  /** End date in ISO8601 format */
  end_date?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** Comma separated list of FX Pair IDs */
  pair_ids?: number[];
  /** Start date in ISO8601 format */
  start_date?: string;
  /** Comma seperated list of tenors */
  tenor?: number[];
}

export interface PangeaMarketdataForwardsCorpayListParams {
  base_currency?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  quote_currency?: string;
  /**
   * * `1W` - 1 Weeks
   * * `3W` - 3 Weeks
   * * `1M` - 1 Month
   * * `1Y` - 1 Year
   */
  tenor?: '1M' | '1W' | '1Y' | '3W';
}

export interface PangeaMarketdataTradingCalendarListParams {
  /** Data cut type: (eod, intra, benchmark) */
  data_cut_type?: string;
  /** End date in ISO8601 format */
  end_date?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** Comma separated list of FX Pair IDs */
  pair_ids?: number[];
  /** Start date in ISO8601 format */
  start_date?: string;
}

export interface PangeaMarketdataSpotIntraAverageRetrieveParams {
  pair_id: number;
}

export interface PangeaMarketdataFxPairP10ListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaMarketdataFutureIntraListParams {
  /** Base for future contract */
  base?: string;
}

export interface PangeaMarketdataFutureLiquidHoursListParams {
  /** End date in ISO8601 format */
  end_date?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** Start date in ISO8601 format */
  start_date?: string;
  /** Future symbol e.g. ECN2023 */
  symbol?: string;
}

export interface PangeaMarketdataFutureTradingHoursListParams {
  /** End date in ISO8601 format */
  end_date?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** Start date in ISO8601 format */
  start_date?: string;
  /** Future symbol e.g. ECN2023 */
  symbol?: string;
}

export interface PangeaMarketdataAssetIndexListParams {
  /** End date in ISO8601 format */
  end_date?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** Start date in ISO8601 format */
  start_date?: string;
  /** Index asset symbol */
  symbol?: string;
}

export interface PangeaWebhookEventsListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaWebhookEventGroupsListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaWebhookListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaInstallmentsListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaCashflowsListParams {
  account?: number;
  /** @format date-time */
  created__gt?: string;
  /** @format date-time */
  created__gte?: string;
  /** @format date-time */
  created__lt?: string;
  /** @format date-time */
  created__lte?: string;
  installment?: number;
  installment__installment_name?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** @format date-time */
  modified__gt?: string;
  /** @format date-time */
  modified__gte?: string;
  /** @format date-time */
  modified__lt?: string;
  /** @format date-time */
  modified__lte?: string;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  status__iexact?: string;
  /** Multiple values may be separated by commas. */
  status__in?: string[];
}

export interface PangeaDraftsListParams {
  account?: number;
  /** @format date-time */
  created__gt?: string;
  /** @format date-time */
  created__gte?: string;
  /** @format date-time */
  created__lt?: string;
  /** @format date-time */
  created__lte?: string;
  installment?: number;
  installment__installment_name?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** @format date-time */
  modified__gt?: string;
  /** @format date-time */
  modified__gte?: string;
  /** @format date-time */
  modified__lt?: string;
  /** @format date-time */
  modified__lte?: string;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaAccountsCashflowCreateParams {
  /**
   * Whether to include pending margin in health check
   * @default true
   */
  include_pending_margin_in_margin_check?: boolean;
  accountPk: number;
}

export interface PangeaAccountsCashflowListParams {
  /** Query a specific installment */
  installment?: string;
  /**
   * Whether to include installments
   * @default true
   */
  with_installments?: boolean;
  accountPk: number;
}

export interface PangeaCompanyContactOrderListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  companyPk: number;
}

export interface PangeaCompanyJoinRequestListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  companyPk: number;
}

export interface PangeaInviteVerifyTokenRetrieveParams {
  /** @minLength 1 */
  invitation_token: string;
}

export interface PangeaUserActivateRetrieveParams {
  /**
   * @minLength 1
   * @maxLength 60
   */
  token: string;
}

export interface PangeaUserExistsRetrieveParams {
  /**
   * @format email
   * @minLength 1
   */
  email: string;
}

export interface PangeaAuthMfaUserActiveMethodsListParams {
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaCurrencyFxpairsListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaCurrencyDeliveryTimeListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaRiskGetCashflowRiskConesCreateParams {
  account_id?: number;
}

export interface PangeaHedgeForwardListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaHedgeForwardWhatIfRetrieveParams {
  /**
   * * `autopilot` - Autopilot
   * * `parachute` - Parachute
   * @minLength 1
   * @default "autopilot"
   */
  strategy?: 'autopilot' | 'parachute';
  /** A unique integer value identifying this draft fx forward position. */
  id: number;
}

export interface PangeaPaymentsListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /**
   * * `awaiting_funds` - Awaiting Funds
   * * `booked` - Booked
   * * `delivered` - Delivered
   * * `drafting` - Drafting
   * * `in_transit` - In Transit
   * * `scheduled` - Scheduled
   * * `working` - Working
   * * `canceled` - Canceled
   * * `failed` - Failed
   * * `settlement_issue` - Settlement Issue
   * * `pend_auth` - Pending Authorization
   * * `strategic_execution` - Strategic Ex
   * * `expired` - Expired
   * * `pending_approval` - Pending Approval
   * * `trade_desk` - Trade Desk
   * * `pending_beneficiary` - Pending Beneficiary
   * * `payment_issue` - Payment Issue
   * * `settled` - Settled
   * * `approved` - Approved
   */
  payment_status?:
    | 'approved'
    | 'awaiting_funds'
    | 'booked'
    | 'canceled'
    | 'delivered'
    | 'drafting'
    | 'expired'
    | 'failed'
    | 'in_transit'
    | 'payment_issue'
    | 'pend_auth'
    | 'pending_approval'
    | 'pending_beneficiary'
    | 'scheduled'
    | 'settled'
    | 'settlement_issue'
    | 'strategic_execution'
    | 'trade_desk'
    | 'working';
  /** A search term. */
  search?: string;
}

export interface PangeaPaymentsCashflowsListParams {
  /** Which field to use when ordering the results. */
  ordering?: string;
  paymentId: number;
}

export interface PangeaNotificationEventsListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaNotificationUserListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaBrokerIbEcaAccountStatusRetrieveParams {
  /** Broker Account ID */
  broker_account_id?: string;
}

export interface PangeaBrokerIbEcaPendingTasksRetrieveParams {
  /** @minLength 1 */
  broker_account_id: string;
  end_date?: string;
  form_number?: number;
  start_date?: string;
}

export interface PangeaBrokerIbEcaRegistrationTasksRetrieveParams {
  /** @minLength 1 */
  broker_account_id: string;
  end_date?: string;
  form_number?: number;
  start_date?: string;
}

export interface PangeaBrokerIbFbInstructionNameRetrieveParams {
  broker_account_id: number;
  /**
   * * `CAACH` - CAACH
   * * `ACHUS` - ACHUS
   * * `ACHCA` - ACHCA
   * * `WIRE` - WIRE
   * @minLength 1
   * @default "ACHUS"
   */
  method?: 'CAACH' | 'ACHUS' | 'ACHCA' | 'WIRE';
}

export interface PangeaBrokerIbFbStatusRetrieveParams {
  funding_request_id: number;
}

export interface PangeaBrokerIbFbFundingRequestsListParams {
  broker_account_id: number;
  /** Number of results to return per page. */
  limit?: number;
  /**
   * * `deposit_funds` - deposit_funds
   * * `instruction_name` - instruction_names
   * @minLength 1
   */
  method?: 'deposit_funds' | 'instruction_name';
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaBrokerIbFbWireInstructionsListParams {
  /** Number of results to return per page. */
  limit?: number;
  /**
   * @minLength 1
   * @maxLength 3
   */
  mnemonic: string;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaBrokerCorpaySpotPurposeOfPaymentRetrieveParams {
  /** @minLength 1 */
  country: string;
  /** @minLength 1 */
  currency: string;
  /**
   * * `W` - Wire
   * * `E` - iACH
   * @minLength 1
   */
  method: 'W' | 'E';
}

export interface PangeaBrokerCorpayFxBalanceAccountsRetrieveParams {
  /** @default true */
  include_balance?: boolean;
}

export interface PangeaBrokerCorpayFxBalanceHistoryListParams {
  /** @format date */
  from_date?: string;
  /** @minLength 1 */
  fx_balance_id: string;
  include_details?: boolean;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /**
   * @minLength 1
   * @default "-id"
   */
  ordering?: string;
  /** @format date */
  to_date?: string;
}

export interface PangeaBrokerCorpayFxBalanceCompanyListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaBrokerCorpayBeneficiaryBanksRetrieveParams {
  /** @minLength 1 */
  country: string;
  /** @minLength 1 */
  query?: string;
  skip?: number;
  take?: number;
}

export interface PangeaBrokerCorpayBeneficiaryRulesRetrieveParams {
  /** @minLength 1 */
  bank_country?: string;
  /** @minLength 1 */
  bank_currency?: string;
  /** @minLength 1 */
  destination_country?: string;
  /**
   * * `W` - Wire
   * * `E` - iACH
   * @minLength 1
   */
  payment_method?: 'W' | 'E';
  /**
   * * `Business` - Business
   * * `Individual` - Individual
   * @minLength 1
   */
  rules_classification?: 'Business' | 'Individual';
}

export interface PangeaBrokerCorpayBeneficiaryRetrieveParams {
  /** @minLength 1 */
  client_integration_id: string;
}

export interface PangeaBrokerCorpayBeneficiaryDestroyParams {
  /** @minLength 1 */
  client_integration_id: string;
}

export interface PangeaBrokerCorpayBeneficiariesRetrieveParams {
  /** @minLength 1 */
  currency?: string;
  is_withdraw?: boolean;
  /**
   * * `W` - Wire
   * * `E` - iACH
   * @minLength 1
   */
  method?: 'W' | 'E';
  /** @minLength 1 */
  payee_country?: string;
  /** @default 0 */
  skip?: number;
  /**
   * * `A` - Active
   * * `T` - Inactive
   * @minLength 1
   */
  status?: 'A' | 'T';
  /** @default 100 */
  take?: number;
}

export interface PangeaBrokerCorpayClientOnboardingPicklistRetrieveParams {
  /**
   * * `AnnualVolumeRange` - Annual Volume Range
   * * `ApplicantType` - Applicant Type
   * * `BusinessType` - Business Type
   * * `PurposeOfTransaction` - Purpose of Transaction
   * * `TradeVolumeRange` - Trade Volume Range
   * * `NatureOfBusiness` - Nature Of Business
   * @minLength 1
   */
  pick_list_type:
    | 'AnnualVolumeRange'
    | 'ApplicantType'
    | 'BusinessType'
    | 'PurposeOfTransaction'
    | 'TradeVolumeRange'
    | 'NatureOfBusiness';
}

export interface PangeaBrokerCorpayCostsRetrieveParams {
  /** @format double */
  aum: number;
}

export interface PangeaBrokerCorpayFxpairsListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaBrokerCorpayCurrencyDefinitionListParams {
  fwd_delivery_buying?: boolean;
  fwd_delivery_selling?: boolean;
  incoming_payments?: boolean;
  /** Number of results to return per page. */
  limit?: number;
  ndf?: boolean;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
  outgoing_payments?: boolean;
  p10?: boolean;
  wallet?: boolean;
  wallet_api?: boolean;
}

export interface PangeaDataproviderProfileParallelOptionRetrieveParams {
  profile_id: number;
}

export interface PangeaApprovalApproveRequestRetrieveParams {
  payment_id: number;
}

export interface PangeaHistoryFeesPaymentsListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaHistoryBankStatementsListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaHistoryTradesListParams {
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}

export interface PangeaHistoryActivitiesListParams {
  /** @format date-time */
  created__gt?: string;
  /** @format date-time */
  created__gte?: string;
  /** @format date-time */
  created__lt?: string;
  /** @format date-time */
  created__lte?: string;
  /** Number of results to return per page. */
  limit?: number;
  /** The initial index from which to return the results. */
  offset?: number;
  /** Which field to use when ordering the results. */
  ordering?: string;
}
