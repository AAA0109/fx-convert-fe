import { TextField, Stack, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { FieldProps } from 'react-jsonschema-form';
import PangeaButton from '../PangeaButton';

export const ObjectFieldTemplate: React.FC<FieldProps> = (props) => {
  const { formData, onChange, schema } = props;
  const [fields, setFields] = useState<{ key: string; value: any }[]>(
    Object.entries(formData || {}).map(([key, value]) => ({ key, value })),
  );

  const handleAddField = () => {
    setFields([...fields, { key: '', value: '' }]);
  };

  const handleRemoveField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    onChange(
      Object.fromEntries(newFields.map(({ key, value }) => [key, value])),
    );
  };

  const handleKeyChange = (index: number, newKey: string) => {
    const newFields = fields.map((field, i) =>
      i === index ? { ...field, key: newKey } : field,
    );
    setFields(newFields);
    onChange(
      Object.fromEntries(newFields.map(({ key, value }) => [key, value])),
    );
  };

  const handleValueChange = (index: number, newValue: any) => {
    const newFields = fields.map((field, i) =>
      i === index ? { ...field, value: newValue } : field,
    );
    setFields(newFields);
    onChange(
      Object.fromEntries(newFields.map(({ key, value }) => [key, value])),
    );
  };

  return (
    <Stack direction='column' rowGap={1} mt={3}>
      <Typography variant='h6'>{schema.title}</Typography>
      {fields.length === 0 && (
        <Alert severity='warning'>No {schema.title} added.</Alert>
      )}
      <Stack direction='column' rowGap={2}>
        {fields.map((field, index) => (
          <Stack key={index} direction='row' columnGap={1}>
            <TextField
              label='Key'
              value={field.key}
              onChange={(e) => handleKeyChange(index, e.target.value)}
              variant='filled'
              style={{ marginRight: '10px' }}
              fullWidth
            />
            <TextField
              label='Value'
              value={field.value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              variant='filled'
              style={{ marginRight: '10px' }}
              fullWidth
            />
            <PangeaButton
              variant='text'
              color='error'
              onClick={() => handleRemoveField(index)}
              sx={{
                minWidth: '100px',
              }}
            >
              Remove
            </PangeaButton>
          </Stack>
        ))}
      </Stack>
      <PangeaButton
        variant='contained'
        color='primary'
        onClick={handleAddField}
      >
        Add {schema.title}
      </PangeaButton>
    </Stack>
  );
};

export default ObjectFieldTemplate;
