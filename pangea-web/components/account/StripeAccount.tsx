import CheckCircle from '@mui/icons-material/CheckCircle';
import { Box, Button, Stack } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  loadStripe,
  PaymentMethod,
  SetupIntent,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { clientApiState, stripeAccountState } from 'atoms';
import {
  ClientAuthHelper,
  PangeaStripePaymentMethodResponse,
  safeWindow,
} from 'lib';
import { isError, padStart } from 'lodash';
import Image from 'next/image';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { ActionContainer, PangeaButton, PangeaLoading } from '../shared';

/*
  Test bank account and CC details:
  https://stripe.com/docs/connect/testing#account-numbers
  */

/**
 * Gets the stripe API - should only load once - leave outside component.
 * @date 8/3/2022 - 10:56:42 AM
 *
 * @type {Stripe}
 */
const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_API_KEY}`);
type StripeStatus = SetupIntent.Status | 'loading_stripe' | 'loading_intnet';
type StatusChangeResult = {
  status: StripeStatus;
  payment_method?: Optional<Nullable<string | PaymentMethod>>;
};

const SetupForm = ({
  onStatusChange,
  buttonProps,
}: {
  onStatusChange(e: StatusChangeResult): void;
  buttonProps?: ReactNode[] | ReactNode | undefined;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<NullableString>(null);
  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const setupResult = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url:
          safeWindow()?.location.href.substring(
            0,
            safeWindow()?.location.href.indexOf('/', 9),
          ) + '/account/payments',
      },
    });

    if (onStatusChange && setupResult.setupIntent) {
      onStatusChange({
        status: setupResult.setupIntent.status,
        payment_method: setupResult.setupIntent.payment_method,
      });
    }
    if (setupResult.error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(setupResult.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <PaymentElement />

      {buttonProps ? (
        buttonProps
      ) : (
        <PangeaButton
          sx={{ width: 'fit-content', marginTop: '8px' }}
          disabled={!stripe}
        >
          Submit
        </PangeaButton>
      )}

      {errorMessage && (
        <Box sx={{ color: PangeaColors.RiskBerryMedium, marginTop: '8px' }}>
          {errorMessage}
        </Box>
      )}
    </Box>
  );
};

const ManageStripe = ({
  paymentInfo,
  onClickEdit,
  reactElements,
}: {
  paymentInfo: Nullable<PangeaStripePaymentMethodResponse>;
  onClickEdit?(): void;
  reactElements?: ReactNode[] | ReactNode | undefined;
}) => {
  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      alignItems='center'
      border={`1px solid ${PangeaColors.SolidSlateLighter}`}
      padding={'8px'}
    >
      <Stack
        direction='row'
        justifyContent='flex-start'
        alignContent='center'
        spacing={2}
      >
        <CheckCircle sx={{ color: PangeaColors.SolidSlateLight }} />
        {paymentInfo ? (
          <span>
            {paymentInfo.brand +
              ' ' +
              padStart(paymentInfo.last4.toString(), 4, '0')}
          </span>
        ) : (
          <span>Stripe account is configured.</span>
        )}
      </Stack>
      <Button variant='text' onClick={onClickEdit}>
        Edit
      </Button>
      {reactElements ? reactElements : null}
    </Stack>
  );
};

const StripeContents = ({
  clientSecret,
  onNewIntentRequest,
  buttonProps,
}: {
  clientSecret: string;
  onNewIntentRequest: () => void;
  buttonProps?: ReactNode[] | ReactNode | undefined;
}) => {
  const stripe = useStripe();
  const apiHelper = useRecoilValue(clientApiState);
  const [status, setStatus] = useRecoilState(stripeAccountState);
  const [paymentInfo, setPaymentInfo] =
    useState<Nullable<PangeaStripePaymentMethodResponse>>(null);

  const handleClickEdit = useEventCallback(async () => {
    if (onNewIntentRequest) {
      onNewIntentRequest();
    }
  });
  const getPaymentStatusAsync =
    useCallback(async (): Promise<StatusChangeResult> => {
      if (!stripe) {
        return { status: 'loading_stripe' };
      }

      if (!clientSecret) {
        return { status: 'loading_intnet' };
      }
      // Retrieve the SetupIntent
      const setupIntentResult = await stripe.retrieveSetupIntent(clientSecret);
      if (setupIntentResult.setupIntent) {
        return {
          status: setupIntentResult.setupIntent.status,
          payment_method: setupIntentResult.setupIntent?.payment_method,
        };
      } else {
        console.debug(setupIntentResult.error);
        return { status: 'requires_action' };
      }
    }, [clientSecret, stripe]);
  const persistStatusResultToState = useCallback(
    (statusChangeResult: StatusChangeResult) => {
      setStatus(statusChangeResult.status);
      if (statusChangeResult.status == 'succeeded') {
        if (
          statusChangeResult.payment_method &&
          typeof statusChangeResult.payment_method == 'string' &&
          apiHelper
        ) {
          apiHelper
            .getAuthenticatedApiHelper()
            .getStripePaymentMethodInfoAsync(statusChangeResult.payment_method)
            .then((payment_method_response) => {
              if (
                payment_method_response &&
                !isError(payment_method_response) &&
                payment_method_response.type
              ) {
                setPaymentInfo(payment_method_response);
              }
            })
            .catch(console.error);
        } else if (
          statusChangeResult.payment_method &&
          (statusChangeResult.payment_method as PaymentMethod).type
        ) {
          const p = statusChangeResult.payment_method as PaymentMethod;
          const brand =
            p.card?.brand ?? `Account Type: ${p.us_bank_account?.account_type}`;
          const last4 = Number(
            p.card?.last4 ?? p.us_bank_account?.account_number ?? '0000',
          );
          setPaymentInfo({
            brand,
            id: p.id,
            last4,
            type: p.type,
          } as PangeaStripePaymentMethodResponse);
        }
      }
    },
    [apiHelper, setStatus],
  );
  useEffect(() => {
    getPaymentStatusAsync()
      .then((res) => {
        persistStatusResultToState(res);
      })
      .catch(console.error);
  }, [clientSecret, getPaymentStatusAsync, persistStatusResultToState]);

  if (!status || status == 'loading_intnet' || status == 'loading_stripe') {
    return <PangeaLoading loadingPhrase={'Loading Stripe account...'} />;
  } else if (status === 'succeeded') {
    return (
      <ManageStripe paymentInfo={paymentInfo} onClickEdit={handleClickEdit} />
    );
  } else {
    return (
      <SetupForm
        onStatusChange={persistStatusResultToState}
        buttonProps={buttonProps}
      />
    );
  }
};

interface StripeProps {
  title?: string;
  buttonProps?: ReactNode[] | ReactNode | undefined;
}

export const StripeAccount = (stripeProps: StripeProps) => {
  const { title, buttonProps } = stripeProps;
  const [clientSecret, setClientSecret] = useState('');
  const getSetupIntent = useCallback((forceNew = false) => {
    const api = ClientAuthHelper.getInstance().getAuthenticatedApiHelper();
    const intentRequest = forceNew
      ? api.getNewStripeSetupIntentAsync()
      : api.getStripeSetupIntentAsync();
    intentRequest.then((res) => {
      if (res && !isError(res)) {
        setClientSecret(res.client_secret);
        setOptions(
          (opts) =>
            ({
              ...opts,
              clientSecret: res.client_secret,
            } as StripeElementsOptions),
        );
      }
    });
  }, []);
  const handleNewIntentRequest = useCallback(() => {
    getSetupIntent(true);
  }, [getSetupIntent]);
  useEffect(() => {
    getSetupIntent();
  }, [getSetupIntent]);

  const [options, setOptions] = useState<StripeElementsOptions>({
    // passing the client secret obtained in step 2
    clientSecret: `${clientSecret}`,
    // Fully customizable with appearance API.
    appearance: {
      theme: 'flat',
      variables: {
        colorPrimary: PangeaColors.PrimaryMain,
        colorText: PangeaColors.SolidSlateDark,
        colorDanger: PangeaColors.RiskBerryMedium,
        fontFamily: 'SuisseNeue',
        borderRadius: '2px',
      },
    },
    fonts: [
      {
        family: 'SuisseNeue',
        src: 'url(/fonts/SuisseNeue-Regular.otf)',
      },
    ],
  });

  if (!clientSecret) {
    return <PangeaLoading loadingPhrase={'Loading...'} />;
  }
  return (
    <Stack direction='column'>
      <ActionContainer title={title}>
        <Elements
          stripe={stripePromise}
          options={options}
          /* key attribute must be updated to force unmount/remount when client secret changes, otherwise PaymentElement uses old client secret. */
          key={clientSecret}
        >
          <StripeContents
            clientSecret={clientSecret}
            onNewIntentRequest={handleNewIntentRequest}
            buttonProps={buttonProps}
          />
        </Elements>
      </ActionContainer>
      <Stack mt={4}>
        <Image
          alt='stripe logo'
          title='stripe logo'
          src='/images/powered-by-stripe-black.svg'
          width={111}
          height={24}
          layout='fixed'
        />
      </Stack>
    </Stack>
  );
};
export default StripeAccount;
