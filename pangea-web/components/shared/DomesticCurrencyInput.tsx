import { InputAdornment, TextField } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  activeCurrencyState,
  cashflowDirectionState,
  domesticAmountState,
  domesticCurrencyState,
  exchangeRateState,
  foreignCurrencyState,
} from 'atoms';
import { debounce } from 'lodash';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { NumericFormat } from 'react-number-format';
import { useRecoilState, useRecoilValue } from 'recoil';

export const DomesticCurrencyInput = () => {
  const foreignCurrency = useRecoilValue(foreignCurrencyState);
  const exchangeRate = useRecoilValue(exchangeRateState);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const [domesticAmount, setDomesticAmount] = useRecoilState(
    domesticAmountState(exchangeRate),
  );
  const [activeCurrency, setActiveCurrency] =
    useRecoilState(activeCurrencyState);
  const cashflowDirection = useRecoilValue(cashflowDirectionState);

  const handleDomesticAmountChange = (values: { value: string }) => {
    if (activeCurrency == 'domestic') {
      const { value } = values;
      setDomesticAmount(value || '0');
    }
  };
  const debounceHandleDomesticAmountchange = useEventCallback(
    debounce(handleDomesticAmountChange, 600),
  );

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
        id='domestic-amount'
        label={
          cashflowDirection === 'paying'
            ? 'Amount Paying'
            : 'Amount You Receive'
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
        disabled={!foreignCurrency}
      />
    </ErrorBoundary>
  );
};

export default DomesticCurrencyInput;
