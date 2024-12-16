import BarChart from '@mui/icons-material/BarChart';
import {
  Box,
  BoxProps,
  Divider,
  Skeleton,
  Stack,
  Typography,
  TypographyProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { marginDepositAPISendDataState, marginHealthDetailsState } from 'atoms';
import { format } from 'date-fns';
import { PangeaGroupEnum, formatCurrency } from 'lib';
import { isError } from 'lodash';
import { Suspense, memo, useEffect, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { PangeaColors } from 'styles';
import { EmptyDashboardState } from '../accountActivation/EmptyDashboardState';
import { GridTabPanel, PangeaLoading, RoleBasedAccessCheck } from '../shared';
import { DashboardMarginChart } from './DashboardMarginChart';
import { DepositAndWithdrawWidgets } from './DepositAndWithdrawWidgets';
import {
  MarginStepperDialog,
  MarginStepperDialogOpener,
} from './MarginStepperDialog';
import { useUserGroupsAndPermissions } from 'hooks';

const StyledBox = styled(Box)<BoxProps>({
  padding: '0 .75rem',
  border: `1px solid ${PangeaColors.Gray}`,
  borderRadius: '.25rem',
  backgroundColor: PangeaColors.White,
  paddingBottom: '1rem',
});

const StyledTypography = styled(Typography)<TypographyProps>({
  display: 'block',
  paddingTop: '1rem',
});

const MarginDepositAndWithdrawal = () => {
  const { userGroups } = useUserGroupsAndPermissions();
  const marginDepositAPISendData = useRecoilValue(
    marginDepositAPISendDataState,
  );
  const dashboardMarginData =
    useRecoilValue(
      marginHealthDetailsState(
        marginDepositAPISendData?.depositDetails?.deposit_amount,
      ),
    ) ?? null;
  if (!dashboardMarginData || isError(dashboardMarginData)) {
    return null;
  }
  const achDateNumbers = new Date(
    dashboardMarginData.ach_deposit_date,
  ).toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const achDate = format(
    new Date(dashboardMarginData.ach_deposit_date),
    'LLLL do',
  );

  const wireDate = format(
    new Date(dashboardMarginData.wire_deposit_date),
    'LLLL do',
  );
  const marginToday = dashboardMarginData.margins[0];
  const marginInThirtyDays =
    dashboardMarginData.margins[dashboardMarginData.margins.length - 1];
  return (
    <Stack spacing={'1rem'} mt={'4rem'}>
      <StyledBox>
        <StyledTypography variant='dataLabel'>
          Current Margin Balance
        </StyledTypography>
        <Typography variant='h2'>
          {formatCurrency(
            dashboardMarginData.margin_balance,
            'USD',
            true,
            0,
            0,
            true,
          )}
        </Typography>
        <Divider sx={{ margin: '0 0 .5em 0' }} />
        <Typography variant='dataLabel'>Margin Utilizaton Today</Typography>
        <Typography variant='h5'>
          {formatCurrency(marginToday.amount, 'USD', true, 0, 0)}
        </Typography>
        <Divider sx={{ margin: '.5em 0' }} />
        <Typography variant='dataLabel'>
          Expected Utilizaton, Next 30 Days
        </Typography>
        <Typography variant='h5'>
          {formatCurrency(marginInThirtyDays.amount, 'USD', true, 0, 0)}
        </Typography>
      </StyledBox>

      {Number(dashboardMarginData.minimum_deposit) > 0 && (
        <StyledBox>
          <Stack spacing={1}>
            <StyledTypography variant='dataLabel'>
              Deposit Required Before
            </StyledTypography>
            <Typography variant='d2'>{achDateNumbers}</Typography>
            <Typography
              variant='body2'
              color={PangeaColors.BlackSemiTransparent60}
            >
              Deposit via ACH on or before {achDate} to avoid a margin call, or
              wire before {wireDate}.
            </Typography>
          </Stack>
        </StyledBox>
      )}
      <RoleBasedAccessCheck
        userGroups={userGroups}
        allowedGroups={[
          PangeaGroupEnum.CustomerAdmin,
          PangeaGroupEnum.CustomerManager,
        ]}
      >
        <Suspense>
          <DepositAndWithdrawWidgets
            recommendedAmt={Number(dashboardMarginData.recommended_deposit)}
            requiredAmt={Number(dashboardMarginData.minimum_deposit)}
          />
        </Suspense>
      </RoleBasedAccessCheck>
    </Stack>
  );
};
export const DashboardMarginTab = memo(function DashboardMarginTab() {
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(true);
  const marginHealthLoadable = useRecoilValueLoadable(
    marginHealthDetailsState(0),
  );

  useEffect(() => {
    marginHealthLoadable
      .toPromise()
      .then((health: any) => {
        setShowChart(health && health.margins && health.margins.length > 0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [marginHealthLoadable]);

  return loading ? (
    <PangeaLoading useBackdrop loadingPhrase='Loading margins...' />
  ) : !showChart ? (
    <EmptyDashboardState
      tab='margin'
      buttonHref='/cashflow'
      title='Add a Cash Flow to Start Hedging'
      message='Your margin account balance and health will live here. Start hedging by clicking ‘Create a Hedge’'
      buttonTitle='Create Hedge'
      outlinedIcon={
        <BarChart color='primary' sx={{ height: '32px', width: '32px' }} />
      }
    />
  ) : (
    <GridTabPanel
      contentColumnCount={8}
      left={
        <Suspense
          fallback={
            <PangeaLoading
              useBackdrop
              direction='column'
              loadingPhrase={[
                'Calculating your margin health projections.',
                'This may take a moment.',
              ]}
            />
          }
        >
          <Stack spacing={1} marginTop={'64px'}>
            <DashboardMarginChart />
          </Stack>
        </Suspense>
      }
      right={
        <>
          <Suspense fallback={<Skeleton width={'100%'} height={'710px'} />}>
            <MarginDepositAndWithdrawal />
          </Suspense>
          <Suspense fallback={<Skeleton />}>
            <MarginStepperDialogOpener type={'link'} step={2} />
            <MarginStepperDialog />
          </Suspense>
        </>
      }
    />
  );
});
export default DashboardMarginTab;
