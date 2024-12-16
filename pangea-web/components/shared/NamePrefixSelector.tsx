import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

export const NamePrefixSelector = (props: {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id='prefix-select'>Prefix</InputLabel>
      <Select
        labelId='prefix-select'
        id='prefix-select'
        value={props.value ?? ''}
        label='Prefix'
        onChange={props.onChange}
        autoComplete={'honorific-prefix'}
      >
        <MenuItem value={'Mr.'}>Mr.</MenuItem>
        <MenuItem value={'Mrs.'}>Mrs.</MenuItem>
        <MenuItem value={'Ms.'}>Ms.</MenuItem>
        <MenuItem value={'Dr.'}>Dr.</MenuItem>
        <MenuItem value={'Mx.'}>Mx.</MenuItem>
        <MenuItem value={'Ind.'}>Ind.</MenuItem>
      </Select>
    </FormControl>
  );
};
export default NamePrefixSelector;
