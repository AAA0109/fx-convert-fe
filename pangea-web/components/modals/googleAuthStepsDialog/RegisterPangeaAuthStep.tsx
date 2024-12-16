import { Box, Skeleton, Stack, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { pangeaTwoFactorAuthSecret } from 'atoms';
import QrCode from 'components/shared/QrCode';
import { formatAuthKey } from 'lib';
import { useRecoilValue } from 'recoil';

export const RegisterPangeaAuthStep = () => {
  const authSecret = useRecoilValue(pangeaTwoFactorAuthSecret) || '';

  return (
    <Box>
      <Stack
        direction={'column'}
        style={{ padding: '40px 24px 16px' }}
        justifyContent='center'
        alignItems='center'
        spacing={3}
      >
        <Typography
          sx={{
            textAlign: 'center',
          }}
        >
          Download and open the Google Authenticator app (
          <Link
            href='https://apps.apple.com/us/app/google-authenticator/id388497605'
            target='_blank'
          >
            App Store
          </Link>{' '}
          &{' '}
          <Link
            href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&gl=US'
            target='_blank'
          >
            Google Play
          </Link>
          ). In the app, select “Add code” or the “+” icon then scan this QR
          code:
        </Typography>
        {authSecret != '' ? (
          <QrCode url={authSecret} />
        ) : (
          <Skeleton height={250} width={250}></Skeleton>
        )}
        <Typography variant='body1'>
          Or enter the following 2FA key manually:
        </Typography>
        {authSecret != '' ? (
          <Typography component='h2' variant='h4'>
            {formatAuthKey(authSecret)}
          </Typography>
        ) : (
          <Skeleton height={32} width={550}></Skeleton>
        )}
        <Typography variant='body1'>
          Once Pangea is registered, you’ll start seeing 6-digit verification
          codes in the app.
        </Typography>
      </Stack>
    </Box>
  );
};

export default RegisterPangeaAuthStep;
