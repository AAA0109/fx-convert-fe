import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { allCashflowsGridViewState } from 'atoms';
import { BulkUploadContainer } from 'components/bulkUpload';
import {
  ChooseAPortfolioLeft,
  ContentStepper,
  ReviewLeft,
  ReviewRight,
} from 'components/cashflow';
import {
  DetailsSideStepper,
  FeatureFlag,
  Grid63Layout,
  GridLayoutOneTenOne,
  HedgingDisabledAlert,
  HttpErrorStatusDisplay,
  PangeaButton,
  PangeaLoading,
  PangeaPageTitle,
  TopLevelStepper,
} from 'components/shared';
import {
  CashflowUpdatesContainer,
  ProjectedRiskRight,
} from 'components/summarypanel';
import {
  useFeatureFlags,
  useRouterParts,
  useUserGroupsAndPermissions,
} from 'hooks';
import { HttpErrorStatusCode } from 'lib';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Suspense, useEffect } from 'react';
import { useRecoilRefresher_UNSTABLE } from 'recoil';
import { PangeaColors } from 'styles';

const CreatePage = () => {
  const router = useRouter();
  const { routerParts } = useRouterParts();
  const { isFeatureEnabled } = useFeatureFlags();
  const refreshCashflowRows = useRecoilRefresher_UNSTABLE(
    allCashflowsGridViewState,
  );
  const isForwardsEnabled = isFeatureEnabled('corpay-forwards-strategy');
  const primaryRoute =
    routerParts.length > 1 ? routerParts[1].toLowerCase() : 'details';
  const secondaryRoute =
    routerParts.length > 2
      ? routerParts[2].toLowerCase()
      : isForwardsEnabled
      ? 'frequency'
      : 'quantity';
  const primaryActiveStep = Math.max(
    0,
    ['details', 'hedge', 'review'].indexOf(primaryRoute),
  );

  const detailsActiveStep =
    primaryActiveStep === 0
      ? {
          quantity: 0,
          frequency: 1,
          direction: 2,
          onetime: 3,
          recurring: 3,
          installments: 3,
          advanced: 0,
        }[secondaryRoute]
      : 0;
  const isBulkUploadPage =
    routerParts.length > 2 && routerParts[2].toLowerCase() === 'advanced';
  const topLevelStepperLabels = [
    'Input cash flow details',
    'Strategy',
    'Review',
  ];
  const title = topLevelStepperLabels[primaryActiveStep];
  const TitleComponent = () => (
    <Stack direction='column'>
      <Typography
        component='h3'
        variant='h3'
        color={PangeaColors.WarmOrangeMedium}
      >
        Hedge Creation
      </Typography>
      <Typography
        component='h5'
        variant='h5'
        color={(theme) => theme.palette.text.secondary}
      >
        {title}
      </Typography>
    </Stack>
  );

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
        StepperLabels={topLevelStepperLabels}
        activeStep={primaryActiveStep}
      />
    </Stack>
  );
  const TopOfPage = () =>
    isBulkUploadPage ? (
      <TitleAndStepper />
    ) : (
      <GridLayoutOneTenOne>
        <TitleAndStepper />
      </GridLayoutOneTenOne>
    );

  const StepperLabels = [
    ...(isForwardsEnabled ? [] : ['Number of cash flows']),
    'Frequency',
    'Direction',
    isForwardsEnabled ? 'Cash Flow Details' : 'Amount and final details',
  ];
  const BottomOfPage = () => {
    const { isAdmin, isCreator, isManager, isLoaded } =
      useUserGroupsAndPermissions();

    // Viewer only permission cannot access this page
    if (isLoaded && !isAdmin && !isCreator && !isManager) {
      return (
        <HttpErrorStatusDisplay
          statusCode={HttpErrorStatusCode.FORBIDDEN}
          title='Access denied'
          description='Sorry, you don&rsquo;t have permission to view this page. If you need
          access, contact your organization&rsquo;s admin.'
        />
      );
    }
    const successHeroTitle =
      isAdmin || isManager ? 'This hedge has been created and is pending.' : '';
    const successHeroText =
      isAdmin || isManager
        ? ''
        : 'Because this hedge is a non-deliverable forward, your Pangea Advisor will need to review this cash flow and will be in contact with you. It will remain as “Pending Activation” until your Advisors contacts you.';

    switch (primaryRoute) {
      case 'details': //Details
        return !isLoaded ? (
          <PangeaLoading
            loadingPhrase='Loading cash flow details ...'
            centerPhrase
            useBackdrop
          />
        ) : isBulkUploadPage ? (
          <BulkUploadContainer />
        ) : (
          <Grid63Layout
            fixed
            left={<ContentStepper pageToDisplay={secondaryRoute} />}
            right={
              <DetailsSideStepper
                StepperLabels={StepperLabels}
                activeStep={(detailsActiveStep ?? 1) - 1}
              />
            }
          />
        );
      case 'hedge':
        return (
          <Grid63Layout
            fixed
            left={<ChooseAPortfolioLeft />}
            right={
              <Suspense
                fallback={
                  <PangeaLoading loadingPhrase={'Loading details...'} />
                }
              >
                <CashflowUpdatesContainer defaultExpanded={true} />
                <ProjectedRiskRight totalFeeIncluded />
              </Suspense>
            }
          />
        );
      case 'review':
        return (
          <Grid63Layout
            fixed
            left={<ReviewLeft mode='create' />}
            right={
              <Suspense
                fallback={
                  <PangeaLoading loadingPhrase={'Loading details...'} />
                }
              >
                <CashflowUpdatesContainer
                  mode='create'
                  defaultExpanded={true}
                />
                <ReviewRight mode='create' />
              </Suspense>
            }
          />
        );
      case 'success':
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Stack marginTop={12} alignItems={'center'} maxWidth={500}>
              <CheckCircleOutline sx={{ fontSize: '120px' }} color='success' />
              <Box margin={'32px 0 40px 0'}>
                <PangeaPageTitle
                  color={PangeaColors.BlackSemiTransparent87}
                  title='Success!'
                />
              </Box>

              <Typography marginBottom={'12px'} variant='body1'>
                {isLoaded && successHeroTitle}
              </Typography>
              <Typography marginBottom={'112px'} variant='body1'>
                {isLoaded && successHeroText}
              </Typography>
              <PangeaButton size={'large'} href={'/dashboard'}>
                Dashboard
              </PangeaButton>
            </Stack>
          </Box>
        );
      default:
        return <PangeaLoading loadingPhrase={'Loading...'} />;
    }
  };
  useEffect(() => {
    if (primaryRoute === 'success') {
      refreshCashflowRows();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryRoute]);
  useEffect(() => {
    router.push('/dashboard/transactions');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense
      fallback={
        <PangeaLoading
          loadingPhrase='Loading cash flow details...'
          centerPhrase
          useBackdrop
        />
      }
    >
      <Head>
        <title>Pangea Prime - Hedge Creation</title>
      </Head>
      <FeatureFlag name={['hedges']} fallback={<>Feature unavailable</>}>
        <Stack direction='column' spacing={8}>
          <TopOfPage />
          <Box>
            <HedgingDisabledAlert />
            <BottomOfPage />
          </Box>
        </Stack>
      </FeatureFlag>
    </Suspense>
  );
};

export default CreatePage;
