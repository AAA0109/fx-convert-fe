import { CheckCircleOutlineOutlined } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogActions,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import {
  clientApiState,
  pangeaAlertNotificationMessageState,
  pangeaTwoFactorAuthBackupCodes,
  pangeaTwoFactorAuthSecret,
  userTwoFactorAuthMethods,
} from 'atoms';
import { PangeaButton } from 'components/shared';
import { PangeaMFAMethodDetailsResponse } from 'lib';
import { isError } from 'lodash';
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

interface AddGoogleAuthDialogProps {
  stepsLabels: AddGoogleAuthStep[];
  modalStartIcon?: ReactNode;
  modalButtonText?: string;
  authCode: string;
  openByDefault?: boolean;
  open?: boolean;
  setOpen?: void;
  title?: string;
  deactivate?: boolean;
  setAuthCode: Dispatch<SetStateAction<string>>;
  onClose?:
    | ((
        event: React.MouseEvent<HTMLButtonElement>,
        reason: 'backdropClick' | 'escapeKeyDown' | 'closeIconClick',
      ) => void)
    | undefined;
}

interface AddGoogleAuthStep {
  label: string;
  component: React.ReactNode;
}

export const AddGoogleAuthDialog = (props: AddGoogleAuthDialogProps) => {
  const {
    stepsLabels,
    modalStartIcon,
    modalButtonText,
    authCode,
    title,
    deactivate,
    setAuthCode,
    onClose = (e, reason) => {
      e.preventDefault();
      if (reason && reason == 'backdropClick') {
        return;
      } else {
        setOpen(false);
      }
    },
  } = props;
  const [processing, setProcessing] = useState(false);
  const authHelper = useRecoilValue(clientApiState);
  const api = authHelper.getAuthenticatedApiHelper();
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const setPangeaTwoFactorAuthBackupCodes = useSetRecoilState(
    pangeaTwoFactorAuthBackupCodes,
  );

  const setPangeaTwoFactorAuthSecret = useSetRecoilState(
    pangeaTwoFactorAuthSecret,
  );

  const [activeStep, setActiveStep] = useState(0);

  const renderNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const [open, setOpen] = useState(props.openByDefault);

  const handleNext = () => {
    if (getCurrentStep(activeStep).label == 'Verify') {
      handleCodeSubmit(authCode);
    } else if (getCurrentStep(activeStep).label == 'Deactivation') {
      handleCodeDeactivation(authCode);
    } else {
      renderNextStep();
    }
  };

  useEffect(() => {
    setProcessing(false);
  }, [activeStep]);

  const handleCodeDeactivation = async (authCode: string): Promise<void> => {
    setProcessing(true);
    await api
      .authDeactivateCreateAsync('app', {
        code: authCode,
      })
      .then((res) => {
        if (res && isError(res)) {
          setPangeaAlertNotificationMessage({
            text: 'The code you entered is not valid. Please try again.',
            severity: 'error',
            timeout: 5000,
          });
          setProcessing(false);
          setAuthCode('');
        } else {
          setAuthCode('');
          renderNextStep();
          setProcessing(false);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleCodeSubmit = async (authCode: string): Promise<void> => {
    setProcessing(true);
    try {
      const res = await api.activateTwoFactorAuthAsync('app', {
        code: authCode,
      });
      if (res && !isError(res)) {
        setPangeaTwoFactorAuthBackupCodes(res.backup_codes);
        renderNextStep();
        setProcessing(false);
        setAuthCode('');
      } else if (res && isError(res)) {
        setPangeaAlertNotificationMessage({
          text: 'The code you entered is not valid. Please try again.',
          severity: 'error',
          timeout: 5000,
        });
        setAuthCode('');
        setProcessing(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getCurrentStep = (index: number) => {
    return stepsLabels[index];
  };

  const getTwoFactorAuthSecret = async () => {
    try {
      api
        .setTwoFactorAuthAsync('app', {})
        .then((res) => {
          setPangeaTwoFactorAuthSecret(
            (res as PangeaMFAMethodDetailsResponse).details,
          );
        })
        .catch(() => {
          setPangeaAlertNotificationMessage({
            text: 'At this moment we are unable to set up two step verification',
            severity: 'error',
          });
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  const setUserTwoFactorAuthMethods = useSetRecoilState(
    userTwoFactorAuthMethods,
  );

  const closeTwoFactorAuthDialog = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    onClose?.(event, 'closeIconClick');
    setAuthCode('');
    api.getUserAuthActiveMethodsAsync().then((res) => {
      if (res && !isError(res)) {
        setUserTwoFactorAuthMethods(res);
      } else if (res && isError(res)) {
        setUserTwoFactorAuthMethods([]);
      }
    });
  };

  const toggleModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveStep(0);
    event.preventDefault();
    if (modalButtonText == 'set up') {
      getTwoFactorAuthSecret();
    }
    setOpen((o) => !o);
  };

  return (
    <>
      <PangeaButton
        onClick={toggleModal}
        startIcon={modalStartIcon}
        sx={{
          minWidth: '20px',
          '& .MuiButton-startIcon': {
            margin: '0px 0px 0px 0px',
          },
        }}
        variant='text'
      >
        {modalButtonText}
      </PangeaButton>
      <Dialog
        open={open ?? false}
        onClose={onClose}
        sx={{
          '& .MuiDialog-paper': {
            width: '760px',
            position: 'relative',
            maxWidth: '100%',
            minHeight: '600px',
            borderRadius: '4px',
            margin: '0px',
            padding: '36px',
            backgroundColor: `{PangeaColors.StoryWhiteLighter}`,
          },
        }}
      >
        <Typography component='h2' variant='h4' marginBottom={3}>
          {title}
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {stepsLabels.map((label) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              return (
                <Step key={label.label} {...stepProps}>
                  <StepLabel {...labelProps}>{label.label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === stepsLabels.length ? (
            <React.Fragment>
              <Stack
                direction='column'
                justifyContent='center'
                alignItems='center'
                spacing={4}
                style={{ padding: '40px 24px 16px' }}
                height={400}
              >
                <Typography component='h2' variant='h4' marginBottom={3}>
                  Verified
                </Typography>
                <CheckCircleOutlineOutlined
                  color='success'
                  sx={{ fontSize: '120px' }}
                />
                {!deactivate ? (
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    From now on you&apos;ll use Google Authenticator to sign
                    into Pangea.
                  </Typography>
                ) : (
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    You&apos;ve successfully deactivated two-step verification.
                  </Typography>
                )}
              </Stack>
            </React.Fragment>
          ) : (
            <Stack>
              {stepsLabels[activeStep] != undefined ? (
                <>
                  {stepsLabels[activeStep].component}
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <PangeaButton
                      disabled={
                        activeStep != 0 &&
                        stepsLabels[activeStep].label != 'Verify'
                      }
                      onClick={(e) => {
                        onClose?.(e, 'closeIconClick');
                      }}
                      sx={{ mr: 1 }}
                      variant='outlined'
                      fullWidth={true}
                      size='large'
                    >
                      Cancel
                    </PangeaButton>
                    <PangeaButton
                      onClick={handleNext}
                      disabled={
                        getCurrentStep(activeStep).label == 'Verify' &&
                        authCode.length < 6
                      }
                      variant='contained'
                      fullWidth={true}
                      size='large'
                      loading={processing}
                    >
                      {activeStep === stepsLabels.length - 1 ? 'Done' : 'Next'}
                    </PangeaButton>
                  </Box>
                </>
              ) : null}
            </Stack>
          )}
        </Box>
        {activeStep === stepsLabels.length && (
          <DialogActions sx={{ justifyContent: 'center' }}>
            <PangeaButton
              onClick={(event) => {
                closeTwoFactorAuthDialog(event);
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

export default AddGoogleAuthDialog;
