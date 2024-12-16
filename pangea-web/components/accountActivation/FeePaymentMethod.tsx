import AccountBalance from '@mui/icons-material/AccountBalance';
import { Box, Button, Stack, Typography } from '@mui/material';
import { stripeAccountState } from 'atoms';
import { useFeatureFlags } from 'hooks';
import router from 'next/router';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { StripeAccount } from '../account/StripeAccount';
import { IconBorder } from '../icons/IconBorder';
import { PangeaButton } from '../shared';

export const FeePaymentMethod = () => {
  const stripeAccount = useRecoilValue(stripeAccountState);
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldShowLinkWithdrawalAccount = isFeatureEnabled(
    'onboarding-link-withdrawal-account',
  );
  const continueLink = shouldShowLinkWithdrawalAccount
    ? '/activation/finishing-up/link-account-for-withdrawals'
    : '/activation/finishing-up/schedule-a-meeting';
  return (
    <Box
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius='4px'
      sx={{ backgroundColor: PangeaColors.White }}
      justifyContent='center'
      mt={0}
      px={3}
      py={4}
      width='480px'
      textAlign='center'
    >
      <IconBorder>
        <AccountBalance
          sx={{ color: PangeaColors.SolidSlateMedium }}
          fontSize='large'
        />
      </IconBorder>
      <Typography component='h1' variant='h4' my={4}>
        Payment method for fees
      </Typography>
      <Typography
        mb={3}
        variant='body1'
        color={PangeaColors.BlackSemiTransparent60}
      >
        This account is used for paying for Pangea services. We will only
        authorize your account, we are not charging your account.
      </Typography>
      <StripeAccount
        buttonProps={
          <Stack direction={'row'} justifyContent='center' spacing={2} mt={3}>
            <Button
              variant='outlined'
              sx={{
                flexGrow: 1,
              }}
              onClick={() => {
                router.push(
                  '/activation/finalization/interactive-broker-application',
                );
              }}
              size='large'
            >
              Go Back
            </Button>
            <PangeaButton
              variant='contained'
              size='large'
              sx={{
                flexGrow: 1,
              }}
            >
              Continue
            </PangeaButton>
          </Stack>
        }
      />
      {stripeAccount === 'succeeded' ? (
        <Stack direction={'row'} justifyContent='center' spacing={2} mt={3}>
          <Button
            variant='outlined'
            sx={{
              flexGrow: 1,
            }}
            onClick={() => {
              router.push(
                '/activation/finalization//interactive-broker-application',
              );
            }}
            size='large'
          >
            Go Back
          </Button>
          <PangeaButton
            variant='contained'
            size='large'
            sx={{
              flexGrow: 1,
            }}
            onClick={() => {
              router.push(continueLink);
            }}
          >
            Continue
          </PangeaButton>
        </Stack>
      ) : null}
    </Box>
  );
};
export default FeePaymentMethod;
