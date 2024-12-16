import { Stack, SxProps, Typography } from '@mui/material';
import { beneficiaryCreatePayloadState } from 'atoms';
import { JSONSchema6 } from 'json-schema';
import { JSONFormChangeProps } from 'lib';
import { Dispatch, SetStateAction, useCallback } from 'react';
import Form from 'react-jsonschema-form';
import { useRecoilState } from 'recoil';
import { STACK_STYLES, UI_SCHEMA, UI_WIDGET_MAP } from '../BeneficiaryForms';
import ArrayFieldTemplate from './ArrayFieldTemplate';
import DataDrivenPhone from './DataDrivenPhone';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';

type DataDrivenFormProps = {
  setValidity: Dispatch<SetStateAction<boolean>>;
  schema: JSONSchema6;
  requiredFields: string[];
  title: string;
  sx?: SxProps;
};

export function DataDrivenForm({
  schema,
  setValidity,
  requiredFields,
  title,
  sx,
}: DataDrivenFormProps): JSX.Element {
  const [createBeneficiaryPayload, setCreateBeneficiaryPayload] =
    useRecoilState(beneficiaryCreatePayloadState);
  const handleFormChange = useCallback(
    ({ errors, formData }: JSONFormChangeProps) => {
      const isFormValid =
        errors.length > 0 &&
        !errors.some((error) =>
          requiredFields.includes(error.property.replace(/\./gi, '')),
        );
      setValidity(errors.length === 0 || isFormValid);
      setCreateBeneficiaryPayload(formData);
    },
    [requiredFields, setCreateBeneficiaryPayload, setValidity],
  );

  return (
    <>
      <Stack spacing={1} sx={sx ?? STACK_STYLES}>
        <Typography>{title}</Typography>
        <Form
          schema={schema}
          widgets={UI_WIDGET_MAP}
          uiSchema={UI_SCHEMA}
          fields={{
            customObject: ObjectFieldTemplate,
            phone: DataDrivenPhone,
          }}
          liveValidate
          onChange={handleFormChange}
          ArrayFieldTemplate={ArrayFieldTemplate}
          showErrorList={false}
          FieldTemplate={FieldTemplate}
          formData={createBeneficiaryPayload}
        />
      </Stack>
    </>
  );
}

export default DataDrivenForm;
