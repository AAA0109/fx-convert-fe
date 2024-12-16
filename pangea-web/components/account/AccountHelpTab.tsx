import DateRange from '@mui/icons-material/DateRange';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import { IAccountPageListItem } from 'lib';
import { ActionContainer } from '../shared';
import { AccountTab } from './AccountTab';
import { HubSpotRequestCallback } from './HubSpotRequestCallback';
import { HubSpotSendMessage } from './HubSpotSendMessage';

export const AccountHelpTab = ({ selectedTab }: { selectedTab?: string }) => {
  const listItems: IAccountPageListItem[] = [
    {
      text: 'Send a message',
      icon: <QuestionAnswer />,
      urlPathPart: 'sendmessage',
    },
    {
      text: 'Schedule a call',
      icon: <DateRange />,
      urlPathPart: 'schedulecall',
    },
  ];
  return (
    <AccountTab
      defaultIndex={Math.max(
        0,
        listItems.findIndex((t) => t.urlPathPart === selectedTab),
      )}
      pathPart='help'
      mainChildren={[
        <ActionContainer title='Send a message' key={0}>
          <HubSpotSendMessage />
        </ActionContainer>,
        <ActionContainer title='Schedule a call' key={1}>
          <HubSpotRequestCallback />
        </ActionContainer>,
      ]}
      listItems={listItems}
    />
  );
};
export default AccountHelpTab;
