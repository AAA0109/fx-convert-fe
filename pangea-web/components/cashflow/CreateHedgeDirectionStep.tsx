import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  activeHedgeFrequencyTypeState,
  cashflowDirectionState,
  hedgeDirectionUIState,
} from 'atoms';
import { useAuthHelper } from 'hooks';
import { CashflowDirectionType } from 'lib';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ListItemWithCheckbox, StepperShell } from '../shared';
export const CreateHedgeDirectionStep = () => {
  const authHelper = useAuthHelper();
  const hedgeFrequency = useRecoilValue(activeHedgeFrequencyTypeState);
  const setHedgeDirection = useSetRecoilState(cashflowDirectionState);

  // We need to track the UI state separately from the cashflowDirectionState because
  // cashflowDirectionState has a default value ('paying') and that causes that option
  // to be selected when visiting the page for the first time.
  // By keeping the UI state separately but still setting the recoil
  // state, we can get the behavior we want.
  const [direction, setDirection] = useRecoilState(hedgeDirectionUIState);
  const handleRadioSelectValue = useEventCallback((selection: string) => {
    setHedgeDirection(selection as CashflowDirectionType);
    setDirection(selection as CashflowDirectionType);
  });
  return (
    <StepperShell
      backButtonHref='/cashflow/details/frequency'
      continueButtonHref={`/cashflow/details/${hedgeFrequency}`}
      title='What would you like to hedge?'
      continueButtonEnabled={!!direction && authHelper.canTrade}
    >
      <ListItemWithCheckbox
        onChange={handleRadioSelectValue}
        value={direction}
        listData={[
          {
            icon: <AddCircleIcon />,
            primaryText: 'Money I am receiving',
            secondaryText:
              'I am receiving revenue for goods or services being sold in another currency.',
            value: 'receiving',
          },
          {
            icon: <ArrowCircleRightIcon />,
            primaryText: 'Money I am paying',
            secondaryText:
              'I am making payments for goods or services being sold in another currency.',
            value: 'paying',
          },
        ]}
      />
    </StepperShell>
  );
};
export default CreateHedgeDirectionStep;
