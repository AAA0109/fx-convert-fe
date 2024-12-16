import { Stack } from '@mui/material';
import {
  bookInstructDealOrderNumberState,
  bookInstructDealRequestDataState,
  clientApiState,
  executionTimingtData,
  fxTransferDetailsValidState,
  fxTransferReviewValidState,
  pangeaAlertNotificationMessageState,
  selectedWaitConditionState,
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
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import ExecutionDetails from './ExecutionDetails';
import TransferDetails from './TransferDetails';
import TransferReview from './TransferReview';

type TransferStepperProps = {
  activeStep: string;
  onChangeStep: Dispatch<SetStateAction<number>>;
};

export const TransferStepper = ({
  activeStep,
  onChangeStep,
}: TransferStepperProps): JSX.Element => {
  const authHelper = useRecoilValue(clientApiState);
  const apiHelper = authHelper.getAuthenticatedApiHelper();
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldEnableStrategicExecution = isFeatureEnabled(
    'strategic-execution',
  );
  const {
    corPayQuotePaymentResponse: spotRateData,
    isLoadingFxRate,
    amountsErrorState,
  } = useWalletAndPaymentHelpers();
  const setBookInstructDealRequestData = useSetRecoilState(
    bookInstructDealRequestDataState,
  );
  const transferDetailsValidLoadable = useRecoilValueLoadable(
    fxTransferDetailsValidState,
  );
  const executionTiming = useRecoilValue(executionTimingtData);

  const isLoadingValidState = transferDetailsValidLoadable.state === 'loading';
  const isTransferReviewValid = useRecoilValue(fxTransferReviewValidState);
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const setOperationOrderNumber = useSetRecoilState(
    bookInstructDealOrderNumberState,
  );
  const setSelectedWaitCondition = useSetRecoilState(
    selectedWaitConditionState,
  );
  const {
    loadingPromise: submitPaymentOrderPromise,
    loadingState: fxTransferSubmissionLoadingState,
  } = useLoading();
  const {
    loadingPromise: waitConditionPromise,
    loadingState: waitConditionLoadingState,
  } = useLoading();

  const [title, titleDescription, continueText, stepperContent, testId] =
    useMemo(() => {
      switch (activeStep) {
        case 'fx-wallet-transfer-0':
          return [
            "Let's fill in the transfer details.",
            '',
            'Next',
            <TransferDetails key='transfer-details' />,
            'fxTransferForm',
          ];
        case 'fx-wallet-transfer-1':
          return [
            shouldEnableStrategicExecution
              ? 'Execution Timing'
              : 'Review and confirm this transfer.',
            '',
            shouldEnableStrategicExecution ? 'Next' : 'Confirm',
            shouldEnableStrategicExecution ? (
              <ExecutionDetails mode='transfer' key='transfer-execution' />
            ) : (
              <TransferReview key='transfer-review' />
            ),
            shouldEnableStrategicExecution
              ? 'transferExecution'
              : 'fxTransferSummary',
          ];
        default:
          return [
            'Review and confirm this transfer.',
            '',
            'Confirm',
            <TransferReview key='transfer-review' />,
            'fxTransferSummary',
          ];
      }
    }, [activeStep, shouldEnableStrategicExecution]);

  const isContinueButtonEnabled = useMemo(() => {
    switch (activeStep) {
      case 'fx-wallet-transfer-0':
        return !amountsErrorState.isAmountError && !isLoadingFxRate;
      case 'fx-wallet-transfer-1':
        return Boolean(executionTiming?.id) && !amountsErrorState.isAmountError;
      default:
        return isTransferReviewValid;
    }
  }, [
    activeStep,
    amountsErrorState.isAmountError,
    isLoadingFxRate,
    executionTiming?.id,
    isTransferReviewValid,
  ]);
  const continueButtonProps: PangeaButtonProps = useMemo(() => {
    switch (activeStep) {
      case 'fx-wallet-transfer-1':
        return {
          color: 'secondary',
          loading:
            fxTransferSubmissionLoadingState.isLoading ||
            isLoadingValidState ||
            waitConditionLoadingState.isLoading,
        };
      case 'fx-wallet-transfer-2':
        return {
          sx: { display: executionTiming?.id === 'now' ? 'none' : 'inherit' },
          color: 'secondary',
          loading:
            fxTransferSubmissionLoadingState.isLoading || isLoadingValidState,
        };
      default:
        return {};
    }
  }, [
    activeStep,
    executionTiming?.id,
    fxTransferSubmissionLoadingState.isLoading,
    isLoadingValidState,
    waitConditionLoadingState.isLoading,
  ]);
  const SecondaryComponents: ReactNode = useMemo(() => {
    switch (activeStep) {
      case 'fx-wallet-transfer-2':
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
            router.push('/wallets/fx-wallet-transfer/success');
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
    await submitPaymentOrderPromise(submitPaymentOrder());
  }, [
    apiHelper,
    spotRateData,
    executionTiming,
    setOperationOrderNumber,
    setPangeaAlertNotificationMessage,
    submitPaymentOrderPromise,
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
      case 'fx-wallet-transfer-0':
        return function () {
          onChangeStep(1);
        };
      case 'fx-wallet-transfer-1':
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
      case 'fx-wallet-transfer-1':
        return function () {
          onChangeStep(0);
        };
      case 'fx-wallet-transfer-2':
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
    if (
      activeStep === 'fx-wallet-transfer-2' &&
      executionTiming?.id !== 'now'
    ) {
      setBookInstructDealRequestData((payload) => {
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
    setBookInstructDealRequestData,
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
      continueButtonEnabled={Boolean(isContinueButtonEnabled)}
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

export default TransferStepper;
