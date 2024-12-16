import { Skeleton, Typography } from '@mui/material';
import {
  activeHedgeState,
  activeOriginalHedgeState,
  autoPilotFeesDetailsState,
  bulkUploadItemsState,
  domesticCurrencyState,
  graphHoverDataState,
  hedgeLosspreventionLimitState,
  hedgeRiskReductionAmountState,
  hedgeSafeGuardState,
  marginAndFeesDetailsCacheState,
  marginAndFeesDetailsState,
  marginFeeDataLoadingState,
  riskToleranceFromAccountIdState,
  selectedAccountIdState,
  selectedHedgeStrategy,
  shouldShowFeesState,
} from 'atoms';
import { useFeatureFlags } from 'hooks';
import {
  AnyHedgeItem,
  Cashflow,
  CashflowEditMode,
  CashflowStrategyEnum,
  Installment,
  PangeaHedgePolicyForAccountViewMethodEnum,
  PangeaHedgeSettings,
  formatCurrency,
} from 'lib';
import { capitalize } from 'lodash';
import { Suspense, useEffect } from 'react';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { PangeaColors } from 'styles';
import { TimedProgressBar, TypographyLoader } from '../shared';
import { AccordionContentBlock } from './AccordionContentBlock';
import { ProjectedGainLoss } from './ProjectedGainLoss';
import { RHSAccordion } from './RHSAccordion';
import PortfolioValue from './SummaryContent_PortfolioValue';
const CORPAY_FW_FF_NAME = 'corpay-forwards-strategy';

const FeeDetailsContainer = ({
  mode,
  hidden,
}: {
  mode: CashflowEditMode;
  hidden: boolean;
}) => {
  const bulkItems = useRecoilValue(bulkUploadItemsState);
  const activeHedge = useRecoilValue(activeHedgeState);
  const allCashflowIds: number[] = ((hedgeItems: AnyHedgeItem[]) =>
    (hedgeItems.filter((h) => h instanceof Cashflow) as Cashflow[])
      .map((h) => h.id)
      .concat(
        (
          hedgeItems.filter((h) => h instanceof Installment) as Installment[]
        ).flatMap<number>((i) => i.cashflows.map((c) => c.id)),
      ))(mode == 'create' ? bulkItems : [activeHedge]);

  useRecoilValueLoadable(
    marginAndFeesDetailsCacheState({ draft_ids: allCashflowIds }),
  );
  return hidden ? null : <FeeDetails cashflow_ids={allCashflowIds} />;
};
const FeeDetails = ({ cashflow_ids }: { cashflow_ids: number[] }) => {
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const account_id = useRecoilValue(selectedAccountIdState);
  const hedgeRiskReduction = useRecoilValue(hedgeRiskReductionAmountState);
  const marginAndFeeRequest =
    (account_id ? account_id : 0) > 0
      ? {
          account_id: Number(account_id),
          draft_ids: cashflow_ids,
        }
      : {
          draft_ids: cashflow_ids,
          hedge_settings: {
            margin_budget: 2e10,
            max_horizon_days: 730,
            method: PangeaHedgePolicyForAccountViewMethodEnum.MIN_VAR,
            custom: { vol_target_reduction: hedgeRiskReduction ?? 0 },
          } as PangeaHedgeSettings,
        };
  const marginFeeData = useRecoilValue(
    marginAndFeesDetailsState(marginAndFeeRequest),
  );

  return (
    <AccordionContentBlock
      labelProps={{ color: (theme) => theme.palette.primary.main }}
    >
      <AccordionContentBlock label='Percentage' autoWidthRight>
        {marginFeeData ? (
          `${(marginFeeData.fee_details.totals.rate * 100).toPrecision(3)}%`
        ) : (
          <Skeleton width={30} />
        )}
      </AccordionContentBlock>
      <AccordionContentBlock label='In USD' autoWidthRight>
        {marginFeeData ? (
          `${formatCurrency(
            marginFeeData ? marginFeeData.fee_details.totals.amount : 0,
            domesticCurrency,
            true,
            0,
            0,
            true,
          )}`
        ) : (
          <Skeleton width={30} />
        )}
      </AccordionContentBlock>
    </AccordionContentBlock>
  );
};
const AutoPilotFeeDetails = ({ hidden }: { hidden: boolean }) => {
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const autopilotFeesData = useRecoilValue(autoPilotFeesDetailsState);
  const selectedStrategy = useRecoilValue(selectedHedgeStrategy);
  const safeGuard = useRecoilValue(hedgeSafeGuardState);
  const lossPrevention = useRecoilValue(hedgeLosspreventionLimitState);
  if (!autopilotFeesData) {
    return <TimedProgressBar maxSeconds={90} caption='Loading fee data...' />;
  }
  return hidden ? (
    <></>
  ) : (
    <AccordionContentBlock
      labelProps={{ color: (theme) => theme.palette.primary.main }}
    >
      <AccordionContentBlock label='Percentage' autoWidthRight>
        <TypographyLoader
          isLoading={!autopilotFeesData}
          skeletonProps={{ width: 30 }}
        >
          {selectedStrategy === CashflowStrategyEnum.PARACHUTE
            ? `${Number(
                autopilotFeesData?.fee.find(
                  (fee) => fee.fee_type === 'total_min',
                )?.percentage,
              ).toFixed(2)}% -`
            : safeGuard || lossPrevention
            ? `${Number(
                autopilotFeesData?.fee.find(
                  (fee) => fee.fee_type === 'total_min',
                )?.percentage,
              ).toFixed(2)}% -`
            : ''}{' '}
          {Number(
            autopilotFeesData?.fee.find(
              (fee) =>
                fee.fee_type ===
                (selectedStrategy === CashflowStrategyEnum.PARACHUTE ||
                safeGuard ||
                lossPrevention
                  ? 'total_max'
                  : 'total_min'),
            )?.percentage,
          ).toFixed(2)}
          %
        </TypographyLoader>
      </AccordionContentBlock>
      <AccordionContentBlock label='In USD' autoWidthRight>
        <TypographyLoader
          isLoading={!autopilotFeesData}
          skeletonProps={{ width: 30 }}
        >
          {selectedStrategy === CashflowStrategyEnum.PARACHUTE
            ? `${formatCurrency(
                autopilotFeesData
                  ? autopilotFeesData.fee.find(
                      (fee) => fee.fee_type === 'total_min',
                    )?.cost ?? 0
                  : 0,
                domesticCurrency,
                true,
                2,
                2,
              )} -`
            : safeGuard || lossPrevention
            ? `${formatCurrency(
                autopilotFeesData
                  ? autopilotFeesData.fee.find(
                      (fee) => fee.fee_type === 'total_min',
                    )?.cost ?? 0
                  : 0,
                domesticCurrency,
                true,
                2,
                2,
              )} -`
            : ''}{' '}
          {formatCurrency(
            autopilotFeesData
              ? autopilotFeesData.fee.find(
                  (fee) =>
                    fee.fee_type ===
                    (selectedStrategy === CashflowStrategyEnum.PARACHUTE ||
                    safeGuard ||
                    lossPrevention
                      ? 'total_max'
                      : 'total_min'),
                )?.cost ?? 0
              : 0,
            domesticCurrency,
            true,
            2,
            2,
          )}
        </TypographyLoader>
      </AccordionContentBlock>
    </AccordionContentBlock>
  );
};

const ProjectedGainLossLowSide = ({
  netAmountDomestic,
  domesticCurrency,
}: {
  netAmountDomestic: number;
  domesticCurrency: string;
}) => {
  const graphHoverData = useRecoilValue(graphHoverDataState);
  return (
    <ProjectedGainLoss
      notional={netAmountDomestic}
      delta={
        -1 *
        Math.abs(
          netAmountDomestic * (graphHoverData ? graphHoverData.downside : 0),
        )
      }
      percentage={
        -1 * Math.abs(graphHoverData ? graphHoverData.downside * 100 : 0)
      }
      currency={domesticCurrency}
    />
  );
};
const ProjectedGainLossHighSide = ({
  netAmountDomestic,
  domesticCurrency,
}: {
  netAmountDomestic: number;
  domesticCurrency: string;
}) => {
  const graphHoverData = useRecoilValue(graphHoverDataState);
  return (
    <ProjectedGainLoss
      notional={netAmountDomestic}
      delta={Math.abs(
        netAmountDomestic * (graphHoverData ? graphHoverData.upside : 0),
      )}
      percentage={Math.abs(graphHoverData ? graphHoverData.upside * 100 : 0)}
      currency={domesticCurrency}
    />
  );
};
const ProjectedRightAccountName = ({ mode }: { mode: CashflowEditMode }) => {
  const activeHedge = useRecoilValue(activeHedgeState);
  const activeOriginalHedge = useRecoilValue(activeOriginalHedgeState);
  const accountname = useRecoilValue(
    riskToleranceFromAccountIdState(activeHedge.accountId),
  );
  return (
    <AccordionContentBlock
      label='Portfolio'
      isChanged={
        mode == 'manage' &&
        activeHedge.accountId != activeOriginalHedge?.accountId
      }
    >
      {capitalize(accountname)}
    </AccordionContentBlock>
  );
};
export const ProjectedRiskRight = ({
  totalFeeIncluded,
  mode = 'create',
}: {
  totalFeeIncluded?: boolean;
  mode?: CashflowEditMode;
}) => {
  const graphHoverData = useRecoilValue(graphHoverDataState);
  const initialValue = graphHoverData?.initialValue ?? 0;
  const hedgeItems = useRecoilValue(bulkUploadItemsState);

  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const canShowFees = useRecoilValue(shouldShowFeesState);
  const selectedStrategy = useRecoilValue(selectedHedgeStrategy);
  const { isFeatureEnabled } = useFeatureFlags();
  const shouldShowStrategySelector = isFeatureEnabled(CORPAY_FW_FF_NAME);
  const SetMarginLoadingTimedProgressBar = () => {
    const setMarginFeeDataLoading = useSetRecoilState(
      marginFeeDataLoadingState,
    );
    useEffect(() => {
      setMarginFeeDataLoading(true);
      return () => setMarginFeeDataLoading(false);
    }, [setMarginFeeDataLoading]);
    return <TimedProgressBar maxSeconds={90} caption='Loading fee data...' />;
  };
  const hasPortfolio = hedgeItems.findIndex((h) => h.accountId > 0) > -1;
  return (
    <>
      <RHSAccordion
        title={
          selectedStrategy == CashflowStrategyEnum.PARACHUTE
            ? 'Risk Overview'
            : hasPortfolio
            ? 'Portfolio Risk'
            : 'Unhedged Risk'
        }
      >
        {hasPortfolio &&
        selectedStrategy === CashflowStrategyEnum.ZEROGRAVITY ? (
          <ProjectedRightAccountName mode={mode} />
        ) : null}
        {hasPortfolio &&
        selectedStrategy === CashflowStrategyEnum.ZEROGRAVITY ? (
          <PortfolioValue />
        ) : null}
        <AccordionContentBlock
          label='Potential Gain'
          isChanged={false}
          labelProps={{ color: (theme) => theme.palette.primary.main }}
        >
          <Suspense fallback={<Skeleton />}>
            <ProjectedGainLossHighSide
              netAmountDomestic={initialValue}
              domesticCurrency={domesticCurrency}
            />
          </Suspense>
        </AccordionContentBlock>
        <AccordionContentBlock
          label='Potential Loss'
          isChanged={false}
          labelProps={{ color: (theme) => theme.palette.primary.main }}
        >
          <Suspense fallback={<Skeleton />}>
            <ProjectedGainLossLowSide
              netAmountDomestic={initialValue}
              domesticCurrency={domesticCurrency}
            />
          </Suspense>
        </AccordionContentBlock>
      </RHSAccordion>
      <RHSAccordion title='Total Fees'>
        {totalFeeIncluded ? (
          <Suspense fallback={<SetMarginLoadingTimedProgressBar />}>
            {selectedStrategy !== CashflowStrategyEnum.ZEROGRAVITY ? (
              <AutoPilotFeeDetails hidden={!canShowFees} />
            ) : !shouldShowStrategySelector ? (
              <FeeDetailsContainer mode={mode} hidden={!canShowFees} />
            ) : (
              <Typography
                variant='body2'
                color={PangeaColors.BlackSemiTransparent60}
              >
                Select a hedging strategy to see corresponding fees.
              </Typography>
            )}
          </Suspense>
        ) : null}
      </RHSAccordion>
    </>
  );
};
export default ProjectedRiskRight;
