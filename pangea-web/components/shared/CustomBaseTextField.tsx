import { FormControl, InputLabel, FilledInput } from '@mui/material';

export const CustomBaseTextField = (props: any) => {
  const { placeholder, onChange, label, InputLabelProps } = props;
  return (
    <>
      <FormControl>
        <InputLabel
          htmlFor='component-outlined'
          variant='filled'
          size='normal'
          shrink
          {...InputLabelProps}
        >
          {label}
        </InputLabel>
        <FilledInput
          aria-label={label}
          size='medium'
          {...props}
          placeholder={placeholder}
          onChange={onChange}
        />
      </FormControl>
    </>
  );
};
export default CustomBaseTextField;
