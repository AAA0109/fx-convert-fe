import { Typography, TypographyProps } from '@mui/material';

interface CurrencyAmountDisplayProps extends TypographyProps {
  amount: number;
  rounding: number;
  currency?: string;
}
export const CurrencyAmountDisplay = ({
  amount,
  rounding,
  currency = '',
  ...rest
}: CurrencyAmountDisplayProps) => {
  return (
    <Typography {...rest}>
      {`${currency} ${amount.toFixed(Math.max(0, Math.floor(rounding)))}`}
    </Typography>
  );
};

export default CurrencyAmountDisplay;
