import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Stack,
  Typography,
} from '@mui/material';
import { useWalletAndPaymentHelpers } from 'hooks';

type CircularProgressWithLabelProps = CircularProgressProps & {
  value: number;
  prefixLabel?: React.ReactNode;
};

export const CircularProgressWithLabel = ({
  value,
  prefixLabel = null,
  ...restProps
}: CircularProgressWithLabelProps) => {
  const { corPayQuotePaymentResponse } = useWalletAndPaymentHelpers();
  const progress = corPayQuotePaymentResponse?.quote?.expiry
    ? (value / 10 / corPayQuotePaymentResponse?.quote?.expiry) * 150
    : value;
  return (
    <Stack
      direction='row'
      alignItems='center'
      spacing={0.5}
      className='circular-progress'
    >
      <Typography variant='dataBody'>{prefixLabel}</Typography>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          color='secondary'
          variant='determinate'
          value={progress * (100 / 150)}
          {...restProps}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant='dataBody'>{`${Math.ceil(
            value / 10,
          )}`}</Typography>
        </Box>
      </Box>
    </Stack>
  );
};

export default CircularProgressWithLabel;
