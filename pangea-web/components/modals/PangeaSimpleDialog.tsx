import CloseIcon from '@mui/icons-material/Close';
import { DialogActions, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import { openSimpleDialogState } from 'atoms';
import { ReactNode, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { PangeaButton } from '../shared';

interface PangeaSimpleDialogProps {
  title?: string;
  modalButtonText?: string;
  modalStartIcon?: ReactNode;
  children?: any;
  width?: string;
  variant?: 'text' | 'outlined' | 'contained';
  dialogOpenButtonWidth?: string;
  margin?: string;
  customClose?: boolean;
  minHeight?: string;
  noButton?: boolean;
  noCloseButton?: boolean;
  openByDefault?: boolean;
  openModal?: boolean;
  footerCloseButton?: boolean;
  onClose?:
    | ((
        event: any,
        reason: 'backdropClick' | 'escapeKeyDown' | 'closeIconClick',
      ) => void)
    | undefined;
}

export const PangeaSimpleDialog = (props: PangeaSimpleDialogProps) => {
  const {
    children,
    title,
    modalButtonText,
    modalStartIcon = '',
    width = '500px',
    variant = 'text',
    dialogOpenButtonWidth = '20px',
    margin = '0px 0px 0px 0px',
    minHeight = '298px',
    noButton,
    noCloseButton = false,
    openModal = false,
    footerCloseButton = false,
    onClose = () => {
      setOpen(false);
    },
  } = props;
  const [open, setOpen] = useState(props.openByDefault);
  const setOpenSimpleDialogState = useSetRecoilState(openSimpleDialogState);

  const toggleModal = () => {
    setOpen((o) => !o);
  };

  useEffect(() => {
    setOpen(openModal);
  }, [openModal, setOpen]);

  return (
    <>
      {!noButton && (
        <PangeaButton
          onClick={toggleModal}
          startIcon={modalStartIcon}
          sx={{
            minWidth: dialogOpenButtonWidth,
            '& .MuiButton-startIcon': {
              margin: margin,
            },
          }}
          variant={variant}
        >
          {modalButtonText}
        </PangeaButton>
      )}
      <Dialog
        open={open ?? false}
        onClose={onClose || toggleModal}
        sx={{
          '& .MuiDialog-paper': {
            width: { width },
            position: 'relative',
            maxWidth: '100%',
            minHeight: { minHeight },
            borderRadius: '4px',
            margin: '0px',
            padding: '36px',
            backgroundColor: `{PangeaColors.StoryWhiteLighter}`,
          },
        }}
      >
        {title && (
          <Typography component='h2' variant='h4' marginBottom={3}>
            {props.title}
          </Typography>
        )}

        {children}

        {!noCloseButton && (
          <IconButton
            sx={{ position: 'absolute', right: '15px', top: '20px' }}
            aria-label='close'
            onClick={(event) => {
              onClose?.(event, 'closeIconClick');
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        {footerCloseButton && (
          <DialogActions>
            <PangeaButton
              onClick={(event) => {
                setOpenSimpleDialogState(false);
                onClose?.(event, 'closeIconClick');
              }}
            >
              Done
            </PangeaButton>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};
export default PangeaSimpleDialog;
