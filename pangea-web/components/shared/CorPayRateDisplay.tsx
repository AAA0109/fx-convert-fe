import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Stack, Typography } from '@mui/material';
import { corPayQuotePaymentResponseState } from 'atoms';
import { formatCurrency } from 'lib';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

export const CorPayRateDisplay = () => {
  const spotRateData = useRecoilValue(corPayQuotePaymentResponseState);
  const exchangeRate = spotRateData?.rate.value ?? '1.00';
  const [source, destination] = [
    spotRateData?.rate.rate_type.substring(0, 3),
    spotRateData?.rate.rate_type.substring(3),
  ];
  return (
    <Stack alignItems={'center'} spacing={1}>
      <Typography
        variant='body2'
        color={PangeaColors.BlackSemiTransparent50}
        whiteSpace='nowrap'
      >
        {formatCurrency('1.00', source, true, 2, 4)}
        {source}
      </Typography>
      <SwapVertIcon fontSize='large' />
      <Typography variant='body2' whiteSpace='nowrap'>
        {formatCurrency(exchangeRate, destination, true, 2, 4)}
        {destination}
      </Typography>
    </Stack>
  );
};

export default CorPayRateDisplay;
