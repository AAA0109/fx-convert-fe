import { matchIsValidTel, MuiTelInput } from 'mui-tel-input';
import { useState } from 'react';
import { FieldProps } from 'react-jsonschema-form';

export const DataDrivenPhone: React.FC<FieldProps> = (props) => {
  const { formData, onChange, schema } = props;

  const [value, setValue] = useState(formData);
  const [isValid, setIsValid] = useState(true);

  const handleChange = (newValue: string) => {
    setIsValid(matchIsValidTel(newValue));
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <MuiTelInput
      value={value}
      onChange={handleChange}
      size='medium'
      defaultCountry='US'
      label={schema.title}
      error={!isValid}
    />
  );
};

export default DataDrivenPhone;
