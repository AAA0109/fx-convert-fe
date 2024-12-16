import TrendingDownIcon from '../../public/images/Trending-down.svg';
import TrendingUpIcon from '../../public/images/Trending-up.svg';

import { Alert, BoxProps, Stack, Typography } from '@mui/material';
import {
  activeHedgeState,
  exchangeRatesState,
  hedgeSafeGuardState,
  selectedHedgeStrategy,
} from 'atoms';
import {
  CashflowStrategyEnum,
  convertToForeignAmount,
  formatCurrency,
} from 'lib';
import { useRecoilValue } from 'recoil';
import { PangeaColors } from 'styles';
import { AccordionContentBlock } from './AccordionContentBlock';

interface IProjectedGainLossProps {
  percentage: number;
  notional: number;
  delta: number;
  currency: string;
}
type ProjectedGainLossProps = IProjectedGainLossProps & BoxProps;
export const ProjectedGainLoss = (props: ProjectedGainLossProps) => {
  const currentHedgeItem = useRecoilValue(activeHedgeState);
  const selectedStrategy = useRecoilValue(selectedHedgeStrategy);
  const safeGuardState = useRecoilValue(hedgeSafeGuardState);

  const exchangeRate = useRecoilValue(
    exchangeRatesState(currentHedgeItem.currency),
  );
  const isGain: boolean = props.percentage > 0;
  if (isGain != props.delta > 0) {
    return (
      <Alert variant='outlined' severity='error'>
        Invalid gain/loss values.
      </Alert>
    );
  }
  if (isNaN(props.percentage)) {
    return (
      <Alert variant='outlined' severity='error'>
        Invalid percentage value.
      </Alert>
    );
  }
  return (
    <Stack>
      <Stack direction={'row'} alignItems={'center'}>
        {isGain ? (
          <TrendingUpIcon color='success' sx={{ fontSize: 50 }} />
        ) : (
          <TrendingDownIcon color='error' sx={{ fontSize: 50 }} />
        )}

        {selectedStrategy === CashflowStrategyEnum.PARACHUTE && isGain ? (
          <Typography
            color={
              isGain
                ? PangeaColors.SecurityGreenMedium
                : PangeaColors.RiskBerryMedium
            }
            variant='h4'
            paddingLeft={0.5}
          >
            {safeGuardState ? 'Safeguarded' : 'Uncapped'}
          </Typography>
        ) : (
          <Typography
            color={
              isGain
                ? PangeaColors.SecurityGreenMedium
                : PangeaColors.RiskBerryMedium
            }
            variant='h4'
            paddingLeft={0.5}
          >
            {Math.abs(props.percentage).toLocaleString('en-US', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 2,
            })}
            %
          </Typography>
        )}
      </Stack>
      <AccordionContentBlock label={`In ${props.currency}`}>
        {formatCurrency(props.delta, props.currency, true, 0, 0)}
      </AccordionContentBlock>
      {currentHedgeItem.currency != null && (
        <AccordionContentBlock label={`In ${currentHedgeItem.currency}`}>
          {formatCurrency(
            convertToForeignAmount(props.delta, exchangeRate),
            currentHedgeItem.currency as string,
            true,
            0,
            0,
          )}
        </AccordionContentBlock>
      )}
    </Stack>
  );
};
export default ProjectedGainLoss;
