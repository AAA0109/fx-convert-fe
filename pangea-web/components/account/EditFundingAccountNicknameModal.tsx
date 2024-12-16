import Close from '@mui/icons-material/Close';
import {
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  FormHelperText,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { clientApiState, pangeaAlertNotificationMessageState } from 'atoms';
import axios, { AxiosError } from 'axios';
import { useLoading } from 'hooks';
import { PangeaWallet, setAlpha } from 'lib';
import { isError } from 'lodash';
import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaButton } from '../shared';

const CustomDialog = styled(Dialog)(() => ({
  '.MuiPaper-root': {
    bgcolor: PangeaColors.StoryWhiteMedium,
  },
  '& .MuiDialog-paper': {
    width: '440px',
    maxWidth: '100%',
    backgroundColor: PangeaColors.StoryWhiteMedium,
  },
}));

export const EditFundingAccountNicknameModal = ({
  open,
  setOpen,
  account,
  refetchData,
  closeAllModals,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  account: PangeaWallet;
  refetchData: () => void;
  closeAllModals: () => void;
}) => {
  const authHelper = useRecoilValue(clientApiState);
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const { loadingState, loadingPromise } = useLoading();
  const [modalData, setModalData] = useState({
    nickname: '',
    buttonDisabled: true,
    isNicknameInUse: false,
  });

  const [renamingAccount, setRenamingAccount] = useState(false);

  const handleUserInviteCreate = async () => {
    const sendRequest = async () => {
      setRenamingAccount(true);
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.updateWalletAsync(account.wallet_id, {
          nickname: modalData.nickname,
        });
        if (res && !isError(res)) {
          setPangeaAlertNotificationMessage({
            severity: 'success',
            text: 'Account Renamed',
          });
          setModalData({
            nickname: '',
            buttonDisabled: true,
            isNicknameInUse: false,
          });
          setOpen(false);
          refetchData();
          closeAllModals();
        } else if (axios.isAxiosError(res)) {
          const axiosError = res as AxiosError<any>;
          const resText = JSON.parse(
            axiosError?.response?.request?.responseText,
          );
          switch (true) {
            case Object.hasOwn(resText, 'detail'):
              if (resText.detail.includes('Active User')) {
                setModalData({
                  nickname: '',
                  buttonDisabled: true,
                  isNicknameInUse: true,
                });
              } else {
                setPangeaAlertNotificationMessage({
                  severity: 'error',
                  text: resText.detail,
                });
                setModalData({
                  nickname: '',
                  buttonDisabled: true,
                  isNicknameInUse: false,
                });
              }
              break;
            case Object.hasOwn(resText, 'email'):
              setPangeaAlertNotificationMessage({
                severity: 'error',
                text: resText.email,
              });
              setModalData({
                nickname: '',
                buttonDisabled: true,
                isNicknameInUse: false,
              });
              break;
          }
        }
      } catch {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'There was an error sending invite email.',
        });
        setModalData({
          nickname: '',
          buttonDisabled: true,
          isNicknameInUse: false,
        });
      } finally {
        setRenamingAccount(false);
      }
    };
    await loadingPromise(sendRequest());
  };

  return (
    <CustomDialog onClose={() => setOpen(false)} open={open}>
      <Stack direction={'column'} style={{ padding: '16px 24px 16px' }}>
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
              marginBottom: '24px',
            }}
          >
            <Typography variant='h5' component={'h2'}>
              Rename Account
            </Typography>
            <IconButton aria-label='close' onClick={() => setOpen(false)}>
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
        <Stack spacing={2}>
          <Typography variant='dataBody'>
            {account.bank_name} - {account.currency} (...
            {account.account_number?.slice(-4)})
          </Typography>
          <TextField
            label='Nickname'
            variant='filled'
            style={{ marginTop: '16px' }}
            error={modalData.isNicknameInUse}
            onChange={(e: any) => {
              e.preventDefault();
              setModalData({
                ...modalData,
                nickname: e.target.value,
                buttonDisabled: false,
              });
            }}
          />
          {modalData.isNicknameInUse ? (
            <FormHelperText sx={{ color: PangeaColors.RiskBerryMedium }}>
              Name already exists. Please provide another name.
            </FormHelperText>
          ) : null}

          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            style={{ marginTop: '16px', padding: '8px' }}
          >
            <PangeaButton variant={'outlined'} onClick={() => setOpen(false)}>
              Close
            </PangeaButton>
            <PangeaButton
              loading={loadingState.isLoading}
              onClick={handleUserInviteCreate}
              disabled={
                modalData.buttonDisabled ||
                renamingAccount ||
                modalData.nickname.length === 0
              }
            >
              {!renamingAccount ? 'Save' : 'Saving ...'}
            </PangeaButton>
          </Stack>
        </Stack>
      </Stack>
    </CustomDialog>
  );
};
export default EditFundingAccountNicknameModal;
