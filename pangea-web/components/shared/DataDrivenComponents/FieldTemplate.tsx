import { Stack } from '@mui/material';
import { FieldTemplateProps } from 'react-jsonschema-form';

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { classNames, help, children } = props;

  return (
    <Stack className={classNames}>
      {children}
      {help}
    </Stack>
  );
};

export default FieldTemplate;
