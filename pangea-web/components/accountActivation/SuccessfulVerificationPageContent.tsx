import CheckIcon from '@mui/icons-material/Check';
import { Box, Stack, Typography } from '@mui/material';
import { userState } from 'atoms';
import { useAuthHelper } from 'hooks/useAuthHelper';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { IconBorder } from '../icons/IconBorder';
import { PangeaButton, PangeaLoading } from '../shared';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const SuccessfulVerificationPageContent = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuthHelper();
  const userData = useRecoilValue(userState);

  if (!isLoggedIn) {
    return <PangeaLoading />;
  }

  return (
    <>
      <Box
        border={`1px solid ${PangeaColors.Gray}`}
        borderRadius='4px'
        bgcolor={PangeaColors.White}
        justifyContent={'center'}
        mt={6}
        px={3}
        mx={'auto'}
        maxWidth='370px'
        py={4}
      >
        <Stack alignItems='center' spacing={3}>
          <IconBorder borderColor={PangeaColors.SecurityGreenMedium}>
            <CheckIcon color='success' sx={{ height: '32px', width: '32px' }} />
          </IconBorder>
          <Typography component='h1' variant='h4'>
            Mobile Number Verified
          </Typography>
          <Box
            textAlign='center'
            flexDirection='column'
            rowGap={2}
            display='flex'
          >
            <Typography
              variant='body1'
              color={PangeaColors.BlackSemiTransparent60}
            >
              Thanks {userData?.first_name ?? '...'},
            </Typography>
            <Stack>
              <Typography
                variant='body1'
                color={PangeaColors.BlackSemiTransparent60}
              >
                Welcome to Pangea!
              </Typography>
              <Typography
                variant='body1'
                color={PangeaColors.BlackSemiTransparent60}
              >
                Go seize a world of opportunity.
              </Typography>
            </Stack>
          </Box>

          <PangeaButton
            size='large'
            variant='contained'
            fullWidth
            onClick={() => router.push('/')}
            endIcon={<ArrowForwardIcon />}
          >
            Get Started
          </PangeaButton>
        </Stack>
      </Box>
    </>
  );
};
export default SuccessfulVerificationPageContent;
