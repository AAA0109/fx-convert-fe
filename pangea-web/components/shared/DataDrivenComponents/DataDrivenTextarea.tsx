import { FormControl, FormHelperText, TextField } from '@mui/material';
import { SubSchemaFormat } from 'lib';
import { WidgetProps as OriginalWidgetProps } from 'react-jsonschema-form';

interface WidgetProps extends OriginalWidgetProps {
  placeholder?: string;
}

export function DataDrivenTextarea({
  required,
  schema,
  value,
  label,
  disabled,
  onChange,
  placeholder,
}: WidgetProps): JSX.Element {
  const { $id, errorMessage, maxLength, pattern } = schema as SubSchemaFormat;

  if (!$id) return <></>;

  const id = $id.split('/').pop();

  const hasError = (() => {
    if (maxLength && value && value.length > maxLength) {
      return true;
    }
    if (pattern && !RegExp(pattern).test(value)) {
      return true;
    }
    return false;
  })();

  return (
    <FormControl fullWidth>
      <TextField
        id={id}
        name={id}
        variant='filled'
        multiline
        rows={4}
        value={value}
        label={label}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-describedby={id}
        error={hasError}
      />
      {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}

export default DataDrivenTextarea;
