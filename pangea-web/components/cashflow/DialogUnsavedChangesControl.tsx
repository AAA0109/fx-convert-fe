import { Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { PangeaColors } from 'styles';

export interface DialogUnsavedChangesControlProps {
  handleSaveDraft: () => void;
  handleClose: (event: any, reason: any) => void;
  handleDeleteDraft: () => void;
  isNewDraft: boolean;
}

export const DialogUnsavedChangesControl = (
  props: DialogUnsavedChangesControlProps,
) => {
  const { handleSaveDraft, handleClose, isNewDraft, handleDeleteDraft } = props;

  return (
    <>
      <DialogContent
        sx={{
          padding: '0px',
        }}
      >
        <Typography color={PangeaColors.Black} variant='body1'>
          {isNewDraft
            ? 'Would you like to save this cashflow draft or discard it?'
            : ' Would you like to save the changes you’ve made on this cash flow draft?'}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'right',
        }}
      >
        <Stack
          direction='row'
          justifyContent='right'
          width={'100%'}
          spacing={1}
        >
          <Button
            variant='text'
            size='large'
            sx={{ height: '42px' }}
            onClick={(e) => {
              handleClose(e, 'backdropClick');
            }}
            autoFocus
          >
            Cancel
          </Button>
          <Button
            variant='outlined'
            size='large'
            sx={{ height: '42px' }}
            onClick={() =>
              isNewDraft ? handleDeleteDraft() : handleSaveDraft()
            }
            autoFocus
          >
            Discard
          </Button>

          <Button
            variant='contained'
            color='primary'
            size='large'
            sx={{ height: '42px' }}
            onClick={handleSaveDraft}
            autoFocus
          >
            Save draft
          </Button>
        </Stack>
      </DialogActions>
    </>
  );
};
export default DialogUnsavedChangesControl;
