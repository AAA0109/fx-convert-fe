import { StyledComponent } from '@emotion/styled';
import { Button, Dialog, DialogProps, FormHelperText } from '@mui/material';
import { styled, SxProps, Theme } from '@mui/material/styles';
import {
  bookInstructDealOrderPayload,
  bookInstructDealPaymentPayload,
  bookInstructDealRequestDataState,
  bookInstructDealSettlementPayload,
  clientApiState,
  corPayQuotePaymentResponseState,
  executionTimingtData,
  fxFetchingSpotRateState,
  paymentLockSideState,
  paymentPurposeRequestData,
  paymentReferenceRequestData,
  paymentspotRateDataState,
  paymentSpotRateRequestDataState,
  purposeOfPaymentsDataState,
  spotRateExpiredState,
  spotRateRequestDataState,
  transactionRequestDataState,
  valueDateTypeState,
  universalBeneficiaryAccountsDataState,
  allSettlementWalletListDataState,
  allValueDatesState,
} from 'atoms';
import { AxiosError } from 'axios';
import { format, parseISO } from 'date-fns';
import {
  CustomQuoteError,
  ExecutionTiming,
  PangeaBeneficiary,
  PangeaBookInstructDealRequest,
  PangeaCorpayLockSideEnum,
  PangeaWallet,
  PangeaInitialMarketStateRequest,
  PangeaInstructDealRequestOrder,
  PangeaInstructDealRequestPayment,
  PangeaInstructDealRequestSettlement,
  PangeaPaymentDeliveryMethodEnum,
  PangeaPaymentMethod1AfEnum,
  PangeaPurposeOfPaymentItem,
  PangeaQuotePaymentResponse,
  PangeaSettlementAccountChildren,
  PangeaSettlementMethodEnum,
  PangeaSpotRateRequest,
  PangeaWalletTypeEnum,
  PaymentType,
  PangeaDateTypeEnum,
} from 'lib';
import { debounce, DebouncedFunc, isError } from 'lodash';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import { useLoading } from './useLoading';

export interface MUIStyledCommonProps<T extends object> {
  theme?: Theme;
  as?: React.ElementType;
  sx?: SxProps<T>;
}

type OriginDestinationAccountType =
  | PangeaWallet
  | PangeaBeneficiary
  | PangeaSettlementAccountChildren
  | string
  | undefined;

const spotMethodMap: Record<string, PangeaPaymentDeliveryMethodEnum> = {
  W: PangeaPaymentDeliveryMethodEnum.Swift,
  E: PangeaPaymentDeliveryMethodEnum.Local,
  C: PangeaPaymentDeliveryMethodEnum.Local,
};

type UseWalletAndPaymentHelpersReturnType = {
  selectedAccountForDetails: Optional<PangeaWallet | PangeaBeneficiary>;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  bookAndInstructDealRequest: PangeaBookInstructDealRequest;
  setBookAndInstructDealRequest: SetterOrUpdater<PangeaBookInstructDealRequest>;
  spotRateRequestPayload: PangeaSpotRateRequest;
  setSpotRateRequestPayload: SetterOrUpdater<PangeaSpotRateRequest>;
  setPaymentSpotRateRequestPayload: SetterOrUpdater<PangeaInitialMarketStateRequest>;
  paymentSpotRateRequestPayload: PangeaInitialMarketStateRequest;
  orderDetails: PangeaInstructDealRequestOrder;
  paymentDetails: PangeaInstructDealRequestPayment;
  settlementDetails: PangeaInstructDealRequestSettlement;
  openDetailsModal(id: string): void;
  allWallets: PangeaWallet[];
  isLoadingFxRate: boolean;
  hasFxRate: boolean;
  isLoadingBeneficiaryAccounts: boolean;
  beneficiaryAccounts: PangeaBeneficiary[];
  corPayQuotePaymentResponse: Nullable<PangeaQuotePaymentResponse>;
  allPurposes: PangeaPurposeOfPaymentItem[];
  isLoadingPurposes: boolean;
  settlementAccounts: PangeaWallet[];
  settlementWallets: PangeaWallet[];
  isLoadingSettlementWallets: boolean;
  handleCurrencyChange: DebouncedFunc<
    (currency: string, side_enum: 'buy_currency' | 'sell_currency') => void
  >;
  isBeneficiaryAccount(
    account: OriginDestinationAccountType,
  ): account is PangeaBeneficiary;
  isSettlementAccount(
    account: OriginDestinationAccountType,
  ): account is PangeaWallet;
  isWalletAccount(
    account: OriginDestinationAccountType,
  ): account is PangeaWallet;
  isSpotRateExpired: boolean;
  setIsSpotRateExpired: SetterOrUpdater<boolean>;
  setCorPayQuotePaymentResponse: SetterOrUpdater<
    Nullable<PangeaQuotePaymentResponse>
  >;
  setPaymentLockSide: SetterOrUpdater<PangeaCorpayLockSideEnum>;
  paymentLockSide: PangeaCorpayLockSideEnum;
  needsRate: boolean;
  renderHelperText(optionValue: Optional<string>): JSX.Element;
  purposeDetails: string;
  setPurposeDetails: SetterOrUpdater<string>;
  executionTiming: ExecutionTiming | null;
  setExecutionTiming: SetterOrUpdater<ExecutionTiming | null>;
  referenceDetails: string;
  amountsErrorState: {
    isAmountError: boolean;
    errorMessage: string;
  };
  requestCorpayQuotePayment: (value: number, accType: PaymentType) => void;
  setReferenceDetails: SetterOrUpdater<string>;
  handlePaymentAmountChange: DebouncedFunc<
    (value: number, accType: PaymentType) => void
  >;
  handleSettlementAmountChange: DebouncedFunc<
    (value: number, accType: PaymentType) => void
  >;
  handlePaymentReferenceChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  getPaymentsV2SpotRate: (
    requestPayload: PangeaInitialMarketStateRequest,
  ) => Promise<void>;
  CustomDialog: StyledComponent<
    DialogProps & MUIStyledCommonProps<Theme>,
    object,
    object
  >;
  getDestinationAccountMethod(
    account: OriginDestinationAccountType,
  ): PangeaPaymentDeliveryMethodEnum | undefined;
  getOriginAccountMethod(
    account: OriginDestinationAccountType,
  ): PangeaPaymentDeliveryMethodEnum | undefined;
  getExecutableDateFromValueDate: (
    valueDate: Date | null | undefined,
  ) => NullableString;
};

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '.MuiPaper-root': {
    backgroundColor: PangeaColors.StoryWhiteMedium,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    maxWidth: '80%',
    padding: '2.5rem 2rem 2rem',
    boxSizing: 'border-box',
  },
  '& .MuiTypography-root.MuiTypography-h6': {
    padding: '0',
  },
  '& .MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium': {
    padding: '0',
  },
}));
export const useWalletAndPaymentHelpers =
  (): UseWalletAndPaymentHelpersReturnType => {
    const { loadingPromise, loadingState: isLoadingFxRate } = useLoading();
    // #region State variables
    const [selectedAccountForDetails, setSelectedAccountForDetails] =
      useState<Optional<PangeaWallet | PangeaBeneficiary>>();
    const [openDialog, setOpenDialog] = useState(false);
    const [amountsErrorMessage, setAmountsErrorMessage] = useState('');
    // #endregion

    // #region Recoil States
    const apiHelper = useRecoilValue(clientApiState);
    const [spotRateRequestPayload, setSpotRateRequestPayload] = useRecoilState(
      spotRateRequestDataState,
    );
    const [isSpotRateExpired, setIsSpotRateExpired] =
      useRecoilState(spotRateExpiredState);
    const [bookAndInstructDealRequest, setBookAndInstructDealRequest] =
      useRecoilState(bookInstructDealRequestDataState);
    const [purposeDetails, setPurposeDetails] = useRecoilState(
      paymentPurposeRequestData,
    );
    const [referenceDetails, setReferenceDetails] = useRecoilState(
      paymentReferenceRequestData,
    );
    const settlementWalletsListLoadable = useRecoilValueLoadable(
      allSettlementWalletListDataState,
    );

    const [corPayQuotePaymentResponse, setCorPayQuotePaymentResponse] =
      useRecoilState(corPayQuotePaymentResponseState);
    const [paymentLockSide, setPaymentLockSide] =
      useRecoilState(paymentLockSideState);
    const valueDateType = useRecoilValue(valueDateTypeState);
    const allValueDates = useRecoilValue(allValueDatesState);
    // #endregion

    // #region Book-Instruct-Deal Payload Parts
    const orderDetails = useRecoilValue(bookInstructDealOrderPayload);
    const settlementDetails = useRecoilValue(bookInstructDealSettlementPayload);
    const paymentDetails = useRecoilValue(bookInstructDealPaymentPayload);
    // #endregion

    // #region Beneficiary Accounts Data
    const beneficiaryAccountsLoadable = useRecoilValueLoadable(
      universalBeneficiaryAccountsDataState,
    );
    const isLoadingBeneficiaryAccounts =
      beneficiaryAccountsLoadable.state === 'loading';
    const hasAllBeneficiaryAccounts =
      beneficiaryAccountsLoadable.state === 'hasValue';
    const beneficiaryAccounts = useMemo(
      () => {
        const allAccounts =
          hasAllBeneficiaryAccounts && !isLoadingBeneficiaryAccounts
            ? beneficiaryAccountsLoadable.getValue()?.results ?? []
            : [];

        return allAccounts;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        beneficiaryAccountsLoadable,
        hasAllBeneficiaryAccounts,
        isLoadingBeneficiaryAccounts,
        settlementDetails.currency,
      ],
    );
    // #endregion

    // #region Settlement Accounts Data
    const isLoadingSettlementWallets =
      settlementWalletsListLoadable.state === 'loading';
    const hasAllSettlementWallets =
      settlementWalletsListLoadable.state === 'hasValue';
    const settlementWallets = useMemo(
      () =>
        hasAllSettlementWallets && !isLoadingSettlementWallets
          ? settlementWalletsListLoadable.getValue()?.results ?? []
          : [],
      [
        settlementWalletsListLoadable,
        hasAllSettlementWallets,
        isLoadingSettlementWallets,
      ],
    );
    const allWallets = useMemo(
      () =>
        settlementWallets.filter(
          ({ type }) => type === PangeaWalletTypeEnum.Wallet,
        ),
      [settlementWallets],
    );
    const settlementAccounts = useMemo(
      () =>
        settlementWallets.filter(
          ({ type }) => type === PangeaWalletTypeEnum.Settlement,
        ),
      [settlementWallets],
    );
    // #endregion

    // #region Payment method mapping
    const PAYMENT_METHOD_MAPPING: Record<
      PaymentType,
      {
        payment_method: PangeaPaymentMethod1AfEnum;
        settlement_method: PangeaSettlementMethodEnum;
      }
    > = useMemo(() => {
      const BENE_PAYMENT_METHOD_MAP: Record<
        string,
        PangeaPaymentMethod1AfEnum | PangeaSettlementMethodEnum
      > = {
        E: PangeaPaymentMethod1AfEnum.EFT,
        W: PangeaPaymentMethod1AfEnum.Wire,
      };
      const accountIfPaymentIsBeneficiary = beneficiaryAccounts.find(
        ({ beneficiary_id }) =>
          paymentDetails.beneficiary_id === beneficiary_id,
      );
      const accountIfSettlementIsBankAccount = settlementAccounts.find(
        ({ wallet_id }) => settlementDetails.account_id === wallet_id,
      );
      return {
        FXWallet: {
          payment_method: PangeaPaymentMethod1AfEnum.StoredValue,
          settlement_method: PangeaSettlementMethodEnum.Wire,
        },
        BeneficiaryPayments: {
          payment_method: accountIfPaymentIsBeneficiary?.payment_methods[0]
            ? (BENE_PAYMENT_METHOD_MAP[
                accountIfPaymentIsBeneficiary.payment_methods[0] as string
              ] as PangeaPaymentMethod1AfEnum)
            : PangeaPaymentMethod1AfEnum.Wire,
          settlement_method: accountIfSettlementIsBankAccount?.method
            ? (BENE_PAYMENT_METHOD_MAP[
                accountIfSettlementIsBankAccount.method as string
              ] as PangeaSettlementMethodEnum)
            : PangeaSettlementMethodEnum.Wire,
        },
        Deposits: {
          payment_method: PangeaPaymentMethod1AfEnum.StoredValue,
          settlement_method: accountIfSettlementIsBankAccount?.method
            ? (BENE_PAYMENT_METHOD_MAP[
                accountIfSettlementIsBankAccount.method as string
              ] as PangeaSettlementMethodEnum)
            : PangeaSettlementMethodEnum.Wire,
        },
        Withdrawals: {
          payment_method: accountIfPaymentIsBeneficiary?.payment_methods[0]
            ? (BENE_PAYMENT_METHOD_MAP[
                accountIfPaymentIsBeneficiary.payment_methods[0] as string
              ] as PangeaPaymentMethod1AfEnum)
            : PangeaPaymentMethod1AfEnum.Wire,
          settlement_method: PangeaSettlementMethodEnum.Wire,
        },
      };
    }, [
      beneficiaryAccounts,
      paymentDetails.beneficiary_id,
      settlementAccounts,
      settlementDetails.account_id,
    ]);
    // #endregion
    // Spot Rate Data
    const hasFxRate =
      corPayQuotePaymentResponse !== null &&
      !isError(corPayQuotePaymentResponse);

    // #region List of Purposes Data
    const purposeOfPaymentsLoadable = useRecoilValueLoadable<
      PangeaPurposeOfPaymentItem[]
    >(purposeOfPaymentsDataState);
    const isLoadingPurposes = purposeOfPaymentsLoadable.state === 'loading';
    const hasAllPurposes = purposeOfPaymentsLoadable.state === 'hasValue';
    const allPurposes = useMemo(
      () =>
        !isLoadingPurposes && hasAllPurposes
          ? purposeOfPaymentsLoadable.getValue()
          : [],
      [hasAllPurposes, isLoadingPurposes, purposeOfPaymentsLoadable],
    );
    // #endregion

    // #region Type guards
    const isBeneficiaryAccount = (
      account: OriginDestinationAccountType,
    ): account is PangeaBeneficiary =>
      (account as PangeaBeneficiary)?.beneficiary_id !== undefined;

    const isSettlementAccount = (
      account: OriginDestinationAccountType,
    ): account is PangeaWallet =>
      (account as PangeaWallet)?.type === PangeaWalletTypeEnum.Settlement;

    const isWalletAccount = (
      account: OriginDestinationAccountType,
    ): account is PangeaWallet =>
      (account as PangeaWallet)?.type === PangeaWalletTypeEnum.Wallet;
    // #endregion
    const [paymentSpotRateRequestPayload, setPaymentSpotRateRequestPayload] =
      useRecoilState(paymentSpotRateRequestDataState);
    const setSpotRateData = useSetRecoilState(paymentspotRateDataState);
    const [executionTiming, setExecutionTiming] =
      useRecoilState(executionTimingtData);
    const setIsFetchingSpotRate = useSetRecoilState(fxFetchingSpotRateState);
    const transactionRequestData = useRecoilValue(transactionRequestDataState);
    // #region Input Handlers
    const timeoutRef = useRef(null);
    const getPaymentsV2SpotRate = useCallback(
      async (
        requestPayload: PangeaInitialMarketStateRequest,
      ): Promise<void> => {
        setIsFetchingSpotRate(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        const api = apiHelper.getAuthenticatedApiHelper();
        const response = await api.getMarketSpotRate({
          ...requestPayload,
        });
        if (!isError(response)) {
          setSpotRateData(response);
          setIsSpotRateExpired(false);

          timeoutRef.current = setTimeout(() => {
            setIsSpotRateExpired(true);
          }, 30000) as any;
        } else {
          setSpotRateData(null);
        }
        setIsFetchingSpotRate(false);
      },
      [apiHelper, setIsFetchingSpotRate, setIsSpotRateExpired, setSpotRateData],
    );
    const requestCorpayQuotePayment = useCallback(
      (value: number, accType: PaymentType) => {
        const fetchQuote = async () => {
          const paymentAndSettlementMethods: {
            payment_method: PangeaPaymentMethod1AfEnum;
            settlement_method: PangeaSettlementMethodEnum;
          } = PAYMENT_METHOD_MAPPING[accType];
          const api = apiHelper.getAuthenticatedApiHelper();
          const corpayQuoteResponse = await api.getCorpayPaymentQuoteAsync({
            beneficiary_id: paymentDetails.beneficiary_id,
            amount: value,
            lock_side:
              spotRateRequestPayload.lock_side ??
              PangeaCorpayLockSideEnum.Payment,
            payment_currency: paymentDetails.currency ?? 'USD',
            settlement_currency: settlementDetails.currency ?? 'USD',
            settlement_account_id: settlementDetails.account_id,
            payment_reference: paymentDetails.payment_reference,
            purpose_of_payment: 'FX Transfer', // Get from flow
            ...(paymentAndSettlementMethods as unknown as {
              payment_method: PangeaPaymentMethod1AfEnum;
              settlement_method: PangeaSettlementMethodEnum;
            }),
          });
          if (!isError(corpayQuoteResponse)) {
            setIsSpotRateExpired(false);
            setCorPayQuotePaymentResponse(corpayQuoteResponse);
          } else {
            const corPayError = (corpayQuoteResponse as unknown as AxiosError)
              ?.response?.data as CustomQuoteError;
            setCorPayQuotePaymentResponse(null);
            setAmountsErrorMessage(corPayError.errors?.[0].message ?? '');
          }
        };

        if (
          paymentDetails.beneficiary_id &&
          settlementDetails.account_id &&
          spotRateRequestPayload.lock_side &&
          paymentDetails.currency &&
          value > 0 &&
          settlementDetails.currency
        ) {
          loadingPromise(fetchQuote());
        } else {
          setAmountsErrorMessage('');
        }
      },
      [
        PAYMENT_METHOD_MAPPING,
        apiHelper,
        loadingPromise,
        paymentDetails.beneficiary_id,
        paymentDetails.currency,
        paymentDetails.payment_reference,
        setCorPayQuotePaymentResponse,
        setIsSpotRateExpired,
        settlementDetails.account_id,
        settlementDetails.currency,
        spotRateRequestPayload.lock_side,
      ],
    );
    const handlePaymentAmountChange = debounce(
      useCallback(
        (value: number, accType: PaymentType) => {
          const amount = isNaN(value) ? 0 : value;
          setBookAndInstructDealRequest((payload) => {
            return {
              ...payload,
              instruct_request: {
                ...payload.instruct_request,
                payments: [
                  {
                    ...payload.instruct_request.payments[0],
                    amount,
                  },
                ],
              },
            };
          });
          requestCorpayQuotePayment(value, accType);
        },
        [requestCorpayQuotePayment, setBookAndInstructDealRequest],
      ),
      600,
    );
    const handleSettlementAmountChange = debounce(
      useCallback(
        (value: number, accType: PaymentType) => {
          requestCorpayQuotePayment(value, accType);
        },
        [requestCorpayQuotePayment],
      ),
      600,
    );
    const handleCurrencyChange = debounce(
      useCallback(
        (currency: string, side_enum: 'buy_currency' | 'sell_currency') => {
          setPaymentSpotRateRequestPayload((payload) => {
            return {
              ...payload,
              [side_enum]: currency,
            };
          });
          getPaymentsV2SpotRate({
            ...paymentSpotRateRequestPayload,
            [side_enum]: currency,
            value_date: format(
              transactionRequestData.delivery_date ?? new Date(),
              'yyyy-MM-dd',
            ),
          });
        },
        [
          getPaymentsV2SpotRate,
          paymentSpotRateRequestPayload,
          setPaymentSpotRateRequestPayload,
          transactionRequestData.delivery_date,
        ],
      ),
      600,
    );
    const handlePaymentReferenceChange = useCallback(
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBookAndInstructDealRequest((payload) => {
          return {
            ...payload,
            instruct_request: {
              ...payload.instruct_request,
              payments: [
                {
                  ...payload.instruct_request.payments[0],
                  payment_reference: event.target.value,
                },
              ],
            },
          };
        });
      },
      [setBookAndInstructDealRequest],
    );
    // #endregion

    // #region Helper functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getSelectedAccountFromId = (id: string) => {
      return (
        allWallets?.find((wallet) => wallet.wallet_id === id) ??
        beneficiaryAccounts?.find((account) => account.beneficiary_id === id) ??
        settlementAccounts?.find((account) => account.wallet_id === id)
      );
    };
    const openDetailsModal = useCallback(
      (id: string) => {
        const selectedWallet = getSelectedAccountFromId(id);
        setSelectedAccountForDetails(selectedWallet);
        setOpenDialog(true);
      },
      [getSelectedAccountFromId],
    );
    const renderHelperText = useCallback(
      (optionValue: Optional<string>) => {
        return (
          <FormHelperText
            sx={{
              textAlign: 'right',
              margin: '0',
            }}
          >
            {optionValue && (
              <Button
                variant='text'
                sx={{
                  lineHeight: '20px',
                  fontSize: '12px',
                  textTransform: 'capitalize',
                }}
                onClick={() => openDetailsModal(optionValue)}
              >
                Account Details
              </Button>
            )}
          </FormHelperText>
        );
      },
      [openDetailsModal],
    );
    const needsRate = useMemo(
      () => !hasFxRate || isSpotRateExpired,
      [hasFxRate, isSpotRateExpired],
    );
    const getExecutableDateFromValueDate = useCallback(
      (valueDate: Date | null | undefined): NullableString => {
        if (valueDate === null || valueDate === undefined) {
          return null;
        }
        const formatedDate = format(valueDate, 'yyyy-MM-dd');
        const valueDateFromAllDates = allValueDates.find(
          ({ date }) => date === formatedDate,
        );
        if (valueDateFromAllDates && valueDateFromAllDates.executable_time) {
          return format(
            parseISO(valueDateFromAllDates.executable_time),
            'yyyy-MM-dd',
          );
        }
        return formatedDate;
      },
      [allValueDates],
    );
    // #endregion

    // #region Error states for amounts
    const amountsErrorState = useMemo(() => {
      if (corPayQuotePaymentResponse && corPayQuotePaymentResponse.payment) {
        if (corPayQuotePaymentResponse.payment.amount_domestic !== undefined) {
          if (corPayQuotePaymentResponse.payment.amount_domestic > 1e6) {
            return {
              isAmountError: true,
              errorMessage: 'Exceeds USD 1,000,000.00 limit',
            };
          }
          if (corPayQuotePaymentResponse.payment.amount_domestic < 1) {
            return {
              isAmountError: true,
              errorMessage: 'Must be ≥ USD 1.00',
            };
          }
        } else {
          return {
            isAmountError: false,
            errorMessage: '',
          };
        }
      }
      return {
        isAmountError: true,
        errorMessage: amountsErrorMessage,
      };
    }, [amountsErrorMessage, corPayQuotePaymentResponse]);
    // #endregion

    // #region Get origin/destination account method
    const getOriginAccountMethod = useCallback(
      (
        account: OriginDestinationAccountType,
      ): PangeaPaymentDeliveryMethodEnum | undefined => {
        if (!account) {
          return undefined;
        }
        if (isWalletAccount(account)) {
          return valueDateType === PangeaDateTypeEnum.SPOT
            ? PangeaPaymentDeliveryMethodEnum.Swift
            : PangeaPaymentDeliveryMethodEnum.Local;
        }
        if (isSettlementAccount(account)) {
          return valueDateType === PangeaDateTypeEnum.SPOT
            ? spotMethodMap[account.method ?? '']
            : (account.method as unknown as PangeaPaymentDeliveryMethodEnum);
        }
        return valueDateType === PangeaDateTypeEnum.SPOT
          ? PangeaPaymentDeliveryMethodEnum.Swift
          : PangeaPaymentDeliveryMethodEnum.Local;
      },
      [valueDateType],
    );
    const getDestinationAccountMethod = useCallback(
      (
        account: OriginDestinationAccountType,
      ): PangeaPaymentDeliveryMethodEnum | undefined => {
        if (!account) {
          return undefined;
        }
        if (isWalletAccount(account)) {
          return valueDateType === PangeaDateTypeEnum.SPOT
            ? PangeaPaymentDeliveryMethodEnum.Swift
            : PangeaPaymentDeliveryMethodEnum.Local;
        }

        if (isBeneficiaryAccount(account)) {
          return valueDateType === PangeaDateTypeEnum.SPOT
            ? spotMethodMap[account.payment_methods[0]]
            : (account
                .payment_methods[0] as unknown as PangeaPaymentDeliveryMethodEnum);
        }

        return valueDateType === PangeaDateTypeEnum.SPOT
          ? PangeaPaymentDeliveryMethodEnum.Swift
          : PangeaPaymentDeliveryMethodEnum.Local;
      },
      [valueDateType],
    );

    return useMemo(
      () => ({
        paymentSpotRateRequestPayload,
        setPaymentSpotRateRequestPayload,
        executionTiming,
        setExecutionTiming,
        getPaymentsV2SpotRate,
        handleCurrencyChange,
        selectedAccountForDetails,
        getExecutableDateFromValueDate,
        openDialog,
        setOpenDialog,
        bookAndInstructDealRequest,
        setBookAndInstructDealRequest,
        amountsErrorState,
        spotRateRequestPayload,
        setSpotRateRequestPayload,
        requestCorpayQuotePayment,
        orderDetails,
        paymentDetails,
        settlementDetails,
        openDetailsModal,
        settlementWallets,
        isLoadingSettlementWallets,
        allWallets,
        beneficiaryAccounts,
        setCorPayQuotePaymentResponse,
        setPaymentLockSide,
        paymentLockSide,
        corPayQuotePaymentResponse,
        isLoadingFxRate: isLoadingFxRate.isLoading,
        hasFxRate,
        allPurposes,
        isLoadingPurposes,
        settlementAccounts,
        isBeneficiaryAccount,
        isLoadingBeneficiaryAccounts,
        isSettlementAccount,
        isSpotRateExpired,
        setIsSpotRateExpired,
        isWalletAccount,
        renderHelperText,
        needsRate,
        handlePaymentAmountChange,
        handleSettlementAmountChange,
        purposeDetails,
        setPurposeDetails,
        referenceDetails,
        setReferenceDetails,
        CustomDialog,
        handlePaymentReferenceChange,
        getOriginAccountMethod,
        getDestinationAccountMethod,
      }),
      [
        paymentSpotRateRequestPayload,
        setPaymentSpotRateRequestPayload,
        executionTiming,
        setExecutionTiming,
        getPaymentsV2SpotRate,
        settlementWallets,
        isLoadingSettlementWallets,
        handleCurrencyChange,
        getExecutableDateFromValueDate,
        selectedAccountForDetails,
        openDialog,
        bookAndInstructDealRequest,
        setBookAndInstructDealRequest,
        spotRateRequestPayload,
        amountsErrorState,
        setSpotRateRequestPayload,
        orderDetails,
        paymentDetails,
        settlementDetails,
        requestCorpayQuotePayment,
        setCorPayQuotePaymentResponse,
        openDetailsModal,
        setPaymentLockSide,
        paymentLockSide,
        allWallets,
        beneficiaryAccounts,
        corPayQuotePaymentResponse,
        isLoadingFxRate,
        hasFxRate,
        allPurposes,
        isLoadingPurposes,
        settlementAccounts,
        isLoadingBeneficiaryAccounts,
        isSpotRateExpired,
        setIsSpotRateExpired,
        renderHelperText,
        needsRate,
        handlePaymentAmountChange,
        handleSettlementAmountChange,
        purposeDetails,
        setPurposeDetails,
        referenceDetails,
        setReferenceDetails,
        handlePaymentReferenceChange,
        getOriginAccountMethod,
        getDestinationAccountMethod,
      ],
    );
  };
