import { JSONSchema6 } from 'json-schema';

import useEventCallback from '@mui/utils/useEventCallback';
import { clientApiState } from 'atoms';
import { PangeaValidationSchemaRequest } from 'lib';
import { isError } from 'lodash';
import { useRecoilValue } from 'recoil';

type UseBeneficiaryManagementParams = {
  validationSchemaRequest: PangeaValidationSchemaRequest;
};
type SplitProps = {
  properties: JSONSchema6;
  required: string[];
  steps: string[][];
};
type UseBeneficiaryManagementReturnType = {
  getValidationSchema: (
    params: UseBeneficiaryManagementParams,
  ) => Promise<JSONSchema6 | Error | null>;
  splitPropertiesIntoGroups: ({
    properties,
    required,
    steps,
  }: SplitProps) => JSONSchema6[];
};

const mappedKeys = [
  'client_legal_entity',
  'classification',
  'payment_methods',
  'settlement_methods',
  'preferred_method',
  'destination_country',
  'destination_currency',
  'beneficiary_alias',
  'default_purpose',
  'default_purpose_description',
];
export const useBeneficiaryManagement =
  (): UseBeneficiaryManagementReturnType => {
    const authHelper = useRecoilValue(clientApiState);
    const apiHelper = authHelper.getAuthenticatedApiHelper();

    const getValidationSchema = useEventCallback(
      async ({ validationSchemaRequest }: UseBeneficiaryManagementParams) => {
        if (
          validationSchemaRequest.bank_country &&
          validationSchemaRequest.beneficiary_account_type &&
          validationSchemaRequest.payment_method &&
          validationSchemaRequest.destination_country &&
          validationSchemaRequest.bank_currency
        ) {
          try {
            const res = await apiHelper.getBeneficiaryValidationSchema(
              validationSchemaRequest,
            );
            if (res && !isError(res)) {
              return res as JSONSchema6;
            } else if (isError(res)) {
              return res;
            } else {
              return null;
            }
          } catch (error) {
            console.error(error);
            return null;
          }
        }
        return null;
      },
    );

    const splitPropertiesIntoGroups = ({
      properties,
      required,
      steps,
    }: SplitProps): JSONSchema6[] => {
      mappedKeys.forEach((key: string) => {
        delete (properties as { [key: string]: any })[key];
        const keyIndex = required.indexOf(key);
        if (keyIndex !== -1) {
          required.splice(keyIndex, 1);
        }
      });
      mappedKeys.forEach((key: string) => {
        delete (properties as { [key: string]: any })[key];
        const keyIndex = required.indexOf(key);
        if (keyIndex !== -1) {
          required.splice(keyIndex, 1);
        }
      });

      const stepGroups = steps.map((step) => ({
        step,
        schema: {
          properties: {} as Record<string, JSONSchema6>,
          required: [] as string[],
        },
      }));

      const requiredFields = [...required];

      Object.entries(properties).forEach(([key, value]) => {
        stepGroups.forEach(({ step, schema }) => {
          if (step.includes(key)) {
            schema.properties[key] = value as JSONSchema6;
            if (required?.includes(key)) {
              schema.required.push(key);
              const index = requiredFields.indexOf(key);
              if (index !== -1) {
                requiredFields.splice(index, 1);
              }
            }
          }
        });
      });

      const additionalFields = {
        step: [],
        schema: {
          properties: {} as Record<string, JSONSchema6>,
          required: [] as string[],
        },
      };
      requiredFields.forEach((key: string) => {
        additionalFields.schema.properties[key] = (
          properties as Record<string, JSONSchema6>
        )[key];
        additionalFields.schema.required.push(key);
      });
      stepGroups.push(additionalFields);
      return stepGroups.map(({ schema }) => schema);
    };

    return {
      getValidationSchema,
      splitPropertiesIntoGroups,
    };
  };

export default useBeneficiaryManagement;
