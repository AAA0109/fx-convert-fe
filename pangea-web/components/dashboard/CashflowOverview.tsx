import { Box, Stack, Typography } from '@mui/material';
import {
  activeOriginalHedgeState,
  domesticCurrencyState,
  isLoggedInState,
  performanceTrackingDataState,
  userCompanyState,
} from 'atoms';
import { useCashflow } from 'hooks';
import { INewAccountPerfChartData } from 'lib';
import Image from 'next/image';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { PangeaLoading, RedirectSpinner } from '../shared';
import { CashflowUpdatesContainer } from '../summarypanel/CashflowUpdatesContainer';
import { DashboardPerformanceChart } from './DashboardPerformanceChart';

const NoChartData = () => {
  return (
    <>
      <Image
        src={'/images/line-chart.png'}
        alt='Not enough data'
        fill
        objectFit='contain'
      />
      <Stack
        position={'absolute'}
        flex={1}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Typography
          color={PangeaColors.BlackSemiTransparent87}
          typography={'body2'}
        >
          Not enough data
        </Typography>
        <Typography
          color={PangeaColors.BlackSemiTransparent60}
          textAlign={'center'}
          width={'70%'}
          typography={'small'}
        >
          Performance chart will update once more data is available
        </Typography>
      </Stack>
    </>
  );
};

const MainPerformanceTabContent = ({
  dashboardPerformanceData,
}: {
  dashboardPerformanceData: INewAccountPerfChartData;
}) => {
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  return (
    <Stack spacing={1}>
      {dashboardPerformanceData &&
      dashboardPerformanceData.hedgedData &&
      dashboardPerformanceData.unhedgedData &&
      dashboardPerformanceData.totalPNLData ? (
        <ErrorBoundary fallback={<>Oops...something went wrong</>}>
          <DashboardPerformanceChart
            unhedgedData={dashboardPerformanceData.unhedgedData}
            hedgedData={dashboardPerformanceData.hedgedData}
            totalPNLData={dashboardPerformanceData.totalPNLData}
            domesticCurrency={domesticCurrency}
          />
        </ErrorBoundary>
      ) : (
        <>Oops, something went wrong</>
      )}
    </Stack>
  );
};
export const CashflowOverview = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const { isLoaded } = useCashflow({
    useRouter: true,
    loadDraftIfAvailable: false,
  });
  const company = useRecoilValue(userCompanyState);

  const activeOriginalHedge = useRecoilValue(activeOriginalHedgeState);
  const dashboardPerformanceData = useRecoilValue(performanceTrackingDataState);
  const hasNoData =
    dashboardPerformanceData.hedgedData.length === 0 &&
    dashboardPerformanceData.unhedgedData.length === 0 &&
    dashboardPerformanceData.totalPNLData.length === 0;
  if (!isLoggedIn) {
    return <RedirectSpinner />;
  }

  if (!isLoaded) {
    return <PangeaLoading loadingPhrase={'Loading details...'} />;
  }
  if (!activeOriginalHedge) {
    return <PangeaLoading loadingPhrase={'Loading details...'} />;
  }
  return (
    <Stack spacing={2}>
      <Suspense
        fallback={<PangeaLoading loadingPhrase={'Loading details...'} />}
      >
        <CashflowUpdatesContainer fullWidth={true} mode='manage' />
      </Suspense>
      {company?.show_pnl_graph && (
        <>
          <Typography
            variant='h4'
            component='h2'
            textTransform='uppercase'
            paddingTop={'64px'}
            paddingBottom={'24px'}
          >
            Cash Flow Performance
          </Typography>
          <Suspense
            fallback={<PangeaLoading loadingPhrase={'Loading details...'} />}
          >
            <Box
              sx={{
                backgroundColor: PangeaColors.White,
                borderRadius: '8px',
                border: '1px solid ' + PangeaColors.Gray,
                mb: '8px',
                position: 'relative',
              }}
              display={'flex'}
              padding={2}
              alignItems={'center'}
              justifyContent={'center'}
              minHeight={300}
            >
              {hasNoData ? (
                <NoChartData />
              ) : (
                <MainPerformanceTabContent
                  dashboardPerformanceData={dashboardPerformanceData}
                />
              )}
            </Box>
          </Suspense>
        </>
      )}
    </Stack>
  );
};
export default CashflowOverview;
