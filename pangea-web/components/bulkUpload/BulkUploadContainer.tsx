import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Info from '@mui/icons-material/Info';
import { Box, Stack, Typography } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { bulkUploadItemsState } from 'atoms';
import { useAuthHelper, useCashflowHelpers } from 'hooks';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaButton } from '../shared';
import { BulkUpload } from './BulkUpload';
import { BulkUploadDialog } from './BulkUploadDialog';

export const BulkUploadContainer = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const userAuthHelper = useAuthHelper();
  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const bulkUploadRows = useRecoilValue(bulkUploadItemsState);
  const { saveBulkUploadHedgeItemsAsync } = useCashflowHelpers();
  const handleContinueClicked = useEventCallback(async () => {
    if (bulkUploadRows.length === 0) {
      return;
    }
    await saveBulkUploadHedgeItemsAsync(bulkUploadRows);
  });
  return (
    <Box
      padding={3}
      sx={{
        backgroundColor: PangeaColors.White,
        border: '1px solid ' + PangeaColors.Gray,
      }}
    >
      <Stack direction='column' spacing={3}>
        <Stack direction='row' justifyContent={'space-between'}>
          <Stack direction='column' spacing={2}>
            <Typography variant='heroBody'>Bulk Upload</Typography>
            <Typography variant='body1'>
              Upload multiple cash flows at once via CSV or manual entry in the
              table below.
            </Typography>
          </Stack>
          <PangeaButton
            variant='text'
            color='info'
            startIcon={<Info />}
            sx={{ height: 36 }}
            onClick={toggleModal}
          >
            Formatting your file
          </PangeaButton>
        </Stack>
        <BulkUpload />
        <Stack direction='row' justifyContent={'right'} spacing={3}>
          <PangeaButton
            href='/cashflow/details'
            startIcon={<ArrowBack />}
            title='Back'
            variant='text'
            sx={{ minWidth: 124, width: 124 }}
            size='large'
          >
            Back
          </PangeaButton>
          <PangeaButton
            href='/cashflow/hedge/'
            variant='contained'
            endIcon={<ArrowForward />}
            sx={{ minWidth: 124, width: 124 }}
            size='large'
            disabled={bulkUploadRows.length === 0 && userAuthHelper.canTrade}
            onClick={handleContinueClicked}
          >
            Continue
          </PangeaButton>
        </Stack>
      </Stack>
      <BulkUploadDialog openModal={openModal} onClose={toggleModal} />
    </Box>
  );
};
export default BulkUploadContainer;
