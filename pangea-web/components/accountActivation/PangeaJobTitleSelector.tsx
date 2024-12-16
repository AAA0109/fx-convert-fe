import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { PangeaIBAssociatedIndividualTitleCodeEnum } from 'lib';
import { useMemo } from 'react';
import { v4 } from 'uuid';

export const PangeaJobTitleSelector = (props: {
  value: NullableString;
  onChange: any;
  label: string;
  name?: string;
  id?: string;
}) => {
  const labelId = useMemo(() => v4(), []);
  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{props.label}</InputLabel>
      <Select
        fullWidth
        required
        labelId={labelId}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        label={props.label}
        name={props.name ?? props.id}
      >
        {Object.values(PangeaIBAssociatedIndividualTitleCodeEnum).map(
          (titleCode, i) => {
            return (
              <MenuItem key={i} value={titleCode}>
                {titleCode}
              </MenuItem>
            );
          },
        )}
      </Select>
    </FormControl>
  );
};
export default PangeaJobTitleSelector;
