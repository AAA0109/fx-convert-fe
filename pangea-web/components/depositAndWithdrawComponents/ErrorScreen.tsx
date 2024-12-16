import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import { PangeaColors } from 'styles';

interface ErrorScreenProps {
  handleClose: () => void;
}
export const ErrorScreen = ({ handleClose }: ErrorScreenProps) => {
  return (
    <>
      <Box
        px={3}
        py={2}
        borderRadius='4px'
        bgcolor={PangeaColors.RiskBerryMedium}
        color={PangeaColors.White}
        display='flex'
        alignItems='center'
        marginBottom={4}
      >
        <ErrorOutlineIcon />
        <Typography variant='body1' marginLeft={1}>
          Transfer was not completed.{' '}
        </Typography>
      </Box>
      <Typography variant='body1' marginBottom={3}>
        Please check your balance or contact customer support.
      </Typography>
      <Box display='flex' marginBottom={4} justifyContent='space-between'>
        <Typography variant='body2'>Support:</Typography>
        <Link href='/account/help/schedulecall'>
          <Typography variant='body2'>Request a call</Typography>
        </Link>
      </Box>
      <Button variant='contained' onClick={handleClose}>
        Close
      </Button>
    </>
  );
};
