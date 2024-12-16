import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { snakeCaseToWords, SubSchemaFormat } from 'lib';
import { WidgetProps } from 'react-jsonschema-form';

export function DataDrivenSelect({
  label,
  required,
  value,
  onChange,
  disabled,
  options,
  schema,
}: WidgetProps): JSX.Element {
  const dropDownOptions = options.enumOptions as Record<
    'value' | 'label',
    string
  >[];

  const { $id, errorMessage, pattern } = schema as SubSchemaFormat;

  const id = $id?.split('/').pop();

  const hasError = (() => {
    if (required && !value) {
      return true;
    }
    if (pattern && !RegExp(pattern).test(value)) {
      return true;
    }
    return false;
  })();
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={id}>
        {label}
        {required ? '*' : ''}
      </InputLabel>
      <Select
        labelId={id}
        id={id}
        name={id}
        value={value ? value : ''}
        label={label}
        required={required}
        onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
        sx={{ minHeight: '57px' }}
        disabled={disabled}
        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
        error={hasError}
      >
        {dropDownOptions.map(({ value, label }) => (
          <MenuItem value={value} key={value}>
            {snakeCaseToWords(label)}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}

export default DataDrivenSelect;
