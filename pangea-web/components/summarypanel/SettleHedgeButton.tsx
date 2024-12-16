import { Cancel } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  activeHedgeState,
  selectedAccountIdState,
  singleMarginAndFeesDetailsCacheState,
} from 'atoms';
import { useCashflowHelpers } from 'hooks';
import { PangeaCurrencyEnum, formatCurrency, formatString } from 'lib';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ConfirmCancelDialog } from '../modals/ConfirmCancelDialog';

type ConfirmationType = 'NEGATIVE' | 'POSITIVE';

const MARGIN_COPY: Record<ConfirmationType, Record<string, string>> = {
  NEGATIVE: {
    confirmText:
      'By settling this hedge early, internal liquidity will be impacted and you will need to immediately deposit {0} margin. Please visit the margin health page after settlement to confirm required margin.',
    confirmLabel: 'MARGIN REQUIRED AFTER SETTLING',
  },
  POSITIVE: {
    confirmText:
      'By settling this hedge early, {0} of margin will become available within the next 24 hours.',
    confirmLabel: 'MARGIN AVAILABLE WITHIN 24 HOURS',
  },
};

const ConfirmationDescription = (): JSX.Element => {
  const router = useRouter();
  const account_id = useRecoilValue(selectedAccountIdState);
  const { cashflow_id } = router.query;
  const marginAndFeePayload = {
    account_id: Number(account_id),
    draft_ids: [Number(cashflow_id)],
    deleted_cashflow_ids: [Number(cashflow_id)],
  };
  const marginFeeData = useRecoilValue(
    singleMarginAndFeesDetailsCacheState(marginAndFeePayload),
  );
  const confirmationType: ConfirmationType = useMemo(
    () =>
      marginFeeData?.margin_required &&
      Number(marginFeeData.margin_required) > 0
        ? 'NEGATIVE'
        : 'POSITIVE',
    [marginFeeData],
  );

  const amount =
    confirmationType === 'POSITIVE'
      ? marginFeeData?.margin_available
      : marginFeeData?.margin_required;

  const amountToDisplay = formatCurrency(
    parseFloat(amount ?? '0'),
    PangeaCurrencyEnum.USD,
    true,
    2,
    2,
  );
  return (
    <>
      <Typography variant='body1'>
        {formatString(
          MARGIN_COPY[confirmationType].confirmText,
          amountToDisplay,
        )}
      </Typography>
      <Stack>
        <Typography variant='dataLabel'>
          {MARGIN_COPY[confirmationType].confirmLabel}
        </Typography>
        <Typography variant='h5'>{amountToDisplay}</Typography>
      </Stack>
    </>
  );
};

export const SettleHedgeButton = ({
  onClick,
  label,
}: {
  onClick: (() => void) | null;
  label?: string;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const activeHedge = useRecoilValue(activeHedgeState);

  const { deleteHedgeItemAsync } = useCashflowHelpers();

  const handleBusinessLogic = useEventCallback(async () => {
    const result = await deleteHedgeItemAsync(activeHedge.clone());
    setOpen(false);
    if (result) {
      router.push('/manage/settle-success');
    }

    //TODO: error handling?
  });
  const handleClickOpen = useEventCallback(() => {
    setOpen(true);
  });
  const handleClose = useEventCallback(() => {
    setOpen(false);
  });
  return (
    <>
      <Button
        color='primary'
        size='medium'
        onClick={() => (onClick ? onClick() : handleClickOpen())}
        sx={{
          height: '42px',
          width: '100%',
          justifyContent: 'start',
          paddingX: 3,
        }}
        startIcon={<Cancel sx={{ marginLeft: 0 }} />}
      >
        {label || 'Settle this hedge early'}
      </Button>
      <ConfirmCancelDialog
        title='Settle Hedge?'
        description={<ConfirmationDescription />}
        open={open}
        alert={{ color: 'error', text: 'This action cannot be undone!' }}
        onClick={handleBusinessLogic}
        onCancel={handleClose}
        confirmation={{
          keyword: 'settle',
          buttonText: 'Settle Hedge Early',
          prompt: "Type the word '{0}' to confirm hedge termination.",
        }}
      />
    </>
  );
};
export default SettleHedgeButton;
