import { Stack, Typography } from '@mui/material';

import { activeHedgeState } from 'atoms';
import { PangeaLoading } from 'components/shared';
import { useCashflowHelpers } from 'hooks';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import PayingSettlementReview from './PayingSettlementReview';
import ReceivingSettlementReview from './ReceivingSettlementReview';

const ReviewSettlementUpdate: React.FC = () => {
  const { allWalletCurrencies } = useCashflowHelpers();
  const activeHedge = useRecoilValue(activeHedgeState);
  const walletAvailable = useMemo(() => {
    return allWalletCurrencies
      .map((curr) => curr.currency.mnemonic)
      .includes(activeHedge?.currency?.toString() ?? '');
  }, [allWalletCurrencies, activeHedge]);

  const ContentStepper = () => {
    switch (activeHedge.direction) {
      case 'paying':
        return (
          <PayingSettlementReview
            walletAvailable={walletAvailable}
            activeHedge={activeHedge}
          />
        );
      case 'receiving':
        return (
          <ReceivingSettlementReview
            walletAvailable={walletAvailable}
            activeHedge={activeHedge}
          />
        );
      default:
        return <PangeaLoading loadingPhrase='Loading ...' />;
    }
  };
  return (
    <Stack direction='column' spacing={1}>
      <Typography variant='h5' component='h5'>
        SETTLEMENT
      </Typography>
      {ContentStepper()}
    </Stack>
  );
};

export default ReviewSettlementUpdate;
