import { InputAdornment, TextField } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  activeCurrencyState,
  cashflowDirectionState,
  currenciesState,
  foreignAmountState,
  foreignCurrencyState,
} from 'atoms';
import { NumericFormat } from 'react-number-format';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';

export const ForeignCurrencyInput = () => {
  const foreignCurrency = useRecoilValue(foreignCurrencyState);
  const currenciesLoadable = useRecoilValueLoadable(currenciesState);
  const [foreignAmount, setForeignAmount] = useRecoilState(foreignAmountState);
  const [activeCurrency, setActiveCurrency] =
    useRecoilState(activeCurrencyState);
  const cashflowDirection = useRecoilValue(cashflowDirectionState);

  const handleForeignAmountChange = useEventCallback(
    (values: { value: string }) => {
      if (activeCurrency == 'foreign') {
        const { value } = values;
        setForeignAmount(parseFloat(value) || 0);
      }
    },
  );
  const handleAmountFocus = useEventCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      event?.target?.setSelectionRange(0, 99);
      const active: 'domestic' | 'foreign' =
        event.target.id == 'domestic-amount' ? 'domestic' : 'foreign';
      setActiveCurrency(active);
    },
  );

  const currencies = currenciesLoadable.getValue();

  return (
    /* TODO: validation to enforce minimum hedge amount? Captured as https://app.zenhub.com/workspaces/engineering---pangea-6246fe3e8c7eab0017506b65/issues/servant-io/pangea/899 */
    <NumericFormat
      id='foreign-amount'
      label={cashflowDirection === 'paying' ? 'Recipient Gets' : 'Payer Sends'}
      thousandSeparator={true}
      prefix={
        (foreignCurrency && (currencies[foreignCurrency].symbol ?? '')) ?? ''
      }
      decimalScale={0}
      fixedDecimalScale={false}
      allowLeadingZeros={false}
      allowNegative={false}
      customInput={TextField}
      InputProps={
        foreignCurrency
          ? {
              endAdornment: (
                <InputAdornment position='end'>
                  {foreignCurrency}
                </InputAdornment>
              ),
            }
          : undefined
      }
      value={foreignAmount}
      onValueChange={handleForeignAmountChange}
      onFocus={handleAmountFocus}
      disabled={!foreignCurrency}
    />
  );
};
export default ForeignCurrencyInput;
