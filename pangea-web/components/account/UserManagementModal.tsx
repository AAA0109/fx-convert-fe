import KabobIcon from '@mui/icons-material/MoreHoriz';
import Close from '@mui/icons-material/Close';
import {
  accountContactsState,
  clientApiState,
  pangeaAlertNotificationMessageState,
  userCompanyState,
} from 'atoms';
import {
  DialogTitle,
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuItemProps,
  Stack,
  Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import styled from '@mui/system/styled';
import { AccountContact, CustomerGroup, PangeaGroupEnum, setAlpha } from 'lib';
import { useEffect, useState } from 'react';
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilRefresher_UNSTABLE,
} from 'recoil';
import { PangeaColors } from 'styles';
import { AccountUserDetails } from '.';
import { apiHelper } from '../../lib/apiHelpers';
import { isError } from 'lodash';
import { AxiosError, isAxiosError } from 'axios';
import { useLoading } from 'hooks';

import { PangeaButton, PangeaPermissionSelector } from 'components/shared';

export function UserManagementModal(contact: AccountContact) {
  const CustomDialog = styled(Dialog)(() => ({
    '.MuiPaper-root': {
      backgroundColor: PangeaColors.StoryWhiteMedium,
      padding: '1.5rem',
    },
    '& .MuiDialog-paper': {
      width: isRemoveUserModalOpen ? '350px' : '440px',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountUserDetailsOpen, setIsAccountUserDetailsOpen] =
    useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const authHelper = useRecoilValue(clientApiState);
  const { loadingState, loadingPromise } = useLoading();
  const userCo = useRecoilValue(userCompanyState);
  const resetAccountContacts = useRecoilRefresher_UNSTABLE(
    accountContactsState(userCo?.id),
  );

  const open = Boolean(anchorEl);

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

  const StyledMenuItem = styled(MenuItem)<MenuItemProps>({
    textTransform: 'none',
    '& svg': {
      paddingRight: '1rem',
    },
  });

  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeAllModals = () => {
    setIsAccountUserDetailsOpen(false);
    setIsRoleModalOpen(false);
    setIsRemoveUserModalOpen(false);
    setIsModalOpen(false);
  };

  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );

  const sendResetPassword = async () => {
    try {
      await apiHelper().forgotPasswordAsync(contact.email);

      setPangeaAlertNotificationMessage({
        severity: 'success',
        text: `Email sent to ${contact.email.split('@', 1)[0]}****@${
          contact.email.split('@')[1]
        }`,
        timeout: 5000,
      });
    } catch (error) {
      setPangeaAlertNotificationMessage({
        severity: 'error',
        text: 'Error sending email',
        timeout: 5000,
      });
    }

    handleClose();
  };
  const handleUpdateUserPermission = async () => {
    const sendRequest = async () => {
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.updateUserPermissionsAsync(contact.id, {
          group: userPermission,
        });
        if (res && !isError(res)) {
          setPangeaAlertNotificationMessage({
            severity: 'success',
            text: 'Role updated',
          });
          setIsModalOpen(false);
          handleClose();
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

  const handleRemoveUserCompany = async () => {
    const sendRequest = async () => {
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.removeUserCompanyAsync(contact.id);
        if (res && !isError(res)) {
          setPangeaAlertNotificationMessage({
            severity: 'success',
            text: 'User Removed',
          });
          setIsModalOpen(false);
          handleClose();
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
          text: 'There was an error removing user.',
        });
      }
    };
    await loadingPromise(sendRequest());
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenUserDetails = () => {
    setIsModalOpen(true);
    handleClose();
    setIsAccountUserDetailsOpen(true);
  };

  const handleOpenRoleModal = () => {
    setIsModalOpen(true);
    handleClose();
    setIsRoleModalOpen(true);
  };

  const handleOpenRemoveUserModal = () => {
    setIsModalOpen(true);
    setIsRemoveUserModalOpen(true);
    handleClose();
  };

  useEffect(() => {
    if (!isModalOpen) closeAllModals();
  }, [isModalOpen]);

  return (
    <>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <KabobIcon />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <StyledMenuItem disabled={false} onClick={handleOpenUserDetails}>
          View User Details
        </StyledMenuItem>
        <StyledMenuItem disabled={false} onClick={sendResetPassword}>
          Send Password Reset
        </StyledMenuItem>
        <StyledMenuItem disabled={false} onClick={handleOpenRoleModal}>
          Assign Role
        </StyledMenuItem>
        <StyledMenuItem disabled={false} onClick={handleOpenRemoveUserModal}>
          Remove User
        </StyledMenuItem>
      </Menu>

      <CustomDialog onClose={toggleModalOpen} open={isModalOpen}>
        <Stack direction={'column'} gap={1}>
          {isAccountUserDetailsOpen && (
            <>
              <Typography typography={'h5'}>USER DETAILS</Typography>

              <AccountUserDetails
                contact={contact}
                editable={false}
                onCloseModal={closeAllModals}
              />
            </>
          )}

          {isRoleModalOpen && (
            <>
              <DialogTitle
                style={{
                  padding: '0px',
                }}
              >
                <Stack
                  direction={'row'}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <Typography variant='h5' component={'h2'}>
                    Assign Role
                  </Typography>
                  <IconButton aria-label='close' onClick={toggleModalOpen}>
                    <Close
                      style={{
                        width: '24px',
                        height: '24px',
                        color: setAlpha(PangeaColors.Black, 0.54),
                      }}
                    />
                  </IconButton>
                </Stack>
              </DialogTitle>
              <PangeaPermissionSelector
                value={userPermission}
                onChange={setUserPermission}
              />
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  marginTop: 1,
                  width: '100%',
                }}
              >
                <Button variant='outlined' fullWidth onClick={closeAllModals}>
                  CLOSE
                </Button>
                <PangeaButton
                  loading={loadingState.isLoading}
                  onClick={handleUpdateUserPermission}
                >
                  SAVE
                </PangeaButton>
              </Stack>
            </>
          )}

          {isRemoveUserModalOpen && (
            <Stack gap={4}>
              <Typography typography={'h5'}>REMOVE USER</Typography>

              <Typography>
                Are you sure you want to remove your user? This action is
                permanent and cannot be undone.
              </Typography>

              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  gap: 1,
                  width: '100%',
                }}
              >
                <Button variant='text' onClick={closeAllModals}>
                  CANCEL
                </Button>
                <PangeaButton onClick={handleRemoveUserCompany} color='error'>
                  YES, REMOVE USER
                </PangeaButton>
              </Stack>
            </Stack>
          )}
        </Stack>
      </CustomDialog>
    </>
  );
}

export default UserManagementModal;
