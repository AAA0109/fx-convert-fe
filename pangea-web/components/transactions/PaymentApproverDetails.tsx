import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { PangeaApprover } from 'lib';
import { useState } from 'react';
import { PangeaColors } from 'styles';

type PaymentApproverDetailsProps = {
  approvers?: PangeaApprover[];
  isRequired?: boolean;
  onApproverChange?: (approver: PangeaApprover[]) => void;
};

export const PaymentApproverDetails = ({
  isRequired = false,
  approvers = [],
  onApproverChange,
}: PaymentApproverDetailsProps): JSX.Element | null => {
  const [selectedValues, setSelectedValues] = useState<Array<number>>([]);

  if (isRequired === false) {
    return null;
  }

  const handleMultiSelectChange = (event: SelectChangeEvent<number[]>) => {
    const selected = event.target.value as number[];
    if (selected.includes(-1)) {
      const isAllApproversSelected = selectedValues.length === approvers.length;
      const newSelectedValues = isAllApproversSelected
        ? []
        : approvers.map(({ id }) => id);
      setSelectedValues(newSelectedValues);
      onApproverChange?.(isAllApproversSelected ? [] : approvers);
    } else {
      setSelectedValues(selected);
      onApproverChange?.(approvers.filter(({ id }) => selected.includes(id)));
    }
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      bgcolor={PangeaColors.White}
      border={`1px solid ${PangeaColors.Gray}`}
      margin='2rem auto 0 auto'
      width='100%'
      maxWidth='35.35rem'
      p={3}
      rowGap={1}
    >
      <Typography variant='body2'>
        This transaction requires approval. Select an approver:
      </Typography>
      <FormControl sx={{ minWidth: 516 }} data-testid='payment-approver-select'>
        <InputLabel
          id={`approver-label`}
          htmlFor='approver-select'
          aria-label='Approver'
        >
          Approver
        </InputLabel>
        <Select<Array<number>>
          id='approver-select'
          value={selectedValues}
          multiple
          sx={{
            textAlign: 'left',
            maxHeight: '57px',
            '& .MuiSelect-select': {
              paddingTop: '27px',
              paddingBottom: '0px',
            },
          }}
          onChange={handleMultiSelectChange}
          renderValue={(selected) =>
            selected
              .map((id) => {
                const approver = approvers.find(
                  ({ id: approverId }) => approverId === id,
                );
                return approver
                  ? `${approver.first_name} ${approver.last_name}`
                  : '';
              })
              .join(', ')
          }
        >
          <MenuItem value={-1}>
            <Checkbox
              checked={selectedValues.length === approvers.length}
              indeterminate={
                selectedValues.length > 0 &&
                selectedValues.length < approvers.length
              }
            />
            Select all approvers
          </MenuItem>
          {approvers.map(({ id, first_name, last_name }) => (
            <MenuItem key={id} value={id}>
              <Checkbox checked={selectedValues.includes(id)} />
              {first_name} {last_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant='body2' color={PangeaColors.SolidSlateLight}>
        The selected execution method will activate immediately upon approval.
      </Typography>
    </Box>
  );
};

export default PaymentApproverDetails;
