import Close from '@mui/icons-material/Close';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import {
  Button,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import styled from '@mui/system/styled';
import { AccountContact, setAlpha } from 'lib';
import { useState } from 'react';
import { PangeaColors } from 'styles';
import { AccountUserDetails } from '.';

export function AccountUserDetailsModal(contact: AccountContact) {
  const CustomDialog = styled(Dialog)(() => ({
    '.MuiPaper-root': {
      backgroundColor: PangeaColors.StoryWhiteMedium,
      padding: '1.5rem',
    },
    '& .MuiDialog-paper': {
      width: '440px',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
  }));

  const [modalData, setModalData] = useState({
    isOpen: false,
    buttonDisabled: true,
  });

  const toggleModalOpen = () => {
    setModalData({
      ...modalData,
      isOpen: !modalData.isOpen.valueOf(),
    });
  };

  return (
    <>
      <Button
        size='medium'
        style={{ width: '24px', height: '24px' }}
        onClick={toggleModalOpen}
      >
        <Stack direction={'row'} style={{ alignItems: 'center' }}>
          <MoreHoriz />
        </Stack>
      </Button>
      <CustomDialog onClose={toggleModalOpen} open={modalData.isOpen}>
        <Stack direction={'column'}>
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
              }}
            >
              <Typography variant='h5' component={'h2'}>
                User Details
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
          <AccountUserDetails
            contact={contact}
            onCloseModal={toggleModalOpen}
          />
        </Stack>
      </CustomDialog>
    </>
  );
}
export default AccountUserDetailsModal;
