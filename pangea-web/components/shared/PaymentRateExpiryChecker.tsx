import ArrowForward from '@mui/icons-material/ArrowForward';
import { Stack } from '@mui/material';
import {
  clientApiState,
  pangeaAlertNotificationMessageState,
  paymentExecutionTimingtData,
  paymentRfqState,
  paymentspotRateDataState,
  transactionPaymentState,
  valueDateTypeState,
} from 'atoms';
import { useLoading, useWalletAndPaymentHelpers } from 'hooks';
import { isError } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import PangeaButton from './PangeaButton';
import { PangeaDateTypeEnum, PangeaExecutionTimingEnum } from 'lib';
import { AxiosError } from 'axios';

export const PaymentRateExpiryChecker = () => {
  const authHelper = useRecoilValue(clientApiState);
  const paymentspotRateData = useRecoilValue(paymentspotRateDataState);
  const [payment] = useRecoilState(transactionPaymentState);
  const [paymentRfq, setPaymentRfq] = useRecoilState(paymentRfqState);

  const rfq = paymentRfq ? paymentRfq.success[0] : null;
  const router = useRouter();
  const { isSpotRateExpired, setIsSpotRateExpired } =
    useWalletAndPaymentHelpers();
  const [progress, setProgress] = useState(0);
  const api = authHelper.getAuthenticatedApiHelper();
  const valueDateType = useRecoilValue(valueDateTypeState);
  const executionTiming = useRecoilValue(paymentExecutionTimingtData);
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const {
    loadingPromise: submitPaymentOrderPromise,
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
  const handleOnSubmit = useCallback(
    async (isNdf?: boolean) => {
      // clear any existing alert messages
      setPangeaAlertNotificationMessage(null);
      const submitPaymentOrder = async () => {
        try {
          if (payment?.id) {
            const executePaymentResponse = await api.executePayment(
              payment.id.toString(),
            );
            if (executePaymentResponse && !isError(executePaymentResponse)) {
              if (isNdf) {
                router.push(`/transactions/payments/successndf`);
              } else {
                router.push(`/transactions/payments/success`);
              }
            } else {
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
            text: 'There was an error executing the payment',
          });
        }
      };
      await submitPaymentOrderPromise(submitPaymentOrder());
    },
    [
      setPangeaAlertNotificationMessage,
      submitPaymentOrderPromise,
      payment?.id,
      api,
      router,
    ],
  );
  const handleOnRequestTradeDeskQuote = useCallback(async () => {
    // clear any existing alert messages
    setPangeaAlertNotificationMessage(null);
    const requestTradeDeskQuote = async () => {
      try {
        const rfq_data = await api.getPaymentRfq(payment?.id?.toString() ?? '');
        if (rfq_data && !isError(rfq_data)) {
          if (rfq_data?.failed && rfq_data?.failed?.length > 0) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: rfq_data?.failed[0].message,
            });
          } else {
            setPaymentRfq(rfq_data);
            handleOnSubmit(true);
          }
        }
      } catch {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error requesting and executing trade desk quote.',
          timeout: 5000,
        });
      }
    };
    await paymentRatePromise(requestTradeDeskQuote());
  }, [
    api,
    handleOnSubmit,
    payment?.id,
    paymentRatePromise,
    setPangeaAlertNotificationMessage,
    setPaymentRfq,
  ]);

  const paymentRate = useCallback(async () => {
    const standardError =
      'Electronic trading ability on this market is temporarily unavailable.';
    const limitError =
      'This transaction amount or tenor exceeds the limits of your executing brokers. Please contact your client advisor.';
    const approvalError =
      'Approval is required to proceed with this transaction.';
    try {
      const rfq_data = await api.getPaymentRfq(payment?.id?.toString() ?? '');
      if (rfq_data && !isError(rfq_data)) {
        if (rfq_data?.failed && rfq_data?.failed?.length > 0) {
          const failed = rfq_data?.failed[0];
          if (
            failed?.data?.error?.includes('maximum') ||
            failed?.data?.non_field_errors?.includes('maximum')
          ) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: limitError,
              timeout: 5000,
            });
          } else {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: standardError,
              timeout: 5000,
            });
          }
        } else {
          setPaymentRfq(rfq_data);
          setProgress(150);
          setIsSpotRateExpired(false);
        }
      } else if (rfq_data instanceof AxiosError) {
        const axiosError = rfq_data;
        const failed = axiosError.response?.data?.failed;
        if (failed && Array.isArray(failed) && failed.length > 0) {
          if (
            failed[0]?.data?.error?.includes('maximum') ||
            failed[0]?.data?.non_field_errors?.includes('maximum')
          ) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: limitError,
              timeout: 5000,
            });
          } else if (
            failed[0]?.data?.error?.includes('approval') ||
            failed[0]?.data?.non_field_errors?.includes('approval')
          ) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: approvalError,
              timeout: 5000,
            });
          } else {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: standardError,
              timeout: 5000,
            });
          }
        }
      }
    } catch (error) {
      setPangeaAlertNotificationMessage({
        severity: 'error',
        text: standardError,
      });
    }
  }, [
    api,
    payment?.id,
    setIsSpotRateExpired,
    setPangeaAlertNotificationMessage,
    setPaymentRfq,
  ]);
  const isValidNdfCondition =
    ((executionTiming?.value as PangeaExecutionTimingEnum) ===
      PangeaExecutionTimingEnum.ImmediateNdf ||
      (executionTiming?.value as PangeaExecutionTimingEnum) ===
        PangeaExecutionTimingEnum.StrategicNdf) &&
    valueDateType === PangeaDateTypeEnum.FORWARD &&
    paymentspotRateData?.is_ndf;

  const onClickButton = useCallback(async () => {
    // if rate is expired, refresh it
    // else continue to next step
    if (isValidNdfCondition) {
      await submitPaymentOrderPromise(handleOnRequestTradeDeskQuote());
      return;
    }
    if (progress <= 0 || (isSpotRateExpired && rfq?.external_quote_expiry)) {
      await paymentRatePromise(paymentRate());
    } else {
      handleOnSubmit();
    }
  }, [
    isValidNdfCondition,
    progress,
    isSpotRateExpired,
    rfq?.external_quote_expiry,
    handleOnRequestTradeDeskQuote,
    paymentRatePromise,
    submitPaymentOrderPromise,
    paymentRate,
    handleOnSubmit,
  ]);
  const buttonText = isSpotRateExpired
    ? isValidNdfCondition
      ? 'Request Trade Desk Quote'
      : 'Refresh Rate'
    : 'Confirm';
  const buttonColor = isSpotRateExpired
    ? isValidNdfCondition
      ? 'secondary'
      : 'primary'
    : 'secondary';
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
        loading={loadingFxRate.isLoading || loadingOrderState.isLoading}
      >
        {buttonText}
      </PangeaButton>
    </Stack>
  );
};

export default PaymentRateExpiryChecker;
