import ArrowBack from '@mui/icons-material/ArrowBack';
import Email from '@mui/icons-material/Email';
import Key from '@mui/icons-material/Key';
import { Grid, Stack, TextField, Typography } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { IconBorder } from 'components/icons';
import { PangeaActionCard, PangeaButton } from 'components/shared';
import { apiHelper, PangeaEmail } from 'lib';
import { isError } from 'lodash';
import Head from 'next/head';
import router from 'next/router';
import { useState } from 'react';
import { PangeaColors } from 'styles';
import isEmail from 'validator/lib/isEmail';
enum DialogState {
  submitEmail = 0,
  checkEmail,
}
const ForgotPassword = () => {
  const [validEmail, setValidEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [currentCard, setCurrentCard] = useState(DialogState.submitEmail);

  const displayActionCard = (id: number): string => {
    return currentCard === id ? '' : 'none';
  };

  const handleUpdateEmail = (e: any) => {
    setErrorMsg(false);
    if (isEmail(e.target.value)) {
      setValidEmail(true);
      setNewEmail(e.target.value);
    } else {
      setValidEmail(false);
    }
  };

  const handleSubmitEmail = useEventCallback(async () => {
    const api = apiHelper();
    api.forgotPasswordAsync(newEmail).then((res: PangeaEmail | Error) => {
      if (!isError(res)) {
        //TODO: We mat consider displaying a spinner as we transition to the next page.
        //TODO: use the router to direct user to the 'check your email for reset instructions' page.
        setCurrentCard(DialogState.checkEmail);
      } else {
        setErrorMsg(true);
      }
    });
  });

  return (
    <>
      <Head>
        <title>Pangea - Forgot Password</title>
      </Head>

      <Grid
        container
        justifyContent='center'
        alignItems='center'
        direction='column'
        textAlign='center'
      >
        <PangeaActionCard
          sx={{ display: displayActionCard(DialogState.submitEmail) }}
        >
          <Stack
            margin={4}
            spacing={4}
            direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <IconBorder>
              <Key sx={{ height: '32px', width: '32px' }} />
            </IconBorder>

            <Stack direction='column' spacing={1}>
              <Typography mt={2} variant='h5'>
                Forgot password?
              </Typography>

              <Typography
                variant='body1'
                color={PangeaColors.BlackSemiTransparent60}
              >
                No worries, we&apos;ll send you reset instructions.
              </Typography>
            </Stack>

            <TextField
              onChange={handleUpdateEmail}
              variant='filled'
              label='Email'
              fullWidth
              helperText={errorMsg ? 'Invalid email' : ''}
              error={errorMsg}
            />

            <PangeaButton
              onClick={handleSubmitEmail}
              fullWidth
              size='large'
              sx={{ borderRadius: '10' }}
              disabled={!validEmail}
            >
              Reset password
            </PangeaButton>

            <PangeaButton
              fullWidth
              color='primary'
              variant='outlined'
              size='large'
              startIcon={<ArrowBack />}
              sx={{ border: 'none', ':hover': { border: 'none' } }}
              onClick={() => {
                router.push('/login');
              }}
            >
              Back to Sign in
            </PangeaButton>
          </Stack>
        </PangeaActionCard>
        <PangeaActionCard
          sx={{ display: displayActionCard(DialogState.checkEmail) }}
        >
          <Stack
            margin={4}
            spacing={4}
            direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <IconBorder>
              <Email sx={{ height: '32px', width: '32px' }} />
            </IconBorder>

            <Stack spacing={1}>
              <Typography variant='h5'>Check Your Email</Typography>

              <Typography color={PangeaColors.BlackSemiTransparent60}>
                We sent a password reset link to
              </Typography>
              <Typography color={PangeaColors.BlackSemiTransparent60}>
                {newEmail}
              </Typography>
            </Stack>
            <Stack direction='column'>
              <Typography>
                Didn&apos;t receive the email? Check your spam or junk mail
                folder or
              </Typography>
              <Stack>
                <PangeaButton
                  fullWidth
                  variant='outlined'
                  size='large'
                  sx={{
                    border: 'none',
                    ':hover': { border: 'none' },
                    color: PangeaColors.EarthBlueMedium,
                  }}
                  onClick={() => setCurrentCard(DialogState.submitEmail)}
                  //TODO: Add a function that resends the email
                >
                  Click here to resend
                </PangeaButton>
              </Stack>
            </Stack>
          </Stack>
        </PangeaActionCard>
      </Grid>
    </>
  );
};

export default ForgotPassword;
