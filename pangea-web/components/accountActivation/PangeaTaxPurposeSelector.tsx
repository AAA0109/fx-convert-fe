import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export const PangeaTaxPurposeSelector = (props: {
  value: string;
  id?: string;
  onChange: any;
  name?: string;
  error?: boolean | undefined;
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel error={props.error} id='simple-select-tax'>
        Tax Purpose
      </InputLabel>
      <Select
        labelId='us_tax_purpose_type'
        id='us_tax_purpose_type'
        value={props.value}
        onChange={props.onChange}
        label='Tax Purpose'
        name={props.name ?? 'us_tax_purpose_type'}
        sx={{
          height: '57px',
        }}
        error={props.error}
      >
        <MenuItem value='C'>Corporation</MenuItem>
        <MenuItem value='P'>Partnership</MenuItem>
        <MenuItem value='E'>Disregard Entity</MenuItem>
      </Select>
    </FormControl>
  );
};
export default PangeaTaxPurposeSelector;
