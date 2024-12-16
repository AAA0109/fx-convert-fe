import {
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  activeCurrencyState,
  cashflowDirectionState,
  domesticAmountState,
  exchangeRateState,
  foreignAmountState,
  foreignCurrencyState,
  selectableCurrenciesState,
} from 'atoms';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';

export const ForeignCurrencySelect = () => {
  const [foreignCurrency, setForeignCurrency] =
    useRecoilState(foreignCurrencyState);
  const currenciesLoadable = useRecoilValueLoadable(selectableCurrenciesState);
  const exchangeRate = useRecoilValue(exchangeRateState);
  const setDomesticAmount = useSetRecoilState(
    domesticAmountState(exchangeRate),
  );
  const setDestinationAmount = useSetRecoilState(foreignAmountState);
  const setActiveCurrency = useSetRecoilState(activeCurrencyState);
  const handleForeignCurrencyChange = useEventCallback(
    (event: SelectChangeEvent<string>) => {
      // reset everything to defaults before changing currency
      setActiveCurrency('');
      setDestinationAmount(0);
      setDomesticAmount('0');
      setForeignCurrency(event?.target?.value);
    },
  );
  const cashflowDirection = useRecoilValue(cashflowDirectionState);
  if (
    !currenciesLoadable ||
    currenciesLoadable.state == 'loading' ||
    currenciesLoadable.state == 'hasError'
  ) {
    return <Skeleton variant='rectangular' />;
  }
  const currencies = currenciesLoadable.getValue();
  return (
    <>
      <InputLabel id='destination-currency-label'>Currency</InputLabel>
      <Select
        labelId='destination-currency-label'
        id='destination-currency'
        value={foreignCurrency ?? ''}
        label='Currency'
        size='small'
        sx={{
          textAlign: 'left',
          maxHeight: '57px',
          '& .MuiSelect-select': {
            paddingTop: '27px',
            paddingBottom: '0px',
          },
        }}
        onChange={handleForeignCurrencyChange}
      >
        {[...currencies]
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          .map((currency) => (
            <MenuItem
              key={`currency${currency.name}`}
              value={`${currency.mnemonic}`}
            >
              {currency.name} ({currency.mnemonic})
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>
        The currency you are{' '}
        {cashflowDirection === 'paying' ? <>paying to</> : <>receiving from</>}.
      </FormHelperText>
    </>
  );
};
export default ForeignCurrencySelect;
