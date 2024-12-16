import { Stack, TextField } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { activeCurrencyState } from 'atoms';
import { CashflowDirectionType } from 'lib';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaErrorFormHelperText } from './PangeaErrorFormHelperText';
export const ForeignCurrencyInput2 = (props: {
  value: number;
  foreignCurrency: NullableString;
  direction: CashflowDirectionType;
  onChange: (newValue: number) => void;
  customLabel?: string;
  customError?: string;
  id?: string;
  width?: string | number;
  isValidForm?: boolean;
  disabled?: boolean;
  showBlockError?: boolean;
  checkCurrencyProp?: boolean;
  keyDownFunc?: () => void;
  rounding?: number;
  testId?: string;
}) => {
  const {
    id,
    isValidForm = true,
    disabled = false,
    customError,
    customLabel,
    showBlockError = false,
    width = '100%',
    checkCurrencyProp = true,
    rounding = 0,
  } = props;
  const [showInputError, setShowInputError] = useState(false);
  useEffect(() => {
    if (!isValidForm) {
      setShowInputError(!props.value);
    }
  }, [isValidForm, props.value]);
  const [activeCurrency, setActiveCurrency] =
    useRecoilState(activeCurrencyState);
  const handleForeignAmountChange = useEventCallback(
    (values: { value: string }) => {
      if (activeCurrency == 'foreign') {
        const { value } = values;
        props.onChange(parseFloat(value) || 0);
      }
    },
  );
  const handleAmountFocus = useEventCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      event?.target?.setSelectionRange(0, 0);
      const active: 'domestic' | 'foreign' =
        event.target.id == 'domestic-amount' ? 'domestic' : 'foreign';
      setActiveCurrency(active);
    },
  );
  return (
    <Stack direction={showBlockError ? 'column' : 'row'}>
      <NumericFormat
        sx={{ width: width }}
        error={showInputError && Boolean(customError)}
        id={id ?? 'foreign-amount'}
        label={
          customLabel
            ? customLabel
            : props.direction === 'paying'
            ? 'Recipient Gets'
            : 'Payer Sends'
        }
        thousandSeparator={true}
        prefix={props.foreignCurrency ?? ''}
        InputLabelProps={{
          sx: {
            color:
              showInputError && customError
                ? PangeaColors.RiskBerryMedium
                : 'black',
          },
        }}
        decimalScale={rounding}
        fixedDecimalScale={true}
        valueIsNumericString
        allowLeadingZeros={false}
        allowNegative={false}
        customInput={TextField}
        InputProps={
          props.foreignCurrency
            ? {
                sx: {
                  color:
                    showInputError && customError
                      ? PangeaColors.RiskBerryMedium
                      : 'black',
                },
                'aria-label': customLabel ?? 'Foreign Amount',
              }
            : undefined
        }
        value={props.value}
        onValueChange={handleForeignAmountChange}
        onFocus={handleAmountFocus}
        disabled={(checkCurrencyProp && !props.foreignCurrency) || disabled}
        onKeyDown={props?.keyDownFunc}
        data-testid={props.testId ?? 'foreign-amount-2'}
      />
      <PangeaErrorFormHelperText
        text={customError ?? 'Please enter currency values'}
        visible={showInputError || customError ? true : false}
      />
    </Stack>
  );
};
export default ForeignCurrencyInput2;
