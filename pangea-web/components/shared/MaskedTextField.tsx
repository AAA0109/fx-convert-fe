import { FormHelperText, TextField } from '@mui/material';
import { ChangeEvent, useRef } from 'react';
import InputMask, { Props as MaskProps } from 'react-input-mask';
import { PangeaColors } from 'styles';

interface MaskedTextFieldProps {
  onBlur?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: any;
  type?: 'date' | 'ssn' | 'phone' | 'ein';
  maskProps?: MaskProps;
  fullWidth?: boolean;
  id: string;
  label: string;
  variant?: 'standard' | 'filled' | 'outlined';
  name: string;
  error?: boolean;
  required?: boolean;
  apiErrorMessages?: string[];
  inputProps?: any;
  autoComplete?: string;
  disabled?: boolean;
}

export const MaskedTextField = ({
  onBlur,
  onChange,
  value,
  maskProps,
  type,
  fullWidth,
  id,
  label,
  variant,
  name,
  error,
  required,
  inputProps,
  apiErrorMessages,
  autoComplete,
  disabled = false,
  ...rest
}: MaskedTextFieldProps) => {
  const getMaskFromVariant = () => {
    switch (type) {
      case 'date':
        return '99/99/9999';
      case 'ssn':
        return '999-99-9999';
      case 'phone':
        return '+1 (999) 999-9999';
      case 'ein':
        return '99-9999999';
      default:
        return '';
    }
  };

  maskProps = type
    ? { ...maskProps, mask: getMaskFromVariant() }
    : maskProps ?? { mask: '' };

  const ref = useRef(null);

  // Known issue: Fires console Warning: findDOMNode is deprecated in StrictMode. https://github.com/sanniassin/react-input-mask/issues/239
  return (
    <>
      <InputMask
        {...maskProps}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        value={value}
        alwaysShowMask
        inputRef={ref}
        id={id}
        ref={ref}
        disabled={disabled}
      >
        {() => (
          <TextField
            {...inputProps}
            name={name}
            variant={variant}
            label={label}
            fullWidth={fullWidth}
            {...rest}
            error={error}
            required={required}
            InputProps={inputProps}
            autoComplete={autoComplete}
            // inputRef={ref}
          />
        )}
      </InputMask>

      {error && type === 'phone' && (
        <FormHelperText
          sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
          id='phone-helper-text'
        >
          Please enter a valid phone
        </FormHelperText>
      )}
      {apiErrorMessages?.map((item, i) => {
        return (
          <FormHelperText
            sx={{ color: `${PangeaColors.RiskBerryMedium}` }}
            key={i}
          >
            {item}
          </FormHelperText>
        );
      })}
    </>
  );
};
export default MaskedTextField;
