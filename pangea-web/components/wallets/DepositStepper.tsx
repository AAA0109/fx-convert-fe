import {
  bookInstructDealOrderNumberState,
  bookInstructDealRequestDataState,
  clientApiState,
  depositReviewValidState,
  executionTimingtData,
  pangeaAlertNotificationMessageState,
  selectedWaitConditionState,
  spotRateExpiredState,
} from 'atoms';
import {
  PangeaButtonProps,
  RateExpiryChecker,
  StepperShell,
} from 'components/shared';
import { useFeatureFlags, useLoading, useWalletAndPaymentHelpers } from 'hooks';
import { isError } from 'lodash';
import router from 'next/router';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import DepositDetails from './DepositDetails';
import DepositReview from './DepositReview';

import { PangeaCorpayLockSideEnum } from 'lib';
import ExecutionDetails from './ExecutionDetails';

type DepositStepperProps = {
  activeStep: string;
  onChangeStep: Dispatch<SetStateAction<number>>;
};
export const DepositStepper = ({
  activeStep,
  onChangeStep,
}: DepositStepperProps): JSX.Element => {
  const authHelper = useRecoilValue(clientApiState);
  const apiHelper = authHelper.getAuthenticatedApiHelper();
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldEnableStrategicExecution = isFeatureEnabled(
    'strategic-execution',
  );
  const {
    loadingPromise: depositProcessingPromise,
    loadingState: depositProcessingLoadingState,
  } = useLoading();

  const {
    corPayQuotePaymentResponse: spotRateData,
    paymentDetails,
    amountsErrorState,
    isLoadingFxRate,
  } = useWalletAndPaymentHelpers();

  const isDepositReviewValid = useRecoilValue(depositReviewValidState);
  const setDepositRequestPayload = useSetRecoilState(
    bookInstructDealRequestDataState,
  );
  const executionTiming = useRecoilValue(executionTimingtData);

  const setSelectedWaitCondition = useSetRecoilState(
    selectedWaitConditionState,
  );
  const isSpotRateExpired = useRecoilValue(spotRateExpiredState);
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const setOperationOrderNumber = useSetRecoilState(
    bookInstructDealOrderNumberState,
  );
  const {
    loadingPromise: waitConditionPromise,
    loadingState: waitConditionLoadingState,
  } = useLoading();

  const [title, titleDescription, continueText, stepperContent, testId] =
    useMemo(() => {
      switch (activeStep) {
        case 'deposit-funds-0':
          return [
            "Let's fill in the deposit details.",
            'You can only initiate external deposits from accounts authorized in Corpay and in the currencies your bank accounts operate in.',
            'Next',
            <DepositDetails key='deposit-details' />,
            'depositFundsForm',
          ];
        case 'deposit-funds-1':
          return [
            shouldEnableStrategicExecution
              ? 'Execution Timing'
              : 'Review and confirm this payment.',
            '',
            shouldEnableStrategicExecution ? 'Next' : 'Confirm Payment',
            shouldEnableStrategicExecution ? (
              <ExecutionDetails mode='deposit' key='deposit-execution' />
            ) : (
              <DepositReview key='deposit-review' />
            ),
            shouldEnableStrategicExecution
              ? 'depositExecution'
              : 'depositFundsReview',
          ];
        default:
          return [
            'Review and confirm this payment.',
            '',
            'Confirm Payment',
            <DepositReview key='deposit-review' />,
            'depositFundsReview',
          ];
      }
    }, [activeStep, shouldEnableStrategicExecution]);
  const isContinueButtonEnabled = useMemo(() => {
    switch (activeStep) {
      case 'deposit-funds-0':
        return (
          !amountsErrorState.isAmountError &&
          paymentDetails.payment_reference !== '' &&
          !isLoadingFxRate
        );
      case 'deposit-funds-1':
        return Boolean(executionTiming?.id);
      default:
        return isDepositReviewValid && !isLoadingFxRate && !isSpotRateExpired;
    }
  }, [
    activeStep,
    amountsErrorState.isAmountError,
    paymentDetails.payment_reference,
    isLoadingFxRate,
    executionTiming,
    isDepositReviewValid,
    isSpotRateExpired,
  ]);
  const SecondaryComponents: ReactNode = useMemo(() => {
    switch (activeStep) {
      case 'deposit-funds-2':
        return executionTiming?.id === 'now' ? <RateExpiryChecker /> : null;
      default:
        return null;
    }
  }, [activeStep, executionTiming?.id]);
  const continueButtonProps: PangeaButtonProps = useMemo(() => {
    switch (activeStep) {
      case 'deposit-funds-1':
        return {
          color: 'secondary',
          loading:
            depositProcessingLoadingState.isLoading ||
            waitConditionLoadingState.isLoading,
        };
      case 'deposit-funds-2':
        return {
          sx: { display: executionTiming?.id === 'now' ? 'none' : 'inherit' },
          color: 'secondary',
          loading:
            depositProcessingLoadingState.isLoading ||
            waitConditionLoadingState.isLoading,
        };
      default:
        return {};
    }
  }, [
    activeStep,
    depositProcessingLoadingState.isLoading,
    executionTiming?.id,
    waitConditionLoadingState.isLoading,
  ]);

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
            router.push('/wallets/deposit-funds/success');
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
    await depositProcessingPromise(submitPaymentOrder());
  }, [
    setPangeaAlertNotificationMessage,
    depositProcessingPromise,
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
      case 'deposit-funds-0':
        return function () {
          onChangeStep(1);
        };
      case 'deposit-funds-1':
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
      case 'deposit-funds-1':
        return function () {
          onChangeStep(0);
        };
      case 'deposit-funds-2':
        return function () {
          onChangeStep(1);
        };
      default:
        return function () {
          router.push('/dashboard/wallets');
        };
    }
  }, [activeStep, onChangeStep]);

  // TODO: Slowly deprecate use of bookInstructDealRequestDataState
  useEffect(() => {
    if (activeStep === 'deposit-funds-2' && executionTiming?.id !== 'now') {
      setDepositRequestPayload((payload) => {
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
    setDepositRequestPayload,
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
      {stepperContent}
    </StepperShell>
  );
};

export default DepositStepper;
