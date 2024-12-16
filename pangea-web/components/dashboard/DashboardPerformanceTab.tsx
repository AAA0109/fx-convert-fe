import AutoGraph from '@mui/icons-material/AutoGraph';
import { Stack, Typography } from '@mui/material';
import {
  accountViewSelectState,
  allAccountsState,
  dashboardPerformanceDataState,
  domesticCurrencyState,
} from 'atoms';
import { formatCurrency, getAutoAbbreviateOptions } from 'lib';
import { Suspense, memo, useEffect, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { PangeaColors } from 'styles';
import { EmptyDashboardState } from '../accountActivation/EmptyDashboardState';
import { GridTabPanel, PangeaLoading } from '../shared';

const AsidePerformanceTabContent = () => {
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const dashboardPerformanceData = useRecoilValue(
    dashboardPerformanceDataState,
  );
  const accountViewSelect = useRecoilValue(accountViewSelectState);
  const allAccounts = useRecoilValue(allAccountsState);
  const selectedData = dashboardPerformanceData[accountViewSelect];
  const selectedAccount = allAccounts.find((a) => a.id == accountViewSelect);
  let activeHedges = NaN;
  let totalHedges = NaN;
  let riskPercent = NaN;
  let cumulativeTarget = NaN;
  let totalHedging = NaN;
  if (selectedData?.cashflows && selectedData.cashflows.length > 0) {
    activeHedges =
      selectedData.cashflows.length > 0
        ? selectedData.cashflows[selectedData.cashflows.length - 1].amount
        : 0;
    totalHedges =
      dashboardPerformanceData[-1].cashflows[selectedData.cashflows.length - 1]
        ?.amount ?? 0;
    riskPercent =
      selectedData.volatility[selectedData.volatility.length - 1].amount;
    cumulativeTarget = selectedAccount
      ? selectedAccount.hedge_settings.custom.vol_target_reduction
      : NaN; //selectedData.hedgeSummary.riskPercent;
    totalHedging =
      selectedData.forwardData[selectedData.forwardData.length - 1]?.amount ??
      0;
  }
  return (
    <Stack spacing={5} mt={'64px'}>
      <Stack spacing={1}>
        <Typography
          variant={'caption'}
          borderBottom={`1px solid ${PangeaColors.SolidSlateMedium}`}
          display={'inline-block'}
          width={'100%'}
        >
          Risk Reduction Achieved
        </Typography>
        <Typography variant={'pullQuote'}>
          {riskPercent.toLocaleString('en-US', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
            ...getAutoAbbreviateOptions(riskPercent * 100),
          })}
        </Typography>
        {!isNaN(cumulativeTarget) ? (
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'baseline'}
            spacing={2}
          >
            <Typography variant={'body2'}>Cumulative Target : </Typography>
            <Typography variant={'body2'}>
              {cumulativeTarget.toLocaleString('en-US', {
                style: 'percent',
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
              })}
            </Typography>
          </Stack>
        ) : null}
        {/* <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'baseline'}
          spacing={2}
        >
          <Typography variant={'body2'}>Health Status:</Typography>
          <StatusChip status={healthStatus} />
        </Stack> */}
      </Stack>
      <Stack spacing={1}>
        <Typography
          variant={'caption'}
          borderBottom={`1px solid ${PangeaColors.SolidSlateMedium}`}
          display={'inline-block'}
          width={'100%'}
        >
          Total Hedged
        </Typography>
        <Typography variant={'pullQuote'}>
          {formatCurrency(totalHedging, domesticCurrency, true, 0, 0, true)}
        </Typography>
        <Typography variant={'body2'}>
          Hedging{' '}
          {formatCurrency(totalHedging, domesticCurrency, true, 0, 0, true)}{' '}
          over {activeHedges} cash flow
          {activeHedges !== 1 && 's'} in this view.
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography
          variant={'caption'}
          borderBottom={`1px solid ${PangeaColors.SolidSlateMedium}`}
          display={'inline-block'}
          width={'100%'}
        >
          Active Hedges
        </Typography>
        <Typography variant={'pullQuote'}>{activeHedges}</Typography>
        {accountViewSelect != -1 && (
          <Typography variant={'body2'}>Out of {totalHedges} total</Typography>
        )}
      </Stack>
    </Stack>
  );
};
export const DashboardPerformanceTab = memo(function DashboardPerformanceTab() {
  const [showPerformanceTab, setShowPerformanceTab] = useState(false);
  const [loading, setLoading] = useState(true);

  const dashboardPerformanceDataLoadable = useRecoilValueLoadable(
    dashboardPerformanceDataState,
  );

  useEffect(() => {
    dashboardPerformanceDataLoadable
      .toPromise()
      .then((performanceData: any) => {
        setShowPerformanceTab(
          performanceData[-1].cashflows &&
            performanceData[-1].cashflows.length > 0,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dashboardPerformanceDataLoadable]);

  return loading ? (
    <PangeaLoading useBackdrop loadingPhrase='Loading Performance Data...' />
  ) : !showPerformanceTab ? (
    <EmptyDashboardState
      tab='performance'
      buttonHref='/cashflow'
      title='Add a Cash Flow to Start Hedging'
      message='The performance of your hedges will live here. Start hedging by clicking ‘Create a Hedge’'
      buttonTitle='Create Hedge'
      outlinedIcon={
        <AutoGraph color='primary' sx={{ height: '32px', width: '32px' }} />
      }
    ></EmptyDashboardState>
  ) : (
    <GridTabPanel
      contentColumnCount={8}
      left={
        <Suspense
          fallback={
            <PangeaLoading
              loadingPhrase='Loading performance data...'
              useBackdrop
            />
          }
        >
          <></>
        </Suspense>
      }
      right={
        <Suspense>
          <AsidePerformanceTabContent />
        </Suspense>
      }
    />
  );
});
export default DashboardPerformanceTab;
