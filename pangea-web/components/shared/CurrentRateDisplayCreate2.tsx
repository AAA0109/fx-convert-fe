import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Stack, Typography } from '@mui/material';
import { domesticCurrencyState, exchangeRatesState } from 'atoms';
import { formatCurrency } from 'lib';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';

export const CurrentRateDisplayCreate2 = (props: {
  foreignCurrency: NullableString;
}) => {
  const exchangeRate = useRecoilValue(
    exchangeRatesState(props.foreignCurrency),
  );
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  return props.foreignCurrency ? (
    <Stack alignItems={'center'} spacing={1}>
      <Typography
        variant='body2'
        color={PangeaColors.BlackSemiTransparent50}
        whiteSpace='nowrap'
      >
        {formatCurrency(
          exchangeRate,
          props.foreignCurrency ?? undefined,
          true,
          1,
          4,
        )}{' '}
        {props.foreignCurrency}
      </Typography>
      <SwapVertIcon fontSize='large' />
      <Typography variant='body2' whiteSpace='nowrap'>
        {formatCurrency('1.00', domesticCurrency, true, 2, 4)}{' '}
        {domesticCurrency}
      </Typography>
    </Stack>
  ) : null;
};

export default CurrentRateDisplayCreate2;
