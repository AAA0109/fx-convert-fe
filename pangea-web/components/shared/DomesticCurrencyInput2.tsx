import { InputAdornment, TextField } from '@mui/material';
import {
  activeCurrencyState,
  domesticCurrencyState,
  exchangeRatesState,
} from 'atoms';
import { CashflowDirectionType, convertToDomesticAmount } from 'lib';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { NumericFormat } from 'react-number-format';
import { useRecoilState, useRecoilValue } from 'recoil';

export const DomesticCurrencyInput2 = (props: {
  value: string;
  foreignCurrency: NullableString;
  direction: CashflowDirectionType;
  onChange: (newValue: string, initialValue: string) => void;
  isValidForm?: boolean;
}) => {
  const { isValidForm = true } = props;
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const [showInputError, setShowInputError] = useState(false);
  const [activeCurrency, setActiveCurrency] =
    useRecoilState(activeCurrencyState);
  const exchangeRate = useRecoilValue(
    exchangeRatesState(props.foreignCurrency),
  );
  const [domesticAmount, setDomesticAmount] = useState('0');

  useEffect(() => {
    if (activeCurrency !== 'domestic') {
      setDomesticAmount(
        convertToDomesticAmount(parseFloat(props.value) || 0, exchangeRate),
      );
    }
  }, [activeCurrency, exchangeRate, props.value]);
  const handleDomesticAmountChange = (values: { value: string }) => {
    if (activeCurrency == 'domestic') {
      const { value } = values;
      const newValue = (
        parseFloat(value as string) * parseFloat(exchangeRate)
      ).toFixed(0);
      props.onChange?.(newValue || '0', value || '0');
    }
  };
  const debounceHandleDomesticAmountchange = debounce(
    handleDomesticAmountChange,
    600,
  );
  useEffect(() => {
    if (!isValidForm) {
      setShowInputError(!domesticAmount);
    }
  }, [isValidForm, domesticAmount]);

  const handleAmountFocus = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event?.target?.setSelectionRange(0, 99);
    const active: 'domestic' | 'foreign' =
      event.target.id == 'domestic-amount' ? 'domestic' : 'foreign';
    setActiveCurrency(active);
  };

  const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
      <div role='alert'>
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    );
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <NumericFormat
        error={showInputError}
        id='domestic-amount'
        label={
          props.direction === 'paying' ? 'Amount Paying' : 'Amount You Receive'
        }
        thousandSeparator={true}
        prefix='$'
        allowLeadingZeros={false}
        allowNegative={false}
        decimalScale={0}
        fixedDecimalScale={false}
        valueIsNumericString
        customInput={TextField}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>{domesticCurrency}</InputAdornment>
          ),
        }}
        value={domesticAmount}
        onValueChange={debounceHandleDomesticAmountchange}
        onFocus={handleAmountFocus}
        disabled={!props.foreignCurrency}
      />
    </ErrorBoundary>
  );
};
export default DomesticCurrencyInput2;
