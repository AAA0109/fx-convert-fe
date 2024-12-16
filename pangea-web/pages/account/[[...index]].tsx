import { isLoggedInState } from 'atoms';
import { AccountHelpTab, AccountSettingsTab } from 'components/account';
import { RedirectSpinner, TabbedPage } from 'components/shared';
import type { NextPage } from 'next';
import { useRecoilValue } from 'recoil';

const Account: NextPage = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  if (!isLoggedIn) {
    return <RedirectSpinner />;
  }
  return (
    <TabbedPage
      pageRoute='/account/'
      pageTitle='Account'
      tabs={[
        {
          label: 'Settings',
          dataRoute: 'settings',
          component: AccountSettingsTab,
          testId: 'settingsTab',
        },
        {
          label: 'Help',
          dataRoute: 'help',
          component: AccountHelpTab,
          testId: 'helpTab',
        },
      ]}
    />
  );
};

export default Account;
