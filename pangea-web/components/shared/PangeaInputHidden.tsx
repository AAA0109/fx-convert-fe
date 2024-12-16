import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Button,
  InputAdornment,
  StandardTextFieldProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { useState } from 'react';

interface IPangeaInputHidden extends StandardTextFieldProps {
  name: string;
}
export const PangeaInputHidden = (
  props: IPangeaInputHidden & TextFieldProps,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, type, ...rest } = props; //Thowing away type on purpose.
  const [isHidden, setIsHidden] = useState(true);
  return (
    <TextField
      fullWidth
      id={name}
      name={name}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <Button
              onClick={() => {
                setIsHidden(!isHidden);
              }}
            >
              {isHidden ? <RemoveRedEye /> : <VisibilityOffIcon />}
            </Button>
          </InputAdornment>
        ),
      }}
      variant='filled'
      type={isHidden ? 'password' : 'text'}
      {...rest}
    />
  );
};
export default PangeaInputHidden;
