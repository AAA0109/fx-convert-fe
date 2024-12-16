import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { PangeaStateEnum } from 'lib';

const getStateCodes = () => Object.keys(PangeaStateEnum);

export const PangeaStateSelector = (props: {
  value: string;
  id?: string;
  onChange: any;
  name?: string;
  error?: boolean | undefined;
  disabled?: boolean;
}) => {
  const stateList = getStateCodes();
  return (
    <FormControl fullWidth>
      <InputLabel error={props.error} id='simple-select-State'>
        State
      </InputLabel>
      <Select
        labelId='simple-select-State'
        id='demo-simple-select-standard'
        value={props.value}
        onChange={props.onChange}
        label='State'
        name={props.name ?? 'state'}
        autoComplete='address-level1'
        sx={{
          height: '57px',
        }}
        error={props.error}
        disabled={props.disabled}
      >
        {stateList.map((state, i) => {
          return (
            <MenuItem key={`${i}`} value={state}>
              {state}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
export default PangeaStateSelector;
