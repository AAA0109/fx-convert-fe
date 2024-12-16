import { InputAdornment, TextField } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { currencyListState } from 'atoms';
import { NumericFormat } from 'react-number-format';
import { useRecoilValue } from 'recoil';

type FXTransferAmountInputProps = {
  id: string;
  value: string;
  label: string;
  currency: string;
  onChange: (newValue: string) => void;
  isLocked?: boolean;
  isValid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
};

export const FXTransferAmountInput = ({
  id,
  label,
  value,
  currency,
  onChange,
  isLocked = false,
  isValid = true,
  errorMessage = '',
  disabled = false,
}: FXTransferAmountInputProps) => {
  const currencies = useRecoilValue(currencyListState);

  const handleAmountChange = useEventCallback((value: string) => {
    const amount = value.replace(/[^\d.]/g, '');
    onChange(parseFloat(amount).toFixed(2) || '0');
  });
  return (
    <NumericFormat
      onChange={(e) => handleAmountChange(e.target.value)}
      sx={{ width: '100%' }}
      error={!isValid}
      helperText={!isValid ? errorMessage : ''}
      id={id}
      label={label}
      thousandSeparator={true}
      prefix={
        (currency &&
          (currencies.find((curr) => curr.mnemonic === currency)?.symbol ??
            '')) ??
        ''
      }
      decimalScale={2}
      fixedDecimalScale={true}
      valueIsNumericString
      allowLeadingZeros={false}
      allowNegative={false}
      customInput={TextField}
      InputProps={
        currency
          ? {
              endAdornment: (
                <InputAdornment position='end'>{currency}</InputAdornment>
              ),
            }
          : undefined
      }
      value={value}
      disabled={!isLocked || disabled}
    />
  );
};
export default FXTransferAmountInput;
