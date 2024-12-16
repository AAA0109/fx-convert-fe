import ArrowForward from '@mui/icons-material/ArrowForward';
import { Stack } from '@mui/material';
import {
  allBulkTransactionItemsState,
  bookInstructDealRequestDataState,
  bulkPaymentRfqState,
  clientApiState,
  createdBulkTransactionItemsState,
  ExtendablePayment,
  ExtendedPangeaBulkPaymentResponse,
  pangeaAlertNotificationMessageState,
  spotRateDataState,
} from 'atoms';
import { useLoading, useWalletAndPaymentHelpers } from 'hooks';
import { isError } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import PangeaButton from './PangeaButton';
import { PangeaExecutionTimingEnum } from 'lib';

export const BulkPaymentRateExpiryChecker = () => {
  const authHelper = useRecoilValue(clientApiState);
  const spotRateData = useRecoilValue(spotRateDataState);
  const createdBulkPayments = useRecoilValue(createdBulkTransactionItemsState);
  const setBulkPaymentRfq = useSetRecoilState(bulkPaymentRfqState);
  const setAllBulkPaymentsRfq = useSetRecoilState(allBulkTransactionItemsState);

  const router = useRouter();
  const { isSpotRateExpired, setIsSpotRateExpired } =
    useWalletAndPaymentHelpers();
  const [progress, setProgress] = useState(0);
  const api = authHelper.getAuthenticatedApiHelper();
  const bookInstructDealRequestData = useRecoilValue(
    bookInstructDealRequestDataState,
  );
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const {
    loadingPromise: submitBulkPaymentOrderPromise,
    loadingState: loadingOrderState,
  } = useLoading();

  const { loadingPromise: paymentRatePromise, loadingState: loadingFxRate } =
    useLoading();

  const rateExpiryInterval = useRef<NodeJS.Timeout>();
  const rateExpiryTimer = useCallback(() => {
    setProgress((prevProgress) => {
      if (prevProgress === 0) {
        if (rateExpiryInterval.current !== undefined) {
          clearInterval(rateExpiryInterval.current);
          setIsSpotRateExpired(true);
        }
      }
      return prevProgress <= 0 ? 0 : prevProgress - 10;
    });
  }, [setIsSpotRateExpired]);
  const handleOnSubmit = useCallback(async () => {
    // clear any existing alert messages
    setPangeaAlertNotificationMessage(null);
    const submitBulkPaymentOrder = async () => {
      try {
        const executeBulkPaymentResponse = await api.executeBulkPaymentsAsync({
          payment_ids:
            (createdBulkPayments.payments.map((p) => p.id) as number[]) || [],
        });
        if (!isError(executeBulkPaymentResponse)) {
          if (
            !executeBulkPaymentResponse.executions.some(
              (e) => e.execution_status.error.length > 0,
            )
          ) {
            router.push(`/transactions/payments/success`);
          } else {
            const errorArray = executeBulkPaymentResponse.executions.map(
              (e) => e.execution_status.error,
            );
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text:
                'There was an error executing payment.' + errorArray.join(', '),
            });
          }
        } else {
          router.push(`/transactions/payments/error`);
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: 'There was an error executing payment.',
          });
        }
      } catch {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error executing the payment',
        });
      }
    };
    await submitBulkPaymentOrderPromise(submitBulkPaymentOrder());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    authHelper,
    spotRateData,
    bookInstructDealRequestData,
    submitBulkPaymentOrderPromise,
  ]);
  const paymentRate = useCallback(async () => {
    try {
      const rfq_data = await api.getBulkPaymentsRfqAsync({
        payment_ids:
          (createdBulkPayments.payments
            .filter(
              (p) =>
                p.execution_timing &&
                [
                  PangeaExecutionTimingEnum.ImmediateForward,
                  PangeaExecutionTimingEnum.ImmediateNdf,
                  PangeaExecutionTimingEnum.ImmediateSpot,
                ].includes(p.execution_timing),
            )
            .filter((p) => Boolean(p.id))
            .map((p) => p.id) as number[]) || [],
      });
      if (rfq_data && !isError(rfq_data)) {
        rfq_data.rfqs.forEach((rfq) => {
          if (rfq.rfq_status.failed && rfq.rfq_status.failed.length > 0) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: rfq.rfq_status.failed[0].message,
            });
          }
        });
        if (
          rfq_data.rfqs[0]?.rfq_status?.failed &&
          rfq_data.rfqs[0]?.rfq_status?.failed?.length > 0
        ) {
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: rfq_data.rfqs[0]?.rfq_status?.failed[0]?.message,
          });
        } else {
          setAllBulkPaymentsRfq((prev: ExtendedPangeaBulkPaymentResponse) => {
            return {
              ...prev,
              payments: prev.payments.map((p) => {
                const matchingRfq = rfq_data.rfqs.find(
                  (r) => r.payment_id === p.id,
                );
                return {
                  ...p,
                  spot_rate: matchingRfq?.rfq_status.success[0]?.spot_rate,
                  fee: matchingRfq?.rfq_status.success[0]?.broker_fee,
                };
              }) as unknown as ExtendablePayment,
            };
          });
          setBulkPaymentRfq(rfq_data);
          setProgress(100);
          setIsSpotRateExpired(false);
        }
      }
    } catch (error) {
      setPangeaAlertNotificationMessage({
        severity: 'error',
        text: 'There was an error getting quote',
      });
    }
  }, [
    api,
    createdBulkPayments.payments,
    setPangeaAlertNotificationMessage,
    setAllBulkPaymentsRfq,
    setBulkPaymentRfq,
    setIsSpotRateExpired,
  ]);
  const onClickButton = useCallback(async () => {
    // if rate is expired, refresh it
    // else continue to next step
    if (progress <= 0 || isSpotRateExpired) {
      //|| (isSpotRateExpired && rfq?.external_quote_expiry)
      await paymentRatePromise(paymentRate());
    } else {
      handleOnSubmit();
    }
  }, [
    progress,
    isSpotRateExpired,
    paymentRatePromise,
    paymentRate,
    handleOnSubmit,
  ]);

  const buttonText = isSpotRateExpired ? 'Refresh Rate' : 'Confirm';
  const buttonColor = isSpotRateExpired ? 'primary' : 'secondary';
  const endIcon = isSpotRateExpired ? null : <ArrowForward />;

  // Run the expiry interval once when component is mounted
  useEffect(() => {
    const intervalToClear = rateExpiryInterval.current;
    return () => {
      clearInterval(intervalToClear);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!isSpotRateExpired) {
      clearInterval(rateExpiryInterval.current);
      rateExpiryInterval.current = setInterval(rateExpiryTimer, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpotRateExpired]);
  return (
    <Stack direction='row' columnGap={4}>
      {!isSpotRateExpired && (
        <CircularProgressWithLabel
          prefixLabel='Rate expires in'
          value={progress}
        />
      )}
      <PangeaButton
        size='large'
        sx={{ marginLeft: 'auto', minWidth: '145px' }}
        onClick={onClickButton}
        endIcon={endIcon}
        color={buttonColor}
        variant='contained'
        loading={loadingOrderState.isLoading || loadingFxRate.isLoading}
      >
        {buttonText}
      </PangeaButton>
    </Stack>
  );
};

export default BulkPaymentRateExpiryChecker;
