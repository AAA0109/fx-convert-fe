export enum ContactPriority {
  Primary = 0,
  Secondary,
  Tertiary,
}

export enum UserState {
  Unknown,
  NoAccount,
  NotActive,
  NeedPhone,
  NeedCompany,
  NeedIbApplication,
  HaveIbTasks,
  NeedStripe,
  NeedMeeting,
  CompanyOnboardingIncomplete,
  NoCashflowsOrDrafts,
  NoCashflows,
  NoPerfData,
  Active,
  CorpayOnlyAccount,
}

export enum MessageMode {
  email = 0,
  phone,
  text,
}

export enum HttpErrorStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  TOO_MANY_REQUESTS = 429,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}
