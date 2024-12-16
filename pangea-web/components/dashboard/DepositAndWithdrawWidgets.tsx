import { ExpandMore } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { wireTransferAPIReceivedDataState } from 'atoms';
import { setAlpha } from 'lib';
import { useCallback, useMemo, useState } from 'react';
import { PangeaColors } from 'styles';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  BoxProps,
  Stack,
} from '@mui/material';
import {
  clientApiState,
  depositRequestDataState,
  pangeaAlertNotificationMessageState,
  userCompanyState,
} from 'atoms';
import axios from 'axios';
import { useLoading } from 'hooks/useLoading';
import { PangeaDepositRequest } from 'lib';
import { isError } from 'lodash';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  DepositInitiated,
  ErrorScreen,
  MarginAmountOptions,
  WireAmountSelection,
  WireInstructions,
  WithdrawMarginInstructions,
} from '../depositAndWithdrawComponents';
import { PangeaButton } from '../shared';

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '.MuiPaper-root': {
    backgroundColor: PangeaColors.StoryWhiteMedium,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    width: '23.875rem',
    maxWidth: '80%',
    padding: '2.5rem 2rem 2rem',
    boxSizing: 'border-box',
  },
  '& .MuiTypography-root.MuiTypography-h6': {
    padding: '0',
  },
  '& .MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium': {
    padding: '0',
  },
}));

const StyledBox = styled(Box)<BoxProps>({
  padding: '0 .75rem',
  border: `1px solid ${PangeaColors.Gray}`,
  borderRadius: '.25rem',
  backgroundColor: PangeaColors.White,
});

type ActiveStepProps = Record<
  ActiveStepEnum,
  {
    title: string;
    renderStep: () => JSX.Element;
  }
>;

type DepositAndWithdrawWidgetsProps = {
  recommendedAmt: number;
  requiredAmt: number;
};

enum ActiveStepEnum {
  WireInstructions,
  WireAmountSelected,
  DepositInitiated,
  ErrorScreen,
  WithdrawMarginInstructions,
}

export function DepositAndWithdrawWidgets({
  recommendedAmt,
  requiredAmt,
}: DepositAndWithdrawWidgetsProps) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<ActiveStepEnum>(
    ActiveStepEnum.WireInstructions,
  );
  const wireTransferAPIReceivedData = useRecoilValue(
    wireTransferAPIReceivedDataState,
  );

  const depositRequestData = useRecoilValue(depositRequestDataState);
  const company = useRecoilValue(userCompanyState);
  const authHelper = useRecoilValue(clientApiState);
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );

  const [depositAccordionExpanded, setDepositAccordionExpanded] =
    useState(true);
  const [withdrawAccordionExpanded, setWithdrawAccordionExpanded] =
    useState(true);

  const { loadingState, loadingPromise } = useLoading();

  const handleNextStep = () => {
    setActiveStep((e) => e + 1);
  };
  const handleBackStep = useCallback(() => {
    if (activeStep === ActiveStepEnum.ErrorScreen) {
      setActiveStep(ActiveStepEnum.WireInstructions);
    } else if (activeStep === ActiveStepEnum.WithdrawMarginInstructions) {
      setOpen(false);
      setActiveStep(ActiveStepEnum.WireInstructions);
    } else {
      setActiveStep((e) => e - 1);
    }
  }, [activeStep]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setActiveStep(ActiveStepEnum.WireInstructions);
  };
  const handleOpenWithdrawalModal = () => {
    setActiveStep(ActiveStepEnum.WithdrawMarginInstructions);
    setOpen(true);
  };

  const confirmWireTransfer = useCallback(async () => {
    const sendTransfer = async () => {
      try {
        const api = authHelper.getAuthenticatedApiHelper();
        const res = await api.createDepositFundsPostAsync({
          ...depositRequestData,
          broker_account_id:
            company?.broker_accounts.find((ba) => ba?.account_type == 2)?.id ??
            -1,
        } as PangeaDepositRequest);
        if (res && !isError(res)) {
          setActiveStep(ActiveStepEnum.DepositInitiated);
          setPangeaAlertNotificationMessage({
            text: 'Your deposit information was submitted successfully',
            severity: 'success',
          });
        }
        if (axios.isAxiosError(res)) {
          setActiveStep(ActiveStepEnum.ErrorScreen);
          setPangeaAlertNotificationMessage({
            text: 'There was an error submitting your information for this deposit',
            severity: 'error',
          });
        }
      } catch {
        setPangeaAlertNotificationMessage({
          text: 'There was an error submitting your information for this deposit',
          severity: 'error',
        });
      }
    };
    await loadingPromise(sendTransfer());
  }, [
    authHelper,
    company?.broker_accounts,
    depositRequestData,
    loadingPromise,
    setPangeaAlertNotificationMessage,
  ]);

  const ACTIVE_STEP_MAP = useMemo<ActiveStepProps>(() => {
    return {
      [ActiveStepEnum.WireInstructions]: {
        title: 'Add Margin',
        renderStep: () => (
          <WireInstructions
            wireInstructions={wireTransferAPIReceivedData}
            handleNextStep={handleNextStep}
          />
        ),
      },
      [ActiveStepEnum.WireAmountSelected]: {
        title: 'Add Margin',
        renderStep: () => (
          <WireAmountSelection
            requiredAmt={requiredAmt}
            recommendedAmt={recommendedAmt}
            confirmWireTransfer={confirmWireTransfer}
            handleBackStep={handleBackStep}
            loading={loadingState.isLoading}
          />
        ),
      },
      [ActiveStepEnum.DepositInitiated]: {
        title: 'Deposit Initiated',
        renderStep: () => (
          <DepositInitiated
            deposit_amount={depositRequestData.amount}
            handleClose={handleClose}
          />
        ),
      },
      [ActiveStepEnum.ErrorScreen]: {
        title: 'Error',
        renderStep: () => <ErrorScreen handleClose={handleClose} />,
      },
      [ActiveStepEnum.WithdrawMarginInstructions]: {
        title: 'Withdraw Margin',
        renderStep: () => (
          <WithdrawMarginInstructions handleBack={handleBackStep} />
        ),
      },
    };
  }, [
    confirmWireTransfer,
    depositRequestData.amount,
    handleBackStep,
    loadingState.isLoading,
    recommendedAmt,
    requiredAmt,
    wireTransferAPIReceivedData,
  ]);
  return (
    <>
      <StyledBox>
        <Accordion
          sx={{ backgroundColor: PangeaColors.White }}
          expanded={depositAccordionExpanded}
          onChange={() => setDepositAccordionExpanded((prev) => !prev)}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls='deposit-content'
            id='deposit-header'
          >
            <Typography>Deposit</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '0 0 1rem 0' }}>
            <Stack>
              <Typography
                variant='caption'
                textTransform='uppercase'
                color={setAlpha(PangeaColors.Black, 0.87)}
              >
                Deposit preview
              </Typography>

              <MarginAmountOptions
                recommendedAmt={recommendedAmt}
                requiredAmt={requiredAmt}
              />
              <PangeaButton
                onClick={handleClickOpen}
                size='large'
                startIcon={<AddIcon />}
              >
                Deposit Margin
              </PangeaButton>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </StyledBox>
      <StyledBox>
        <Accordion
          sx={{ backgroundColor: PangeaColors.White }}
          expanded={withdrawAccordionExpanded}
          onChange={() => setWithdrawAccordionExpanded((prev) => !prev)}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls='withdraw-content'
            id='withdraw-header'
          >
            <Typography>Withdrawal</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '0 0 1rem 0' }}>
            <Stack>
              <PangeaButton onClick={handleOpenWithdrawalModal} size='large'>
                Withdraw Margin
              </PangeaButton>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </StyledBox>

      <CustomDialog onClose={handleClose} open={open}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <Typography variant='h4' component='span'>
            {ACTIVE_STEP_MAP[activeStep].title}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {ACTIVE_STEP_MAP[activeStep].renderStep()}
      </CustomDialog>
    </>
  );
}

export default DepositAndWithdrawWidgets;
