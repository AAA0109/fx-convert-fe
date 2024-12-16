import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  bookInstructDealOrderNumberState,
  bookInstructDealRequestDataState,
  corPayQuotePaymentResponseState,
  executionTimingtData,
  paymentLockSideState,
  paymentPurposeRequestData,
  paymentReferenceRequestData,
  spotRateRequestDataState,
} from 'atoms';
import {
  PangeaButton,
  PangeaLoading,
  PangeaPageTitle,
  RedirectSpinner,
  TopLevelStepper,
} from 'components/shared';
import {
  BeneficiaryStepper,
  DepositStepper,
  TransferStepper,
  WithdrawStepper,
} from 'components/wallets';
import { useAuthHelper, useFeatureFlags, useRouterParts } from 'hooks';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';

type ContentStepperProps = {
  page: string;
  activeStep: number;
  onChangeStep: Dispatch<SetStateAction<number>>;
};
type TitleComponentProps = {
  subPath: string;
  activeStep: number;
};
type OperationStatusProps = {
  title: string;
  body: string;
  status: 'success' | 'error';
};

const ContentStepper = ({
  page,
  activeStep,
  onChangeStep,
}: ContentStepperProps) => {
  const stepToShow = `${page}-${activeStep}`;
  switch (stepToShow) {
    case 'fx-wallet-transfer-0':
    case 'fx-wallet-transfer-1':
    case 'fx-wallet-transfer-2':
      return (
        <TransferStepper activeStep={stepToShow} onChangeStep={onChangeStep} />
      );
    case 'send-payments-0':
    case 'send-payments-1':
    case 'send-payments-2':
      return (
        <BeneficiaryStepper
          activeStep={stepToShow}
          onChangeStep={onChangeStep}
        />
      );
    case 'deposit-funds-0':
    case 'deposit-funds-1':
    case 'deposit-funds-2':
      return (
        <DepositStepper activeStep={stepToShow} onChangeStep={onChangeStep} />
      );
    case 'withdraw-funds-0':
    case 'withdraw-funds-1':
    case 'withdraw-funds-2':
      return (
        <WithdrawStepper activeStep={stepToShow} onChangeStep={onChangeStep} />
      );
    default:
      return <PangeaLoading loadingPhrase='Loading ...' />;
  }
};

const TitleComponent = ({ subPath, activeStep }: TitleComponentProps) => {
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldEnableStrategicExecution = isFeatureEnabled(
    'strategic-execution',
  );
  const [title, subTitle] = useMemo(() => {
    switch (subPath) {
      case 'fx-wallet-transfer':
        return [
          'FX Wallet Transfer',
          activeStep === 0
            ? 'Transfer Details'
            : activeStep === 1 && shouldEnableStrategicExecution
            ? 'Execution Timing'
            : 'Review & Confirm',
        ];
      case 'send-payments':
        return [
          'Send a Payment',
          activeStep === 0
            ? 'Payment Details'
            : activeStep === 1 && shouldEnableStrategicExecution
            ? 'Execution Timing'
            : 'Review & Confirm',
        ];
      case 'deposit-funds':
        return [
          'Deposit Funds',
          activeStep === 0
            ? 'Deposit Details'
            : activeStep === 1 && shouldEnableStrategicExecution
            ? 'Execution Timing'
            : 'Review & Confirm',
        ];
      case 'withdraw-funds':
        return [
          'Withdraw Funds',
          activeStep === 0
            ? 'Withdraw Details'
            : activeStep === 1 && shouldEnableStrategicExecution
            ? 'Execution Timing'
            : 'Review & Confirm',
        ];
      default:
        return ['', ''];
    }
  }, [subPath, activeStep, shouldEnableStrategicExecution]);

  return (
    <Stack direction='column'>
      <PangeaPageTitle title={title} />
      <Typography
        component='h5'
        variant='h5'
        color={(theme) => theme.palette.text.secondary}
      >
        {subTitle}
      </Typography>
    </Stack>
  );
};

const OperationStatus = ({ title, body, status }: OperationStatusProps) => {
  const router = useRouter();
  const resetSpotRateRequestPayload = useResetRecoilState(
    spotRateRequestDataState,
  );
  const resetFxRequestPayload = useResetRecoilState(
    bookInstructDealRequestDataState,
  );
  const resetOrderNumber = useResetRecoilState(
    bookInstructDealOrderNumberState,
  );
  const resetReferencePayload = useResetRecoilState(
    paymentReferenceRequestData,
  );
  const resetCorpayQuotePaymentResponse = useResetRecoilState(
    corPayQuotePaymentResponseState,
  );
  const resetPaymentLockSide = useResetRecoilState(paymentLockSideState);
  const resetPurposePayload = useResetRecoilState(paymentPurposeRequestData);
  const resetExecutionTimingState = useResetRecoilState(executionTimingtData);
  const handleGoToDashboard = () => {
    resetOrderNumber();
    router.push('/dashboard/wallets');
  };
  useEffect(() => {
    resetSpotRateRequestPayload();
    resetFxRequestPayload();
    resetReferencePayload();
    resetPurposePayload();
    resetExecutionTimingState();
    resetCorpayQuotePaymentResponse();
    resetPaymentLockSide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Stack spacing={4} alignItems={'center'} maxWidth={500}>
        {status === 'success' ? (
          <CheckCircleOutline sx={{ fontSize: '120px' }} color={status} />
        ) : (
          <ErrorOutlineIcon sx={{ fontSize: '120px' }} color={status} />
        )}
        <PangeaPageTitle title={title} />
        <Typography variant='body1'>{body}</Typography>
        <PangeaButton size={'large'} onClick={handleGoToDashboard}>
          Return to Dashboard
        </PangeaButton>
      </Stack>
    </Box>
  );
};

const Wallets: NextPage = () => {
  const resetSpotRateRequestPayload = useResetRecoilState(
    spotRateRequestDataState,
  );
  const resetFxRequestPayload = useResetRecoilState(
    bookInstructDealRequestDataState,
  );
  const resetReferencePayload = useResetRecoilState(
    paymentReferenceRequestData,
  );
  const resetPurposePayload = useResetRecoilState(paymentPurposeRequestData);
  const resetCorpayQuotePaymentResponse = useResetRecoilState(
    corPayQuotePaymentResponseState,
  );
  const resetPaymentLockSide = useResetRecoilState(paymentLockSideState);
  const orderNumber = useRecoilValue(bookInstructDealOrderNumberState);
  const { isLoggedIn } = useAuthHelper();
  const { routerParts } = useRouterParts();
  const [activeStep, setActiveStep] = useState(0);
  const [, subPath, finalPath] = routerParts;
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldEnableStrategicExecution = isFeatureEnabled(
    'strategic-execution',
  );
  const stepperLabels = useMemo(() => {
    switch (subPath) {
      case 'fx-wallet-transfer':
        return ['Transfer Details', 'Execution Timing', 'Review & Confirm'];
      case 'send-payments':
        return ['Payment Details', 'Execution Timing', 'Review & Confirm'];
      case 'deposit-funds':
        return ['Deposit Details', 'Execution Timing', 'Review & Confirm'];
      case 'withdraw-funds':
        return ['Withdraw Details', 'Execution Timing', 'Review & Confirm'];
      default:
        return ['', ''];
    }
  }, [subPath]);

  const [successHeroTitle, successHeroText] = useMemo(() => {
    const fullPath = `${subPath}-${finalPath}`;
    switch (fullPath) {
      case 'fx-wallet-transfer-success':
      case 'send-payments-success':
      case 'deposit-funds-success':
      case 'withdraw-funds-success':
        return [
          'Transfer Initiated',
          `You'll see this payment reflected in your balances as soon as they are completed. Your order number is ${orderNumber}.`,
        ];
      case 'fx-wallet-transfer-error':
      case 'send-payments-error':
      case 'deposit-funds-error':
        return [
          'Transfer not Initiated',
          'We were unable to initiate this transfer at this moment. Please try again or contact your advisor for help.',
        ];
      case 'withdraw-funds-error':
        return [
          'Transfer not Initiated',
          'We were unable to initiate this withrawal at this moment. Please try again or contact your advisor for help.',
        ];
      default:
        return ['', ''];
    }
  }, [finalPath, orderNumber, subPath]);

  const TitleAndStepper = () => (
    <Stack
      direction='row'
      justifyContent={'space-between'}
      divider={
        <Divider
          orientation='vertical'
          sx={{ borderColor: PangeaColors.Gray }}
          flexItem
        />
      }
    >
      <TitleComponent subPath={subPath} activeStep={activeStep} />
      <TopLevelStepper
        StepperLabels={
          shouldEnableStrategicExecution
            ? stepperLabels
            : stepperLabels.filter((label) => label !== 'Execution Timing')
        }
        activeStep={activeStep}
      />
    </Stack>
  );

  useEffect(() => {
    resetSpotRateRequestPayload();
    resetFxRequestPayload();
    resetReferencePayload();
    resetPurposePayload();
    resetCorpayQuotePaymentResponse();
    resetPaymentLockSide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoggedIn) {
    return <RedirectSpinner />;
  }

  switch (finalPath) {
    case 'success':
    case 'error':
      return (
        <OperationStatus
          title={successHeroTitle}
          body={successHeroText}
          status={finalPath as 'success' | 'error'}
        />
      );
    default:
      return (
        <>
          <TitleAndStepper />
          <Stack direction='column' spacing={8}>
            <ContentStepper
              page={subPath}
              activeStep={activeStep}
              onChangeStep={setActiveStep}
            />
          </Stack>
        </>
      );
  }
};

export default Wallets;
