import Add from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import {
  Button,
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
import { CustomerGroup, PangeaGroupEnum, setAlpha } from 'lib';
import { isError } from 'lodash';
import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import isEmail from 'validator/lib/isEmail';
import { PangeaButton, PangeaPermissionSelector } from '../shared';

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

export const AccountInviteUserModal = ({ asLink }: { asLink?: boolean }) => {
  const authHelper = useRecoilValue(clientApiState);
  const [userPermission, setUserPermission] = useState<CustomerGroup>();
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const { loadingState, loadingPromise } = useLoading();
  const [modalData, setModalData] = useState({
    email: '',
    isValidEmail: false,
    isOpen: false,
    buttonDisabled: true,
    isEmailBeingUsed: false,
  });

  const [sendingInvite, setSendingInvite] = useState(false);

  const toggleModalOpen = () => {
    setModalData({
      ...modalData,
      isOpen: !modalData.isOpen.valueOf(),
    });
  };

  const checkValidation = (inString: string) => {
    // a callback as a second argument to the setState
    // from https://stackoverflow.com/questions/38488930/one-state-lagging-behind-after-setstate
    if (isEmail(inString)) {
      setModalData({
        ...modalData,
        email: inString,
        isValidEmail: true,
        buttonDisabled: false,
      });
    } else {
      setModalData({
        ...modalData,
        email: inString,
        isValidEmail: false,
        buttonDisabled: true,
      });
    }
  };

  const handleUserInviteCreate = async () => {
    const sendRequest = async () => {
      setSendingInvite(true);
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.inviteUsersAsync(
          modalData.email,
          userPermission as PangeaGroupEnum,
        );
        if (res && !isError(res)) {
          // set the successState to true
          setPangeaAlertNotificationMessage({
            severity: 'success',
            text: 'The invite has been sent',
          });
          setModalData({
            email: '',
            isValidEmail: false,
            isOpen: false,
            buttonDisabled: true,
            isEmailBeingUsed: false,
          });
        } else if (axios.isAxiosError(res)) {
          // if anything comes back with an error, store it in the errorMessageState
          const axiosError = res as AxiosError<any>;
          const resText = JSON.parse(
            axiosError?.response?.request?.responseText,
          );
          switch (true) {
            case Object.hasOwn(resText, 'detail'):
              if (resText.detail.includes('Active User')) {
                setModalData({
                  email: '',
                  isValidEmail: false,
                  isOpen: true,
                  buttonDisabled: true,
                  isEmailBeingUsed: true,
                });
              } else {
                setPangeaAlertNotificationMessage({
                  severity: 'error',
                  text: resText.detail,
                });
                setModalData({
                  email: '',
                  isValidEmail: false,
                  isOpen: false,
                  buttonDisabled: true,
                  isEmailBeingUsed: false,
                });
              }
              break;
            case Object.hasOwn(resText, 'email'):
              setPangeaAlertNotificationMessage({
                severity: 'error',
                text: resText.email,
              });
              setModalData({
                email: '',
                isValidEmail: false,
                isOpen: true,
                buttonDisabled: true,
                isEmailBeingUsed: false,
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
          email: '',
          isValidEmail: false,
          isOpen: false,
          buttonDisabled: true,
          isEmailBeingUsed: false,
        });
      } finally {
        setSendingInvite(false);
      }
    };
    await loadingPromise(sendRequest());
  };

  return (
    <>
      <Button
        sx={
          asLink
            ? {
                backgroundColor: 'transparent',
                boxShadow: 'none',
                ':hover': {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }
            : {}
        }
        startIcon={<Add color={asLink ? 'info' : 'inherit'} />}
        size={'medium'}
        onClick={toggleModalOpen}
      >
        <Typography
          sx={{
            fontFamily: 'SuisseIntlCond',
            fontSize: 16,
            fontWeight: 500,
            justifyContent: 'center',
          }}
          variant='body1'
          color={asLink ? PangeaColors.EarthBlueMedium : 'inherit'}
        >
          Invite User
        </Typography>
      </Button>
      <CustomDialog onClose={toggleModalOpen} open={modalData.isOpen}>
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
              {/* TODO: Assess and address our approach to purposeful Semantic HTML tags and styling */}
              <Typography variant='h5' component={'h2'}>
                Invite User
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
          <Stack spacing={2}>
            <Typography variant='body1'>
              Invite a user to create a profile in Pangea.
            </Typography>
            <TextField
              // TODO: Revisit the email string. It won't validate.
              label='Email'
              variant='filled'
              style={{ marginTop: '16px' }}
              error={!modalData.isValidEmail || modalData.isEmailBeingUsed}
              onChange={(e: any) => {
                e.preventDefault();
                checkValidation(e.target.value);
              }}
            />
            {modalData.isEmailBeingUsed ? (
              <FormHelperText sx={{ color: PangeaColors.RiskBerryMedium }}>
                A user with this email address already exists.
              </FormHelperText>
            ) : null}

            <PangeaPermissionSelector
              value={userPermission}
              onChange={setUserPermission}
            />
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              style={{ marginTop: '16px', padding: '8px' }}
            >
              <PangeaButton variant={'outlined'} onClick={toggleModalOpen}>
                Close
              </PangeaButton>
              <PangeaButton
                loading={loadingState.isLoading}
                onClick={handleUserInviteCreate}
                disabled={modalData.buttonDisabled || sendingInvite}
              >
                {!sendingInvite ? 'Send Invite' : 'Sending ...'}
              </PangeaButton>
            </Stack>
          </Stack>
        </Stack>
      </CustomDialog>
    </>
  );
};
export default AccountInviteUserModal;
