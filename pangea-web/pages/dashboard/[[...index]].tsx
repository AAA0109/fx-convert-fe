import { Grid } from '@mui/material';
import { userState } from 'atoms';
import { CashflowsTab, TransactionsTab } from 'components/dashboard';
import WalletsTab from 'components/dashboard/WalletsTab';
import { RedirectSpinner, TabbedPage } from 'components/shared';
import {
  useAuthHelper,
  useFeatureFlags,
  useUserGroupsAndPermissions,
} from 'hooks';
import type { NextPage } from 'next';
import { ReactNode, memo, useMemo } from 'react';
import { useRecoilValueLoadable } from 'recoil';

const Grid12 = memo(function Grid12({ children }: { children?: ReactNode[] }) {
  return (
    <Grid spacing={3} container justifyContent='space-between'>
      <Grid item xl={12}>
        {children}
      </Grid>
    </Grid>
  );
});

const Dashboard: NextPage = () => {
  const { isLoggedIn } = useAuthHelper();
  const { isFeatureEnabled } = useFeatureFlags();
  const isHedgesEnabled = isFeatureEnabled('hedges');
  const isWalletsEnabled = isFeatureEnabled('wallets');
  const isPaymentsv2Enabled = isFeatureEnabled('transactions');
  const { isAdmin, isManager, isCreator, isViewer } =
    useUserGroupsAndPermissions();

  const userLoadable = useRecoilValueLoadable(userState);
  const isLoadingUserData = userLoadable.state === 'loading';
  const hasUserData = userLoadable.state === 'hasValue';
  const hasIbkrSettings =
    !isLoadingUserData && hasUserData
      ? userLoadable.getValue()?.company?.settings.ibkr.spot
      : false;
  const hasCorpaySettings =
    !isLoadingUserData && hasUserData
      ? userLoadable.getValue()?.company?.settings.corpay.wallet
      : false;
  const hasCorpayForwardsSettings =
    !isLoadingUserData && hasUserData
      ? userLoadable.getValue()?.company?.settings.corpay.forwards
      : false;
  const canCreateHedge = useMemo(
    () =>
      (isAdmin || isManager || isCreator) &&
      (hasIbkrSettings || hasCorpayForwardsSettings),
    [isAdmin, isManager, isCreator, hasIbkrSettings, hasCorpayForwardsSettings],
  );
  const tabs = useMemo(
    () => [
      // NOTE: We will be adding the commented tabs back in the future
      //  {
      //   label: 'Performance',
      //   dataRoute: 'performance',
      //   component: DashboardPerformanceTab,
      // },
      ...((canCreateHedge || isViewer) && isHedgesEnabled
        ? [
            {
              label: 'Hedges',
              dataRoute: 'cashflows',
              component: CashflowsTab,
              testId: 'cashFlowsTab',
            },
          ]
        : []),
      ...((hasCorpaySettings || hasCorpayForwardsSettings) && isWalletsEnabled
        ? [
            {
              label: 'Wallets',
              dataRoute: 'wallets',
              component: WalletsTab,
              testId: 'walletsTab',
            },
          ]
        : []),
      // ...(canCreateHedge && hasIbkrSettings && shouldShowZeroGravity
      //   ? [
      //       {
      //         label: 'Margin',
      //         dataRoute: 'margin',
      //         component: DashboardMarginTab,
      //         testId: 'marginTab',
      //       },
      //     ]
      //   : []),
      ...(isPaymentsv2Enabled
        ? [
            {
              label: 'Transactions',
              dataRoute: 'transactions',
              component: TransactionsTab,
            },
          ]
        : []),
    ],
    [
      canCreateHedge,
      hasCorpayForwardsSettings,
      hasCorpaySettings,
      isHedgesEnabled,
      isPaymentsv2Enabled,
      isViewer,
      isWalletsEnabled,
    ],
  );

  if (!isLoggedIn) {
    return <RedirectSpinner />;
  }
  const defaultPageRoute = isWalletsEnabled
    ? '/dashboard/'
    : '/dashboard/transactions/';
  return (
    <TabbedPage
      pageRoute={defaultPageRoute}
      pageTitle='Dashboard'
      tabs={tabs}
      container={Grid12}
    />
  );
};

export default Dashboard;
