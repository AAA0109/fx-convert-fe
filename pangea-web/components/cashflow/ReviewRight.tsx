import {
  activeHedgeState,
  activeOriginalHedgeState,
  currentForwardHedgeItem,
  hedgeLosspreventionLimitState,
  hedgeLosspreventionTargetState,
  hedgeMaxLossThresholdState,
  hedgeRiskReductionAmountState,
  hedgeSafeGuardState,
  hedgeSafeGuardTargetState,
  riskToleranceFromAccountIdState,
  selectedHedgeStrategy,
} from 'atoms';
import { FeatureFlag } from 'components/shared';
import STRATEGY_OPTIONS from 'components/shared/StrategyOptions';
import { CashflowEditMode, CashflowStrategyEnum } from 'lib';
import { capitalize, isUndefined } from 'lodash';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { AccordionContentBlock, RHSAccordion } from '../summarypanel';
const AUTOPILOT_FEATURE_FLAG = 'autopilot';
const HARD_LIMITS_FEATURE_FLAG = 'autopilot-hard-limits';
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
export const ReviewRight = ({
  mode,
  defaultExpanded = true,
}: {
  mode: CashflowEditMode;
  defaultExpanded?: boolean;
}) => {
  const riskReductionState = useRecoilValue(hedgeRiskReductionAmountState);
  const maxLoss = useRecoilValue(hedgeMaxLossThresholdState);
  const safeguard = useRecoilValue(hedgeSafeGuardState);
  const lossPrevention = useRecoilValue(hedgeLosspreventionLimitState);
  const safeGuardTaget = useRecoilValue(hedgeSafeGuardTargetState);
  const lossPreventionTaget = useRecoilValue(hedgeLosspreventionTargetState);
  const currentHedgeItem = useRecoilValue(currentForwardHedgeItem);
  const selectedStrategy = useRecoilValue(selectedHedgeStrategy);

  const riskReductionDisplay =
    currentHedgeItem && currentHedgeItem.risk_reduction
      ? Math.round(currentHedgeItem.risk_reduction * 100)
      : isUndefined(riskReductionState ?? 0)
      ? 'N/A'
      : Math.round((riskReductionState ?? 0) * 100);

  return (
    <RHSAccordion
      title='Hedge Summary'
      defaultExpanded={defaultExpanded}
      showDivider={false}
    >
      {selectedStrategy === CashflowStrategyEnum.ZEROGRAVITY && (
        <ProjectedRightAccountName mode={mode} />
      )}
      {selectedStrategy !== undefined ? (
        <AccordionContentBlock
          label='Strategy'
          labelRight={STRATEGY_OPTIONS[selectedStrategy].label}
        />
      ) : null}
      {selectedStrategy === CashflowStrategyEnum.AUTOPILOT && (
        <>
          <AccordionContentBlock
            label='Risk Reduction'
            labelRight={`${riskReductionDisplay}%`}
          />
          <AccordionContentBlock
            label='SAFEGUARD TARGET'
            labelRight={
              safeguard ? `${((safeGuardTaget ?? 0) * 100).toFixed(2)}%` : 'OFF'
            }
            labelRightProps={{
              color: safeguard
                ? PangeaColors.SecurityGreenDarker
                : PangeaColors.BlackSemiTransparent87,
            }}
          />
          <AccordionContentBlock
            label='LOSS PREVENTION LIMIT'
            labelRight={
              lossPrevention
                ? `${((lossPreventionTaget ?? 0) * 100).toFixed(2)}%`
                : 'OFF'
            }
            labelRightProps={{
              color: lossPrevention
                ? PangeaColors.RiskBerryDark
                : PangeaColors.BlackSemiTransparent87,
            }}
          />
        </>
      )}
      {selectedStrategy === CashflowStrategyEnum.PARACHUTE && (
        <>
          <AccordionContentBlock
            label='MaX Loss Threshold'
            labelRight={`${((maxLoss ?? 0) * 100).toFixed(2)}%`}
            labelRightProps={{ color: PangeaColors.RiskBerryDark }}
          />
          <AccordionContentBlock
            label={'SAFEGUARD AI'}
            labelRight={safeguard ? 'safeguarded' : 'uncapped'}
            labelRightProps={{ color: PangeaColors.SecurityGreenDarker }}
          />
        </>
      )}
      <FeatureFlag name={[HARD_LIMITS_FEATURE_FLAG, AUTOPILOT_FEATURE_FLAG]}>
        <AccordionContentBlock label='Hard Limits' labelRight={`-2% +2%`} />
      </FeatureFlag>
    </RHSAccordion>
  );
};
export default ReviewRight;
