import { css } from '@emotion/css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import { userState } from 'atoms';
import { LinkTab } from 'components/shared';
import { useAuthHelper, useFeatureFlags } from 'hooks';
import { UserState } from 'lib';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { customThemeData, PangeaColors } from 'styles';
const AUTOMATED_ONBOARDING_FF_NAME = 'automated-onboarding';
const coreStyles: React.CSSProperties = {
  color: PangeaColors.SolidSlateMedium,
  fontFamily: 'SuisseIntlCond',
  fontWeight: 500,
  letterSpacing: '0.46px',
  lineHeight: '26px',
  fontSize: '16px',
  fontStyle: 'normal',
  textTransform: 'uppercase',
  margin: '12px 16px',
  paddingTop: '8px',
  paddingBottom: '8px',
  paddingLeft: '16px',
  paddingRight: '16px',
  minHeight: '34px',
};
const navLinkStyle = css({
  ...coreStyles,
  '&.Mui-selected': {
    color: PangeaColors.SolidSlateMedium,
  },
});

export const PangeaAppBar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showDashboardTab, setShowDashboardTab] = useState(true);
  const [showAccountTab, setShowAccountTab] = useState(true);
  const authHelper = useAuthHelper();
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
  const logoUrl =
    hasCorpaySettings && !hasIbkrSettings ? '/dashboard/wallets' : '/';
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldShowOnboarding = isFeatureEnabled(AUTOMATED_ONBOARDING_FF_NAME);
  useEffect(() => {
    setLoggedIn(authHelper.isLoggedIn);
    const userNotFullyActivated = [
      UserState.NeedPhone,
      undefined,
      UserState.NoAccount,
      UserState.NotActive,
      UserState.NeedCompany,
    ].includes(authHelper.userStatus?.state);
    setShowAccountTab(authHelper.isLoggedIn && !userNotFullyActivated);
    setShowDashboardTab(
      authHelper.isLoggedIn && !!authHelper.canTrade && !userNotFullyActivated,
    );
  }, [authHelper, setLoggedIn]);

  return (
    <AppBar
      position='sticky'
      aria-roledescription='Top navigation bar'
      sx={{ minWidth: customThemeData.columnWidths.desktop, boxShadow: 'none' }}
    >
      <Container maxWidth={false} disableGutters sx={{ height: '64px' }}>
        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              paddingLeft: '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
            }}
          >
            <Link href={logoUrl} as={logoUrl} prefetch={false}>
              <Image
                src={'/images/pangea-logo.svg'}
                width={131}
                height={32}
                alt='Pangea logo'
                priority
              />
            </Link>
          </Box>
          <Box sx={{ display: 'inline-flex', paddingRight: '24px' }}>
            <Tabs
              TabIndicatorProps={{ style: { display: 'none' } }}
              value={
                loggedIn
                  ? showDashboardTab
                    ? 'dashboard'
                    : 'logout'
                  : 'signin'
              }
            >
              {!loggedIn && shouldShowOnboarding ? (
                <LinkTab
                  value='createaccount'
                  label='Create Account'
                  className={navLinkStyle}
                  to='/activation/create-account'
                />
              ) : null}
              {!loggedIn ? (
                <LinkTab
                  label='Sign In'
                  className={navLinkStyle}
                  to='/login'
                  value='signin'
                />
              ) : null}
              {showDashboardTab ? (
                <LinkTab
                  label='Dashboard'
                  className={navLinkStyle}
                  to='/dashboard'
                  value='dashboard'
                  data-testid='dashboardLinkButton'
                />
              ) : null}
              {showAccountTab ? (
                <LinkTab
                  label='Account'
                  className={navLinkStyle}
                  to='/account'
                  value='account'
                />
              ) : null}
              {loggedIn ? (
                <LinkTab
                  label='Sign Out'
                  className={navLinkStyle}
                  to='/api/logout'
                  value='logout'
                  data-testid='signOutButton'
                />
              ) : null}
            </Tabs>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default PangeaAppBar;
