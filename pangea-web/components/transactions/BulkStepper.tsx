import InfoIcon from '@mui/icons-material/Info';
import { List, ListItem, Stack, Typography } from '@mui/material';
import {
  allBulkTransactionItemsState,
  bulkUploadTransactionItemsState,
  clientApiState,
  createdBulkTransactionItemsState,
  ExtendedPangeaBulkPaymentResponse,
  pangeaAlertNotificationMessageState,
} from 'atoms';
import { PangeaSimpleDialog } from 'components/modals';
import {
  BulkPaymentRateExpiryChecker,
  PangeaButton,
  PangeaButtonProps,
  PangeaLoading,
  RedirectSpinner,
  StepperShell,
} from 'components/shared';
import { format } from 'date-fns';
import {
  useAuthHelper,
  useBulkSummaryHelper,
  useCsvTemplate,
  useLoading,
} from 'hooks';
import {
  PangeaExecutionTimingEnum,
  PangeaSimplePayment,
  PangeaSimpleUpdatePayment,
} from 'lib';
import { isError } from 'lodash';
import { useRouter } from 'next/router';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { v4 as uuid } from 'uuid';
import PaymentBulkReview from './PaymentBulkReview';
import PaymentBulkUpload from './PaymentBulkUpload';

type BulkStepperProps = {
  activeStep: string;
  onChangeStep: Dispatch<SetStateAction<number>>;
};
type ValidationError = {
  non_field_errors: {
    field: string;
    detail: string;
  }[];
};

type ErrorResponse = {
  response: {
    data: {
      validation_errors: ValidationError[];
      traceback: string;
    };
  };
};

export const BulkStepper = ({
  activeStep,
  onChangeStep,
}: BulkStepperProps): JSX.Element => {
  const authHelper = useRecoilValue(clientApiState);
  const { loadingPromise, loadingState } = useLoading();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [bulkUploadRows, setBulkUploadRows] = useRecoilState(
    bulkUploadTransactionItemsState,
  );
  const [allBulkPayments, setAllBulkPayments] = useRecoilState(
    allBulkTransactionItemsState,
  );
  const [createdBulkTransactions, setCreatedBulkTransactions] = useRecoilState(
    createdBulkTransactionItemsState,
  );
  const resetAllBulkPayments = useResetRecoilState(
    allBulkTransactionItemsState,
  );
  const resetCreatedBulkTransactions = useResetRecoilState(
    createdBulkTransactionItemsState,
  );
  const resetBulkUploadTransactionItemsState = useResetRecoilState(
    bulkUploadTransactionItemsState,
  );
  const router = useRouter();
  const { transactionsCount, needsReviewCount } = useBulkSummaryHelper();
  const apiHelper = authHelper.getAuthenticatedApiHelper();

  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const toggleModal = useCallback(() => {
    setOpenModal(!openModal);
  }, [openModal]);
  const hasSpotPayments = allBulkPayments.payments.some(
    (p) =>
      p.execution_timing &&
      [
        PangeaExecutionTimingEnum.ImmediateNdf,
        PangeaExecutionTimingEnum.ImmediateForward,
        PangeaExecutionTimingEnum.ImmediateSpot,
      ].includes(p.execution_timing),
  );
  const isStepOneValid = transactionsCount > 0 && needsReviewCount === 0;
  const [title, titleDescription, continueText, stepperContent, testId] =
    useMemo(() => {
      switch (activeStep) {
        case '0':
          return [
            'Bulk Upload',
            'Upload multiple transactions via CSV or manual entry in the table below. All payments will be spot transactions.',
            'Continue',
            <PaymentBulkUpload key='bulk-details' />,
            'bulkUploadForm',
          ];
        default:
          return [
            'Review & Confirm',
            'Bulk Upload',
            'Confirm & Finish',
            <PaymentBulkReview key='bulk-review' />,
            'bulkReviewForm',
          ];
      }
    }, [activeStep]);

  const { downloadFile } = useCsvTemplate();

  const headerInfoComponents = useMemo(() => {
    switch (activeStep) {
      case '0':
        return (
          <Stack justifyContent='center'>
            <PangeaButton variant='text' color='info' onClick={toggleModal}>
              <InfoIcon sx={{ mr: 2 }} />
              Download the Bulk Upload Template
            </PangeaButton>
          </Stack>
        );

      default:
        return null;
    }
  }, [activeStep, toggleModal]);

  const isContinueButtonEnabled = useMemo(() => {
    switch (activeStep) {
      case '0':
        return isStepOneValid;
      default:
        return true;
    }
  }, [activeStep, isStepOneValid]);

  const continueButtonProps: PangeaButtonProps = useMemo(() => {
    switch (activeStep) {
      case '1':
        return {
          sx: { ml: 4, display: hasSpotPayments ? 'none' : 'inherit' },
          color: 'secondary',
          loading: loadingState.isLoading,
        };
      default:
        return {
          sx: { ml: 4 },
          loading: loadingState.isLoading,
        };
    }
  }, [activeStep, hasSpotPayments, loadingState.isLoading]);

  const SecondaryComponents: ReactNode = useMemo(() => {
    switch (activeStep) {
      case '1':
        return hasSpotPayments ? <BulkPaymentRateExpiryChecker /> : null;
      default:
        return null;
    }
  }, [activeStep, hasSpotPayments]);

  const handleOnSubmit = useCallback(async () => {
    // clear any existing alert messages
    setPangeaAlertNotificationMessage(null);
    const submitBulkPaymentOrder = async () => {
      try {
        const executeBulkPaymentResponse =
          await apiHelper.executeBulkPaymentsAsync({
            payment_ids: allBulkPayments.payments.map((p) => p.id) as number[],
          });
        if (
          executeBulkPaymentResponse &&
          !isError(executeBulkPaymentResponse)
        ) {
          resetAllBulkPayments();
          resetBulkUploadTransactionItemsState();
          resetCreatedBulkTransactions();
          router.push(`/transactions/payments/success`);
        } else {
          resetAllBulkPayments();
          resetBulkUploadTransactionItemsState();
          resetCreatedBulkTransactions();
          router.push(`/transactions/payments/error`);
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'There was an error executing payment.',
          });
        }
      } catch {
        resetAllBulkPayments();
        resetBulkUploadTransactionItemsState();
        resetCreatedBulkTransactions();
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error executing the payment',
        });
      }
    };
    await loadingPromise(submitBulkPaymentOrder());
  }, [
    setPangeaAlertNotificationMessage,
    loadingPromise,
    apiHelper,
    allBulkPayments.payments,
    resetAllBulkPayments,
    resetBulkUploadTransactionItemsState,
    resetCreatedBulkTransactions,
    router,
  ]);

  const handleCreateBulkTransaction = useCallback(() => {
    async function handleContinueClick() {
      const allBulkTransactions: PangeaSimplePayment[] = bulkUploadRows.map(
        (r) => {
          const payment: PangeaSimplePayment = {
            amount: r.amount ?? 0,
            buy_currency: r.buy_currency ?? '',
            destination: r.destination_account_id ?? '',
            lock_side: r.lock_side ?? '',
            description: r.name,
            origin: r.origin_account_id ?? '',
            purpose_of_payment: r.purpose_of_payment as string,
            sell_currency: r.sell_currency ?? '',
            value_date: format(new Date(r.delivery_date ?? ''), 'yyyy-MM-dd'),
          };
          return payment;
        },
      );
      // Do an update if bulk payments already exist
      if (
        createdBulkTransactions.payments.length > 0 &&
        createdBulkTransactions.payment_group
      ) {
        const allUpdateBulkTransactions = bulkUploadRows.map((t) => {
          const payment: PangeaSimpleUpdatePayment = {
            amount: t.amount ?? 0,
            buy_currency: t.buy_currency ?? '',
            destination: t.destination_account_id ?? '',
            lock_side: t.lock_side ?? '',
            description: t.name,
            origin: t.origin_account_id ?? '',
            purpose_of_payment: t.purpose_of_payment as string,
            sell_currency: t.sell_currency ?? '',
            value_date: format(new Date(t.delivery_date ?? ''), 'yyyy-MM-dd'),
            payment_id: t.payment_id,
          };
          return payment;
        });
        const addedBulkPayments = bulkUploadRows.filter(
          (t) => !t.payment_id,
        ) as PangeaSimplePayment[];

        const deletedBulkPayments = createdBulkTransactions.payments
          .filter((t) => !bulkUploadRows.find((r) => r.payment_id === t.id))
          .map((t) => t.id)
          .filter((i) => i !== undefined) as unknown[] as string[];

        const response = await apiHelper.updateBulkPaymentsAsync({
          payment_group: createdBulkTransactions.payment_group,
          added_payments: addedBulkPayments,
          deleted_payments: deletedBulkPayments,
          updated_payments: allUpdateBulkTransactions,
        });
        if (!isError(response)) {
          setAllBulkPayments(
            response as unknown as ExtendedPangeaBulkPaymentResponse,
          );
          setCreatedBulkTransactions({
            ...response,
            payment_group: createdBulkTransactions.payment_group,
          } as unknown as ExtendedPangeaBulkPaymentResponse);
          setBulkUploadRows(response.payments);
          onChangeStep(1);
        } else {
          setPangeaAlertNotificationMessage({
            text: 'Error updating bulk transaction',
            severity: 'error',
          });
        }
      } else {
        const response = await apiHelper.createBulkPaymentsAsync({
          payments: allBulkTransactions,
        });
        if (!isError(response)) {
          setAllBulkPayments(
            response as unknown as ExtendedPangeaBulkPaymentResponse,
          );
          setCreatedBulkTransactions({
            ...response,
            payment_group: uuid(),
          } as unknown as ExtendedPangeaBulkPaymentResponse);
          setBulkUploadRows(response.payments);
          onChangeStep(1);
        } else {
          const detailMessage = extractErrorMessage(
            response as unknown as ErrorResponse,
          );
          setPangeaAlertNotificationMessage({
            text: `Error creating bulk transaction: ${detailMessage}`,
            severity: 'error',
          });
        }
      }
    }
    // clear any existing alert messages
    setPangeaAlertNotificationMessage(null);
    loadingPromise(handleContinueClick());
  }, [
    apiHelper,
    bulkUploadRows,
    createdBulkTransactions.payment_group,
    createdBulkTransactions.payments,
    loadingPromise,
    onChangeStep,
    setAllBulkPayments,
    setBulkUploadRows,
    setCreatedBulkTransactions,
    setPangeaAlertNotificationMessage,
  ]);

  const handleContinueClick = useMemo(() => {
    switch (activeStep) {
      case '0':
        return function () {
          handleCreateBulkTransaction();
        };
      default:
        return function () {
          handleOnSubmit();
        };
    }
  }, [activeStep, handleCreateBulkTransaction, handleOnSubmit]);

  const handleBackClick = useMemo(() => {
    switch (activeStep) {
      case '1':
        return function () {
          onChangeStep(0);
        };
      default:
        return function () {
          router.push('/dashboard/transactions');
        };
    }
  }, [activeStep, onChangeStep, router]);
  const { isLoggedIn } = useAuthHelper();
  if (!isLoggedIn) {
    return <RedirectSpinner />;
  }
  return (
    <>
      <StepperShell
        title={title}
        titleDescription={titleDescription}
        continueButtonText={continueText}
        continueButtonEnabled={isContinueButtonEnabled}
        onClickContinueButton={handleContinueClick}
        onClickBackButton={handleBackClick}
        sx={{
          width: '100%',
          maxWidth: '68.9rem',
          margin: '4rem auto 0 0',
        }}
        navigationSxProps={{
          width: '100%',
          maxWidth: '100%',
        }}
        continueButtonProps={continueButtonProps}
        secondaryComponents={SecondaryComponents}
        headerInfoComponents={headerInfoComponents}
        backButtonProps={{
          variant: activeStep === '0' ? 'text' : 'outlined',
        }}
        justifyFooterContent={activeStep === '0' ? 'flex-end' : 'space-between'}
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

      <PangeaSimpleDialog
        title='Formatting your file'
        width={'480px'}
        openModal={openModal}
        onClose={toggleModal}
      >
        <Typography mb={1}>
          Our bulk upload CSV template includes the necessary formatting to
          ensure your transactions upload successfully.
        </Typography>
        <List
          sx={{
            listStyleType: 'decimal',
            pl: 3,
            '& .MuiListItem-root': {
              display: 'list-item',
              p: 0,
              pb: 0.5,
            },
          }}
        >
          <ListItem>
            <Typography>Download the CSV template below.</Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Open the CSV and enter your transactions details.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Before saving, ensure that all required fields are filled out.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Return to Pangea and upload your CSV in the bulk transaction
              table.
            </Typography>
          </ListItem>
        </List>

        <Stack direction='row' justifyContent='space-evenly' marginTop={2}>
          <PangeaButton onClick={toggleModal} variant='outlined' size='large'>
            Close
          </PangeaButton>

          <PangeaButton size='large' onClick={() => downloadFile()}>
            Download Template
          </PangeaButton>
        </Stack>
      </PangeaSimpleDialog>
    </>
  );
};

function extractErrorMessage(response: ErrorResponse): string | null {
  for (const error of response.response.data.validation_errors) {
    if (error.non_field_errors && error.non_field_errors.length > 0) {
      return error.non_field_errors[0].detail;
    }
  }
  return null;
}

export default BulkStepper;
