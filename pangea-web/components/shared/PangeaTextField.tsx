/*
 * Text fields {@link https://zeroheight.com/3ed86e7c3/p/73468a-text-fields-/b/69660f}
 */
import { TextField, TextFieldProps } from '@mui/material';

export const PangeaTextField = (props: TextFieldProps) => {
  return <TextField {...props} variant='filled' hiddenLabel />;
};
export default PangeaTextField;
