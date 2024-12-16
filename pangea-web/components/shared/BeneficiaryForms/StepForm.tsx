import { Divider, SxProps } from '@mui/material';
import { JSONSchema6 } from 'json-schema';
import { Dispatch, SetStateAction } from 'react';
import { PangeaColors } from 'styles';
import DataDrivenForm from '../DataDrivenComponents/DataDrivenForm';

type StepFormProps = {
  setValidity: Dispatch<SetStateAction<boolean>>;
  schema1: JSONSchema6;
  schema2?: JSONSchema6;
  title1: string;
  title2?: string;
  sx1?: SxProps;
  sx2?: SxProps;
  requiredFields: string[];
  loading: boolean;
};

export function StepForm({
  schema1,
  schema2,
  title1,
  title2,
  setValidity,
  requiredFields,
  loading = false,
  sx1,
  sx2,
}: StepFormProps): JSX.Element {
  return (
    <>
      {!loading && (
        <>
          <DataDrivenForm
            setValidity={setValidity}
            schema={schema1}
            requiredFields={requiredFields}
            title={title1}
            sx={sx1}
          />
          {title2 && schema2 && (
            <>
              <Divider sx={{ borderColor: PangeaColors.Gray }} />
              <DataDrivenForm
                setValidity={setValidity}
                schema={schema2}
                requiredFields={requiredFields}
                title={title2}
                sx={sx2}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

export default StepForm;
