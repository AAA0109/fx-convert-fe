import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  brokerUniverseCurrenciesState,
  buyCurrencyState,
  sellCurrencyState,
} from 'atoms';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import {
  useRecoilState,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';

export const CurrencySelect = (props: {
  value: NullableString;
  label: string;
  onChange: (newValue: string) => void;
  type: 'buy' | 'sell';
  setCurrencySymbol?: Dispatch<SetStateAction<string>>;
  isValidForm?: boolean;
  isDisabled?: boolean;
  showName?: boolean;
  sxFormControlProps?: SxProps;
  testId?: string;
}) => {
  const { isValidForm = true, type, sxFormControlProps = {} } = props;
  const brokerUniverseCurrenciesLoadable = useRecoilValueLoadable(
    brokerUniverseCurrenciesState(type),
  );
  const [sellCurrencyDetails, setSellCurrencyDetails] =
    useRecoilState(sellCurrencyState);
  const setBuyCurrencyDetails = useSetRecoilState(buyCurrencyState);
  const brokerUniverseCurrencies = brokerUniverseCurrenciesLoadable.getValue();
  const isLoadingCurrency =
    brokerUniverseCurrenciesLoadable.state === 'loading';
  const showCurrencyError = !isValidForm && !props.value;
  const { buy_currency, sell_currency } = brokerUniverseCurrencies
    ? brokerUniverseCurrencies
    : { buy_currency: [], sell_currency: [] };
  const [allBuyCurrencies, allSellCurrencies] = useMemo(
    () => [buy_currency, sell_currency],
    [buy_currency, sell_currency],
  );
  const handleForeignCurrencyChange = useEventCallback(
    (event: SelectChangeEvent<string>) => {
      props.onChange?.(event.target.value);
      const updateCurrencyDetails = (type: 'buy' | 'sell', value: string) => {
        const currencyDetails =
          allBuyCurrencies.find(({ currency }) => currency === value) ??
          allSellCurrencies.find(({ currency }) => currency === value) ??
          null;
        if (type === 'buy') {
          setBuyCurrencyDetails(currencyDetails);
        } else {
          setSellCurrencyDetails(currencyDetails);
        }
      };
      updateCurrencyDetails(type, event.target.value);

      props.setCurrencySymbol?.(
        (
          allBuyCurrencies.find(
            ({ currency }) => currency === event.target.value,
          ) as any
        )?.symbol ??
          (
            allSellCurrencies.find(
              ({ currency }) => currency === event.target.value,
            ) as any
          )?.symbol ??
          '',
      );
    },
  );
  const allCurrencies = type === 'buy' ? allBuyCurrencies : allSellCurrencies;
  const usableCurrencies = [...allCurrencies].filter(
    (c) => c.active && c.available,
  );

  const unUsableCurrencies = [...allCurrencies].filter(
    (c) => c.active && !c.available,
  );

  useEffect(() => {
    if (!sellCurrencyDetails && allSellCurrencies.length) {
      const usdCurrencyDetails = allSellCurrencies.find(
        ({ currency }) => currency === 'USD',
      );
      if (usdCurrencyDetails) {
        setSellCurrencyDetails(usdCurrencyDetails);
      }
    }
  }, [allSellCurrencies, sellCurrencyDetails, setSellCurrencyDetails]);

  return (
    <FormControl
      sx={{ width: 120, ...sxFormControlProps }}
      error={showCurrencyError}
      data-testid={props.testId || 'currencySelect'}
    >
      <InputLabel id='destination-currency-label'>{props.label}</InputLabel>
      <Select
        labelId='destination-currency-label'
        id='destination-currency'
        value={props.value ?? ''}
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
        disabled={props.isDisabled || isLoadingCurrency}
      >
        {usableCurrencies.map(({ currency, id }, index) => {
          return (
            <MenuItem key={`${id}-${index}`} value={`${currency}`}>
              {props.showName && currency} {currency}
            </MenuItem>
          );
        })}
        {unUsableCurrencies.length > 0 && <Divider />}
        {unUsableCurrencies.map((currency) => {
          return (
            <MenuItem
              key={`currency${currency.currency}`}
              value={`${currency.currency}`}
              sx={{ color: `rgba(0,0,0, 0.4)` }}
            >
              {props.showName && currency.currency} {currency.currency}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
export default CurrencySelect;
