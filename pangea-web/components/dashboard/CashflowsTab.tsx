import ListAlt from '@mui/icons-material/ListAlt';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { clientApiState } from 'atoms';
import { PangeaCashflow, PangeaDraftCashflow } from 'lib';
import { Suspense, memo, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { EmptyDashboardState } from '../accountActivation/EmptyDashboardState';
import { PangeaLoading } from '../shared';
import { CashflowsGrid } from './CashflowsGrid';
import { CashflowMarginHealthCharts } from './CashflowMarginHealthCharts';

export const CashflowsTab = memo(function CashflowsTab() {
  const authHelper = useRecoilValue(clientApiState);
  const [cashflows, setCashflows] = useState<
    Array<PangeaCashflow | PangeaDraftCashflow>
  >([]);
  const [loading, setLoading] = useState(true);
  const showGrid = cashflows && cashflows.length > 0;
  useEffect(() => {
    const api = authHelper.getAuthenticatedApiHelper();
    Promise.all([api.loadAllCashflowsAsync(1), api.loadAllDraftsAsync(1)])
      .then((cashflows) => cashflows.flat())
      .then((cashflows) => {
        setCashflows(cashflows);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authHelper]);

  return loading ? (
    <PangeaLoading useBackdrop loadingPhrase='Loading cash flows...' />
  ) : (!loading && cashflows.length == 0) || !showGrid ? (
    <EmptyDashboardState
      tab='cashflows'
      buttonHref='/cashflow'
      title='Add a Cash Flow to Start Hedging'
      message='Your hedged cashflows will live here. Start hedging by clicking ‘Create a Hedge’'
      buttonTitle='Create Hedge'
      outlinedIcon={
        <ListAlt color='primary' sx={{ height: '32px', width: '32px' }} />
      }
    />
  ) : (
    <Stack>
      <Box sx={{ width: '100%' }}>
        <Suspense
          fallback={<PangeaLoading loadingPhrase='Loading cash flows...' />}
        >
          <CashflowMarginHealthCharts />
          <CashflowsGrid />
        </Suspense>
      </Box>
    </Stack>
  );
});
export default CashflowsTab;
