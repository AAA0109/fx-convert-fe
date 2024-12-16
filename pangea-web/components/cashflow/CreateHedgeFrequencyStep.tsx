import LoopIcon from '@mui/icons-material/Loop';
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentsIcon from '@mui/icons-material/Payments';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  activeHedgeFrequencyTypeState,
  hedgeDirectionUIState,
  hedgeFrequencyState,
} from 'atoms';
import { useAuthHelper, useFeatureFlags } from 'hooks';
import { FrequencyType } from 'lib';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ListItemWithCheckbox, StepperShell } from '../shared';
import { ChangeFrequencyModal } from './ChangeFrequencyModal';

export const CreateHedgeFrequencyStep = () => {
  const authHelper = useAuthHelper();
  const [showModal, setShowModal] = useState(false);
  const { isFeatureEnabled } = useFeatureFlags();
  const isForwardsEnabled = isFeatureEnabled('corpay-forwards-strategy');
  const setHedgeFrequency = useSetRecoilState(hedgeFrequencyState);
  const hedgeFrequency = useRecoilValue(activeHedgeFrequencyTypeState);
  const setHedgeDirection = useSetRecoilState(hedgeDirectionUIState);

  const handleRadioSelectValue = useEventCallback((selection: string) => {
    setHedgeFrequency(selection as FrequencyType);
  });
  useEffect(() => {
    if (hedgeFrequency) {
      setShowModal(true);
    }
    //We only want this to run the first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <StepperShell
        onClickContinueButton={() => {
          setHedgeDirection(undefined);
        }}
        backButtonHref='/cashflow/details/quantity'
        continueButtonHref='/cashflow/details/direction'
        title='Select a frequency for this cash flow'
        continueButtonEnabled={!!hedgeFrequency && authHelper.canTrade}
        backButtonVisible={!isForwardsEnabled && !showModal}
      >
        <ListItemWithCheckbox
          value={hedgeFrequency}
          onChange={handleRadioSelectValue}
          listData={[
            {
              icon: <PaymentIcon />,
              primaryText: 'One-Time',
              secondaryText: 'A single transaction',
              value: 'onetime',
            },
            {
              icon: <LoopIcon />,
              primaryText: 'Recurring',
              secondaryText: 'Weekly, monthly, yearly, or custom interval.',
              value: 'recurring',
            },
            {
              icon: <PaymentsIcon />,
              primaryText: 'Installments',
              secondaryText: 'Multiple payments over different dates.',
              value: 'installments',
            },
          ]}
        />
      </StepperShell>

      <ChangeFrequencyModal
        open={showModal}
        onClickChange={() => setHedgeFrequency(null)}
      />
    </>
  );
};
export default CreateHedgeFrequencyStep;
