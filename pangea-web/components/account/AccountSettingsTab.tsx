import LocationCityIcon from '@mui/icons-material/LocationCity';
import PaymentsIcon from '@mui/icons-material/Payments';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';

import { Box, Stack, Typography } from '@mui/material';
import { ActionContainer } from 'components/shared';
import { IAccountPageListItem } from 'lib';
import { useMemo } from 'react';
import AccountChangePassword from './AccountChangePassword';
import { AccountTab } from './AccountTab';
import AccountTwoStepVerification from './AccountTwoStepVerification';
import { AccountYourProfileManagement } from './AccountYourProfileManagement';
import { BeneficiariesManagement } from './BeneficiariesManagement';
import FundingAccountManagement from './FundingAccountManagement';
import WalletsManagement from './WalletsManagement';
import { PangeaColors } from 'styles';
import { AccountCompanyDetailsSimple } from './AccountCompanyDetailsSimple';
import { UserManagement } from './UserManagement';
import AccountInviteUserModal from './AccountInviteUserModal';
type Props = { selectedTab?: string };

export function AccountSettingsTab({ selectedTab }: Props) {
  const listItems: IAccountPageListItem[] = useMemo(
    () => [
      {
        text: 'Your Profile',
        icon: <PersonIcon />,
        urlPathPart: 'profile',
      },
      {
        text: 'Your Company',
        icon: <LocationCityIcon />,
        urlPathPart: 'your_company',
      },
      {
        text: 'User Management',
        icon: <PeopleIcon />,
        urlPathPart: 'user_management',
      },
      {
        text: 'Payment Hub',
        icon: <PaymentsIcon />,
        urlPathPart: 'payment_hub',
      },
    ],
    [],
  );

  return (
    <AccountTab
      defaultIndex={Math.max(
        0,
        listItems.findIndex((t) => t.urlPathPart === selectedTab),
      )}
      pathPart='settings'
      mainChildren={[
        <>
          <Box
            bgcolor={PangeaColors.White}
            border={PangeaColors.Gray}
            padding={'24px'}
            width={564}
            marginBottom={'20px'}
          >
            <ActionContainer title='Your Profile'>
              <AccountYourProfileManagement />
            </ActionContainer>
          </Box>
          <Box
            bgcolor={PangeaColors.White}
            border={PangeaColors.Gray}
            padding={'24px'}
            width={564}
          >
            <ActionContainer title='Password and security'>
              <AccountChangePassword />
              <AccountTwoStepVerification />
            </ActionContainer>
          </Box>
        </>,

        <>
          <Box
            bgcolor={PangeaColors.White}
            border={PangeaColors.Gray}
            padding={'24px'}
            width={564}
            marginBottom={'20px'}
          >
            <ActionContainer>
              <AccountCompanyDetailsSimple />
            </ActionContainer>
          </Box>
        </>,

        <>
          <Box
            bgcolor={PangeaColors.White}
            border={PangeaColors.Gray}
            padding={'24px'}
            width={564}
            marginBottom={'20px'}
          >
            <ActionContainer tableChild>
              <Stack
                direction={'row'}
                spacing={2}
                justifyContent='space-between'
              >
                <Typography variant='h5'>User Management</Typography>
                <AccountInviteUserModal asLink />
              </Stack>
              <UserManagement />
            </ActionContainer>
          </Box>
        </>,

        <>
          <ActionContainer>
            <Box
              bgcolor={PangeaColors.White}
              border={PangeaColors.Gray}
              padding={'24px'}
              width={564}
              marginBottom={'20px'}
            >
              <ActionContainer tableChild>
                <BeneficiariesManagement />
              </ActionContainer>
            </Box>
            <Box
              bgcolor={PangeaColors.White}
              border={PangeaColors.Gray}
              padding={'24px'}
              width={564}
              marginBottom={'20px'}
            >
              <ActionContainer tableChild>
                <FundingAccountManagement />
              </ActionContainer>
            </Box>
            <Box
              bgcolor={PangeaColors.White}
              border={PangeaColors.Gray}
              padding={'24px'}
              width={564}
              marginBottom={'20px'}
            >
              <ActionContainer tableChild>
                <WalletsManagement />
              </ActionContainer>
            </Box>
          </ActionContainer>
        </>,
      ]}
      listItems={listItems}
    />
  );
}
export default AccountSettingsTab;
