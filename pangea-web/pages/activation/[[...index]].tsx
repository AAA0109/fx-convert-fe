import { Box, Divider, Stack, Typography } from '@mui/material';

import {
  AccountActivatedSuccessState,
  ActivationDetailsContainer,
  ActivationFinalizationContainer,
  CompanyCreatedPageContent,
  CompanyOnboardingIncomplete,
  CreateAccountPageContent,
  FinishingUpDetailsContainer,
  RequestToJoinACompany,
  SuccessfulVerificationPageContent,
  VerifyMobile,
} from 'components/accountActivation';
import {
  GridLayoutOneTenOne,
  PangeaLoading,
  TopLevelStepper,
} from 'components/shared';
import { useRouterParts } from 'hooks';

import { apiHelper, parseBoolean } from 'lib';
import { isError, startCase } from 'lodash';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { PangeaColors } from 'styles';

const ActivationPage = () => {
  const { router, routerParts, isRouterReady } = useRouterParts();
  const [componentMounted, setComponentMounted] = useState(false);
  useEffect(() => setComponentMounted(true), []);

  const primaryRoute =
    routerParts.length > 1 ? routerParts[1].toLowerCase() : 'create-account';

  const secondaryRoute =
    routerParts.length > 2 ? routerParts[2].toLowerCase() : '';

  const primaryActiveStep = Math.max(
    0,
    ['details', 'finalization', 'finishing-up'].indexOf(primaryRoute),
  );

  const isPageWithNoTitleComponent =
    routerParts[routerParts.length - 2] != 'details' &&
    routerParts[routerParts.length - 2] != 'finalization' &&
    routerParts[routerParts.length - 2] != 'finishing-up';

  const TitleComponent = () => {
    const pageName = routerParts[routerParts.length - 1];
    const pageTitle = startCase(pageName);

    return (
      <Stack direction='column'>
        <Typography
          component='h3'
          variant='h3'
          color={PangeaColors.WarmOrangeMedium}
        >
          Account Activation
        </Typography>
        <Typography
          component='h5'
          variant='h5'
          color={(theme) => theme.palette.text.secondary}
        >
          {pageTitle}
        </Typography>
      </Stack>
    );
  };

  const TopLevelStepperLabels = [
    'Company and personal details',
    'IB application',
    'Finishing Up',
  ];

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
      <TitleComponent />
      <TopLevelStepper
        StepperLabels={TopLevelStepperLabels}
        activeStep={primaryActiveStep}
      />
    </Stack>
  );
  const TopOfPage = () =>
    isPageWithNoTitleComponent ? (
      <></>
    ) : (
      <GridLayoutOneTenOne>
        <TitleAndStepper />
      </GridLayoutOneTenOne>
    );

  const BottomOfPage = () => {
    switch (primaryRoute) {
      case 'create-account':
        return (
          <Suspense>
            <CreateAccountPageContent />
          </Suspense>
        );
      case 'details':
        return <ActivationDetailsContainer page={secondaryRoute} />;
      case 'finalization':
        return (
          <Suspense>
            <ActivationFinalizationContainer page={secondaryRoute} />
          </Suspense>
        );
      case 'finishing-up':
        return (
          <Suspense>
            <FinishingUpDetailsContainer page={secondaryRoute} />
          </Suspense>
        );
      case 'successful-verification':
        return (
          <Suspense>
            <SuccessfulVerificationPageContent />
          </Suspense>
        );
      case 'verify-mobile':
        return (
          <Suspense>
            <VerifyMobile />
          </Suspense>
        );
      case 'company-created':
        return (
          <Suspense fallback='loading'>
            <CompanyCreatedPageContent />
          </Suspense>
        );
      case 'request':
        return (
          <Suspense>
            <RequestToJoinACompany />
          </Suspense>
        );
      case 'account-activated':
        return (
          <Suspense>
            <AccountActivatedSuccessState />
          </Suspense>
        );
      case 'company-onboarding-incomplete':
        return (
          <Suspense>
            <CompanyOnboardingIncomplete />
          </Suspense>
        );
      default:
        router.push('/404');
        return <PangeaLoading loadingPhrase={'Loading...'} />;
    }
  };
  if (!isRouterReady || !componentMounted) {
    return <PangeaLoading loadingPhrase={'Loading...'} />;
  }
  return (
    <>
      <Head>
        <title>Pangea Prime - Account Creation</title>
      </Head>
      <Stack direction='column' spacing={8}>
        <TopOfPage />
        <Box>
          <BottomOfPage />
        </Box>

        {process.env.NODE_ENV == 'development' &&
        parseBoolean(process.env.NEXT_PUBLIC_SHOW_ACTIVATION_LINKS) ? (
          <Stack
            direction='column'
            alignContent={'center'}
            marginLeft={6}
            spacing={2}
            justifyContent='space-evenly'
            flexWrap={'wrap'}
          >
            <Stack spacing={2}>
              <h2>email, password and verification</h2>
              <Link href='/activation/create-account'>Start</Link>
              <Link href='/activation/successful-verification'>
                Successful Verification
              </Link>
              <Link href='/activation/company-created'>Company Created</Link>
              <Link href='/activation/request'>Request</Link>
            </Stack>

            <Stack spacing={2}>
              <h2>details</h2>
              <Link href='/activation/details/company-details'>
                Company Details
              </Link>
              <Link href='/activation/details/company-address'>
                Company Address
              </Link>
              <Link href='/activation/details/about-you'>About You</Link>
              <Link href='/activation/details/your-address'>Your Address</Link>
            </Stack>

            <Stack spacing={2}>
              <h2>finalization</h2>
              <Link href='/activation/finalization/collecting-documents'>
                Documents
              </Link>
              <Link href='/activation/finalization/portal-access'>
                Portal Access
              </Link>
              <Link href='/activation/finalization/interactive-broker-application'>
                IB Application
              </Link>
            </Stack>

            <Stack spacing={2}>
              <h2>finishing up</h2>
              <Link href='/activation/finishing-up/fee-payment-method'>
                Fee
              </Link>
              <Link href='/activation/finishing-up/link-account-for-withdrawals'>
                Link Account
              </Link>
              <Link href='/activation/finishing-up/schedule-a-meeting'>
                meeting
              </Link>
              <Link href='/activation/finishing-up/invite-your-team'>
                Invite Team
              </Link>
            </Stack>

            <Stack spacing={2}>
              <h2>floater end pages</h2>
              <Link href='/activation/account-activated'>
                Account Activated
              </Link>
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.req.url) {
    return { props: {} };
  }
  if (
    context.resolvedUrl.toLowerCase().indexOf('/activation/create_account') >= 0
  ) {
    return {
      redirect: {
        destination: context.resolvedUrl.replace(
          'create_account',
          'create-account',
        ),
        permanent: true,
      },
    };
  }
  if (
    context.resolvedUrl.toLowerCase().indexOf('/activation/verify-email') == 0
  ) {
    const activationToken = context.query['activation_token']?.toString();
    if (activationToken) {
      const resp = await apiHelper().activateUserAsync(activationToken);
      if (isError(resp)) {
        //TODO: need to redirect to some failure page here.
        console.error(resp);
        return { props: { error: { name: resp.name, message: resp.message } } };
      }
      return {
        redirect: {
          destination: '/login?returnUrl=/activation/verify-mobile',
          permanent: false,
        },
      };
    }
  }
  return { props: {} };
};
export default ActivationPage;
