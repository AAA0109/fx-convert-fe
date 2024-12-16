import { Button, Stack, Typography } from '@mui/material';
import {
  accountContactsState,
  clientApiState,
  pangeaAlertNotificationMessageState,
  userCompanyState,
} from 'atoms';
import { AxiosError, isAxiosError } from 'axios';
import {
  PangeaButton,
  PangeaPermissionSelector,
  RoleBasedAccessCheck,
} from 'components/shared';
import { useLoading, useUserGroupsAndPermissions } from 'hooks';
import { AccountContact, CustomerGroup, GROUPS_LABEL_MAP } from 'lib';
import { PangeaGroupEnum } from 'lib/api/v2/data-contracts';
import { isError } from 'lodash';
import { useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
type Props = {
  contact: AccountContact;
  editable?: boolean;
  onCloseModal: () => void;
};

export const AccountUserDetails = ({
  contact,
  editable = true,
  onCloseModal,
}: Props) => {
  const { userGroups } = useUserGroupsAndPermissions();

  const userCo = useRecoilValue(userCompanyState);
  const resetAccountContacts = useRecoilRefresher_UNSTABLE(
    accountContactsState(userCo?.id),
  );
  const [userPermission, setUserPermission] = useState<CustomerGroup>(() => {
    if (contact.groups && contact.groups.length) {
      if (
        contact.groups[0].name !== PangeaGroupEnum.AdminCustomerSuccess &&
        contact.groups[0].name !== PangeaGroupEnum.AdminReadOnly
      ) {
        return contact.groups[0].name;
      } else {
        return PangeaGroupEnum.CustomerViewer;
      }
    } else {
      return PangeaGroupEnum.CustomerViewer;
    }
  });

  const authHelper = useRecoilValue(clientApiState);
  const { loadingState, loadingPromise } = useLoading();
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const handleUpdateUser = async () => {
    const sendRequest = async () => {
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.updateUserPermissionsAsync(contact.id, {
          group: userPermission,
        });
        if (res && !isError(res)) {
          setPangeaAlertNotificationMessage({
            severity: 'success',
            text: 'User permissions have been updated.',
          });
          onCloseModal();
          resetAccountContacts();
        } else if (isAxiosError(res)) {
          const axiosError = res as AxiosError<any>;
          const resText = JSON.parse(
            axiosError?.response?.request?.responseText,
          );
          setPangeaAlertNotificationMessage({
            severity: 'error',
            text: resText.detail,
          });
        }
      } catch {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error updating user permissions.',
        });
      }
    };
    await loadingPromise(sendRequest());
  };

  return (
    <Stack width={'100%'}>
      <Stack mt={'16px'} spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant='body1'>Name </Typography>
          <Typography variant='body2'>{contact.name}</Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant='body1'>Phone Number </Typography>
          <Typography variant='body2'>{contact.phone}</Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant='body1'>Email </Typography>
          <Typography variant='body2'>{contact.email}</Typography>
        </Stack>
        <Stack spacing={0.5}>
          <RoleBasedAccessCheck
            userGroups={userGroups}
            allowedGroups={[PangeaGroupEnum.CustomerAdmin]}
            fallbackComponent={
              <Stack>
                <Typography variant='body1'>Role </Typography>
                <Typography variant='body2'>
                  {contact.groups
                    .map(
                      (userGroup) =>
                        GROUPS_LABEL_MAP[userGroup.name as CustomerGroup],
                    )
                    .join(', ')}
                </Typography>
              </Stack>
            }
          >
            {editable ? (
              <PangeaPermissionSelector
                value={userPermission}
                onChange={setUserPermission}
              />
            ) : (
              <>
                <Typography variant='body1'>Role </Typography>
                <Typography variant='body2'>
                  {contact.groups.map(
                    (userGroup) =>
                      GROUPS_LABEL_MAP[userGroup.name as CustomerGroup],
                  )}
                </Typography>
              </>
            )}
          </RoleBasedAccessCheck>
        </Stack>

        <Button
          variant='outlined'
          fullWidth
          size='large'
          onClick={onCloseModal}
          disabled={loadingState.isLoading}
        >
          Close
        </Button>

        {editable && (
          <RoleBasedAccessCheck
            userGroups={userGroups}
            allowedGroups={[PangeaGroupEnum.CustomerAdmin]}
          >
            <PangeaButton
              size={'large'}
              loading={loadingState.isLoading}
              disabled={loadingState.isLoading}
              onClick={handleUpdateUser}
              fullWidth
            >
              Save
            </PangeaButton>
          </RoleBasedAccessCheck>
        )}
      </Stack>
    </Stack>
  );
};

export default AccountUserDetails;
