import { Stack } from '@mui/material';
import {
  beneficiaryReviewValidState,
  bookInstructDealOrderNumberState,
  bookInstructDealRequestDataState,
  clientApiState,
  executionTimingtData,
  pangeaAlertNotificationMessageState,
  selectedWaitConditionState,
  spotRateExpiredState,
} from 'atoms';
import {
  PangeaButtonProps,
  PangeaLoading,
  RateExpiryChecker,
  StepperShell,
} from 'components/shared';
import { useFeatureFlags, useLoading, useWalletAndPaymentHelpers } from 'hooks';
import { PangeaCorpayLockSideEnum } from 'lib';
import { isError } from 'lodash';
import router from 'next/router';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import BeneficiaryDetails from './BeneficiaryDetails';
import BeneficiaryReview from './BeneficiaryReview';
import ExecutionDetails from './ExecutionDetails';

type BeneficiaryStepperProps = {
  activeStep: string;
  onChangeStep: Dispatch<SetStateAction<number>>;
};
export const BeneficiaryStepper = ({
  activeStep,
  onChangeStep,
}: BeneficiaryStepperProps): JSX.Element => {
  const authHelper = useRecoilValue(clientApiState);
  const apiHelper = authHelper.getAuthenticatedApiHelper();
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldEnableStrategicExecution = isFeatureEnabled(
    'strategic-execution',
  );
  const setPaymentRequestPayload = useSetRecoilState(
    bookInstructDealRequestDataState,
  );

  const setSelectedWaitCondition = useSetRecoilState(
    selectedWaitConditionState,
  );

  const executionTiming = useRecoilValue(executionTimingtData);
  const {
    corPayQuotePaymentResponse: spotRateData,
    amountsErrorState,
    isLoadingFxRate,
  } = useWalletAndPaymentHelpers();

  const isPaymentReviewValid = useRecoilValue(beneficiaryReviewValidState);
  const isSpotRateExpired = useRecoilValue(spotRateExpiredState);
  const setOperationOrderNumber = useSetRecoilState(
    bookInstructDealOrderNumberState,
  );
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );

  const {
    loadingPromise: paymentProcessingPromise,
    loadingState: paymentProcessingLoadingState,
  } = useLoading();
  const {
    loadingPromise: waitConditionPromise,
    loadingState: waitConditionLoadingState,
  } = useLoading();
  const [title, titleDescription, continueText, stepperContent, testId] =
    useMemo(() => {
      switch (activeStep) {
        case 'send-payments-0':
          return [
            "Let's fill in the payment details.",
            'You must pay beneficiaries from the wallet they receive funds in.',
            'Next',
            <BeneficiaryDetails key='beneficiary-details' />,
            'beneficiaryDetailsForm',
          ];
        case 'send-payments-1':
          return [
            shouldEnableStrategicExecution ? 'Execution Timing' : '',
            '',
            shouldEnableStrategicExecution ? 'Next' : 'Confirm',
            shouldEnableStrategicExecution ? (
              <ExecutionDetails mode='payment' key='beneficiary-execution' />
            ) : (
              <BeneficiaryReview key='beneficiary-review' />
            ),
            shouldEnableStrategicExecution
              ? 'beneficiaryExecution'
              : 'beneficiaryReviewForm',
          ];
        default:
          return [
            'Review and confirm this payment.',
            '',
            'Confirm',
            <BeneficiaryReview key='beneficiary-review' />,
            'beneficiaryReviewForm',
          ];
      }
    }, [activeStep, shouldEnableStrategicExecution]);
  const isContinueButtonEnabled = useMemo(() => {
    switch (activeStep) {
      case 'send-payments-0':
        return !amountsErrorState.isAmountError && !isLoadingFxRate;
      case 'send-payments-1':
        return Boolean(executionTiming?.id) && !amountsErrorState.isAmountError;
      default:
        return isPaymentReviewValid && !isLoadingFxRate && !isSpotRateExpired;
    }
  }, [
    activeStep,
    amountsErrorState.isAmountError,
    isLoadingFxRate,
    executionTiming,
    isPaymentReviewValid,
    isSpotRateExpired,
  ]);

  const continueButtonProps: PangeaButtonProps = useMemo(() => {
    switch (activeStep) {
      case 'send-payments-1':
        return {
          color: 'secondary',
          loading:
            paymentProcessingLoadingState.isLoading ||
            isLoadingFxRate ||
            waitConditionLoadingState.isLoading,
        };
      case 'send-payments-2':
        return {
          sx: { display: executionTiming?.id === 'now' ? 'none' : 'inherit' },
          color: 'secondary',
          loading: paymentProcessingLoadingState.isLoading,
        };
      default:
        return {};
    }
  }, [
    activeStep,
    executionTiming?.id,
    isLoadingFxRate,
    paymentProcessingLoadingState.isLoading,
    waitConditionLoadingState.isLoading,
  ]);

  const SecondaryComponents: ReactNode = useMemo(() => {
    switch (activeStep) {
      case 'send-payments-2':
        return executionTiming?.id === 'now' ? <RateExpiryChecker /> : null;
      default:
        return null;
    }
  }, [activeStep, executionTiming?.id]);

  const handleOnSubmit = useCallback(async () => {
    // clear any existing alert messages
    setPangeaAlertNotificationMessage(null);
    const submitPaymentOrder = async () => {
      try {
        if (spotRateData !== null && executionTiming !== null) {
          const bookPaymentResponse = await apiHelper.bookCorpayPaymentAsync({
            quote_id: spotRateData.quote.quote_id,
            session_id: spotRateData.quote.session_id,
            combine_settlements: true,
          });
          if (bookPaymentResponse && !isError(bookPaymentResponse)) {
            setOperationOrderNumber(String(bookPaymentResponse.order_number));
            router.push('/wallets/send-payments/success');
          } else {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'There was an error booking corpay payment.',
            });
          }
        } else {
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'There was an error booking order quote.',
          });
        }
      } catch {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error booking order quote.',
        });
      }
    };
    await paymentProcessingPromise(submitPaymentOrder());
  }, [
    setPangeaAlertNotificationMessage,
    paymentProcessingPromise,
    spotRateData,
    executionTiming,
    apiHelper,
    setOperationOrderNumber,
  ]);

  const handleCreateWaitCondition = useCallback(async () => {
    setPangeaAlertNotificationMessage(null);
    const submitCreateWaitCondition = async () => {
      if (executionTiming !== null) {
        try {
          if (
            spotRateData?.payment.currency !== spotRateData?.settlement.currency
          ) {
            const createWaitConditionResponse =
              await apiHelper.oemsWaitConditionCreateAsync({
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ...executionTiming.wait_condition!,
              });
            if (
              createWaitConditionResponse &&
              !isError(createWaitConditionResponse)
            ) {
              setSelectedWaitCondition(createWaitConditionResponse);
              onChangeStep(2);
            } else {
              setPangeaAlertNotificationMessage({
                severity: 'error',
                text: 'There was an error creating a wait condition.',
              });
            }
          } else {
            onChangeStep(2);
          }
        } catch {
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'There was an error creating a wait condition.',
          });
        }
      }
    };
    await waitConditionPromise(submitCreateWaitCondition());
  }, [
    setPangeaAlertNotificationMessage,
    waitConditionPromise,
    executionTiming,
    spotRateData?.payment.currency,
    spotRateData?.settlement.currency,
    apiHelper,
    setSelectedWaitCondition,
    onChangeStep,
  ]);

  const handleContinueClick = useMemo(() => {
    switch (activeStep) {
      case 'send-payments-0':
        return function () {
          onChangeStep(1);
        };
      case 'send-payments-1':
        return function () {
          handleCreateWaitCondition();
        };
      default:
        return function () {
          handleOnSubmit();
        };
    }
  }, [activeStep, handleCreateWaitCondition, handleOnSubmit, onChangeStep]);

  const handleBackClick = useMemo(() => {
    switch (activeStep) {
      case 'send-payments-1':
        return function () {
          onChangeStep(0);
        };
      case 'send-payments-2':
        return function () {
          onChangeStep(1);
        };
      default:
        return function () {
          router.push('/dashboard/wallets');
        };
    }
  }, [activeStep, onChangeStep]);

  useEffect(() => {
    if (activeStep === 'send-payments-2' && executionTiming?.id !== 'now') {
      setPaymentRequestPayload((payload) => {
        return {
          ...payload,
          book_request: {
            quote_id:
              spotRateData?.quote.quote_id ?? payload.book_request.quote_id,
          },
          instruct_request: {
            ...payload.instruct_request,
            orders: [
              {
                amount:
                  (spotRateData?.rate.lock_side ===
                  PangeaCorpayLockSideEnum.Payment
                    ? spotRateData?.settlement.amount
                    : spotRateData?.payment.amount) ?? 0,
              },
            ],
            payments: [
              {
                ...payload.instruct_request.payments[0],
                amount:
                  (spotRateData?.rate.lock_side ===
                  PangeaCorpayLockSideEnum.Payment
                    ? spotRateData?.settlement.amount
                    : spotRateData?.payment.amount) ?? 0,
              },
            ],
          },
        };
      });
    }
  }, [
    activeStep,
    executionTiming?.id,
    setPaymentRequestPayload,
    spotRateData?.payment.amount,
    spotRateData?.quote.quote_id,
    spotRateData?.rate.lock_side,
    spotRateData?.settlement.amount,
  ]);

  return (
    <StepperShell
      title={title}
      titleDescription={titleDescription}
      continueButtonText={continueText}
      continueButtonEnabled={isContinueButtonEnabled}
      onClickContinueButton={handleContinueClick}
      onClickBackButton={handleBackClick}
      sx={{
        width: '100%',
        maxWidth: '35.35rem',
        margin: '4rem auto 0 auto',
      }}
      continueButtonProps={continueButtonProps}
      secondaryComponents={SecondaryComponents}
      data-testid={testId}
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
    </StepperShell>
  );
};

export default BeneficiaryStepper;
