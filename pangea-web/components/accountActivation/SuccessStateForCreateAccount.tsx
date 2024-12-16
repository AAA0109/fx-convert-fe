import EmailIcon from '@mui/icons-material/Email';
import { Box, Grid, Stack, Typography } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { useAuthHelper } from 'hooks/useAuthHelper';
import { debounce } from 'lodash';
import { PangeaColors } from 'styles';
import { IconBorder } from '../icons/IconBorder';
import { PangeaButton } from '../shared';

export const SuccessStateForCreateAccount = (props: { email: string }) => {
  const { email } = props;
  const { anonymousApiHelper } = useAuthHelper();
  const handleResendClick = useEventCallback(
    debounce(async () => {
      await anonymousApiHelper.resendVerifyEmailAsync(email);
    }, 1500),
  );
  return (
    <>
      <Grid container>
        <Grid
          item
          xs={4.5}
          border={`1px solid ${PangeaColors.Gray}`}
          borderRadius='4px'
          sx={{ backgroundColor: PangeaColors.White }}
          justifyContent={'center'}
          mt={6}
          mx={'auto'}
        >
          <Stack alignItems={'center'} spacing={4} py={5} textAlign={'center'}>
            <IconBorder>
              <EmailIcon sx={{ height: '32px', width: '32px' }} />
            </IconBorder>
            <Typography component='h1' variant='h5'>
              First, let&apos;s verify your email
            </Typography>
            <Box>
              <Typography
                variant='body1'
                color={PangeaColors.BlackSemiTransparent60}
              >
                We sent a verification email to:
              </Typography>
              <Typography
                variant='h6'
                textTransform={'lowercase'}
                component={'p'}
                mt={1}
                color={PangeaColors.BlackSemiTransparent60}
              >
                {email}
              </Typography>
            </Box>
            <Stack>
              <Typography
                variant='body1'
                color={PangeaColors.BlackSemiTransparent60}
              >
                Didn&apos;t receive the email? Check your spam or:
              </Typography>
              {/* TODO: This resend button needs to sent another message to the persons email */}
              <PangeaButton
                size={'large'}
                variant='text'
                color='info'
                fullWidth
                onClick={handleResendClick}
              >
                click to resend
              </PangeaButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Stack mt={3} mx='auto'>
        <Typography
          component='p'
          color={PangeaColors.BlackSemiTransparent60}
          variant='body2'
          textAlign={'center'}
        >
          You may close this window after verifying your email.
        </Typography>
      </Stack>
    </>
  );
};
export default SuccessStateForCreateAccount;
