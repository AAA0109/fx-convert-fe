import { SxProps } from '@mui/material';
import { UiSchema, Widget } from 'react-jsonschema-form';
import { PangeaColors } from 'styles';
import {
  DataDrivenDate,
  DataDrivenInput,
  DataDrivenSelect,
  DataDrivenTextarea,
} from '../DataDrivenComponents';

export const BeneficiaryDetails = [
  'beneficiary_account_type',
  'beneficiary_name',
  'beneficiary_phone',
  'beneficiary_email',
];

export const BeneficiaryAddress = [
  'beneficiary_country',
  'beneficiary_address_1',
  'beneficiary_address_2',
  'beneficiary_city',
  'beneficiary_region',
  'beneficiary_postal',
];

export const BankDetails = [
  'bank_name',
  'bank_account_type',
  'bank_account_number_type',
  'bank_account_number',
  'bank_routing_code_type_1',
  'bank_routing_code_value_1',
];

export const BankAddress = [
  'bank_country',
  'bank_region',
  'bank_city',
  'bank_postal',
  'bank_address_1',
  'bank_address_2',
];

// export const BankAddress = [
//   'bank_country',
//   'beneficiary_region',
//   'bank_city',
//   'beneficiary_postal',
//   'bank_address_1',
//   'bank_address_2',
// ];

export const UI_SCHEMA: UiSchema = {
  additional_fields: {
    'ui:field': 'customObject',
  },
  regulatory: {
    'ui:field': 'customObject',
  },
  bank_instruction: {
    'ui:widget': 'textarea',
  },
  default_purpose_description: {
    'ui:widget': 'textarea',
  },
  beneficiary_phone: {
    'ui:field': 'phone',
  },
  'ui:order': [
    ...BeneficiaryDetails,
    ...BeneficiaryAddress,
    ...BankDetails,
    ...BankAddress,
    '*',
  ],
};

export const STACK_STYLES: SxProps = {
  '& button[type=submit], & .control-label, & .panel-default': {
    display: 'none',
  },
  '& form fieldset': {
    border: '0 none',
    display: 'flex',
    padding: 0,
    flexDirection: 'column',
    rowGap: 2,
  },
};

const BASE_BENEFICIARY_STYLE: SxProps = {
  '& button[type=submit], & .control-label, & .panel-default': {
    display: 'none',
  },
  '& form fieldset': {
    border: 'none',
    display: 'grid',
    padding: 0,
    rowGap: 2,
    columnGap: 2,
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr',
    width: '100%',
  },
  '& form fieldset .form-group': {
    gridColumn: '1 / -1',
  },
};

export const BENEFICIARY_STYLE_1: SxProps = {
  ...BASE_BENEFICIARY_STYLE,
  '& form fieldset .form-group:nth-child(2), & form fieldset .form-group:nth-child(3)':
    {
      display: 'grid',
      gridColumn: 'span 1',
    },
};

export const BENEFICIARY_STYLE_2: SxProps = {
  ...BASE_BENEFICIARY_STYLE,
  '& form fieldset .form-group:nth-last-child(2), & form fieldset .form-group:nth-last-child(1)':
    {
      display: 'grid',
      gridColumn: 'span 1',
    },
};

export const BANK_ADDRESS_STYLE: SxProps = {
  ...BASE_BENEFICIARY_STYLE,
  '& form fieldset .form-group:nth-last-child(2), & form fieldset .form-group':
    {},
};

export const UI_WIDGET_MAP: {
  [name: string]: Widget;
} = {
  TextWidget: DataDrivenInput,
  TextareaWidget: DataDrivenTextarea,
  DateWidget: DataDrivenDate,
  SelectWidget: DataDrivenSelect,
  EmailWidget: DataDrivenInput,
};

export const ToggleButtonGroupCustomStyle: SxProps = {
  '& .MuiToggleButton-root': {
    '&.Mui-selected': {
      backgroundColor: PangeaColors.StoryWhiteDark,
      transition: 'all 300ms ease',
    },
    '&:hover': {
      backgroundColor: PangeaColors.StoryWhiteLight,
      transition: 'all 300ms ease',
    },
  },
};
