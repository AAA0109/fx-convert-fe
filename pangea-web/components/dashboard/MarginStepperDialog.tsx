import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { dialogQuickTipsMarginState } from 'atoms';
import { setAlpha } from 'lib';
import Image from 'next/image';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import { ScoreChip } from './ScoreChip';

export const MarginStepperDialog = () => {
  const [dialogQuickTipsMargin, setDialogQuickTipsMargin] = useRecoilState(
    dialogQuickTipsMarginState,
  );

  const handleClose = () => {
    setDialogQuickTipsMargin({
      ...dialogQuickTipsMargin,
      open: false,
    });
  };

  const handleNext = () => {
    setDialogQuickTipsMargin({
      open: true,
      step: (dialogQuickTipsMargin.step ?? 0) + 1,
    });
  };

  const handleBack = () => {
    setDialogQuickTipsMargin({
      open: true,
      step: (dialogQuickTipsMargin.step ?? 1) - 1,
    });
  };

  const dialogContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Stack direction='row' justifyContent='space-between' mb={4}>
              <Typography variant='h4'>
                Quick Tips: Margin health score
              </Typography>
              <IconButton
                aria-label='close'
                onClick={handleClose}
                style={{
                  color: setAlpha(PangeaColors.Black, 0.54),
                }}
              >
                <CloseIcon
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                />
              </IconButton>
            </Stack>
            <Typography variant='h5'>
              What is my margin health score?
            </Typography>
            <Divider />
            <Typography variant='body1' mt={2}>
              Your margin health score is based on two factors:
            </Typography>
            <Typography variant='body1' component={'ol'} mt={2}>
              <li>Your current margin balance</li>
              <li>The total margin required to hedge your active cashflows</li>
            </Typography>
            <Typography variant='h5' mt={5}>
              Health score key
            </Typography>
            <Divider />
            <Stack
              direction='row'
              justifyContent='flex-start'
              spacing={6}
              mt={2}
            >
              <Stack>
                <Typography variant='body2'>Liquidation</Typography>
                <ScoreChip
                  bgcolor={PangeaColors.RiskBerryMedium}
                  score={'0-20'}
                />
              </Stack>
              <Stack>
                <Typography variant='body2'>Deposit Required</Typography>
                <ScoreChip
                  bgcolor={PangeaColors.CautionYellowMedium}
                  score={'21-50'}
                />
              </Stack>
              <Stack>
                <Typography variant='body2'>Within Buffer</Typography>
                <ScoreChip
                  bgcolor={PangeaColors.SecurityGreenMedium}
                  score={'51-100'}
                />
              </Stack>
              <Stack>
                <Typography variant='body2'>Excess</Typography>
                <ScoreChip
                  bgcolor={PangeaColors.VisionCyanLight}
                  score={'100+'}
                />
              </Stack>
            </Stack>
            <Typography variant='h5' mt={5}>
              How is this forecast?
            </Typography>
            <Divider />
            <Typography variant='body1' mt={2}>
              We forecast your health score based on your current margin balance
              and the future total margin required.
            </Typography>
            <Stack direction='row' justifyContent='flex-end' mt={9}>
              <Button
                size='large'
                color={'primary'}
                endIcon={<ArrowForward />}
                variant='contained'
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
                onClick={handleNext}
              >
                What is a margin forecast?
              </Button>
            </Stack>
          </>
        );
      case 1:
        return (
          <>
            <Stack direction='row' justifyContent='space-between' mb={4}>
              <Typography variant='h4'>Quick Tips: margin forecast</Typography>
              <IconButton
                aria-label='close'
                onClick={handleClose}
                style={{
                  color: setAlpha(PangeaColors.Black, 0.54),
                }}
              >
                <CloseIcon
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                />
              </IconButton>{' '}
            </Stack>
            <Typography variant='h5'>What does this look like?</Typography>
            <Divider />
            <Stack
              direction={'row'}
              alignItems={'center'}
              component='p'
              mt={2}
              mb={2}
            >
              <Typography marginRight={'16px'} variant='body1'>
                Here, the solid line{' '}
              </Typography>
              <Image
                src={'/images/solid_line.svg'}
                height={20}
                width={32}
                alt={'icon'}
              />
              <Typography marginLeft={'16px'} variant='body1'>
                represents your forecast health score.
              </Typography>
            </Stack>
            <Stack direction={'row'} alignItems={'center'}>
              <Image
                src={'/images/margin_explainer1.svg'}
                width={564}
                height={233}
                alt='margin forecast'
              />
            </Stack>

            <Typography variant='body1' mt={2}>
              It increases or decreases across time because cash flow
              adjustments either require more margin, or free margin up.
            </Typography>
            <Stack direction='row' justifyContent='space-between' mt={8}>
              <Button
                onClick={handleBack}
                size='large'
                color={'primary'}
                startIcon={<ArrowBack />}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '14px',
                }}
              >
                what is a Margin health score?
              </Button>
              <Button
                size='large'
                color={'primary'}
                endIcon={<ArrowForward />}
                variant='contained'
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
                onClick={handleNext}
              >
                What are deposit previews?
              </Button>
            </Stack>
          </>
        );
      case 2:
        return (
          <>
            <Stack direction='row' justifyContent='space-between' mb={4}>
              <Typography variant='h4'>Quick Tips: deposit previews</Typography>
              <IconButton
                aria-label='close'
                onClick={handleClose}
                style={{
                  color: setAlpha(PangeaColors.Black, 0.54),
                }}
              >
                <CloseIcon
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                />
              </IconButton>
            </Stack>
            <Typography variant='h5'>About deposit previews</Typography>
            <Divider />
            <Stack
              direction={'row'}
              alignItems={'center'}
              component='p'
              mt={2}
              mb={2}
            >
              <Typography marginRight={'16px'} variant='body1'>
                Lastly, the dotted line
              </Typography>
              <Image
                src={'/images/dotted_line.svg'}
                height={20}
                width={32}
                alt={'icon'}
              />
              <Typography marginLeft={'16px'} variant='body1'>
                represents your forecast health score
              </Typography>
            </Stack>
            <Stack direction={'row'} alignItems={'center'}>
              <Image
                src={'/images/margin_explainer2.svg'}
                width={564}
                height={233}
                alt='margin forecast'
              />
            </Stack>

            <Typography variant='h5' mt={2}>
              What is a recommended deposit?
            </Typography>
            <Divider />
            <Typography variant='body1' mt={2} mb={1}>
              This is the deposit required to boost your lowest health score in
              the next 30 days to healthy levels.
            </Typography>
            <Stack direction='row' justifyContent='space-between' mt={3}>
              <Button
                size='large'
                color={'primary'}
                startIcon={<ArrowBack />}
                onClick={handleBack}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',

                  fontSize: '14px',
                }}
              >
                What is a margin forecast?
              </Button>
              <Button
                size='large'
                color={'primary'}
                variant='contained'
                onClick={handleClose}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '16px',
                }}
              >
                Got it!
              </Button>
            </Stack>
          </>
        );
    }
  };

  return (
    <>
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            width: '645px',
            height: '550px',
            maxWidth: '80%',
            padding: '40px',
            backgroundColor: '#F8F9F3',
          },
        }}
        onClose={handleClose}
        open={dialogQuickTipsMargin.open}
      >
        {dialogContent(dialogQuickTipsMargin.step ?? 0)}
      </Dialog>
    </>
  );
};

export const MarginStepperDialogOpener = ({
  type = 'icon',
  step = 0,
}: {
  type?: 'icon' | 'link';
  step?: number;
}) => {
  const setDialogQuickTipsMargin = useSetRecoilState(
    dialogQuickTipsMarginState,
  );
  const handleClickOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setDialogQuickTipsMargin({
      open: true,
      step: step,
    });
  };

  switch (type) {
    case 'icon':
      return (
        <IconButton
          aria-label='open'
          onClick={handleClickOpen}
          style={{ color: PangeaColors.EarthBlueMedium }}
        >
          <InfoOutlined fontSize={'large'} transform={'translate(0 1)'} />
        </IconButton>
      );
    case 'link':
      return (
        <>
          <Typography
            marginTop={2}
            variant='body2'
            color={PangeaColors.BlackSemiTransparent60}
          >
            * Deposit and withdraw preview amounts help ensure healthy margin
            for the next 30 days.
          </Typography>
          <Typography
            variant='body2'
            component={'a'}
            onClick={handleClickOpen}
            href='#'
          >
            Learn more
          </Typography>
        </>
      );
  }
};
export default MarginStepperDialog;
