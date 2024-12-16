import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { PangeaColors } from 'styles';

export const CompanyOnboardingIncomplete = () => {
  return (
    <Box
      border={`1px solid ${PangeaColors.Gray}`}
      borderRadius='4px'
      sx={{ backgroundColor: PangeaColors.White }}
      justifyContent='center'
      mt={6}
      px={3}
      py={4}
      mx='auto'
      width='480px'
      textAlign='center'
    >
      <Image
        alt='Pangea logo'
        itemID='my pangea logo'
        src={'/images/pangea-icon.svg'}
        width={59}
        height={59}
      />

      <Typography component='h1' variant='h4' my={4}>
        Welcome to Pangea
      </Typography>
      <Typography
        mb={3}
        variant='body1'
        color={PangeaColors.BlackSemiTransparent60}
      >
        Your company is currently in the process of onboarding for hedging
        services, but we&apos;re not quite there yet. Please contact the account
        owner for more information.
      </Typography>
    </Box>
  );
};
export default CompanyOnboardingIncomplete;
