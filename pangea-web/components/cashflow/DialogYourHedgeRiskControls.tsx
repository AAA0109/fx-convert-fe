import ArrowForward from '@mui/icons-material/ArrowForward';
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  dialogDontShowState,
  dialogYourHedgeRiskControlsStatusState,
} from 'atoms';
import Image from 'next/image';
import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';

export const DialogYourHedgeRiskControls = () => {
  const [open, setOpen] = useRecoilState(
    dialogYourHedgeRiskControlsStatusState,
  );

  const [dontShow, setDontShow] = useState(false);

  const setDontShowAnymore = useSetRecoilState(
    dialogDontShowState('your-hedge-risk-controls'),
  );

  const handleClose = (
    _event: any,
    reason: 'backdropClick' | 'escapeKeyDown',
  ) => {
    if (!reason) setOpen(false);
  };

  const handleClick = () => {
    setDontShowAnymore(dontShow);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      aria-labelledby='alert-dialog-title'
      sx={{
        '& .MuiDialog-paper': {
          width: '781px',
          maxWidth: '80%',
          padding: '40px',
          backgroundColor: PangeaColors.StoryWhiteMedium,
        },
      }}
    >
      <DialogTitle id='alert-dialog-title'>
        <Typography variant='h4' component={'p'}>
          Quick Tips: Risk Controls
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant='heroBody' marginTop={'40px'}>
            Risk Reduction
          </Typography>
          <Divider variant='fullWidth' style={{ marginTop: '2px' }} />
          <Grid container columns={12} spacing={1}>
            <Grid item xl={2}>
              <Image
                alt='Risk Reduction Illustration'
                src='/images/icon-risk-control-illustration.svg'
                width={96}
                height={96}
              />
            </Grid>
            <Grid item xl={10}>
              <Stack spacing={1}>
                <Typography variant='body1'>
                  Decreases your value at risk by hedging a percentage of your
                  exposure.
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    backgroundColor: PangeaColors.VisionCyanLighter,
                    padding: '8px 12px',
                    fontSize: '14px',
                    lineHeight: '18px',
                  }}
                >
                  For example, a 50% risk reduction applied to a $1,000,000
                  transaction will hedge $500,000 against volatility. In this
                  hedge, a market movement of -7% (-$70,000 unhedged) would
                  result in only a -3.5% (-$35,000) net loss.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
        {/* <Stack spacing={1}>
          <Typography variant='heroBody' marginTop={'40px'}>
            Hard Limits
          </Typography>
          <Divider variant='fullWidth' style={{ marginTop: '2px' }} />
          <Grid container columns={12} spacing={1}>
            <Grid item xl={2}>
              <Image
                alt='Risk Reduction Illustration'
                src='/images/icon-trending-down.svg'
                width={96}
                height={96}
              />
            </Grid>
            <Grid item xl={10}>
              <Stack spacing={1}>
                <Typography variant='body1'>
                  Used to set an absolute upper or lower limit on your hedged
                  exposure, similar to a &lsquo;stop-loss&rsquo; in trading.
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    backgroundColor: PangeaColors.CautionYellowLighter,
                    padding: '8px 12px 8px 40px',
                    fontSize: '14px',
                    lineHeight: '18px',
                    border: `2px solid ${PangeaColors.CautionYellowMedium}`,
                    backgroundImage: 'url(/images/icon-warning.svg)',
                    backgroundSize: '22px 19px',
                    backgroundPosition: '8px 11px',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  If the value of your exposure reaches your limits, your hedge
                  will lock in at the level of the limit, excluding potential
                  price recovery from a negative position.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Stack> */}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'space-between',
          marginTop: '40px',
          paddingX: 2,
        }}
      >
        <Stack direction='row' justifyContent='space-between' width={'100%'}>
          <FormControlLabel
            label="Don't show me this again."
            control={
              <Checkbox
                title='Do not show this dialog again'
                onChange={(_ev, checked) => setDontShow(checked)}
                checked={dontShow}
                aria-checked={dontShow}
              />
            }
          />

          <Button
            variant='contained'
            color='secondary'
            endIcon={<ArrowForward />}
            size='large'
            sx={{ height: '42px' }}
            onClick={handleClick}
            autoFocus
          >
            I understand
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
export default DialogYourHedgeRiskControls;
