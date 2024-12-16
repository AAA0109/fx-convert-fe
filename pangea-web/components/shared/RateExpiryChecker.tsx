import ArrowForward from '@mui/icons-material/ArrowForward';
import { Stack } from '@mui/material';
import {
  bookInstructDealOrderNumberState,
  bookInstructDealRequestDataState,
  clientApiState,
  executionTimingtData,
  pangeaAlertNotificationMessageState,
} from 'atoms';
import { useLoading, useRouterParts, useWalletAndPaymentHelpers } from 'hooks';
import { PangeaCorpayLockSideEnum, PaymentType } from 'lib';
import { isError } from 'lodash';
import router from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import PangeaButton from './PangeaButton';

const SUBPATH_PAYMENTS_MAP: Record<string, PaymentType> = {
  'deposit-funds': 'Deposits',
  'withdraw-funds': 'Withdrawals',
  'fx-wallet-transfer': 'FXWallet',
  'send-payments': 'BeneficiaryPayments',
};
export const RateExpiryChecker = () => {
  const authHelper = useRecoilValue(clientApiState);
  const { routerParts } = useRouterParts();
  const [, subPath] = routerParts;
  const {
    isLoadingFxRate,
    hasFxRate,
    corPayQuotePaymentResponse: spotRateData,
    setIsSpotRateExpired,
    isSpotRateExpired,
    paymentDetails,
    requestCorpayQuotePayment,
  } = useWalletAndPaymentHelpers();
  const [progress, setProgress] = useState(
    () => (spotRateData?.quote.expiry ?? 10) * 10,
  );

  const api = authHelper.getAuthenticatedApiHelper();
  const setBookInstructDealRequestData = useSetRecoilState(
    bookInstructDealRequestDataState,
  );
  const bookInstructDealRequestData = useRecoilValue(
    bookInstructDealRequestDataState,
  );
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const setOperationOrderNumber = useSetRecoilState(
    bookInstructDealOrderNumberState,
  );
  const executionTiming = useRecoilValue(executionTimingtData);
  const {
    loadingPromise: submitPaymentOrderPromise,
    loadingState: loadingOrderState,
  } = useLoading();
  const rateExpiryInterval = useRef<NodeJS.Timeout>();
  const rateExpiryTimer = useCallback(() => {
    setProgress((prevProgress) => {
      if (prevProgress === 0) {
        if (rateExpiryInterval.current !== undefined) {
          setIsSpotRateExpired(true);
          clearInterval(rateExpiryInterval.current);
        }
      }
      return prevProgress <= 0 ? 0 : prevProgress - 10;
    });
  }, [setIsSpotRateExpired]);
  const handleOnSubmit = useCallback(async () => {
    // clear any existing alert messages
    setPangeaAlertNotificationMessage(null);
    const submitPaymentOrder = async () => {
      try {
        if (
          spotRateData &&
          !isError(spotRateData) &&
          executionTiming !== null
        ) {
          const bookPaymentResponse = await api.bookCorpayPaymentAsync({
            quote_id: spotRateData.quote.quote_id,
            session_id: spotRateData.quote.session_id,
            combine_settlements: true,
          });
          if (bookPaymentResponse && !isError(bookPaymentResponse)) {
            setOperationOrderNumber(String(bookPaymentResponse.order_number));
            router.push(`/wallets/${subPath}/success`);
          } else {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'There was an error booking Corpay payment.',
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
    await submitPaymentOrderPromise(submitPaymentOrder());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    authHelper,
    spotRateData,
    bookInstructDealRequestData,
    submitPaymentOrderPromise,
  ]);

  const onClickButton = useCallback(() => {
    // if rate is expired, refresh it
    // else continue to next step
    if (progress === 0 || isSpotRateExpired) {
      setProgress((spotRateData?.quote.expiry ?? 10) * 10);
      requestCorpayQuotePayment(
        paymentDetails.amount,
        SUBPATH_PAYMENTS_MAP[subPath],
      );
    } else {
      handleOnSubmit();
    }
  }, [
    progress,
    isSpotRateExpired,
    spotRateData?.quote.expiry,
    requestCorpayQuotePayment,
    paymentDetails.amount,
    subPath,
    handleOnSubmit,
  ]);

  const buttonText = isSpotRateExpired ? 'Refresh Rate' : 'Confirm';
  const buttonColor = isSpotRateExpired ? 'primary' : 'secondary';
  const endIcon = isSpotRateExpired ? null : <ArrowForward />;

  // Run the expiry interval once when component is mounted
  useEffect(() => {
    const intervalToClear = rateExpiryInterval.current;
    setIsSpotRateExpired(true);
    return () => {
      clearInterval(intervalToClear);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (hasFxRate && !isLoadingFxRate && !isSpotRateExpired) {
      clearInterval(rateExpiryInterval.current);
      rateExpiryInterval.current = setInterval(rateExpiryTimer, 1000);
      // TODO: Slowly deprecate use of bookInstructDealRequestDataState
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
                    ? spotRateData?.payment.amount
                    : spotRateData?.settlement.amount) ?? 0,
              },
            ],
          },
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasFxRate,
    isLoadingFxRate,
    spotRateData?.quote.quote_id,
    isSpotRateExpired,
  ]);
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
        loading={isLoadingFxRate || loadingOrderState.isLoading}
      >
        {buttonText}
      </PangeaButton>
    </Stack>
  );
};

export default RateExpiryChecker;
