import { useState, useEffect } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  MenuItemProps,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import KabobIcon from '@mui/icons-material/MoreHoriz';
import { styled } from '@mui/material/styles';
import { clientApiState, pangeaAlertNotificationMessageState } from 'atoms';
import { useLoading } from 'hooks';
import { PangeaBeneficiaryStatusEnum, PangeaWallet } from 'lib';
import { isError } from 'lodash';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import Dialog from '@mui/material/Dialog';
import { PangeaButton } from 'components/shared';
import EditFundingAccountNicknameModal from './EditFundingAccountNicknameModal';

const StyledMenuItem = styled(MenuItem)<MenuItemProps>({
  textTransform: 'none',
  '& svg': {
    paddingRight: '1rem',
  },
});

const FundingAccountManagementActions = ({
  account,
  refetchData,
}: {
  account: PangeaWallet;
  status?: PangeaBeneficiaryStatusEnum;
  refetchData: () => void;
}) => {
  const CustomDialog = styled(Dialog)(() => ({
    '.MuiPaper-root': {
      backgroundColor: PangeaColors.StoryWhiteMedium,
      padding: '1.5rem',
    },
    '& .MuiDialog-paper': {
      width: isMakeDefaultModalOpen ? '360px' : '440px',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewAccountDetailsModalOpen, setIsViewAccountDetailsModalOpen] =
    useState(false);
  const [isEditAccountNicknameModalOpen, setIsEditAccountNicknameModalOpen] =
    useState(false);
  const [isMakeDefaultModalOpen, setIsMakeDefaultModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [makingDefault, setMakingDefault] = useState(false);

  const authHelper = useRecoilValue(clientApiState);

  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const { loadingState, loadingPromise } = useLoading();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeAllModals = () => {
    setIsViewAccountDetailsModalOpen(false);
    setIsEditAccountNicknameModalOpen(false);
    setIsMakeDefaultModalOpen(false);
    setIsModalOpen(false);
  };

  const handleOpenUserDetails = () => {
    setIsModalOpen(true);
    handleClose();
    setIsViewAccountDetailsModalOpen(true);
  };

  const handleOpenEditAccountNickname = () => {
    setIsModalOpen(false);
    handleClose();
    setIsEditAccountNicknameModalOpen(true);
  };

  const handleOpenMakeDefault = () => {
    setIsModalOpen(true);
    handleClose();
    setIsMakeDefaultModalOpen(true);
  };

  useEffect(() => {
    if (!isModalOpen) closeAllModals();
  }, [isModalOpen]);

  const handleMakeDefault = async () => {
    const sendRequest = async () => {
      setMakingDefault(true);

      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.updateWalletAsync(account.wallet_id, {
          default: true,
        });

        if (res && !isError(res)) {
          setPangeaAlertNotificationMessage({
            severity: 'success',
            text: 'Default funding account updated',
          });
          refetchData();
          setIsModalOpen(false);
          closeAllModals();
        }
      } catch {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error making default funding account.',
        });
      } finally {
        setMakingDefault(false);
      }
    };

    await loadingPromise(sendRequest());
  };

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
          View Account Details
        </StyledMenuItem>
        <StyledMenuItem
          disabled={false}
          onClick={handleOpenEditAccountNickname}
        >
          Edit Account Nickname
        </StyledMenuItem>
        <StyledMenuItem disabled={false} onClick={handleOpenMakeDefault}>
          Make Default
        </StyledMenuItem>
      </Menu>

      <EditFundingAccountNicknameModal
        open={isEditAccountNicknameModalOpen}
        setOpen={setIsEditAccountNicknameModalOpen}
        account={account}
        refetchData={refetchData}
        closeAllModals={closeAllModals}
      />

      <CustomDialog onClose={toggleModalOpen} open={isModalOpen}>
        <Stack direction={'column'} gap={1}>
          {isViewAccountDetailsModalOpen && (
            <>
              <Typography typography={'h5'}>Account Details</Typography>

              <Stack width={'100%'}>
                <Stack mt={'16px'} spacing={3}>
                  <Stack spacing={0.5}>
                    <Typography variant='body1'>Bank</Typography>
                    <Typography variant='body2'>{account.bank_name}</Typography>
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography variant='body1'>Account Currency</Typography>
                    <Typography variant='body2'>{account.currency}</Typography>
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography variant='body1'>
                      Last 4 of Account Number
                    </Typography>
                    <Typography variant='body2'>
                      ...{account.account_number?.slice(-4)}
                    </Typography>
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography variant='body1'>Associated Broker</Typography>
                    <Typography variant='body2'>
                      {account.broker.name}
                    </Typography>
                  </Stack>

                  <Button
                    variant='outlined'
                    fullWidth
                    size='large'
                    onClick={closeAllModals}
                  >
                    Close
                  </Button>
                </Stack>
              </Stack>
            </>
          )}

          {isMakeDefaultModalOpen && (
            <Stack gap={4}>
              <Typography typography={'h5'}>MAKE DEFAULT</Typography>

              <Typography>
                Are you sure you want to make this funding account your default
                for booking transactions?
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
                <PangeaButton
                  disabled={makingDefault || loadingState.isLoading}
                  onClick={handleMakeDefault}
                >
                  YES, MAKE DEFAULT
                </PangeaButton>
              </Stack>
            </Stack>
          )}
        </Stack>
      </CustomDialog>
    </>
  );
};

export default FundingAccountManagementActions;
