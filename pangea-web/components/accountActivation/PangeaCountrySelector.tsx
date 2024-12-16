import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { countries, PangeaCountryEnum } from 'lib';
import { useMemo } from 'react';
import { v4 } from 'uuid';

export const PangeaCountrySelector = (props: {
  value: string | undefined;
  onChange: any;
  label: string;
  name?: string;
  id?: string;
  error?: boolean | undefined;
}) => {
  const labelId = useMemo(() => v4(), []);
  return (
    <FormControl fullWidth>
      <InputLabel error={props.error} id={labelId}>
        {props.label}
      </InputLabel>
      <Select
        fullWidth
        required
        labelId={labelId}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        label={props.label}
        name={props.name ?? props.id}
        autoComplete='country'
        error={props.error}
      >
        {countries.length > 0
          ? countries.map((countryPair) => {
              return (
                <MenuItem key={countryPair.value} value={countryPair.value}>
                  {countryPair.display_name}
                </MenuItem>
              );
            })
          : Object.values(PangeaCountryEnum).map((countryCode) => {
              return (
                <MenuItem key={countryCode} value={countryCode}>
                  {countryCode}
                </MenuItem>
              );
            })}
      </Select>
    </FormControl>
  );
};
export default PangeaCountrySelector;
