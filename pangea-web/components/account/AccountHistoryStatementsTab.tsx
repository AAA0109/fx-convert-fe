import ListIcon from '@mui/icons-material/List';
import { ActionContainer } from 'components/shared';
import { IAccountPageListItem } from 'lib';
import { AccountTab } from './AccountTab';
import { DataGridAccountActivity } from './DataGridAccountActivity';
import { DataGridBankingHistory } from './DataGridBankingHistory';
import DataGridFeesAndPayments from './DataGridFeesAndPayments';

import { DataGridUnderlyingTrades } from './DataGridUnderlyingTrades';

export const AccountHistoryStatementsTab = ({
  selectedTab,
}: {
  selectedTab?: string;
}) => {
  const listItems: IAccountPageListItem[] = [
    {
      text: 'Account Activity',
      icon: <ListIcon />,
      urlPathPart: 'activity',
    },
    {
      text: 'Fees and Payments',
      icon: <ListIcon />,
      urlPathPart: 'fees',
    },
    {
      text: 'Banking History',
      icon: <ListIcon />,
      urlPathPart: 'bank-history',
    },
    {
      text: 'Underlying Trades',
      icon: <ListIcon />,
      urlPathPart: 'trades',
    },
  ];
  return (
    <AccountTab
      defaultIndex={Math.max(
        0,
        listItems.findIndex((t) => t.urlPathPart === selectedTab),
      )}
      pathPart='history'
      mainChildren={[
        <ActionContainer title='Account Activity' key={0}>
          <DataGridAccountActivity />
        </ActionContainer>,
        <ActionContainer title='Fees and Payments' key={1}>
          <DataGridFeesAndPayments />
        </ActionContainer>,
        <ActionContainer title='Banking History' key={2}>
          <DataGridBankingHistory />
        </ActionContainer>,
        <ActionContainer title='Underlying Trades' key={3}>
          <DataGridUnderlyingTrades />
        </ActionContainer>,
      ]}
      listItems={listItems}
    />
  );
};
export default AccountHistoryStatementsTab;
