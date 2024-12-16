import {
  Button,
  ButtonProps,
  Menu,
  MenuItem,
  MenuItemProps,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import { PangeaPayment, PangeaPaymentStatusEnum } from 'lib';
import { PaymentStatusChip } from '../shared';

import { DeleteForever } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ModeIcon from '@mui/icons-material/Mode';
import { AccordionContentBlock, RHSAccordion } from 'components/summarypanel';
import { format, parseISO } from 'date-fns';
import router from 'next/router';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  clientApiState,
  existingPaymentIdState,
  pangeaAlertNotificationMessageState,
} from 'atoms';
import { ConfirmCancelDialog } from 'components/modals';
import { useLoading } from 'hooks';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { PangeaColors } from 'styles';
import { isError } from 'lodash';
const StyledMenuItem = styled(MenuItem)<MenuItemProps>({
  textTransform: 'none',
});
export const TransactionSummary = ({ data }: { data: PangeaPayment }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const api = useRecoilValue(clientApiState);
  const setPangeaNotification = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const queryClient = useQueryClient();
  const apiHelper = api.getAuthenticatedApiHelper();
  const resetExistingPaymentId = useResetRecoilState(existingPaymentIdState);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const {
    loadingPromise: cancelPaymentPromise,
    loadingState: cancelPaymentLoadingState,
  } = useLoading();

  const handleCancelPaymentDialogClosed = useEventCallback(() => {
    setCancelDialogOpen(false);
  });
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditPayment = useEventCallback(() => {
    resetExistingPaymentId();
    router.push(`/transactions/payments?id=${id}`);
  });
  const handleCancelPayment = useEventCallback(() => {
    handleClose();
    setCancelDialogOpen(true);
  });

  const handleCancelPaymentConfirmed = useEventCallback(async () => {
    cancelPaymentPromise(
      (async () => {
        const deletePaymentResponse = await apiHelper.deletePaymentByIdAsync(
          id,
        );
        if (isError(deletePaymentResponse)) {
          setPangeaNotification({
            text: 'Error occurred while cancelling payment',
            severity: 'error',
          });
          return;
        }
        setPangeaNotification({
          text: 'Payment cancelled successfully',
          severity: 'success',
        });
        queryClient.invalidateQueries({
          queryKey: [`transaction-${id}`],
        });
        setCancelDialogOpen(false);
      })(),
    );
  });

  const { id, payment_status, modified, cashflows } = data;
  const transactionTime = cashflows[0]?.ticket?.transaction_time;
  const transactionDate = transactionTime
    ? parseISO(transactionTime)
    : new Date(modified);

  return (
    <>
      <Stack spacing={2} sx={{ paddingTop: '4rem' }}>
        <RHSAccordion title='Summary' defaultExpanded={true}>
          <AccordionContentBlock label='Status' autoWidthRight>
            <PaymentStatusChip status={payment_status} />
          </AccordionContentBlock>
          <AccordionContentBlock label='Transaction Date'>
            {format(parseISO(transactionDate.toISOString()), 'MM/dd/yyyy')}
          </AccordionContentBlock>
          <AccordionContentBlock label='Value Date'>
            {cashflows.length > 0
              ? format(
                  parseISO(new Date(cashflows[0].pay_date).toISOString()),
                  'MM/dd/yyyy',
                )
              : '-'}
          </AccordionContentBlock>
          <AccordionContentBlock
            label='Payment ID'
            labelRight={`${id}`}
          ></AccordionContentBlock>
          <AccordionContentBlock
            label='Ticket ID'
            labelRight={
              cashflows.length > 0
                ? cashflows[0]?.ticket?.ticket_id ?? '-'
                : '-'
            }
          ></AccordionContentBlock>
          {(() => {
            if (
              [
                PangeaPaymentStatusEnum.AwaitingFunds,
                PangeaPaymentStatusEnum.Scheduled,
                PangeaPaymentStatusEnum.Working,
                PangeaPaymentStatusEnum.Drafting,
              ].includes(payment_status)
            ) {
              return (
                <AccordionContentBlock>
                  <Button
                    aria-label='manage payment'
                    id='manage-button'
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup='true'
                    onClick={handleClick}
                    variant='outlined'
                    fullWidth
                    sx={{ justifyContent: 'space-between' }}
                    endIcon={<ArrowDropDownIcon />}
                  >
                    Manage
                  </Button>
                  <Menu
                    id='long-menu'
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      sx: { width: '15rem', maxWidth: 'auto' },
                    }}
                    sx={{ width: '15rem', maxWidth: 'auto' }}
                  >
                    {(() => {
                      if (
                        payment_status &&
                        [
                          PangeaPaymentStatusEnum.Scheduled,
                          PangeaPaymentStatusEnum.Working,
                          PangeaPaymentStatusEnum.Drafting,
                        ].includes(payment_status)
                      ) {
                        return (
                          <StyledMenuItem onClick={handleEditPayment}>
                            <ModeIcon sx={{ paddingRight: '32px' }} />
                            Edit payment
                          </StyledMenuItem>
                        );
                      }
                    })()}
                    {(() => {
                      if (
                        payment_status &&
                        [
                          PangeaPaymentStatusEnum.Scheduled,
                          PangeaPaymentStatusEnum.Working,
                          PangeaPaymentStatusEnum.AwaitingFunds,
                          PangeaPaymentStatusEnum.Drafting,
                        ].includes(payment_status)
                      ) {
                        return (
                          <StyledMenuItem onClick={handleCancelPayment}>
                            <DeleteForever sx={{ paddingRight: '32px' }} />
                            Cancel payment
                          </StyledMenuItem>
                        );
                      }
                    })()}
                  </Menu>
                </AccordionContentBlock>
              );
            }
          })()}
        </RHSAccordion>
      </Stack>
      <ConfirmCancelDialog
        title='Cancel Payment?'
        open={cancelDialogOpen}
        description='Are you sure your want to cancel this payment? This action cannot be undone.'
        confirmButtonColorOverride={PangeaColors.RiskBerryMedium}
        onClick={handleCancelPaymentConfirmed}
        onCancel={handleCancelPaymentDialogClosed}
        cancelButtonText='Abort'
        cancelButtonProps={{
          variant: 'text',
          disabled: cancelPaymentLoadingState.isLoading,
        }}
        confirmButtonText='Cancel Payment'
        confirmButtonProps={
          {
            color: 'error',
            loading: cancelPaymentLoadingState.isLoading,
          } as Partial<ButtonProps>
        }
        preventBackdropClose
      />
    </>
  );
};
export default TransactionSummary;
