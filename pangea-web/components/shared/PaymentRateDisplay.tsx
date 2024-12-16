import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Stack, Typography } from '@mui/material';
import { paymentspotRateDataState } from 'atoms';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { CurrencyAmountDisplay } from '.';

const DEFAULT_ROUNDING = 0;
interface PaymentRateDisplayProps {
  sourceRounding?: number;
  destinationRounding?: number;
}

export const PaymentRateDisplay = ({
  sourceRounding = DEFAULT_ROUNDING,
  destinationRounding = DEFAULT_ROUNDING,
}: PaymentRateDisplayProps) => {
  const spotRateData = useRecoilValue(paymentspotRateDataState);
  const exchangeRate = spotRateData?.rate ?? Number('1.00');
  const [source, destination] = [
    spotRateData?.market.substring(0, 3),
    spotRateData?.market.substring(3),
  ];

  return (
    <Stack alignItems={'center'} spacing={1}>
      <CurrencyAmountDisplay
        variant='body2'
        color={PangeaColors.BlackSemiTransparent50}
        whiteSpace='nowrap'
        amount={Number(1)}
        currency={source}
        rounding={sourceRounding}
      />
      <SwapVertIcon fontSize='large' />
      <CurrencyAmountDisplay
        variant='body2'
        whiteSpace='nowrap'
        currency={destination}
        amount={Number(exchangeRate)}
        rounding={destinationRounding}
      />
      {source && destination && (
        <Typography
          variant='small'
          fontSize={'0.75rem'}
          color={PangeaColors.BlackSemiTransparent50}
          whiteSpace='nowrap'
        >
          {/* *this FX rate is indicative */}
        </Typography>
      )}
    </Stack>
  );
};

export default PaymentRateDisplay;
