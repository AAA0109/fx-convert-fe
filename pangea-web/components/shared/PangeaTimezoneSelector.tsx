import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { PangeaTimezoneEnum } from 'lib';

export const PangeaTimezoneSelector = ({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: any;
  disabled?: boolean;
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id='simple-select-timezone'>Time Zone*</InputLabel>
      <Select
        fullWidth
        required
        labelId='simple-select-timezone'
        id='demo-simple-select-standard'
        value={value}
        onChange={onChange}
        label='Time Zone'
        disabled={disabled}
      >
        {Object.values(PangeaTimezoneEnum).map((value, i) => {
          return (
            <MenuItem key={i} value={value}>
              {value}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
export default PangeaTimezoneSelector;
