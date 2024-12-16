import { Stack, Typography } from '@mui/material';
import { PangeaSimpleDialog } from '../modals';
import { PangeaButton } from '../shared';

export const ChangeFrequencyModal = ({
  onClickChange,
  open = false,
}: {
  open?: boolean;
  onClickChange?: () => void;
}) => {
  return (
    <PangeaSimpleDialog
      title='Change Frequency?'
      variant='outlined'
      width={'380px'}
      minHeight={'unset'}
      openModal={open}
      noButton
    >
      <Typography>
        This will discard any information you may have entered.
      </Typography>
      <Stack direction={'row'} mt={4} spacing={2}>
        <PangeaButton
          size='large'
          variant='outlined'
          href='/cashflow/details/direction'
        >
          Keep my settings
        </PangeaButton>

        <PangeaButton
          onClick={onClickChange}
          href='/cashflow/details/frequency'
          size='large'
        >
          Change Frequency
        </PangeaButton>
      </Stack>
    </PangeaSimpleDialog>
  );
};
export default ChangeFrequencyModal;
