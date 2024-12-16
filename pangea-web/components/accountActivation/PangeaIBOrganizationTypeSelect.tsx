import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { PangeaIBOrganizationTypeEnum } from 'lib';
import { useMemo } from 'react';
import { v4 } from 'uuid';

export const PangeaIBOrganizationTypeSelect = (props: {
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
        {Object.values(PangeaIBOrganizationTypeEnum).map((type, i) => {
          return (
            <MenuItem key={i} value={type}>
              {type}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
export default PangeaIBOrganizationTypeSelect;
