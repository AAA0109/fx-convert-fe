import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { CustomerGroup, CustomerGroupOptions, PangeaGroupEnum } from 'lib';
import { PangeaColors } from 'styles';

type Props = {
  value?: CustomerGroup;
  onChange: (permission: CustomerGroup) => void;
  disabled?: boolean;
};

const PERMISSION_OPTIONS_MAP: Record<
  CustomerGroup,
  Record<'description' | 'label', string>
> = {
  [PangeaGroupEnum.CustomerCreator]: {
    label: 'Creator',
    description:
      'Create/edit hedges to be approved by manager or admin. Cannot manage margin deposits/withdrawals.',
  },
  [PangeaGroupEnum.CustomerViewer]: {
    label: 'Viewer',
    description:
      'View only permissions for cash flows, margin and performance.',
  },
  [PangeaGroupEnum.CustomerManager]: {
    label: 'Manager',
    description:
      'Ability to approve hedges as well as manage margin deposits/withdrawals.',
  },
  [PangeaGroupEnum.CustomerAdmin]: {
    label: 'Admin',
    description:
      'Ability to approve hedges, manage margin deposits/withdrawals, as well as manage users/permissions.',
  },
  [PangeaGroupEnum.CustomerCorpay]: {
    label: 'CorPay',
    description:
      'Ability to ciew cash flows and perform CorPay wallet/payment transactions',
  },
  [PangeaGroupEnum.CustomerIbkr]: {
    label: 'IBKR',
    description: 'Ability to create and manage hedges',
  },
  [PangeaGroupEnum.AdminGroup]: {
    label: 'Approval Admin',
    description: 'Ability to approve and change transaction limits',
  },
  [PangeaGroupEnum.AccountOwnerGroup]: {
    label: 'Account Owner',
    description: 'Account Owner description.',
  },
  [PangeaGroupEnum.ManagerGroup]: {
    label: 'Approval Manager',
    description: 'Ability to approve transactions requiring approval.',
  },
};

export function PangeaPermissionSelector({
  value = PangeaGroupEnum.CustomerViewer,
  onChange,
  disabled = false,
}: Props) {
  const handlePermissionChange = (event: SelectChangeEvent<CustomerGroup>) => {
    const permission = event.target.value as CustomerGroup;
    onChange(permission);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id='select-permission'>Role</InputLabel>
      <Select
        fullWidth
        required
        labelId='select-permission'
        id='select-permission'
        value={value}
        onChange={handlePermissionChange}
        label='Permission'
        disabled={disabled}
        autoWidth={false}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: PangeaColors.White,
            },
          },
        }}
      >
        {Object.values(CustomerGroupOptions).map((value, i) => {
          return (
            <MenuItem
              key={i}
              value={value as string}
              sx={{ maxWidth: '392px', padding: '1rem 1.25rem' }}
            >
              <Stack>
                <Typography
                  variant='h6'
                  sx={{
                    textTransform: 'capitalize',
                    lineHeight: '1.5rem',
                    marginBottom: '.3rem',
                  }}
                >
                  {PERMISSION_OPTIONS_MAP[value].label}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    color: PangeaColors.BlackSemiTransparent99,
                    whiteSpace: 'normal',
                    lineHeight: '1.25rem',
                    textTransform: 'none',
                  }}
                >
                  {PERMISSION_OPTIONS_MAP[value].description}
                </Typography>
              </Stack>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
export default PangeaPermissionSelector;
