import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
} from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { selectableCurrenciesState } from 'atoms';
import { CashflowDirectionType, CashflowEditMode } from 'lib';
import { Suspense } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { PangeaErrorFormHelperText } from './PangeaErrorFormHelperText';

export const ForeignCurrencySelect2 = (props: {
  value: NullableString;
  direction: CashflowDirectionType;
  onChange: (newValue: string) => void;
  isValidForm?: boolean;
  mode?: CashflowEditMode;
}) => {
  const { isValidForm = true } = props;
  const selectableCurrenciesLoadable = useRecoilValueLoadable(
    selectableCurrenciesState,
  );
  const currencies = selectableCurrenciesLoadable.getValue();
  const showCurrencyError = !isValidForm && !props.value;
  const handleForeignCurrencyChange = useEventCallback(
    (event: SelectChangeEvent<string>) => {
      props.onChange?.(event.target.value);
    },
  );
  return (
    <>
      <FormControl sx={{ width: 270 }} error={showCurrencyError}>
        <Suspense fallback={<Skeleton variant='rectangular' />}>
          <InputLabel id='destination-currency-label'>Currency</InputLabel>
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
            disabled={props.mode === 'manage'}
          >
            {[...currencies]
              .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
              .map((currency) => (
                <MenuItem
                  key={`currency${currency.mnemonic}`}
                  value={`${currency.mnemonic}`}
                >
                  {currency.name} ({currency.mnemonic})
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>
            The currency you are{' '}
            {props.direction === 'paying' ? (
              <>paying to</>
            ) : (
              <>receiving from</>
            )}
            .
          </FormHelperText>
          <PangeaErrorFormHelperText
            text='Please select a currency'
            visible={showCurrencyError}
          />
        </Suspense>
      </FormControl>
    </>
  );
};
export default ForeignCurrencySelect2;
