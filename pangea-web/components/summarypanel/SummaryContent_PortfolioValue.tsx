import {
  activeHedgeState,
  domesticCurrencyState,
  hedgeMaxLossThresholdState,
  riskReductionFromAccountIdState,
} from 'atoms';
import { useChartData } from 'hooks';
import { formatCurrency } from 'lib';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import AccordionContentBlock from './AccordionContentBlock';

export const PortfolioValue = () => {
  const activeHedge = useRecoilValue(activeHedgeState);
  const domesticCurrency = useRecoilValue(domesticCurrencyState);
  const riskReduction = useRecoilValue(
    riskReductionFromAccountIdState(activeHedge.accountId),
  );
  const maxLoss = useRecoilValue(hedgeMaxLossThresholdState);

  const { hedgeChartData } = useChartData({
    riskReduction,
    selectedAccountId: activeHedge.accountId,
    maxLoss,
  });
  const hedgeValue = useMemo(() => {
    return hedgeChartData && hedgeChartData.length > 0
      ? {
          previousValue: hedgeChartData[0].previous_value ?? 0,
          updatedValue: hedgeChartData[0].update_value ?? 0,
        }
      : {
          previousValue: 0,
          updatedValue: 0,
        };
  }, [hedgeChartData]);

  return (
    <AccordionContentBlock
      label='Portfolio Value'
      isChanged={false}
      labelProps={{ color: (theme) => theme.palette.primary.main }}
    >
      <AccordionContentBlock label='Previously'>
        {formatCurrency(hedgeValue.previousValue, domesticCurrency, true, 0, 0)}
      </AccordionContentBlock>
      <AccordionContentBlock label='Updated'>
        {formatCurrency(hedgeValue.updatedValue, domesticCurrency, true, 0, 0)}
      </AccordionContentBlock>
    </AccordionContentBlock>
  );
};

export default PortfolioValue;
