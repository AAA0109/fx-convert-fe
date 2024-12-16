import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  beneficiaryValidationSchemaRequestDataState,
  bookInstructDealRequestDataState,
  bulkPaymentRfqState,
  createdBulkTransactionItemsState,
  paymentDetailsValidationState,
  paymentExecutionTimingtData,
  paymentRfqState,
  paymentSpotRateRequestDataState,
  paymentspotRateDataState,
  spotRateRequestDataState,
  transactionPaymentState,
  transactionRequestDataState,
  transactionToApproveState,
  valueDateTypeState,
} from 'atoms';
import {
  PangeaButton,
  PangeaPageTitle,
  TopLevelStepper,
} from 'components/shared';
import BulkStepper from 'components/transactions/BulkStepper';
import PaymentStepper from 'components/transactions/PaymentStepper';
import { useFeatureFlags, useRouterParts } from 'hooks';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useResetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';

type FinalPath = 'success' | 'error' | 'successndf' | 'success-authorization';
type OperationStatusProps = {
  title: string;
  body: string;
  status: FinalPath;
};

const OperationStatus = ({ title, body, status }: OperationStatusProps) => {
  const router = useRouter();
  const transactionId = useRecoilValue(transactionToApproveState);
  const resetTransactionPayment = useResetRecoilState(transactionPaymentState);
  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };
  const handleViewTransaction = () => {
    if (transactionId) router.push(`/payments/view?id=${transactionId}`);
  };
  const isApprovalTransaction = status === 'success-authorization';
  useEffect(() => {
    resetTransactionPayment();
  }, [resetTransactionPayment]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Stack spacing={4} alignItems={'center'} maxWidth={500}>
        {status === 'success' || status === 'successndf' ? (
          <CheckCircleOutline sx={{ fontSize: '120px' }} color='success' />
        ) : isApprovalTransaction ? (
          <PendingActionsIcon
            sx={{
              fontSize: '120px',
              border: `6.78px solid ${PangeaColors.SolidSlateMedium}`,
              borderRadius: '50%',
              boxSizing: 'border-box',
              padding: 2,
            }}
            color='primary'
          />
        ) : (
          <ErrorOutlineIcon sx={{ fontSize: '120px' }} color='error' />
        )}
        <PangeaPageTitle
          title={title}
          color={isApprovalTransaction ? PangeaColors.Black : 'inherit'}
          variant='h3'
        />
        <Typography variant='body1' fontSize={14}>
          {body}
        </Typography>
        {isApprovalTransaction ? (
          <Stack direction='row' columnGap={2}>
            <PangeaButton
              size={'large'}
              onClick={handleGoToDashboard}
              variant='outlined'
            >
              Back to Dashboard
            </PangeaButton>
            <PangeaButton size={'large'} onClick={handleViewTransaction}>
              View Transaction
            </PangeaButton>
          </Stack>
        ) : (
          <PangeaButton size={'large'} onClick={handleGoToDashboard}>
            Return to Dashboard
          </PangeaButton>
        )}
      </Stack>
    </Box>
  );
};
const TitleComponent = ({ activeStep }: { activeStep: number }) => {
  const { isFeatureEnabled } = useFeatureFlags();

  const shouldEnableStrategicExecution = isFeatureEnabled(
    'strategic-execution',
  );
  const [title, subTitle] = [
    'Book A Transaction',
    activeStep === 0
      ? 'Transaction Details'
      : activeStep === 1 && shouldEnableStrategicExecution
      ? 'Execution Timing'
      : 'Review & Confirm',
  ];
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
const BulkTitleComponent = ({ activeStep }: { activeStep: number }) => {
  const [title, subTitle] = [
    'Bulk Transactions',
    activeStep === 0 ? 'Bulk Upload' : 'Review & Confirm',
  ];
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

const Payments: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { routerParts } = useRouterParts();
  const [, subPath, finalPath] = routerParts;
  const resetValueDateType = useResetRecoilState(valueDateTypeState);
  const resetCreatedBulkTransactions = useResetRecoilState(
    createdBulkTransactionItemsState,
  );
  const resetBulkPaymentRfq = useResetRecoilState(bulkPaymentRfqState);
  const resetSpotRateRequestPayload = useResetRecoilState(
    spotRateRequestDataState,
  );
  const resetFxRequestPayload = useResetRecoilState(
    bookInstructDealRequestDataState,
  );
  const resetTransactionPaymentPayload = useResetRecoilState(
    transactionRequestDataState,
  );
  const resetPaymentspotRateData = useResetRecoilState(
    paymentspotRateDataState,
  );
  const resetPaymentSpotRateRequestDataState = useResetRecoilState(
    paymentSpotRateRequestDataState,
  );
  const resetPaymentExecutionTimingtData = useResetRecoilState(
    paymentExecutionTimingtData,
  );
  const resetValidationSchemaRequest = useResetRecoilState(
    beneficiaryValidationSchemaRequestDataState,
  );
  const resetPaymentDetailsValidation = useRecoilRefresher_UNSTABLE(
    paymentDetailsValidationState,
  );

  const resetPaymentRfq = useResetRecoilState(paymentRfqState);
  const resetTransactionPayment = useResetRecoilState(transactionPaymentState);
  const [successHeroTitle, successHeroText] = useMemo(() => {
    const fullPath = `${subPath}-${finalPath}`;
    switch (fullPath) {
      case 'payments-success':
        return [
          'Transactions Created',
          `You'll see these transactions in your dashboard.`,
        ];
      case 'payments-successndf':
        return [
          'Request for Quote initiated',
          "This is not a trade execution confirmation. A member of Pangea's Trade Desk will contact you shortly to finalize the transaction.",
        ];
      case 'payments-success-authorization':
        return [
          'Submitted for Authorization',
          'This transaction has been submitted for approval and is “Pending Authorization” in your dashboard. The approver you selected has been notified and this transaction must be approved to execute.',
        ];
      case 'payments-error':
        return [
          'Transactions Failed',
          'We were unable to initiate this transaction at the moment. Please try again or contact your advisor for help.',
        ];
      default:
        return ['', ''];
    }
  }, [finalPath, subPath]);
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
      <TitleComponent activeStep={activeStep} />
      <TopLevelStepper
        StepperLabels={['Create Transaction', 'Review & Confirm']}
        activeStep={activeStep}
      />
    </Stack>
  );

  const BulkTitleAndStepper = () => (
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
      <BulkTitleComponent activeStep={activeStep} />
      <TopLevelStepper
        StepperLabels={['Bulk Upload', 'Review & Confirm']}
        activeStep={activeStep}
      />
    </Stack>
  );

  useEffect(() => {
    resetSpotRateRequestPayload();
    resetFxRequestPayload();
    resetPaymentDetailsValidation();
    resetTransactionPaymentPayload();
    resetPaymentspotRateData();
    resetPaymentExecutionTimingtData();
    resetTransactionPayment();
    resetPaymentSpotRateRequestDataState();
    resetValueDateType();
    resetPaymentRfq();
    resetCreatedBulkTransactions();
    resetBulkPaymentRfq();
    resetValidationSchemaRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  switch (finalPath) {
    case 'success':
    case 'successndf':
    case 'error':
    case 'success-authorization':
      return (
        <OperationStatus
          title={successHeroTitle}
          body={successHeroText}
          status={finalPath as FinalPath}
        />
      );
    case 'bulk':
      return (
        <>
          <BulkTitleAndStepper />
          <Stack direction='column' spacing={8}>
            <BulkStepper
              activeStep={activeStep.toString()}
              onChangeStep={setActiveStep}
            />
          </Stack>
        </>
      );
    default:
      return (
        <>
          <TitleAndStepper />
          <Stack direction='column' spacing={8}>
            <PaymentStepper
              activeStep={activeStep.toString()}
              onChangeStep={setActiveStep}
            />
          </Stack>
        </>
      );
  }
};
export default Payments;
