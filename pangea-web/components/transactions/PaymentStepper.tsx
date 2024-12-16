import { Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import {
  buyCurrencyState,
  clientApiState,
  existingPaymentIdState,
  pangeaAlertNotificationMessageState,
  paymentDetailsValidationState,
  paymentExecutionTimingtData,
  paymentRfqState,
  paymentspotRateDataState,
  sellCurrencyState,
  transactionPaymentState,
  transactionRequestDataState,
  transactionToApproveState,
  userState,
} from 'atoms';
import { ConfirmCancelDialog } from 'components/modals';
import {
  PangeaButtonProps,
  PangeaLoading,
  PaymentSummarySidebar,
  RedirectSpinner,
  StepperShell,
} from 'components/shared';
import { CurrencyInsightPreview } from 'components/shared/CurrencyInsights';
import PaymentRateExpiryChecker from 'components/shared/PaymentRateExpiryChecker';
import { format, parse } from 'date-fns';
import { useAuthHelper, useLoading, useWalletAndPaymentHelpers } from 'hooks';
import {
  CreateOrUpdatePaymentArguments,
  PangeaExecutionTimingEnum,
  PangeaFwdBrokerEnum,
  PangeaPayment,
  PangeaPaymentInstallment,
  PangeaPaymentStatusEnum,
  TransactionRequestData,
} from 'lib';
import { isError } from 'lodash';
import { useRouter } from 'next/router';
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useRecoilCallback,
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { RRule } from 'rrule';
import { PangeaColors } from 'styles';
import PaymentApproverDetails from './PaymentApproverDetails';
import PaymentDetails from './PaymentDetails';
import PaymentExecutionDetails from './PaymentExecutionDetails';
import PaymentReview from './PaymentReview';

type PaymentStepperProps = {
  activeStep: string;
  onChangeStep: Dispatch<SetStateAction<number>>;
};
export const PaymentStepper = ({
  activeStep,
  onChangeStep,
}: PaymentStepperProps): JSX.Element => {
  const authHelper = useRecoilValue(clientApiState);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextLocation, setNextLocation] = useState('');
  const [approverIds, setApproverIds] = useState<number[]>([]);
  const user = useRecoilValue(userState);
  const apiHelper = authHelper.getAuthenticatedApiHelper();

  const [transactionPayment, setTransactionPayment] = useRecoilState(
    transactionPaymentState,
  );
  const [transactionRequestData, setTransactionRequestData] = useRecoilState(
    transactionRequestDataState,
  );
  const setTransactionToApproveId = useSetRecoilState(
    transactionToApproveState,
  );
  const setExistingTransactionId = useSetRecoilState(existingPaymentIdState);
  const resetPaymentSpotRate = useResetRecoilState(paymentspotRateDataState);
  const resetBuyCurrency = useResetRecoilState(buyCurrencyState);
  const resetSellCurrency = useResetRecoilState(sellCurrencyState);
  const resetTransactionPayment = useResetRecoilState(transactionPaymentState);
  const resetPaymentRfq = useResetRecoilState(paymentRfqState);
  const resetExistingPaymentId = useResetRecoilState(existingPaymentIdState);
  const resetPaymentDetailsValidation = useRecoilRefresher_UNSTABLE(
    paymentDetailsValidationState,
  );
  const resetTransactionRequestData = useResetRecoilState(
    transactionRequestDataState,
  );
  const isSameCurrency =
    transactionRequestData?.payment_currency ===
    transactionRequestData?.settlement_currency;
  const [executionTiming, setExecutionTiming] = useRecoilState(
    paymentExecutionTimingtData,
  );
  const isApprovalRequired = Boolean(
    (transactionPayment?.approvers?.length ?? 0) > 0 &&
      transactionPayment?.min_approvers &&
      transactionPayment.min_approvers > 0 &&
      user &&
      !user?.can_bypass_approval,
  );

  const availableApprovers = useMemo(() => {
    if (transactionPayment?.approvers?.length) {
      return transactionPayment.approvers;
    }
    return [];
  }, [transactionPayment]);

  const {
    isLoadingFxRate,
    setIsSpotRateExpired,
    getExecutableDateFromValueDate,
    settlementWallets,
    settlementAccounts,
  } = useWalletAndPaymentHelpers();
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const resetCurrencies = useCallback(() => {
    resetBuyCurrency();
    resetSellCurrency();
  }, [resetBuyCurrency, resetSellCurrency]);
  const paymentDetailsValidation = useRecoilValue(
    paymentDetailsValidationState,
  );
  const transactionNeedsBeneficiary = useMemo(() => {
    const { settlementDetails } = transactionRequestData;
    if (!settlementDetails?.account_id) {
      return false;
    }

    const accountDetails =
      settlementAccounts.find(
        ({ wallet_id }) => wallet_id === settlementDetails.account_id,
      ) ||
      settlementWallets.find(
        ({ wallet_id }) => wallet_id === settlementDetails.account_id,
      );

    return (
      accountDetails?.broker.broker_provider === PangeaFwdBrokerEnum.CORPAY
    );
  }, [settlementAccounts, settlementWallets, transactionRequestData]);
  const isSettlementDetailsValid = useMemo(() => {
    const { settlementDetails, paymentDetails, purpose_of_payment } =
      transactionRequestData;
    if (
      !settlementDetails?.account_id ||
      !paymentDetails?.beneficiary_id ||
      !purpose_of_payment
    ) {
      return false;
    }
    return true;
  }, [transactionRequestData]);
  const paymentDetailsIsValid = useMemo(() => {
    const baseValidation =
      Object.values(paymentDetailsValidation).every((v) => v) &&
      Boolean(executionTiming);

    if (transactionNeedsBeneficiary) {
      return (
        baseValidation &&
        Boolean(transactionRequestData.paymentDetails?.beneficiary_id)
      );
    }

    return baseValidation;
  }, [
    transactionNeedsBeneficiary,
    paymentDetailsValidation,
    executionTiming,
    transactionRequestData.paymentDetails?.beneficiary_id,
  ]);
  const {
    loadingPromise: paymentProcessingPromise,
    loadingState: paymentProcessingLoadingState,
  } = useLoading();
  const { loadingPromise: waitConditionPromise } = useLoading();

  const updateTransactionRequestData = useCallback(
    (paymentResult: PangeaPayment, trxReqData: TransactionRequestData) => {
      if (trxReqData?.frequency === 'recurring') {
        setTransactionRequestData({
          ...trxReqData,
          periodicity: paymentResult.periodicity,
          periodicity_start_date: paymentResult.periodicity_start_date
            ? parse(
                paymentResult.periodicity_start_date,
                'yyyy-MM-dd',
                new Date(),
              )
            : null,
          periodicity_end_date: paymentResult.periodicity_end_date
            ? parse(
                paymentResult.periodicity_end_date,
                'yyyy-MM-dd',
                new Date(),
              )
            : null,
          cashflows: paymentResult.cashflows,
        });
      } else if (trxReqData?.frequency === 'installments') {
        const installments = paymentResult.cashflows.map((val) => {
          return {
            amount: val.amount,
            buy_currency: val.buy_currency,
            cashflow_id: val.cashflow_id,
            cntr_amount: val.cntr_amount,
            date: val.pay_date.split('T')[0],
            lock_side: val.lock_side,
            sell_currency: val.sell_currency,
          } as PangeaPaymentInstallment;
        });
        setTransactionRequestData({
          ...trxReqData,
          installments: installments,
          cashflows: paymentResult.cashflows,
        });
      }
    },
    [setTransactionRequestData],
  );

  const handleCreateOrUpdatePaymentTransaction = useRecoilCallback(
    ({ snapshot }) =>
      async ({
        shouldUpdateBestEx,
        newValueDate,
        newStartDate,
        newEndDate,
        newPeriodicity,
      }: CreateOrUpdatePaymentArguments) => {
        const release = snapshot.retain();
        try {
          setPangeaAlertNotificationMessage(null);
          setIsSpotRateExpired(true);
          const transactionRequestDataSnapshot = await snapshot.getPromise(
            transactionRequestDataState,
          );
          const executionTimingSnapshot = await snapshot.getPromise(
            paymentExecutionTimingtData,
          );
          const paymentDetailsValidationSnapshot = await snapshot.getPromise(
            paymentDetailsValidationState,
          );
          const isPaymentValid = Object.values(
            paymentDetailsValidationSnapshot,
          ).every((v) => v);

          const payment = {
            amount:
              (transactionRequestDataSnapshot?.lock_side ===
              transactionRequestDataSnapshot?.payment_currency
                ? transactionRequestDataSnapshot.payment_amount
                : transactionRequestDataSnapshot.settlement_amount) ?? 0,
            cntr_amount:
              (transactionRequestDataSnapshot.lock_side ===
              transactionRequestDataSnapshot.payment_currency
                ? transactionRequestDataSnapshot.settlement_amount
                : transactionRequestDataSnapshot.payment_amount) ?? 0,

            lock_side: transactionRequestDataSnapshot.lock_side,
            buy_currency: transactionRequestDataSnapshot.payment_currency,
            delivery_date:
              transactionRequestDataSnapshot.frequency === 'recurring' ||
              transactionRequestDataSnapshot.frequency === 'installments'
                ? null
                : getExecutableDateFromValueDate(
                    newValueDate ??
                      transactionRequestDataSnapshot?.delivery_date,
                  ),

            execution_timing:
              executionTimingSnapshot?.value as PangeaExecutionTimingEnum,
            fee_in_bps: transactionRequestDataSnapshot.fees,
            fee: 0,
            name: transactionRequestDataSnapshot.payment_reference,
            destination_account_id:
              transactionRequestDataSnapshot?.paymentDetails?.beneficiary_id ??
              null,
            destination_account_method: null,
            origin_account_id:
              transactionRequestDataSnapshot?.settlementDetails?.account_id ??
              null,
            origin_account_method: null,
            purpose_of_payment:
              transactionRequestDataSnapshot.purpose_of_payment,
            sell_currency: transactionRequestDataSnapshot.settlement_currency,
            cashflows: [],
            created: '',
            id: transactionPayment?.id ?? 0,
            installment: false,
            modified: '',
            payment_status: PangeaPaymentStatusEnum.Drafting,
            recurring: transactionRequestDataSnapshot.frequency === 'recurring',
          } as unknown as PangeaPayment;
          if (
            transactionRequestDataSnapshot.frequency === 'recurring' &&
            transactionRequestDataSnapshot?.periodicity
          ) {
            const rruleDates = RRule.fromString(
              newPeriodicity ?? transactionRequestDataSnapshot.periodicity,
            ).all();
            payment.periodicity =
              newPeriodicity ?? transactionRequestDataSnapshot?.periodicity;
            payment.periodicity_end_date = newEndDate
              ? format(new Date(newEndDate), 'yyyy-MM-dd')
              : format(rruleDates[rruleDates.length - 1], 'yyyy-MM-dd');
            payment.periodicity_start_date = newStartDate
              ? format(new Date(newStartDate), 'yyyy-MM-dd')
              : format(rruleDates[0], 'yyyy-MM-dd');
          } else if (
            transactionRequestDataSnapshot.frequency === 'installments'
          ) {
            let installments = transactionRequestDataSnapshot.installments
              ? [...transactionRequestDataSnapshot.installments]
              : [];
            installments = installments.map((item) => {
              const cashflow: PangeaPaymentInstallment = {
                amount: item.amount,
                cntr_amount: item.cntr_amount,
                sell_currency: item.sell_currency,
                buy_currency: item.buy_currency,
                date: item.date,
                lock_side: item.lock_side,
              };
              if (item.cashflow_id) {
                cashflow.cashflow_id = item.cashflow_id;
              }
              return cashflow;
            });
            payment.installments = installments;
          }
          const submitCreatePaymentTransaction = async () => {
            try {
              if (!isPaymentValid) {
                return;
              }
              const paymentResult = await apiHelper.createPaymentAsync(payment);
              if (paymentResult && !isError(paymentResult)) {
                setTransactionPayment(paymentResult);
                updateTransactionRequestData(
                  paymentResult,
                  transactionRequestDataSnapshot,
                );
                setExistingTransactionId(paymentResult.id + '');
                if (shouldUpdateBestEx) {
                  setExecutionTiming(null);
                  queryClient.invalidateQueries({
                    queryKey: ['paymentTimingOptions'],
                  });
                }
              } else {
                setPangeaAlertNotificationMessage({
                  severity: 'error',
                  text: (paymentResult as unknown as any)?.response?.data
                    ?.validation_errors[0]?.detail,
                });
              }
            } catch (error) {
              setPangeaAlertNotificationMessage({
                severity: 'error',
                text: 'There was an error creating a wait condition.',
              });
            }
          };
          const submitUpdatePaymentTransaction = async () => {
            try {
              if (!isPaymentValid) {
                return;
              }
              const paymentResult = await apiHelper.updatePaymentAsync(
                payment.id.toString(),
                payment,
              );
              if (paymentResult && !isError(paymentResult)) {
                setTransactionPayment(paymentResult);
                updateTransactionRequestData(
                  paymentResult,
                  transactionRequestDataSnapshot,
                );
                if (shouldUpdateBestEx) {
                  setExecutionTiming(null);
                  queryClient.invalidateQueries({
                    queryKey: ['paymentTimingOptions'],
                  });
                }
              } else {
                setPangeaAlertNotificationMessage({
                  severity: 'error',
                  text: (paymentResult as unknown as any)?.response?.data
                    ?.validation_errors[0]?.detail,
                  timeout: 5000,
                });
              }
            } catch (error) {
              setPangeaAlertNotificationMessage({
                severity: 'error',
                text: 'There was an error updating a wait condition.',
                timeout: 5000,
              });
            }
          };
          await waitConditionPromise(
            transactionPayment?.id
              ? submitUpdatePaymentTransaction()
              : submitCreatePaymentTransaction(),
          );
        } finally {
          release();
        }
      },
    [
      setPangeaAlertNotificationMessage,
      setIsSpotRateExpired,
      getExecutableDateFromValueDate,
      setExecutionTiming,
      transactionPayment?.id,
      waitConditionPromise,
      apiHelper,
      setTransactionPayment,
      updateTransactionRequestData,
      setExistingTransactionId,
      queryClient,
    ],
  );

  const [
    title,
    titleDescription,
    continueText,
    stepperContent,
    leftContent,
    rightContent,
    testId,
  ] = useMemo(() => {
    switch (activeStep) {
      case '0':
        return [
          'Transaction Details',
          '',
          'Next',
          <PaymentDetails
            key='payment-details'
            onCreateOrUpdateTransaction={handleCreateOrUpdatePaymentTransaction}
          />,
          <React.Fragment key='left-content'>
            <PaymentExecutionDetails
              key='payment-execution'
              isPaymentValid={Boolean(
                Object.values(paymentDetailsValidation).every((v) => v),
              )}
              onCreateOrUpdateTransaction={
                handleCreateOrUpdatePaymentTransaction
              }
            />
            <PaymentApproverDetails
              key='payment-approver'
              approvers={availableApprovers}
              onApproverChange={(selected) =>
                setApproverIds(selected.map(({ id }) => id))
              }
              isRequired={isApprovalRequired}
            />
          </React.Fragment>,
          <>
            <CurrencyInsightPreview
              key='currency-insights'
              sx={{ mt: '4rem' }}
            />
            <PaymentSummarySidebar key='payment-summary-sidebar' />
          </>,
          'paymentDetailsForm',
        ];
      default:
        return [
          'Review & Confirm',
          '',
          isApprovalRequired ? 'Submit for Authorization' : 'Confirm',
          <PaymentReview
            key='payment-review'
            onCreateOrUpdateTransaction={handleCreateOrUpdatePaymentTransaction}
          />,
          null,
          <>
            <CurrencyInsightPreview
              key='currency-insights'
              sx={{ mt: '4rem' }}
            />
            <PaymentSummarySidebar key='payment-summary-sidebar' />
          </>,
          'paymentReviewForm',
        ];
    }
  }, [
    activeStep,
    handleCreateOrUpdatePaymentTransaction,
    paymentDetailsValidation,
    availableApprovers,
    isApprovalRequired,
  ]);

  const checkApprovalReqs = isApprovalRequired ? approverIds.length > 0 : true;

  const isContinueButtonEnabled = useMemo(() => {
    switch (activeStep) {
      case '0':
        return (
          !isLoadingFxRate &&
          paymentDetailsIsValid &&
          isSettlementDetailsValid &&
          checkApprovalReqs
        );
      case '1':
        return Boolean(executionTiming?.value);
      default:
        return (
          (executionTiming?.value &&
            ![
              PangeaExecutionTimingEnum.ImmediateNdf,
              PangeaExecutionTimingEnum.ImmediateForward,
              PangeaExecutionTimingEnum.ImmediateSpot,
            ].includes(executionTiming.value as PangeaExecutionTimingEnum)) ||
          isSameCurrency
        );
    }
  }, [
    activeStep,
    isLoadingFxRate,
    checkApprovalReqs,
    paymentDetailsIsValid,
    isSettlementDetailsValid,
    executionTiming?.value,
    isSameCurrency,
  ]);

  const continueButtonProps: PangeaButtonProps = useMemo(() => {
    switch (activeStep) {
      case '1':
        return {
          sx: {
            display:
              executionTiming?.value &&
              [
                PangeaExecutionTimingEnum.ImmediateSpot,
                PangeaExecutionTimingEnum.ImmediateNdf,
                PangeaExecutionTimingEnum.ImmediateForward,
              ].includes(executionTiming.value as PangeaExecutionTimingEnum) &&
              !isSameCurrency &&
              !isApprovalRequired
                ? 'none'
                : 'inherit',
          },
          color: isApprovalRequired ? 'primary' : 'secondary',
          loading: paymentProcessingLoadingState.isLoading,
        };
      default:
        return {};
    }
  }, [
    activeStep,
    isApprovalRequired,
    isSameCurrency,
    executionTiming?.value,
    paymentProcessingLoadingState.isLoading,
  ]);

  const SecondaryComponents: ReactNode = useMemo(() => {
    switch (activeStep) {
      case '1':
        return executionTiming?.value &&
          [
            PangeaExecutionTimingEnum.ImmediateSpot,
            PangeaExecutionTimingEnum.ImmediateNdf,
            PangeaExecutionTimingEnum.ImmediateForward,
          ].includes(executionTiming.value as PangeaExecutionTimingEnum) &&
          !isSameCurrency &&
          !isApprovalRequired ? (
          <PaymentRateExpiryChecker />
        ) : null;
      default:
        return null;
    }
  }, [activeStep, executionTiming?.value, isSameCurrency, isApprovalRequired]);

  const handleOnSubmit = useCallback(async () => {
    // clear any existing alert messages
    setPangeaAlertNotificationMessage(null);
    const submitPaymentOrder = async () => {
      try {
        if (transactionPayment?.id) {
          const executePaymentResponse = await apiHelper.executePayment(
            transactionPayment.id.toString(),
          );
          if (executePaymentResponse && !isError(executePaymentResponse)) {
            resetCurrencies();
            resetTransactionPayment();
            resetTransactionRequestData();
            resetPaymentDetailsValidation();
            resetExistingPaymentId();
            router.push(`/transactions/payments/success`);
          } else {
            resetCurrencies();
            resetTransactionPayment();
            resetTransactionRequestData();
            resetPaymentDetailsValidation();
            resetExistingPaymentId();
            router.push(`/transactions/payments/error`);
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'There was an error executing payment.',
            });
          }
        } else {
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'There was an error instructing the deal.',
          });
        }
      } catch {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error quoting the order.',
        });
      }
    };
    const submitPaymentForAuthorization = async () => {
      try {
        if (transactionPayment?.id) {
          const submitPaymentResponse =
            await apiHelper.submitPaymentForAuthorizationAsync({
              payment_id: transactionPayment.id,
              approver_user_ids: approverIds,
            });
          if (submitPaymentResponse && !isError(submitPaymentResponse)) {
            setTransactionToApproveId(String(transactionPayment.id));
            resetCurrencies();
            resetTransactionPayment();
            resetTransactionRequestData();
            resetPaymentDetailsValidation();
            resetExistingPaymentId();
            router.push(`/transactions/payments/success-authorization`);
          } else {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'There was an error submitting the payment for authorization.',
            });
          }
        } else {
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'There was an error submitting the payment for authorization.',
          });
        }
      } catch {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error submitting the payment for authorization.',
        });
      }
    };
    await paymentProcessingPromise(
      isApprovalRequired
        ? submitPaymentForAuthorization()
        : submitPaymentOrder(),
    );
  }, [
    isApprovalRequired,
    approverIds,
    setTransactionToApproveId,
    setPangeaAlertNotificationMessage,
    paymentProcessingPromise,
    resetTransactionPayment,
    resetPaymentDetailsValidation,
    resetExistingPaymentId,
    resetTransactionRequestData,
    transactionPayment?.id,
    apiHelper,
    resetCurrencies,
    router,
  ]);

  const handleContinueClick = useMemo(() => {
    switch (activeStep) {
      case '0':
        return function () {
          onChangeStep(1);
        };
      default:
        return function () {
          handleOnSubmit();
        };
    }
  }, [activeStep, handleOnSubmit, onChangeStep]);

  const handleBackClick = useMemo(() => {
    switch (activeStep) {
      case '1':
        return function () {
          onChangeStep(0);
          resetPaymentRfq();
        };
      default:
        return function () {
          if (transactionPayment?.id) {
            setIsModalOpen(true);
            setNextLocation('/dashboard/transactions');
            router.events.emit('routeChangeError');
            throw 'Route change cancelled by user';
          } else {
            router.push('/dashboard/transactions');
          }
        };
    }
  }, [
    activeStep,
    onChangeStep,
    resetPaymentRfq,
    router,
    transactionPayment?.id,
  ]);

  const { isLoggedIn } = useAuthHelper();

  const handleModalChoice = useCallback(
    async (choice: 'save' | 'delete') => {
      // Handle the user's choice here. For example:
      if (choice === 'save') {
        // Save the work as a draft

        const payment = {
          amount:
            (transactionRequestData.lock_side ===
            transactionRequestData.payment_currency
              ? transactionRequestData.payment_amount
              : transactionRequestData.settlement_amount) ?? 0,
          cntr_amount:
            (transactionRequestData.lock_side ===
            transactionRequestData.payment_currency
              ? transactionRequestData.settlement_amount
              : transactionRequestData.payment_amount) ?? 0,

          lock_side: transactionRequestData.lock_side,
          buy_currency: transactionRequestData.payment_currency,
          delivery_date:
            transactionRequestData.frequency === 'recurring' ||
            transactionRequestData.frequency === 'installments'
              ? format(new Date(), 'yyyy-MM-dd')
              : getExecutableDateFromValueDate(
                  transactionRequestData?.delivery_date,
                ),

          execution_timing: executionTiming?.value as PangeaExecutionTimingEnum,
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
          id: transactionPayment?.id ?? 0,
          installment: transactionRequestData.frequency === 'installments',
          modified: '',
          payment_status: PangeaPaymentStatusEnum.Drafting,
          recurring: transactionRequestData.frequency === 'recurring',
        } as unknown as PangeaPayment;
        if (
          transactionRequestData.frequency === 'recurring' &&
          transactionRequestData?.periodicity
        ) {
          payment.periodicity = transactionRequestData?.periodicity;
          payment.periodicity_end_date =
            transactionRequestData?.periodicity_end_date
              ? format(
                  new Date(transactionRequestData?.periodicity_end_date),
                  'yyyy-MM-dd',
                )
              : null;
          payment.periodicity_start_date =
            transactionRequestData?.periodicity_start_date
              ? format(
                  new Date(transactionRequestData?.periodicity_start_date),
                  'yyyy-MM-dd',
                )
              : null;
        } else if (transactionRequestData.frequency === 'installments') {
          let installments = transactionRequestData.installments
            ? [...transactionRequestData.installments]
            : [];
          installments = installments.map((item) => {
            const cashflow: PangeaPaymentInstallment = {
              amount: item.amount,
              cntr_amount: item.cntr_amount,
              sell_currency: item.sell_currency,
              buy_currency: item.buy_currency,
              date: item.date,
              lock_side: item.lock_side,
            };
            if (item.cashflow_id) {
              cashflow.cashflow_id = item.cashflow_id;
            }
            return cashflow;
          });
          payment.installments = installments;
        }

        let saveDraftResult;
        if (transactionPayment?.id) {
          saveDraftResult = await apiHelper.updatePaymentAsync(
            transactionPayment.id.toString(),
            payment,
          );
        } else {
          saveDraftResult = await apiHelper.createPaymentAsync(payment);
        }

        if (!isError(saveDraftResult)) {
          resetPaymentSpotRate();
          // Navigate to the new route
          router.push(nextLocation);
          return;
        }
      } else if (choice === 'delete') {
        // Delete the work
        if (transactionPayment?.id) {
          const deleteDraftResult = await apiHelper.deletePaymentByIdAsync(
            transactionPayment.id,
          );
          if (!isError(deleteDraftResult)) {
            resetPaymentSpotRate();
            // Navigate to the new route
            router.push(nextLocation);
            return;
          }
        }
      } else {
        // Navigate to the new route
        resetPaymentSpotRate();
        router.push(nextLocation);
      }
      resetPaymentSpotRate();
      router.push(nextLocation);
    },
    [
      apiHelper,
      resetPaymentSpotRate,
      executionTiming?.value,
      nextLocation,
      router,
      transactionPayment?.id,
      transactionRequestData?.delivery_date,
      getExecutableDateFromValueDate,
      transactionRequestData.fees,
      transactionRequestData.lock_side,
      transactionRequestData?.paymentDetails?.beneficiary_id,
      transactionRequestData.payment_amount,
      transactionRequestData.payment_currency,
      transactionRequestData.payment_reference,
      transactionRequestData.purpose_of_payment,
      transactionRequestData?.settlementDetails?.account_id,
      transactionRequestData.settlement_amount,
      transactionRequestData.settlement_currency,
      transactionRequestData.frequency,
      transactionRequestData?.periodicity,
      transactionRequestData?.periodicity_start_date,
      transactionRequestData?.periodicity_end_date,
      transactionRequestData.installments,
    ],
  );

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const successRegex = /^\/transactions\/payments\/success(ndf)?$/;
      const errorRegex = /^\/transactions\/payments\/error$/;
      if (
        !isModalOpen &&
        !successRegex.test(url) &&
        !errorRegex.test(url) &&
        paymentDetailsIsValid
      ) {
        setIsModalOpen(true);
        setNextLocation(url);

        // Cancel the route change
        router.events.emit('routeChangeError');
        // Throw an error to cancel the route change
        throw 'Route change cancelled by user';
      }
    };

    // Prevent navigation when the modal is open
    router.beforePopState(() => {
      if (isModalOpen) {
        // Cancel the route change
        return false;
      }
      return true;
    });

    // Listen for route changes
    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, paymentDetailsIsValid, router]);

  if (!isLoggedIn) {
    return (
      <Stack height='50vh'>
        <RedirectSpinner />
      </Stack>
    );
  }
  return (
    <StepperShell
      title={title}
      titleDescription={titleDescription}
      continueButtonText={continueText}
      continueButtonEnabled={isContinueButtonEnabled}
      onClickContinueButton={handleContinueClick}
      onClickBackButton={handleBackClick}
      sx={{
        width:
          transactionRequestData.frequency !== 'onetime' && activeStep === '1'
            ? 'auto'
            : '100%',
        maxWidth:
          transactionRequestData.frequency !== 'onetime' && activeStep === '1'
            ? '70.35rem'
            : '35.35rem',
        margin: '4rem auto 0 auto',
      }}
      continueButtonProps={continueButtonProps}
      secondaryComponents={SecondaryComponents}
      data-testid={testId}
      justifyFooterContent='flex-end'
      leftContent={leftContent}
      rightContent={rightContent}
    >
      <Suspense
        fallback={
          <Stack sx={{ minHeight: '403px' }}>
            <PangeaLoading centerPhrase loadingPhrase='Initializing ...' />
          </Stack>
        }
      >
        {stepperContent}
      </Suspense>

      <ConfirmCancelDialog
        title='UNSAVED CHANGES'
        open={isModalOpen}
        description='You are about to leave, and any unsaved changes will be lost. Would you like to save this as a draft transaction?'
        confirmButtonColorOverride={PangeaColors.CautionYellowMedium}
        onClick={() => handleModalChoice('save')}
        onCancel={() => handleModalChoice('delete')}
        onClose={() => setIsModalOpen(false)}
        cancelButtonText='Delete Draft'
        cancelButtonProps={{ endIcon: null, color: 'warning' }}
        confirmButtonText='Save & Exit'
        preventBackdropClose
      />
    </StepperShell>
  );
};

export default PaymentStepper;
