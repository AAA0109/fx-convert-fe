import { Stack } from '@mui/material';
import {
  bookInstructDealOrderNumberState,
  bookInstructDealRequestDataState,
  clientApiState,
  executionTimingtData,
  pangeaAlertNotificationMessageState,
  selectedWaitConditionState,
  spotRateExpiredState,
  withdrawalReviewValidState,
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
import ExecutionDetails from './ExecutionDetails';
import WithdrawDetails from './WithdrawDetails';
import WithdrawReview from './WithdrawReview';
type WithdrawStepperProps = {
  activeStep: string;
  onChangeStep: Dispatch<SetStateAction<number>>;
};
export const WithdrawStepper = ({
  activeStep,
  onChangeStep,
}: WithdrawStepperProps): JSX.Element => {
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldEnableStrategicExecution = isFeatureEnabled(
    'strategic-execution',
  );
  const executionTiming = useRecoilValue(executionTimingtData);

  const setSelectedWaitCondition = useSetRecoilState(
    selectedWaitConditionState,
  );
  const authHelper = useRecoilValue(clientApiState);
  const apiHelper = authHelper.getAuthenticatedApiHelper();
  const {
    loadingPromise: withdrawProcessingPromise,
    loadingState: withdrawProcessingLoadingState,
  } = useLoading();
  const {
    loadingPromise: waitConditionPromise,
    loadingState: waitConditionLoadingState,
  } = useLoading();

  const {
    corPayQuotePaymentResponse: spotRateData,
    isLoadingFxRate,
    amountsErrorState,
  } = useWalletAndPaymentHelpers();
  const isWithdrawReviewValid = useRecoilValue(withdrawalReviewValidState);
  const setWithdrawRequestPayload = useSetRecoilState(
    bookInstructDealRequestDataState,
  );

  const isSpotRateExpired = useRecoilValue(spotRateExpiredState);
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const setOperationOrderNumber = useSetRecoilState(
    bookInstructDealOrderNumberState,
  );
  const [title, titleDescription, continueText, stepperContent, testId] =
    useMemo(() => {
      switch (activeStep) {
        case 'withdraw-funds-0':
          return [
            "Let's fill out the withdrawal details.",
            'Withdraw money from your Pangea FX wallets to your linked bank accounts.',
            'Next',
            <WithdrawDetails key='withdrawal-details' />,
            'withdrawFundsForm',
          ];
        case 'withdraw-funds-1':
          return [
            shouldEnableStrategicExecution
              ? 'Execution Timing'
              : 'Review and confirm this withdrawal.',
            '',
            shouldEnableStrategicExecution ? 'Next' : 'Confirm Withdrawal',
            shouldEnableStrategicExecution ? (
              <ExecutionDetails mode='withdraw' key='withdraw-execution' />
            ) : (
              <WithdrawReview key='withdrawal-review' />
            ),
            shouldEnableStrategicExecution
              ? 'withdrawExecution'
              : 'withdrawFundsReview',
          ];
        default:
          return [
            'Review and confirm this withdrawal.',
            '',
            'Confirm Withdrawal',
            <WithdrawReview key='withdrawal-review' />,
            'withdrawFundsReview',
          ];
      }
    }, [activeStep, shouldEnableStrategicExecution]);
  const isContinueButtonEnabled = useMemo(() => {
    switch (activeStep) {
      case 'withdraw-funds-0':
        return !amountsErrorState.isAmountError && !isLoadingFxRate;
      case 'withdraw-funds-1':
        return Boolean(executionTiming?.id);
      default:
        return isWithdrawReviewValid && !isLoadingFxRate && !isSpotRateExpired;
    }
  }, [
    activeStep,
    amountsErrorState.isAmountError,
    isLoadingFxRate,
    executionTiming,
    isWithdrawReviewValid,
    isSpotRateExpired,
  ]);
  const SecondaryComponents: ReactNode = useMemo(() => {
    switch (activeStep) {
      case 'withdraw-funds-2':
        return executionTiming?.id === 'now' ? <RateExpiryChecker /> : null;
      default:
        return null;
    }
  }, [activeStep, executionTiming?.id]);

  const continueButtonProps: PangeaButtonProps = useMemo(() => {
    switch (activeStep) {
      case 'withdraw-funds-1':
        return {
          color: 'secondary',
          loading: isLoadingFxRate || waitConditionLoadingState.isLoading,
        };
      case 'withdraw-funds-2':
        return {
          sx: { display: executionTiming?.id === 'now' ? 'none' : 'inherit' },
          color: 'secondary',
          loading:
            isLoadingFxRate ||
            withdrawProcessingLoadingState.isLoading ||
            waitConditionLoadingState.isLoading,
        };
      default:
        return {};
    }
  }, [
    activeStep,
    executionTiming?.id,
    isLoadingFxRate,
    waitConditionLoadingState.isLoading,
    withdrawProcessingLoadingState.isLoading,
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
            router.push('/wallets/withdraw-funds/success');
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
    await withdrawProcessingPromise(submitPaymentOrder());
  }, [
    setPangeaAlertNotificationMessage,
    withdrawProcessingPromise,
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
      case 'withdraw-funds-0':
        return function () {
          onChangeStep(1);
        };
      case 'withdraw-funds-1':
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
      case 'withdraw-funds-1':
        return function () {
          onChangeStep(0);
        };
      case 'withdraw-funds-2':
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
    if (activeStep === 'withdraw-funds-2' && executionTiming?.id !== 'now') {
      setWithdrawRequestPayload((payload) => {
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
    setWithdrawRequestPayload,
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
      secondaryComponents={SecondaryComponents}
      sx={{
        width: '100%',
        maxWidth: '35.35rem',
        margin: '4rem auto 0 auto',
      }}
      continueButtonProps={continueButtonProps}
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

export default WithdrawStepper;
