import {
  chartYourHedgeDataState,
  chartYourRiskDataState,
  hedgeLosspreventionLimitState,
  hedgeLosspreventionTargetState,
  hedgeMaxLossThresholdState,
  hedgeRiskReductionAmountState,
  hedgeSafeGuardState,
  hedgeSafeGuardTargetState,
  selectedAccountIdState,
  selectedHedgeStrategy,
} from 'atoms';
import { formatISO } from 'date-fns';
import {
  CashflowStrategyEnum,
  IChartYourHedgeData,
  IChartYourRiskData,
  IGraphHoverData,
  PangeaCashFlowCore,
} from 'lib';
import { isUndefined } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { useCashflowHelpers } from './useCashflowHelpers';

export const useChartData = ({
  riskReduction,
  selectedAccountId,
  maxLoss,
}: {
  riskReduction: Optional<number>;
  selectedAccountId: Optional<number>;
  maxLoss: Optional<number>;
}) => {
  // State objects
  const hedgeHardLimitUpper = 0; // Commenting out per https://github.com/servant-io/Pangea/issues/648 //useRecoilValue(hedgeHardLimitUpperState);
  const hedgeHardLimitLower = 0; // useRecoilValue(hedgeHardLimitLowerState);
  const safeGuard = useRecoilValue(hedgeSafeGuardState);
  const safeGuardTaget = useRecoilValue(hedgeSafeGuardTargetState);
  const lossprevention = useRecoilValue(hedgeLosspreventionLimitState);
  const lossPreventionTaget = useRecoilValue(hedgeLosspreventionTargetState);
  const account_id = useRecoilValue(selectedAccountIdState);
  const selectedStrategy = useRecoilValue(selectedHedgeStrategy);
  const riskReductionStateValue =
    useRecoilValue(hedgeRiskReductionAmountState) ?? 0;
  const hedgeRiskReductionAmount = isUndefined(riskReduction)
    ? riskReductionStateValue
    : riskReduction;
  const maxLossThresholdStateValue =
    useRecoilValue(hedgeMaxLossThresholdState) ?? 0;
  const hedgeMaxLossThreshold = isUndefined(maxLoss)
    ? maxLossThresholdStateValue
    : maxLoss;
  const { getGraphData, getCashflowDates } = useCashflowHelpers();
  const cashflowDates = getCashflowDates();
  const hedgeEndDate =
    cashflowDates.length > 0 ? Date.Max(...cashflowDates) : new Date();

  const cashflowsArray = getGraphData();

  // Build aggregate cashflow object

  const [newAndExistingCashflows, setNewAndExistingCashflows] = useState<
    Optional<Record<string, PangeaCashFlowCore[]>[]>
  >([cashflowsArray]);

  useEffect(() => {
    if (!selectedAccountId || selectedAccountId === -1 || !cashflowsArray) {
      return;
    }
    setNewAndExistingCashflows([cashflowsArray]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId]);

  const newAndExistingCashflowsObject = useMemo(() => {
    if (newAndExistingCashflows) {
      return newAndExistingCashflows.reduce((acc, curr) => {
        // reduce the array of cashflow records to one object
        return { ...acc, ...curr };
      }, {});
    } else {
      return {};
    }
  }, [newAndExistingCashflows]);
  const hedgeChartDataLoadable = useRecoilValueLoadable(
    chartYourHedgeDataState({
      data: {
        domestic: 'USD',
        cashflows: newAndExistingCashflowsObject,
        start_date: formatISO(new Date(), { representation: 'date' }), // API won't accept full date/time value
        end_date: formatISO(hedgeEndDate, { representation: 'date' }), // API won't accept full date/time value
        risk_reductions: [
          0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
          0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1,
        ],
        max_horizon: 730,
        do_std_dev_cones: false,
      },
      account_id: account_id ?? undefined,
    }),
  );
  const riskChartDataLoadable = useRecoilValueLoadable(
    chartYourRiskDataState({
      requestBody: {
        domestic: 'USD',
        cashflows: cashflowsArray,
        start_date: formatISO(new Date(), { representation: 'date' }), // API won't accept full date/time value
        end_date: formatISO(hedgeEndDate, { representation: 'date' }), // API won't accept full date/time value
        max_horizon: 730,
        std_dev_levels: [1, 2, 3],
        do_std_dev_cones: true,
      },
      account_id: account_id ?? undefined,
    }),
  );

  const riskChartData: Nullable<IChartYourRiskData[]> =
    riskChartDataLoadable.contents;

  const hedgeChartDataRaw: Nullable<IChartYourHedgeData[]> =
    hedgeChartDataLoadable.contents;

  const hedgeChartData: Nullable<IChartYourHedgeData[]> = useMemo(() => {
    if (hedgeChartDataRaw === null || !(hedgeChartDataRaw instanceof Array)) {
      return null;
    }
    return hedgeChartDataRaw.map((chartDatum) => {
      const returnDatum = { ...chartDatum };
      const uppers = Object.entries(returnDatum.uppers).map((upper, index) => {
        return [
          upper[0],
          safeGuard &&
          safeGuardTaget &&
          ((selectedStrategy === CashflowStrategyEnum.PARACHUTE &&
            index !== 0) ||
            selectedStrategy === CashflowStrategyEnum.AUTOPILOT)
            ? Math.min(upper[1], safeGuardTaget)
            : upper[1],
        ];
      });
      const uppersUnlimited = Object.entries(returnDatum.uppers).map(
        (upper) => {
          return [upper[0], upper[1]];
        },
      );
      returnDatum.uppers = Object.fromEntries(uppers);
      returnDatum.uppersUnlimited = Object.fromEntries(uppersUnlimited);
      const median = Math.floor(chartDatum.original_lowers[0].length / 2);
      const gamma =
        ((hedgeMaxLossThreshold ?? -0.005) * chartDatum.initial_value) /
        chartDatum.original_lowers[0][
          Math.floor(chartDatum.original_lowers[0].length / 2)
        ];
      const parachuteFunc = (index: number, lowerValue: number) => {
        return index <= median
          ? lowerValue * gamma
          : (hedgeMaxLossThreshold ?? -0.005) * chartDatum.initial_value;
      };
      const parachuteLowers = Object.fromEntries(
        [
          0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
          0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1,
        ].map((riskReduction, riskReductionIndex) => {
          return [
            riskReduction,
            parachuteFunc(
              chartDatum.date_index,
              chartDatum.original_lowers[riskReductionIndex][
                chartDatum.date_index
              ],
            ) / Math.abs(chartDatum.initial_value),
          ];
        }),
      );
      const lowers = Object.entries(
        selectedStrategy === CashflowStrategyEnum.PARACHUTE
          ? parachuteLowers
          : returnDatum.lowers,
      ).map((lower, index) => {
        return [
          lower[0],
          lossprevention &&
          lossPreventionTaget &&
          ((selectedStrategy === CashflowStrategyEnum.PARACHUTE &&
            index !== 0) ||
            selectedStrategy === CashflowStrategyEnum.AUTOPILOT)
            ? Math.max(lower[1], lossPreventionTaget)
            : lower[1],
        ];
      });

      const lowersUnlimited = Object.entries(returnDatum.lowers).map(
        (lower) => {
          return [lower[0], lower[1]];
        },
      );
      returnDatum.lowers = Object.fromEntries(lowers);
      returnDatum.lowersUnlimited = Object.fromEntries(lowersUnlimited);
      return returnDatum as IChartYourHedgeData;
    });
  }, [
    hedgeChartDataRaw,
    hedgeMaxLossThreshold,
    lossPreventionTaget,
    lossprevention,
    safeGuard,
    safeGuardTaget,
    selectedStrategy,
  ]);
  // Page Sidebar Data state
  const initialHedgeGraphHoverData: Nullable<IGraphHoverData> = useMemo(() => {
    if (!hedgeChartData) {
      return null;
    }
    const uppersUnlimited =
      hedgeChartData[hedgeChartData.length - 1]?.uppersUnlimited;
    const lowersUnlimited =
      hedgeChartData[hedgeChartData.length - 1]?.lowersUnlimited;
    return {
      upside:
        hedgeHardLimitUpper > 0
          ? Math.min(
              hedgeChartData[hedgeChartData.length - 1]?.uppers[
                hedgeRiskReductionAmount
              ],
              hedgeHardLimitUpper / 100,
            )
          : hedgeChartData[hedgeChartData.length - 1]?.uppers[
              hedgeRiskReductionAmount
            ],
      upsideUnlimited: uppersUnlimited
        ? uppersUnlimited[hedgeRiskReductionAmount]
        : 0,
      downside:
        hedgeHardLimitLower > 0
          ? Math.max(
              hedgeChartData[hedgeChartData.length - 1]?.lowers[
                hedgeRiskReductionAmount
              ],
              (-1 * hedgeHardLimitLower) / 100,
            )
          : hedgeChartData[hedgeChartData.length - 1]?.lowers[
              hedgeRiskReductionAmount
            ],
      downsideUnlimited: lowersUnlimited
        ? lowersUnlimited[hedgeRiskReductionAmount]
        : 0,
      initialValue: hedgeChartData[hedgeChartData.length - 1]?.initial_value,
    };
  }, [
    hedgeChartData,
    hedgeHardLimitLower,
    hedgeHardLimitUpper,
    hedgeRiskReductionAmount,
  ]);
  // Graph Hover Data state
  const initialRiskGraphHoverData: Nullable<IGraphHoverData> = useMemo(() => {
    if (riskChartData) {
      return {
        upside: riskChartData[riskChartData.length - 1]?.uppers['3'],
        downside: riskChartData[riskChartData.length - 1]?.uppers['3'],
        upsideUnlimited: riskChartData[riskChartData.length - 1]?.uppers['3'],
        downsideUnlimited: riskChartData[riskChartData.length - 1]?.uppers['3'],
        initialValue: riskChartData[riskChartData.length - 1]?.initial_value,
      };
    } else {
      return null;
    }
  }, [riskChartData]);

  return {
    initialHedgeGraphHoverData,
    initialRiskGraphHoverData,
    hedgeChartData,
    riskChartData,
    hedgeEndDate,
    hedgeRiskReductionAmount,
    hedgeMaxLossThreshold,
    cashflowDates,
    isRiskChartLoading: riskChartDataLoadable.state === 'loading',
    isHedgeChartLoading: hedgeChartDataLoadable.state === 'loading',
  };
};

export default useChartData;
