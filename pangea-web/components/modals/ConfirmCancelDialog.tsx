import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  AlertColor,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import { ResponsiveStyleValue, SystemStyleObject } from '@mui/system';
import useEventCallback from '@mui/utils/useEventCallback';
import type { Property } from 'csstype';
import { formatString } from 'lib';
import { ChangeEvent, isValidElement, useState } from 'react';
import { PangeaColors } from 'styles';
import { PangeaButton } from '../shared';
interface ConfirmCancelDialogConfirmationProps {
  keyword: string;
  prompt?: string;
  buttonText?: string;
}
interface ConfirmCancelDialogAlertProps {
  color: AlertColor;
  text: string;
}
interface ConfirmCancelDialogProps {
  title: string;
  description?: string | JSX.Element;
  confirmation?: ConfirmCancelDialogConfirmationProps;
  alert?: ConfirmCancelDialogAlertProps;
  cancelButtonText?: string;
  onClick?(): void;
  onCancel?(): void;
  onClose?(): void;
  confirmButtonProps?: ButtonProps;
  confirmButtonColorOverride?:
    | SystemStyleObject<Theme>
    | ResponsiveStyleValue<
        Optional<Property.BackgroundColor | Property.BackgroundColor[]>
      >;
  cancelButtonProps?: ButtonProps;
  open: boolean;
  confirmButtonText?: string;
  stackButtons?: boolean;
  preventBackdropClose?: boolean;
  dialogWidth?: string;
}

export const ConfirmCancelDialog = (props: ConfirmCancelDialogProps) => {
  const [confirmButtonActive, setConfirmButtonActive] = useState(
    !props.confirmation,
  );

  const setButtonActiveState = (inputString: string) => {
    setConfirmButtonActive(
      !props.confirmation ||
        inputString.toLowerCase() === props.confirmation.keyword.toLowerCase()
        ? true
        : false,
    );
  };
  const validateConfirmButtonActive = useEventCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setButtonActiveState(event.target.value);
    },
  );

  const handleConfirm = useEventCallback(() => {
    if (props.onClick) {
      props.onClick();
    }
  });
  const handleDialogClose = useEventCallback((_event, reason) => {
    setButtonActiveState('');
    if (
      props.preventBackdropClose &&
      (reason === 'backdropClick' || reason === 'escapeKeyDown')
    ) {
      return;
    }
    if (props.onCancel) {
      props.onCancel();
    }
  });
  const handleClose = useEventCallback(() => {
    setButtonActiveState('');
    if (props.onCancel) {
      props.onCancel();
    }
  });

  const ActionButtons = () => {
    return (
      <>
        <Button
          variant='text'
          onClick={handleClose}
          {...props.cancelButtonProps}
        >
          {props.cancelButtonText ?? 'Back'}
        </Button>
        <PangeaButton
          fullWidth={props.stackButtons}
          onClick={handleConfirm}
          variant='contained'
          disabled={!confirmButtonActive}
          {...props.confirmButtonProps}
        >
          {props.confirmation?.buttonText ??
            props.confirmButtonText ??
            'Confirm'}
        </PangeaButton>
      </>
    );
  };
  return (
    <Dialog
      sx={{
        '& .MuiDialog-paper': {
          width: props.dialogWidth ?? '368px',
          maxWidth: '80%',
          padding: '1.75rem 1.5rem',
          backgroundColor: PangeaColors.StoryWhiteMedium,
          boxSizing: 'border-box',
        },
      }}
      open={props.open}
      onClose={handleDialogClose}
    >
      <DialogTitle variant='h5' sx={{ padding: 0, marginBottom: '0.5rem' }}>
        {props.title}
        <IconButton
          aria-label='close'
          onClick={props.onClose ? props.onClose : handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: 0 }}>
        <Stack my={2} spacing={2}>
          {props.description &&
            (isValidElement(props.description) ? (
              <>{props.description}</>
            ) : (
              <Typography variant='body1'>{props.description}</Typography>
            ))}
          <Divider sx={{ borderColor: PangeaColors.Gray, marginTop: '2rem' }} />
          {props.confirmation && (
            <>
              <Typography mt={4} variant='body1'>
                {props.confirmation.prompt &&
                  formatString(
                    props.confirmation.prompt,
                    props.confirmation.keyword,
                  )}
              </Typography>

              <TextField
                label='Confirmation'
                variant='outlined'
                onChange={validateConfirmButtonActive}
                sx={{
                  '& label.MuiInputLabel-shrink': {
                    transform: 'translate(.875rem, -.5rem) scale(0.75)',
                  },
                }}
              />
            </>
          )}

          {props.alert && (
            <Alert severity={props.alert.color || 'info'} variant='filled'>
              {props.alert.text}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'flex-end',
          padding: 0,
        }}
      >
        {props.stackButtons && (
          <Stack direction='column' spacing={2} width={'100%'}>
            <ActionButtons />
          </Stack>
        )}
        {!props.stackButtons && <ActionButtons />}
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmCancelDialog;
