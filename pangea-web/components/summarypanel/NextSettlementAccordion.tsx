import { Skeleton, Stack } from '@mui/material';
import { activeHedgeState, activeOriginalHedgeState } from 'atoms';
import { useCashflow } from 'hooks';
import { useRecoilValue } from 'recoil';

import { RHSAccordion } from './RHSAccordion';
import SummaryContent_CashflowAmountUSD from './SummaryContent_CashflowAmountUSD';
import SummaryContent_Currency from './SummaryContent_CashflowCurrency';
import SummaryContent_Expiration from './SummaryContent_Expiration';

export const NextSettlementAccordion = () => {
  const { isLoaded } = useCashflow({
    useRouter: true,
    loadDraftIfAvailable: false,
    force: true,
  });
  const activeHedge = useRecoilValue(activeHedgeState);
  const activeOriginalHedge = useRecoilValue(activeOriginalHedgeState);
  const cashflowStatus = activeOriginalHedge?.ui_status ?? ['default'];
  const isSettled =
    cashflowStatus.indexOf('archived') == 0 ||
    cashflowStatus.indexOf('terminated') == 0;

  return isLoaded ? (
    !isSettled ? (
      <Stack sx={{ marginTop: '10px' }}>
        <RHSAccordion title='Next Settlement' defaultExpanded={true}>
          <SummaryContent_CashflowAmountUSD value={activeHedge} />
          <SummaryContent_Currency
            value={activeOriginalHedge ?? undefined}
            label='Amount'
          />
          <SummaryContent_Expiration value={activeHedge} label='Date' />
        </RHSAccordion>
      </Stack>
    ) : null
  ) : (
    <Skeleton />
  );
};
export default NextSettlementAccordion;
