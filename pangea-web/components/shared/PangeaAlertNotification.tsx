import { Alert, Slide, SlideProps, Snackbar } from '@mui/material';
import { pangeaAlertNotificationMessageState } from 'atoms';
import { SyntheticEvent } from 'react';
import { useRecoilState } from 'recoil';

export const PangeaAlertNotification = () => {
  const [pangeaAlertNotificationMessage, setPangeaAlertNotificationMessage] =
    useRecoilState(pangeaAlertNotificationMessageState);

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setPangeaAlertNotificationMessage(null);
  };

  const autoHideDuration: Nullable<number> =
    pangeaAlertNotificationMessage?.timeout &&
    (pangeaAlertNotificationMessage?.timeout ?? 0) > 0
      ? pangeaAlertNotificationMessage.timeout
      : pangeaAlertNotificationMessage?.severity === 'error'
      ? null
      : 10000;

  type TransitionProps = Omit<SlideProps, 'direction'>;

  const transition = (props: TransitionProps) => {
    return <Slide {...props} direction='left' />;
  };
  return (
    <>
      {pangeaAlertNotificationMessage && (
        <Snackbar
          TransitionComponent={transition}
          open={!!pangeaAlertNotificationMessage}
          onClose={handleClose}
          autoHideDuration={autoHideDuration}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleClose}
            variant='filled'
            elevation={6}
            sx={{ width: '100%' }}
            severity={pangeaAlertNotificationMessage.severity}
            color={pangeaAlertNotificationMessage.color}
            icon={pangeaAlertNotificationMessage.icon}
          >
            {pangeaAlertNotificationMessage.text}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
export default PangeaAlertNotification;
