import {
  activeOriginalHedgeState,
  clientApiState,
  pangeaAlertNotificationMessageState,
  settlementDetailsState,
  userState,
} from 'atoms';
import { PangeaLoading } from 'components/shared';
import {
  Cashflow,
  PangeaInstructDealRequestDeliveryMethodEnum,
  PangeaUpdateRequestTypeEnum,
} from 'lib';
import { isError } from 'lodash';
import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ForwardsFirstStep from './ForwardsFirstStep';
import ForwardsSecondStep from './ForwardsSecondStep';

export interface ForwardManagementModalContentProps {
  mode: PangeaUpdateRequestTypeEnum;
  forwardId: string;
  onClose: () => void;
}

type ContentStepperProps = {
  mode: PangeaUpdateRequestTypeEnum;
  activeStep: number;
  onChangeStep: (val: number, details: string) => void;
  onClose: () => void;
};
export const ForwardManagementModalContent = (
  props: ForwardManagementModalContentProps,
) => {
  const { mode, onClose } = props;
  const [activeStep, setActiveStep] = useState(0);
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const editSettlementDetails = useRecoilValue(settlementDetailsState);
  const user = useRecoilValue(userState);
  const apiHelper = useRecoilValue(clientApiState);
  const activeOriginalHedge = useRecoilValue(activeOriginalHedgeState);
  const handleSubmitRequest = async (step: number, details: string) => {
    if (!user) return;
    try {
      const api = apiHelper.getAuthenticatedApiHelper();
      if (mode === 'ndf') {
        const hedge = activeOriginalHedge as Cashflow;
        if (activeOriginalHedge) {
          const updateFwHedgeItemResponse =
            await api.corPayHedgeForwardupdateAsync(hedge.accountId, {
              is_cash_settle: editSettlementDetails.is_cash_settle,
              cash_settle_account: editSettlementDetails.cash_settle_account,
              origin_account: editSettlementDetails.origin_account,
              destination_account: editSettlementDetails.destination_account,
              funding_account: editSettlementDetails.funding_account,
              purpose_of_payment: editSettlementDetails.purpose_of_payment,
              status: activeOriginalHedge.ui_status.toString(),
              risk_reduction: 0,
              fxpair: '',
              estimated_fx_forward_price: 0,
              destination_account_type:
                PangeaInstructDealRequestDeliveryMethodEnum.W, // TODO: SHOULD BE OPTIONAL
            });

          if (isError(updateFwHedgeItemResponse)) {
            setPangeaAlertNotificationMessage({
              severity: 'error',
              text: 'Error updating forward hedge item',
            });
          }
        }
        setPangeaAlertNotificationMessage({
          severity: 'success',
          text: 'The request has been sent',
        });
        setActiveStep(step);
      } else {
        const res = await api.sendCashflowUpdateMessageAsync(
          mode,
          details,
          user?.id ?? 0,
        );
        if (res && !isError(res)) {
          setPangeaAlertNotificationMessage({
            severity: 'success',
            text: 'The request has been sent',
          });
          setActiveStep(step);
        }
      }
    } catch {
      setPangeaAlertNotificationMessage({
        severity: 'error',
        text: 'There was an error with sendCashflowUpdateMessageAsync.',
      });
    }
  };
  const ContentStepper = ({
    mode,
    activeStep,
    onChangeStep,
    onClose,
  }: ContentStepperProps) => {
    switch (activeStep) {
      case 0:
        return (
          <ForwardsFirstStep
            onClose={onClose}
            mode={mode}
            onChangeStep={onChangeStep}
          />
        );
      case 1:
        return <ForwardsSecondStep onClose={onClose} mode={mode} />;
      default:
        return <PangeaLoading loadingPhrase='Loading ...' />;
    }
  };

  return (
    <>
      <ContentStepper
        mode={mode}
        activeStep={activeStep}
        onChangeStep={handleSubmitRequest}
        onClose={onClose}
      />
    </>
  );
};
