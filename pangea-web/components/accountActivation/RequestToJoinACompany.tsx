import ArrowBack from '@mui/icons-material/ArrowBack';
import Mail from '@mui/icons-material/Mail';
import { Box, Typography } from '@mui/material';
import { PangeaColors } from 'styles';
import { IconBorder } from '../icons/IconBorder';
import { PangeaButton } from '../shared';

export const RequestToJoinACompany = () => {
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
      width='380px'
      textAlign='center'
    >
      <IconBorder>
        <Mail sx={{ color: PangeaColors.SolidSlateMedium }} fontSize='large' />
      </IconBorder>
      <Typography component='h1' variant='h4' my={4}>
        Your Request
      </Typography>
      <Typography
        mb={3}
        variant='body1'
        color={PangeaColors.BlackSemiTransparent60}
      >
        The account owner has been notified of your request. They can send an
        invite email in Account &gt; Settings &gt; Company Details.
      </Typography>
      <PangeaButton
        fullWidth
        href='/activation/successful-verification'
        variant='text'
        startIcon={<ArrowBack />}
        size='large'
        sx={{ border: `1px solid ` }}
      >
        Back
      </PangeaButton>
    </Box>
  );
};
export default RequestToJoinACompany;
