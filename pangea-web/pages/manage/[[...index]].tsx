import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { Box, Stack, Typography } from '@mui/material';
import {
  CashflowDetailsStep,
  ChooseAPortfolioLeft,
  ReviewLeft,
  ReviewRight,
} from 'components/cashflow';
import { CashflowOverview, OverviewTitle } from 'components/dashboard';
import {
  FeatureFlag,
  Grid63Layout,
  HttpErrorStatusDisplay,
  PageFrame,
  PangeaButton,
  PangeaLoading,
  PangeaPageTitle,
  RedirectSpinner,
  RoleBasedAccessCheck,
} from 'components/shared';

import {
  CashflowUpdatesContainer,
  NextSettlementAccordion,
  OverviewSummary,
  ProjectedRiskRight,
} from 'components/summarypanel';

import {
  useAuthHelper,
  useRouterParts,
  useUserGroupsAndPermissions,
} from 'hooks';
import { HttpErrorStatusCode, PangeaGroupEnum } from 'lib';
import Head from 'next/head';
import { PropsWithChildren, Suspense } from 'react';

const PermissionsWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { userGroups, isLoaded } = useUserGroupsAndPermissions();
  return (
    <RoleBasedAccessCheck
      userGroups={userGroups}
      allowedGroups={[
        PangeaGroupEnum.CustomerCreator,
        PangeaGroupEnum.CustomerManager,
        PangeaGroupEnum.CustomerAdmin,
      ]}
      fallbackComponent={
        isLoaded && (
          <HttpErrorStatusDisplay
            statusCode={HttpErrorStatusCode.FORBIDDEN}
            title='Access denied'
            description='Sorry, you don&rsquo;t have permission to view this page. If you need
          access, contact your organization&rsquo;s admin.'
          />
        )
      }
    >
      {children}
    </RoleBasedAccessCheck>
  );
};
const ManagePage = () => {
  const { isLoggedIn } = useAuthHelper();
  const { routerParts } = useRouterParts();
  const { isAdmin, isManager } = useUserGroupsAndPermissions();

  const primaryRoute =
    routerParts.length > 1 ? routerParts[1].toLowerCase() : 'details';
  const secondaryRoute =
    routerParts.length > 2 ? routerParts[2].toLowerCase() : 'quantity';

  const useDraftingChangesBorder = ![
    'overview',
    'success',
    'settle-success',
  ].includes(primaryRoute);

  const successHeroTitle =
    isAdmin || isManager
      ? 'Congratulations, your hedge is pending.'
      : 'This hedge is pending approval.';
  const successHeroText =
    isAdmin || isManager
      ? 'Notice: Your hedge will activate automatically once the necessary margin has been received by Interactive Brokers.'
      : 'Notice: This hedge needs to be approved by a manager or admin in order to be successfully executed.';

  const MainContent = () => {
    switch (primaryRoute) {
      case 'details': //Details
        return (
          <PermissionsWrapper>
            <Grid63Layout
              fixed
              left={
                <CashflowDetailsStep
                  pageToDisplay={secondaryRoute}
                  mode='manage'
                />
              }
              right={
                <Suspense fallback='loading'>
                  <CashflowUpdatesContainer
                    mode='manage'
                    defaultExpanded={true}
                  />
                </Suspense>
              }
            />
          </PermissionsWrapper>
        );
      case 'overview': //Overview page
        return (
          <Grid63Layout
            fixed
            titleRowNode={<OverviewTitle />}
            left={
              <Suspense
                fallback={
                  <PangeaLoading
                    loadingPhrase={'Loading cashflow details'}
                    useBackdrop
                  />
                }
              >
                <CashflowOverview />
              </Suspense>
            }
            right={
              <Suspense
                fallback={
                  <PangeaLoading loadingPhrase={'Loading summary...'} />
                }
              >
                <OverviewSummary />
                <NextSettlementAccordion />
              </Suspense>
            }
          />
        );
      case 'hedge':
        return (
          <PermissionsWrapper>
            <Grid63Layout
              fixed
              left={<ChooseAPortfolioLeft mode='manage' />}
              right={
                <Suspense
                  fallback={
                    <PangeaLoading loadingPhrase={'Loading details...'} />
                  }
                >
                  <CashflowUpdatesContainer
                    mode='manage'
                    defaultExpanded={true}
                  />
                  <ProjectedRiskRight totalFeeIncluded mode='manage' />
                </Suspense>
              }
            />
          </PermissionsWrapper>
        );
      case 'review':
        return (
          <PermissionsWrapper>
            <Grid63Layout
              fixed
              left={<ReviewLeft mode='manage' />}
              right={
                <Suspense
                  fallback={
                    <PangeaLoading loadingPhrase={'Loading details...'} />
                  }
                >
                  <CashflowUpdatesContainer
                    mode='manage'
                    defaultExpanded={true}
                  />
                  <ReviewRight mode='manage' defaultExpanded={true} />
                </Suspense>
              }
            />
          </PermissionsWrapper>
        );
      case 'success':
        return (
          <PermissionsWrapper>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <Stack spacing={4} alignItems={'center'} maxWidth={500}>
                <CheckCircleOutline
                  sx={{ fontSize: '120px' }}
                  color='success'
                />
                <PangeaPageTitle title='Success!' />
                <Typography variant='heroBody'>{successHeroTitle}</Typography>
                <Typography variant='body1'>{successHeroText}</Typography>
                <PangeaButton size={'large'} href={'/dashboard'}>
                  Dashboard
                </PangeaButton>
              </Stack>
            </Box>
          </PermissionsWrapper>
        );
      case 'settle-success':
        return (
          <PermissionsWrapper>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <Stack spacing={4} alignItems={'center'} maxWidth={500}>
                <CheckCircleOutline
                  sx={{ fontSize: '120px' }}
                  color='success'
                />
                <PangeaPageTitle title='Hedge Settled' />

                <Typography variant='body1'>
                  Notice: Any active positions will be unwound in 1-2 business
                  days.
                </Typography>
                <PangeaButton size={'large'} href={'/dashboard'}>
                  Dashboard
                </PangeaButton>
              </Stack>
            </Box>
          </PermissionsWrapper>
        );
      default:
        return <PangeaLoading loadingPhrase={'Loading...'} />;
    }
  };

  return isLoggedIn ? (
    <>
      <Head>
        <title>Pangea Prime - Hedge Maintenance</title>
      </Head>
      <FeatureFlag name={['hedges']} fallback={<>Feature unavailable</>}>
        {useDraftingChangesBorder ? (
          <PageFrame borderLabel='Drafting Changes' padding='72px 0'>
            <MainContent />
          </PageFrame>
        ) : (
          <MainContent />
        )}
      </FeatureFlag>
    </>
  ) : (
    <RedirectSpinner />
  );
};
export default ManagePage;
