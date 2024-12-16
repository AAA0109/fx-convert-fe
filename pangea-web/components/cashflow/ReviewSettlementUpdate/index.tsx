import { SelectChangeEvent, Stack } from '@mui/material';

import {
  activeHedgeState,
  clientApiState,
  currentForwardHedgeItem,
  pangeaAlertNotificationMessageState,
} from 'atoms';
import { PangeaLoading } from 'components/shared';
import { useCashflowHelpers, useLoading } from 'hooks';
import { PangeaFeeResponse, PangeaPatchedDraftFxForward } from 'lib';
import { isError } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import PayingSettlementReview from './PayingSettlementReview';
import ReceivingSettlementReview from './ReceivingSettlementReview';

const ReviewSettlementUpdate = ({
  brokerFees,
}: {
  brokerFees?: Nullable<PangeaFeeResponse>;
}): JSX.Element => {
  const { allWalletCurrencies } = useCashflowHelpers();
  const { loadingPromise } = useLoading();
  const authHelper = useRecoilValue(clientApiState);

  const [selectedHedgeItem, setSelectedHedgeItem] = useRecoilState(
    currentForwardHedgeItem,
  );
  const setPangeaAlertNotificationMessage = useSetRecoilState(
    pangeaAlertNotificationMessageState,
  );
  const activeHedge = useRecoilValue(activeHedgeState);
  const walletAvailable = useMemo(() => {
    return allWalletCurrencies
      .map((curr) => curr.currency.mnemonic)
      .includes(activeHedge?.currency?.toString() ?? '');
  }, [allWalletCurrencies, activeHedge]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const processSettlementChangeAsync = async (
    data: PangeaPatchedDraftFxForward,
  ) => {
    const api = authHelper.getAuthenticatedApiHelper();
    if (data.id) {
      const updateFwHedgeItemResponse =
        await api.corPayHedgeForwardPartialupdateAsync(data.id, data);
      if (isError(updateFwHedgeItemResponse)) {
        setPangeaAlertNotificationMessage({
          severity: 'error',
          text: 'Error updating forward hedge item',
        });
        return;
      }
      setSelectedHedgeItem(updateFwHedgeItemResponse);
    }
  };
  const handleSettlementDetailsChange = useCallback(
    async (event: SelectChangeEvent) => {
      const data = {
        ...selectedHedgeItem,
        [event.target.name]: event.target.value,
        ...(activeHedge.direction === 'receiving' && {
          is_cash_settle: true,
        }),
      };
      loadingPromise(processSettlementChangeAsync(data));
    },
    [
      activeHedge.direction,
      loadingPromise,
      selectedHedgeItem,
      processSettlementChangeAsync,
    ],
  );

  const ContentStepper = useMemo(() => {
    switch (activeHedge.direction) {
      case 'paying':
        return (
          <PayingSettlementReview
            walletAvailable={walletAvailable}
            activeHedge={activeHedge}
            handleSettlementDetailsChange={handleSettlementDetailsChange}
            brokerFees={brokerFees}
            updateSettlementDetails={processSettlementChangeAsync}
          />
        );
      case 'receiving':
        return (
          <ReceivingSettlementReview
            walletAvailable={walletAvailable}
            activeHedge={activeHedge}
            handleSettlementDetailsChange={handleSettlementDetailsChange}
            updateSettlementDetails={processSettlementChangeAsync}
          />
        );
      default:
        return <PangeaLoading loadingPhrase='Loading ...' />;
    }
  }, [
    activeHedge,
    brokerFees,
    handleSettlementDetailsChange,
    processSettlementChangeAsync,
    walletAvailable,
  ]);
  return (
    <Stack direction='column' spacing={1}>
      {ContentStepper}
    </Stack>
  );
};

export default ReviewSettlementUpdate;
