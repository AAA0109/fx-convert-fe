import { Grid, Stack, Typography } from '@mui/material';
import { GreenCircleCheck } from 'components/icons';
import { PangeaActionCard, PangeaButton } from 'components/shared';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PangeaColors } from 'styles';

const PasswordResetSuccess = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Set New Password</title>
      </Head>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        direction='column'
        textAlign='center'
      >
        <PangeaActionCard height='297px' width='416px'>
          <Stack
            margin={4}
            spacing={4}
            direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <GreenCircleCheck />
            <Stack direction='column' spacing={1}>
              <Typography
                variant='h5'
                color={PangeaColors.BlackSemiTransparent87}
              >
                Password reset
              </Typography>
              <Typography
                variant='body1'
                color={PangeaColors.BlackSemiTransparent60}
              >
                Your password has been successfully reset. Click below to log
                in.
              </Typography>
            </Stack>
            <PangeaButton
              fullWidth
              size='large'
              sx={{ borderRadius: '10' }}
              onClick={() => {
                router.push('/login');
              }}
            >
              Login
            </PangeaButton>
          </Stack>
        </PangeaActionCard>
      </Grid>
    </>
  );
};

export default PasswordResetSuccess;
