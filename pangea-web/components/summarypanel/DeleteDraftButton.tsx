import RightArrowIcon from '@mui/icons-material/ArrowForward';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button } from '@mui/material';
import useEventCallback from '@mui/utils/useEventCallback';
import { activeHedgeState, clientApiState } from 'atoms';
import { useCashflowHelpers } from 'hooks';
import { Cashflow, Installment } from 'lib';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { ConfirmCancelDialog } from '../modals/ConfirmCancelDialog';

export const DeleteDraftButton = () => {
  const authHelper = useRecoilValue(clientApiState);
  const hedgeItem = useRecoilValue(activeHedgeState);
  const router = useRouter();
  const {
    deleteDraftAsync,
    loadFromExistingInstallmentToStateAsync,
    loadFromExistingCashflowToStateAsync,
  } = useCashflowHelpers();
  const [open, setOpen] = useState(false);

  const handleBusinessLogic = useEventCallback(async () => {
    if (!hedgeItem) {
      return;
    }

    const draftsToDelete: Cashflow[] = [];
    if (hedgeItem.type === 'installments' && hedgeItem.installment_id) {
      const installment = await Installment.fromInstallmentIdAsync(
        hedgeItem.installment_id,
        authHelper,
        true,
      );
      installment &&
        installment.cashflows.forEach((c) => draftsToDelete.push(c));
    } else {
      const cashflow = hedgeItem as Cashflow;
      if (cashflow.cashflow_id) {
        const c = await Cashflow.fromCashflowIdAsync(
          cashflow.cashflow_id,
          authHelper,
        );
        c && draftsToDelete.push(c);
      }
    }
    await Promise.all(
      draftsToDelete.map(async (cashflow: Cashflow) => {
        if (cashflow.isFromDraftObject()) {
          await deleteDraftAsync(cashflow);
        } else if (cashflow.childDraft) {
          await deleteDraftAsync(Cashflow.fromDraftObject(cashflow.childDraft));
        }
      }),
    );

    // in this case, we have an underlying active cashflow so we'll stay on
    // this page and just refresh the data from the API.
    let doNotRedirectToGrid = false;
    if (hedgeItem.type === 'installments' && hedgeItem.installment_id) {
      doNotRedirectToGrid = await loadFromExistingInstallmentToStateAsync(
        hedgeItem.installment_id,
        true,
        false,
      );
    } else {
      doNotRedirectToGrid = await loadFromExistingCashflowToStateAsync(
        (hedgeItem as Cashflow).cashflow_id ?? -1,
        true,
        false,
      );
    }

    setOpen(false);
    if (!doNotRedirectToGrid) {
      router.push('/dashboard/cashflows');
    }
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
        variant='text'
        color='primary'
        size='medium'
        onClick={handleClickOpen}
        startIcon={<DeleteForeverIcon />}
        sx={{
          height: '42px',
          justifyContent: 'center',
        }}
      >
        Delete This Draft
      </Button>
      <ConfirmCancelDialog
        title='Delete Draft?'
        open={open}
        alert={{
          color: 'warning',
          text: 'Your existing hedge will not be affected, but drafted changes will be deleted.',
        }}
        confirmButtonColorOverride={PangeaColors.CautionYellowMedium}
        onClick={handleBusinessLogic}
        onCancel={handleClose}
        cancelButtonText='Continue Drafting Changes'
        cancelButtonProps={{ endIcon: <RightArrowIcon />, color: 'warning' }}
        confirmButtonText='Delete Draft'
        stackButtons
      />
    </>
  );
};
export default DeleteDraftButton;
